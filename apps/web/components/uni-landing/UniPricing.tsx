import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "For getting your inbox under control.",
    features: [
      "1 connected account",
      "AI labels & cleanup",
      "Bulk unsubscribe",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$20",
    period: "per month",
    blurb: "For people who live in their inbox.",
    features: [
      "Unlimited accounts",
      "AI drafts in your voice",
      "Calendar-aware triage",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
];

export function UniPricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue">
          Simple pricing
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Pay for the calm, not the seats
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative rounded-2xl border p-8",
              plan.highlighted
                ? "border-brand-blue/50 bg-card shadow-xl shadow-brand-blue/10"
                : "border-border bg-card",
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold text-foreground">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-semibold tracking-tight text-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-foreground"
                >
                  <Check className="h-4 w-4 flex-shrink-0 text-brand-green" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className={cn(
                "mt-8 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors",
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-background text-foreground hover:bg-accent",
              )}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
