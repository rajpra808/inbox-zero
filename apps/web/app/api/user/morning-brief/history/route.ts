import { NextResponse } from "next/server";
import { withAuth } from "@/utils/middleware";
import prisma from "@/utils/prisma";

export type GetMorningBriefHistoryResponse = Awaited<
  ReturnType<typeof getData>
>;

async function getData({ userId }: { userId: string }) {
  const briefs = await prisma.morningBrief.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      executiveSummary: true,
      sentAt: true,
      status: true,
      createdAt: true,
      items: {
        orderBy: { importanceScore: "desc" },
        select: {
          id: true,
          emailAccountId: true,
          threadId: true,
          from: true,
          subject: true,
          summary: true,
          importanceScore: true,
          category: true,
          actionNeeded: true,
        },
      },
    },
  });

  return { briefs };
}

export const GET = withAuth("user/morning-brief/history", async (request) => {
  const userId = request.auth.userId;
  const result = await getData({ userId });
  return NextResponse.json(result);
});
