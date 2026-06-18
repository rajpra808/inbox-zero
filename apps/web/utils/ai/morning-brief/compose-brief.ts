import { z } from "zod";
import { createScopedLogger } from "@/utils/logger";
import type { EmailAccountWithAI } from "@/utils/llms/types";
import { getModelForUseCase, LlmUseCase } from "@/utils/llms/use-cases";
import { createGenerateObject } from "@/utils/llms";
import { getUserInfoPrompt } from "@/utils/ai/helpers";

const logger = createScopedLogger("morning-brief-compose");

const briefItemSchema = z.object({
  accountEmail: z.string(),
  from: z.string(),
  subject: z.string(),
  summary: z.string(),
  importanceScore: z.number().min(0).max(1),
  category: z.string().nullable(),
  actionNeeded: z.boolean(),
});

const briefSchema = z.object({
  executiveSummary: z
    .string()
    .describe("A 1-2 sentence overview of what needs attention today."),
  items: z
    .array(briefItemSchema)
    .describe("Emails ranked by importance, most important first."),
});

export type MorningBriefItem = z.infer<typeof briefItemSchema>;
export type ComposedMorningBrief = z.infer<typeof briefSchema>;

export type BriefEmailInput = {
  accountEmail: string;
  from: string;
  fromName: string | null;
  subject: string | null;
  snippet: string | null;
  category: string | null;
  date: string;
};

export async function composeMorningBrief({
  emailAccount,
  emails,
}: {
  emailAccount: EmailAccountWithAI & { name: string | null };
  emails: BriefEmailInput[];
}): Promise<ComposedMorningBrief | null> {
  if (emails.length === 0) return null;

  const system = `You are an AI assistant that produces a concise morning brief across a user's multiple email accounts.
Your task is to rank the provided new emails by importance and produce a short executive summary.

Guidelines:
- Lead the executive summary with anything that needs a reply or action today.
- For each item, write a one-line summary of what it is and why it matters (do not restate the sender).
- Assign an importanceScore from 0.0 to 1.0: 1.0 = urgent/requires reply or action, 0.0 = FYI only.
- Set actionNeeded to true only when the user must reply, approve, or take a concrete step.
- Keep the original accountEmail, from, subject, and category values unchanged.
- Order items by importanceScore descending.
- Do not invent emails; only use the ones provided.
- Exclude opaque technical identifiers (account IDs, tracking tokens) from summaries.`;

  const emailsXml = emails
    .map(
      (e, i) => `<email index="${i}">
  <account>${e.accountEmail}</account>
  <from>${e.fromName || e.from}</from>
  <subject>${e.subject || ""}</subject>
  <snippet>${e.snippet || ""}</snippet>
  <category>${e.category || ""}</category>
  <date>${e.date}</date>
</email>`,
    )
    .join("\n");

  const prompt = `<emails>
${emailsXml}
</emails>

${getUserInfoPrompt({ emailAccount })}`;

  logger.info("Composing morning brief", { emailCount: emails.length });

  try {
    const modelOptions = getModelForUseCase(
      emailAccount.user,
      LlmUseCase.MorningBrief,
    );

    const generateObject = createGenerateObject({
      emailAccount,
      label: "Morning brief",
      modelOptions,
      promptHardening: { trust: "untrusted", level: "compact" },
    });

    const result = await generateObject({
      ...modelOptions,
      system,
      prompt,
      schema: briefSchema,
    });

    return result.object;
  } catch (error) {
    logger.error("Failed to compose morning brief", { error });
    return null;
  }
}
