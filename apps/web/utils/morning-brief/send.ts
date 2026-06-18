import "server-only";

import { env } from "@/env";
import prisma from "@/utils/prisma";
import { sendMorningBriefEmail } from "@inboxzero/resend";
import { createUnsubscribeToken } from "@/utils/unsubscribe";
import { MorningBriefStatus } from "@/generated/prisma/enums";
import type { Logger } from "@/utils/logger";
import type { GeneratedMorningBrief } from "./generate";

// Delivers a generated morning brief via email to the user's primary account.
// Slack/Teams delivery can be added by routing on MessagingRoutePurpose.MORNING_BRIEFS.
export async function sendMorningBrief({
  userId,
  brief,
  logger,
}: {
  userId: string;
  brief: GeneratedMorningBrief;
  logger: Logger;
}): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      emailAccounts: {
        select: { id: true, email: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!user) {
    logger.error("User not found for morning brief", { userId });
    return;
  }

  // Prefer the account matching the user's primary email, else the first.
  const primaryAccount =
    user.emailAccounts.find((a) => a.email === user.email) ??
    user.emailAccounts[0];

  if (!primaryAccount) {
    logger.error("No email account to deliver morning brief", { userId });
    return;
  }

  const unsubscribeToken = await createUnsubscribeToken({
    emailAccountId: primaryAccount.id,
  });

  logger.info("Sending morning brief email", { userId, briefId: brief.id });

  try {
    await sendMorningBriefEmail({
      from: env.RESEND_FROM_EMAIL,
      to: user.email,
      emailProps: {
        baseUrl: env.NEXT_PUBLIC_BASE_URL,
        unsubscribeToken,
        emailAccountId: primaryAccount.id,
        date: new Date(),
        executiveSummary: brief.executiveSummary,
        items: brief.items.map((item) => ({
          accountEmail: item.accountEmail || primaryAccount.email,
          from: item.from,
          subject: item.subject,
          summary: item.summary,
          importanceScore: item.importanceScore,
          category: item.category,
          actionNeeded: item.actionNeeded,
        })),
      },
    });

    await prisma.morningBrief.update({
      where: { id: brief.id },
      data: { status: MorningBriefStatus.SENT, sentAt: new Date() },
    });

    logger.info("Morning brief sent", { userId, briefId: brief.id });
  } catch (error) {
    logger.error("Failed to send morning brief", {
      userId,
      briefId: brief.id,
      error,
    });
    await prisma.morningBrief.update({
      where: { id: brief.id },
      data: { status: MorningBriefStatus.FAILED },
    });
  }
}
