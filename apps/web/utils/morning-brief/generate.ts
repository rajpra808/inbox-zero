import "server-only";

import { subDays } from "date-fns/subDays";
import prisma from "@/utils/prisma";
import { NewsletterStatus } from "@/generated/prisma/enums";
import type { EmailAccountWithAI } from "@/utils/llms/types";
import { createScopedLogger, type Logger } from "@/utils/logger";
import {
  composeMorningBrief,
  type BriefEmailInput,
  type MorningBriefItem,
} from "@/utils/ai/morning-brief/compose-brief";

const logger = createScopedLogger("morning-brief-generate");

const MAX_EMAILS_FOR_AI = 30;
const LOOKBACK_DAYS = 1;

export type GeneratedMorningBrief = {
  id: string;
  executiveSummary: string;
  items: Array<
    MorningBriefItem & {
      emailAccountId: string;
      threadId: string;
      messageId: string;
    }
  >;
};

export async function generateMorningBrief({
  userId,
  injectedLogger,
}: {
  userId: string;
  injectedLogger?: Logger;
}): Promise<GeneratedMorningBrief | null> {
  const log = injectedLogger ?? logger;
  log.info("Generating morning brief", { userId });

  const accounts = await prisma.emailAccount.findMany({
    where: { userId },
    select: {
      id: true,
      userId: true,
      email: true,
      name: true,
      about: true,
      multiRuleSelectionEnabled: true,
      sensitiveDataPolicy: true,
      timezone: true,
      calendarBookingLink: true,
      user: { select: { aiProvider: true, aiModel: true, aiApiKey: true } },
      account: { select: { provider: true } },
    },
  });

  if (accounts.length === 0) {
    log.info("No email accounts for user", { userId });
    return null;
  }

  const accountIds = accounts.map((a) => a.id);
  const accountEmailById = new Map(accounts.map((a) => [a.id, a.email]));
  // Use the first account as the AI config carrier (all share the same user AI config).
  const emailAccount = accounts[0] as EmailAccountWithAI & {
    name: string | null;
  };

  const schedule = await prisma.morningBriefSchedule.findUnique({
    where: { userId },
  });

  const since = schedule?.lastSentAt ?? subDays(new Date(), LOOKBACK_DAYS);

  // Exclude senders the user has already blocked/unsubscribed.
  const blocked = await prisma.newsletter.findMany({
    where: {
      emailAccountId: { in: accountIds },
      status: {
        in: [NewsletterStatus.UNSUBSCRIBED, NewsletterStatus.AUTO_ARCHIVED],
      },
    },
    select: { email: true },
  });
  const blockedSenders = new Set(blocked.map((b) => b.email));

  const messages = await prisma.emailMessage.findMany({
    where: {
      emailAccountId: { in: accountIds },
      inbox: true,
      date: { gt: since },
      ...(blockedSenders.size > 0
        ? { from: { notIn: [...blockedSenders] } }
        : {}),
    },
    orderBy: { date: "desc" },
    take: 100,
    select: {
      id: true,
      threadId: true,
      messageId: true,
      emailAccountId: true,
      date: true,
      from: true,
      fromName: true,
      subject: true,
      snippet: true,
    },
  });

  // Dedupe to the latest message per (account, thread).
  const latestByThread = new Map<string, (typeof messages)[number]>();
  for (const m of messages) {
    const key = `${m.emailAccountId}:${m.threadId}`;
    if (!latestByThread.has(key)) latestByThread.set(key, m);
  }
  const deduped = [...latestByThread.values()].slice(0, MAX_EMAILS_FOR_AI);

  if (deduped.length === 0) {
    log.info("No new emails to brief on", { userId });
    return null;
  }

  // Enrich with sender categories.
  const senders = [...new Set(deduped.map((m) => m.from))];
  const newsletters = await prisma.newsletter.findMany({
    where: { emailAccountId: { in: accountIds }, email: { in: senders } },
    select: { email: true, category: { select: { name: true } } },
  });
  const categoryBySender = new Map<string, string>();
  for (const n of newsletters) {
    if (n.category?.name && !categoryBySender.has(n.email)) {
      categoryBySender.set(n.email, n.category.name);
    }
  }

  const emailInputs: BriefEmailInput[] = deduped.map((m) => ({
    accountEmail: accountEmailById.get(m.emailAccountId) ?? "",
    from: m.from,
    fromName: m.fromName,
    subject: m.subject,
    snippet: m.snippet,
    category: categoryBySender.get(m.from) ?? null,
    date: m.date.toISOString(),
  }));

  const composed = await composeMorningBrief({
    emailAccount,
    emails: emailInputs,
  });
  if (!composed) {
    log.error("Compose returned null", { userId });
    return null;
  }

  // Map composed items back to their EmailMessage records.
  const messageByKey = new Map(
    deduped.map((m) => {
      const accountEmail = accountEmailById.get(m.emailAccountId) ?? "";
      return [`${accountEmail}:${m.from}:${m.subject ?? ""}`, m];
    }),
  );

  const brief = await prisma.morningBrief.create({
    data: {
      userId,
      scheduleId: schedule?.id,
      executiveSummary: composed.executiveSummary,
      status: "PROCESSING",
      items: {
        create: composed.items.map((item) => {
          const msg = messageByKey.get(
            `${item.accountEmail}:${item.from}:${item.subject}`,
          );
          const account = accounts.find((a) => a.email === item.accountEmail);
          return {
            emailAccountId: account?.id ?? "",
            threadId: msg?.threadId ?? "",
            messageId: msg?.messageId ?? "",
            from: item.from,
            subject: item.subject,
            summary: item.summary,
            importanceScore: item.importanceScore,
            category: item.category,
            actionNeeded: item.actionNeeded,
          };
        }),
      },
    },
    include: { items: true },
  });

  if (schedule) {
    await prisma.morningBriefSchedule.update({
      where: { userId },
      data: { lastSentAt: new Date() },
    });
  }

  return {
    id: brief.id,
    executiveSummary: brief.executiveSummary,
    items: brief.items.map((i) => ({
      accountEmail: accountEmailById.get(i.emailAccountId) ?? "",
      from: i.from,
      subject: i.subject ?? "",
      summary: i.summary,
      importanceScore: i.importanceScore ?? 0,
      category: i.category,
      actionNeeded: i.actionNeeded,
      emailAccountId: i.emailAccountId,
      threadId: i.threadId,
      messageId: i.messageId,
    })),
  };
}
