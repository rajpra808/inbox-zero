import { z } from "zod";

export const sendMorningBriefBody = z.object({
  userId: z.string(),
});
export type SendMorningBriefBody = z.infer<typeof sendMorningBriefBody>;
