"use server";

import { actionClientUser } from "@/utils/actions/safe-action";
import {
  sendTestMorningBriefBody,
  updateMorningBriefSettingsBody,
} from "@/utils/actions/morning-brief.validation";
import prisma from "@/utils/prisma";
import { createCanonicalTimeOfDay } from "@/utils/schedule";
import { calculateNextScheduleDate } from "@/utils/schedule";
import { generateMorningBrief } from "@/utils/morning-brief/generate";
import { sendMorningBrief } from "@/utils/morning-brief/send";
import { SafeError } from "@/utils/error";

export const updateMorningBriefSettingsAction = actionClientUser
  .metadata({ name: "updateMorningBriefSettings" })
  .inputSchema(updateMorningBriefSettingsBody)
  .action(
    async ({
      ctx: { userId, logger },
      parsedInput: { enabled, hours, minutes, daysOfWeek },
    }) => {
      const timeOfDay = createCanonicalTimeOfDay(hours, minutes);

      const nextOccurrenceAt = enabled
        ? calculateNextScheduleDate({
            daysOfWeek,
            timeOfDay,
            lastOccurrenceAt: new Date(),
          })
        : null;

      await prisma.morningBriefSchedule.upsert({
        where: { userId },
        create: {
          userId,
          enabled,
          daysOfWeek,
          timeOfDay,
          nextOccurrenceAt,
        },
        update: {
          enabled,
          daysOfWeek,
          timeOfDay,
          nextOccurrenceAt,
        },
      });

      logger.info("Updated morning brief settings", {
        enabled,
        nextOccurrenceAt,
      });
    },
  );

export const sendTestMorningBriefAction = actionClientUser
  .metadata({ name: "sendTestMorningBrief" })
  .inputSchema(sendTestMorningBriefBody)
  .action(async ({ ctx: { userId, logger } }) => {
    const brief = await generateMorningBrief({
      userId,
      injectedLogger: logger,
    });

    if (!brief) {
      throw new SafeError("No new emails to summarize for the test brief.");
    }

    await sendMorningBrief({ userId, brief, logger });
    return { briefId: brief.id };
  });
