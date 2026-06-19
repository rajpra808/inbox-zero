import {
  CalendarClock,
  Layers,
  PenLine,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    tone: "blue",
    title: "One unified inbox",
    body: "Every Gmail and Outlook account in a single calm view. No more tab juggling.",
  },
  {
    icon: Sparkles,
    tone: "green",
    title: "AI auto-organize",
    body: "Labels, priorities, and categories applied the moment mail lands — automatically.",
  },
  {
    icon: PenLine,
    tone: "blue",
    title: "Drafts in your voice",
    body: "Replies are pre-written in your tone, waiting for a one-tap send.",
  },
  {
    icon: Trash2,
    tone: "green",
    title: "Bulk unsubscribe",
    body: "Clear newsletters and cold email in seconds. See who emails you most.",
  },
  {
    icon: CalendarClock,
    tone: "blue",
    title: "Calendar aware",
    body: "Understands your schedule to triage meetings and follow-ups for you.",
  },
  {
    icon: ShieldCheck,
    tone: "green",
    title: "Private & open source",
    body: "Your data stays yours. Self-host anytime — the whole engine is open.",
  },
];

const TONE: Record<string, string> = {
  blue: "bg-brand-blue/10 text-brand-blue",
  green: "bg-brand-green/10 text-brand-green",
};

export function UniFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue">
          Everything in one place
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Less inbox. More done.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A focused set of tools that quietly handle the busywork behind your
          email.
        </p>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5"
          >
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${TONE[f.tone]}`}
            >
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
              {f.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
