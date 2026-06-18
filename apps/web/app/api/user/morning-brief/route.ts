import { NextResponse } from "next/server";
import { withAuth } from "@/utils/middleware";
import prisma from "@/utils/prisma";

export type GetMorningBriefSettingsResponse = Awaited<
  ReturnType<typeof getData>
>;

async function getData({ userId }: { userId: string }) {
  const schedule = await prisma.morningBriefSchedule.findUnique({
    where: { userId },
    select: {
      enabled: true,
      daysOfWeek: true,
      timeOfDay: true,
      nextOccurrenceAt: true,
      lastSentAt: true,
    },
  });

  const hours = schedule?.timeOfDay?.getHours() ?? 8;
  const minutes = schedule?.timeOfDay?.getMinutes() ?? 0;

  return {
    enabled: schedule?.enabled ?? false,
    hours,
    minutes,
    daysOfWeek: schedule?.daysOfWeek ?? 127, // default every day
    nextOccurrenceAt: schedule?.nextOccurrenceAt?.toISOString() ?? null,
    lastSentAt: schedule?.lastSentAt?.toISOString() ?? null,
  };
}

export const GET = withAuth("user/morning-brief", async (request) => {
  const userId = request.auth.userId;
  const result = await getData({ userId });
  return NextResponse.json(result);
});
