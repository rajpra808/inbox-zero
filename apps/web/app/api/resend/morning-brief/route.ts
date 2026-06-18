import { NextResponse } from "next/server";
import { withError } from "@/utils/middleware";
import { withQstashOrInternal } from "@/utils/qstash";
import { captureException } from "@/utils/error";
import { generateMorningBrief } from "@/utils/morning-brief/generate";
import { sendMorningBrief } from "@/utils/morning-brief/send";
import { sendMorningBriefBody } from "./validation";

export const maxDuration = 120;

export const POST = withError(
  "resend/morning-brief",
  withQstashOrInternal(async (request) => {
    const json = await request.json();
    const { success, data, error } = sendMorningBriefBody.safeParse(json);

    if (!success) {
      request.logger.error("Invalid request body", { error });
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { userId } = data;
    const logger = request.logger.with({ userId });

    logger.info("Generating morning brief");

    try {
      const brief = await generateMorningBrief({
        userId,
        injectedLogger: logger,
      });

      if (!brief) {
        logger.info("No morning brief to send");
        return NextResponse.json({
          success: true,
          message: "No brief to send",
        });
      }

      await sendMorningBrief({ userId, brief, logger });

      return NextResponse.json({ success: true, briefId: brief.id });
    } catch (error) {
      logger.error("Error sending morning brief", { error });
      captureException(error, { userId });
      return NextResponse.json({
        success: false,
        error: "Error sending morning brief",
      });
    }
  }),
);
