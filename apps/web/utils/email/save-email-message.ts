import "server-only";

import prisma from "@/utils/prisma";
import {
  extractDomainFromEmail,
  extractEmailAddress,
  extractNameFromEmail,
} from "@/utils/email";
import { internalDateToDate } from "@/utils/date";
import type { ParsedMessage } from "@/utils/types";
import type { Logger } from "@/utils/logger";

// Keeps the EmailMessage table in sync with incoming emails so it can serve as
// the unified, cross-account inbox source. Mirrors the field extraction in
// `saveBatch` (utils/actions/stats-loading.ts) but for a single message.
export async function upsertEmailMessage({
  message,
  emailAccountId,
  logger,
}: {
  message: ParsedMessage;
  emailAccountId: string;
  logger: Logger;
}): Promise<void> {
  const date = internalDateToDate(message.internalDate);

  const labelIds = message.labelIds ?? [];

  try {
    await prisma.emailMessage.upsert({
      where: {
        emailAccountId_threadId_messageId: {
          emailAccountId,
          threadId: message.threadId,
          messageId: message.id,
        },
      },
      update: {
        from: extractEmailAddress(message.headers.from),
        fromName: extractNameFromEmail(message.headers.from),
        fromDomain: extractDomainFromEmail(message.headers.from),
        to: message.headers.to
          ? extractEmailAddress(message.headers.to)
          : "Missing",
        date,
        subject: message.subject,
        snippet: message.snippet,
        read: !labelIds.includes("UNREAD"),
        sent: labelIds.includes("SENT"),
        draft: labelIds.includes("DRAFT"),
        inbox: labelIds.includes("INBOX"),
      },
      create: {
        threadId: message.threadId,
        messageId: message.id,
        from: extractEmailAddress(message.headers.from),
        fromName: extractNameFromEmail(message.headers.from),
        fromDomain: extractDomainFromEmail(message.headers.from),
        to: message.headers.to
          ? extractEmailAddress(message.headers.to)
          : "Missing",
        date,
        subject: message.subject,
        snippet: message.snippet,
        read: !labelIds.includes("UNREAD"),
        sent: labelIds.includes("SENT"),
        draft: labelIds.includes("DRAFT"),
        inbox: labelIds.includes("INBOX"),
        emailAccountId,
      },
    });
  } catch (error) {
    logger.error("Failed to upsert EmailMessage", {
      messageId: message.id,
      emailAccountId,
      error,
    });
  }
}
