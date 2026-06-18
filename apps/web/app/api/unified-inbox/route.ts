import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/utils/prisma";
import { withAuth } from "@/utils/middleware";
import {
  decodeCursor,
  encodeCursor,
  unifiedInboxQuery,
  type UnifiedInboxResponse,
  type UnifiedInboxThread,
} from "./validation";

export const maxDuration = 30;

type RawThread = {
  id: string;
  threadId: string;
  messageId: string;
  emailAccountId: string;
  date: Date;
  from: string;
  fromName: string | null;
  subject: string | null;
  snippet: string | null;
  read: boolean;
};

export const GET = withAuth("unified-inbox", async (request) => {
  const userId = request.auth.userId;

  const { searchParams } = new URL(request.url);
  const query = unifiedInboxQuery.parse({
    limit: searchParams.get("limit") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    isUnread: searchParams.get("isUnread") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  const limit = query.limit ?? 50;

  const accounts = await prisma.emailAccount.findMany({
    where: { userId },
    select: { id: true, email: true, name: true, image: true },
  });

  if (accounts.length === 0) {
    return NextResponse.json<UnifiedInboxResponse>({
      threads: [],
      nextCursor: null,
    });
  }

  const accountIds = accounts.map((a) => a.id);
  const accountById = new Map(accounts.map((a) => [a.id, a]));

  const whereConditions: Prisma.Sql[] = [
    Prisma.sql`"emailAccountId" IN (${Prisma.join(accountIds)})`,
    Prisma.sql`inbox = true`,
  ];

  if (query.isUnread) whereConditions.push(Prisma.sql`read = false`);

  // The cursor filters the deduped (latest-per-thread) rows in the outer query,
  // so a thread can't reappear on a later page with an older message.
  const cursor = query.cursor ? decodeCursor(query.cursor) : null;
  const cursorClause = cursor
    ? Prisma.sql`WHERE ("date", "id") < (${cursor.date}, ${cursor.id})`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<RawThread[]>`
    SELECT * FROM (
      SELECT DISTINCT ON ("emailAccountId", "threadId")
        "id", "threadId", "messageId", "emailAccountId",
        "date", "from", "fromName", "subject", "snippet", "read"
      FROM "EmailMessage"
      WHERE ${Prisma.join(whereConditions, " AND ")}
      ORDER BY "emailAccountId", "threadId", "date" DESC, "id" DESC
    ) latest
    ${cursorClause}
    ORDER BY "date" DESC, "id" DESC
    LIMIT ${limit + 1}
  `;

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor =
    hasMore && page.length > 0
      ? encodeCursor(page[page.length - 1].date, page[page.length - 1].id)
      : null;

  // Enrich with sender categories (batch)
  const senders = [...new Set(page.map((r) => r.from))];
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

  const threads: UnifiedInboxThread[] = page.map((r) => {
    const account = accountById.get(r.emailAccountId);
    return {
      id: `${r.emailAccountId}:${r.threadId}`,
      threadId: r.threadId,
      messageId: r.messageId,
      emailAccountId: r.emailAccountId,
      account: {
        email: account?.email ?? "",
        name: account?.name ?? null,
        image: account?.image ?? null,
      },
      from: r.from,
      fromName: r.fromName,
      subject: r.subject,
      snippet: r.snippet,
      date: r.date.toISOString(),
      read: r.read,
      category: categoryBySender.get(r.from) ?? null,
    };
  });

  const filtered = query.category
    ? threads.filter((t) => t.category === query.category)
    : threads;

  return NextResponse.json<UnifiedInboxResponse>({
    threads: filtered,
    nextCursor,
  });
});
