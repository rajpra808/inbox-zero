import { z } from "zod";

export const unifiedInboxQuery = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  // Opaque base64 cursor: JSON { date, id }
  cursor: z.string().optional(),
  isUnread: z.coerce.boolean().optional(),
  category: z.string().optional(),
});
export type UnifiedInboxQuery = z.infer<typeof unifiedInboxQuery>;

export type UnifiedInboxThread = {
  id: string;
  threadId: string;
  messageId: string;
  emailAccountId: string;
  account: { email: string; name: string | null; image: string | null };
  from: string;
  fromName: string | null;
  subject: string | null;
  snippet: string | null;
  date: string;
  read: boolean;
  category: string | null;
};

export type UnifiedInboxResponse = {
  threads: UnifiedInboxThread[];
  nextCursor: string | null;
};

export function encodeCursor(date: Date, id: string): string {
  return Buffer.from(JSON.stringify({ date: date.toISOString(), id })).toString(
    "base64",
  );
}

export function decodeCursor(
  cursor: string,
): { date: Date; id: string } | null {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString());
    const date = new Date(parsed.date);
    if (Number.isNaN(date.getTime()) || typeof parsed.id !== "string")
      return null;
    return { date, id: parsed.id };
  } catch {
    return null;
  }
}
