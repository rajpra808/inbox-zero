import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { BRAND_NAME } from "@/utils/branding";
import { UniInboxMock } from "@/components/uni-landing/UniInboxMock";

export function UniHero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div className="h-[420px] w-[820px] rounded-full bg-gradient-to-tr from-brand-blue/25 via-brand-green/15 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-brand-green" />
          Your AI inbox, finally unified
        </div>

        <h1 className="mx-auto mt-7 max-w-4xl font-display text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          The inbox that
          <br className="hidden sm:block" />{" "}
          <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
            runs itself
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {BRAND_NAME} reads, sorts, and drafts your email in your own voice —
          so you open your inbox already at zero. One calm workspace for every
          account.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#how"
            className="inline-flex h-12 items-center rounded-full border border-border bg-background px-7 text-base font-semibold text-foreground transition-colors hover:bg-accent"
          >
            See how it works
          </Link>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          No credit card · Works with Gmail &amp; Outlook · Open source
        </p>

        <div className="mt-16 lg:mt-20">
          <UniInboxMock />
        </div>
      </div>
    </section>
  );
}
