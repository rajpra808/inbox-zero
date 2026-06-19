import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Which email providers are supported?",
    a: "Gmail and Outlook today, with more on the way. Connect as many accounts as your plan allows.",
  },
  {
    q: "Is my email data safe?",
    a: "Yes. Access is revocable at any time, we never sell your data, and the entire platform is open source so you can self-host it.",
  },
  {
    q: "Will it send emails without me?",
    a: "Never silently. Uni Inbox drafts replies for you, but nothing leaves your account until you approve it.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Of course. Plans are month to month — cancel in a click, no questions asked.",
  },
];

export function UniFAQ() {
  return (
    <section id="faq" className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h2 className="text-center font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Questions, answered
        </h2>
        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-lg font-medium text-foreground">
                {item.q}
                <Plus className="h-5 w-5 flex-shrink-0 text-brand-blue transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
