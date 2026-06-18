import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMockParsedMessage } from "@/__tests__/mocks/email-provider.mock";
import { createTestLogger } from "@/__tests__/helpers";
import prisma from "@/utils/__mocks__/prisma";
import { upsertEmailMessage } from "./save-email-message";

vi.mock("server-only", () => ({}));
vi.mock("@/utils/prisma");

const logger = createTestLogger();

describe("upsertEmailMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts an EmailMessage with extracted fields", async () => {
    const message = getMockParsedMessage({
      id: "msg-1",
      threadId: "thread-1",
      subject: "Hello world",
      snippet: "A short preview",
      internalDate: "1700000000000",
      labelIds: ["INBOX", "UNREAD"],
      headers: {
        from: "Jane Doe <jane@example.com>",
        to: "me@example.com",
        subject: "Hello world",
        date: "Tue, 14 Nov 2023 00:00:00 +0000",
      },
    });

    await upsertEmailMessage({
      message,
      emailAccountId: "account-1",
      logger,
    });

    expect(prisma.emailMessage.upsert).toHaveBeenCalledTimes(1);
    const args = prisma.emailMessage.upsert.mock.calls[0][0];
    expect(args.where.emailAccountId_threadId_messageId).toEqual({
      emailAccountId: "account-1",
      threadId: "thread-1",
      messageId: "msg-1",
    });
    expect(args.create).toMatchObject({
      emailAccountId: "account-1",
      threadId: "thread-1",
      messageId: "msg-1",
      from: "jane@example.com",
      fromName: "Jane Doe",
      subject: "Hello world",
      snippet: "A short preview",
      inbox: true,
      read: false,
      sent: false,
      draft: false,
    });
    expect(args.update).toMatchObject({
      subject: "Hello world",
      inbox: true,
    });
  });
});
