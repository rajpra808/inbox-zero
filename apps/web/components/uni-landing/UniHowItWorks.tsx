const STEPS = [
  {
    n: "01",
    title: "Connect your accounts",
    body: "Sign in with Gmail or Outlook. One click, read-only by default, fully revocable.",
  },
  {
    n: "02",
    title: "Set your preferences",
    body: "Tell Uni Inbox how you work in plain language. It learns your tone and rules.",
  },
  {
    n: "03",
    title: "Open an inbox at zero",
    body: "Mail arrives sorted and drafted. You review, send, and get on with your day.",
  },
];

export function UniHowItWorks() {
  return (
    <section id="how" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-green">
            Set up in minutes
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            How it works
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-display text-5xl font-semibold text-transparent [-webkit-text-stroke:1px_hsl(var(--brand-blue))]">
                {s.n}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-7 hidden h-px w-12 translate-x-1/2 bg-gradient-to-r from-brand-blue/40 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
