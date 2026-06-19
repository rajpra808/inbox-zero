import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function UniFinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-blue to-brand-green px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white,transparent_40%)]"
        />
        <h2 className="relative font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Reach inbox zero today
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">
          Join thousands who let their inbox run itself. Free to start, no card
          required.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Link
            href="/login"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-brand-blue transition-transform hover:scale-[1.02]"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
