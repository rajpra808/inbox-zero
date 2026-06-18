import { z } from "zod";

export const updateMorningBriefSettingsBody = z.object({
  enabled: z.boolean(),
  hours: z.number().min(0).max(23),
  minutes: z.number().min(0).max(59),
  // Bitmask of days of week (0-127). See DAYS in utils/schedule.ts.
  daysOfWeek: z.number().min(0).max(127),
});

export type UpdateMorningBriefSettingsBody = z.infer<
  typeof updateMorningBriefSettingsBody
>;

export const sendTestMorningBriefBody = z.object({}).optional();
export type SendTestMorningBriefBody = z.infer<typeof sendTestMorningBriefBody>;
