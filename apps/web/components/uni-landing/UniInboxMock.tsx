import { Check, Inbox, Sparkles, Star, Zap } from "lucide-react";
import { cn } from "@/utils";

const FOLDERS = [
  { label: "Unified", icon: Inbox, active: true },
  { label: "To reply", icon: Zap },
  { label: "Newsletters", icon: Star },
  { label: "Done", icon: Check },
];

const ROWS = [
  {
    from: "Maya Chen",
    subject: "Re: Q3 partnership terms",
    preview: "Thanks for the quick turnaround — the draft looks…",
    tag: "Drafted",
    tone: "blue" as const,
  },
  {
    from: "Vercel",
    subject: "Your deployment is live",
    preview: "uni-inbox.app deployed to production in 38s.",
    tag: "Archived",
    tone: "green" as const,
  },
  {
    from: "Daniel Roy",
    subject: "Intro: design contractor",
    preview: "Happy to connect you both — copying Priya here…",
    tag: "To reply",
    tone: "blue" as const,
  },
  {
    from: "Stripe",
    subject: "Payout sent",
    preview: "$4,210.00 is on its way to your bank account.",
    tag: "Archived",
    tone: "green" as const,
  },
];

const TONE = {
  blue: "bg-brand-blue/10 text-brand-blue",
  green: "bg-brand-green/10 text-brand-green",
};

export function UniInboxMock() {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-brand-blue/5">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-destructive/60" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-brand-green/70" />
        <div className="ml-3 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-brand-blue" />
          AI organized · 0 left to triage
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
        <div className="hidden flex-col gap-1 border-r border-border p-3 sm:flex">
          {FOLDERS.map((f) => (
            <div
              key={f.label}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                f.active
                  ? "bg-brand-blue/10 font-medium text-brand-blue"
                  : "text-muted-foreground",
              )}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {ROWS.map((r) => (
            <div
              key={r.subject}
              className="flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-green/20 text-sm font-semibold text-foreground">
                {r.from.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {r.from}
                  </span>
                  <span className="truncate text-sm text-foreground/80">
                    {r.subject}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {r.preview}
                </p>
              </div>
              <span
                className={cn(
                  "hidden flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block",
                  TONE[r.tone],
                )}
              >
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
