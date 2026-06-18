import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { withError } from "@/utils/middleware";
import { hasCronSecret, hasPostCronSecret } from "@/utils/cron";
import { captureException } from "@/utils/error";
import type { Logger } from "@/utils/logger";
import { getPremiumUserFilter } from "@/utils/premium";
import { enqueueBackgroundJob } from "@/utils/queue/dispatch";
import { getMorningBriefScheduleProgression } from "@/utils/morning-brief/schedule";

export const maxDuration = 300;
const RESEND_MORNING_BRIEF_TOPIC = "resend-morning-brief";

export const GET = withError(
  "cron/resend/morning-brief/all",
  async (request) => {
    if (!hasCronSecret(request)) {
      captureException(
        new Error("Unauthorized request: api/resend/morning-brief/all"),
      );
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await sendMorningBriefAllUpdate(request.logger);
    return NextResponse.json(result);
  },
);

export const POST = withError(
  "cron/resend/morning-brief/all",
  async (request) => {
    if (!(await hasPostCronSecret(request))) {
      captureException(
        new Error("Unauthorized cron request: api/resend/morning-brief/all"),
      );
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await sendMorningBriefAllUpdate(request.logger);
    return NextResponse.json(result);
  },
);

async function sendMorningBriefAllUpdate(logger: Logger) {
  logger.info("Sending morning brief to all due users");

  const now = new Date();

  const schedules = await prisma.morningBriefSchedule.findMany({
    where: {
      enabled: true,
      nextOccurrenceAt: { lte: now },
      ...getPremiumUserFilter({ minimumTier: "PLUS_MONTHLY" }),
    },
    select: {
      id: true,
      userId: true,
      intervalDays: true,
      daysOfWeek: true,
      timeOfDay: true,
      nextOccurrenceAt: true,
    },
  });

  logger.info("Sending morning brief to users", {
    eligibleSchedules: schedules.length,
  });

  for (const schedule of schedules) {
    try {
      await enqueueBackgroundJob({
        topic: RESEND_MORNING_BRIEF_TOPIC,
        body: { userId: schedule.userId },
        qstash: {
          queueName: "morning-brief-all",
          parallelism: 3,
          path: "/api/resend/morning-brief",
        },
        logger,
      });

      const progression = getMorningBriefScheduleProgression(schedule, now);
      await prisma.morningBriefSchedule.update({
        where: { id: schedule.id },
        data: progression,
      });
    } catch (error) {
      logger.error("Failed to enqueue morning brief send", {
        userId: schedule.userId,
        error,
      });
    }
  }

  logger.info("All morning brief requests initiated", {
    count: schedules.length,
  });
  return { count: schedules.length };
}
