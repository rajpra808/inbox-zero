import type { MorningBriefSchedule } from "@/generated/prisma/client";
import { calculateNextScheduleDate } from "@/utils/schedule";

type ScheduleForProgression = Pick<
  MorningBriefSchedule,
  "intervalDays" | "daysOfWeek" | "timeOfDay" | "nextOccurrenceAt"
>;

export function isMorningBriefDue(
  schedule: Pick<MorningBriefSchedule, "nextOccurrenceAt"> | null | undefined,
  now = new Date(),
): boolean {
  return !!schedule?.nextOccurrenceAt && schedule.nextOccurrenceAt <= now;
}

export function getMorningBriefScheduleProgression(
  schedule: ScheduleForProgression,
  now = new Date(),
) {
  const lastOccurrenceAt =
    schedule.nextOccurrenceAt && schedule.nextOccurrenceAt <= now
      ? schedule.nextOccurrenceAt
      : now;

  return {
    lastOccurrenceAt,
    nextOccurrenceAt: calculateNextScheduleDate({
      intervalDays: schedule.intervalDays,
      daysOfWeek: schedule.daysOfWeek,
      timeOfDay: schedule.timeOfDay,
      lastOccurrenceAt,
    }),
  };
}
