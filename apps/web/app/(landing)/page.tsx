import type { Metadata } from "next";
import { env } from "@/env";
import { UniHeader } from "@/components/uni-landing/UniHeader";
import { UniHero } from "@/components/uni-landing/UniHero";
import { UniFeatures } from "@/components/uni-landing/UniFeatures";
import { UniHowItWorks } from "@/components/uni-landing/UniHowItWorks";
import { UniPricing } from "@/components/uni-landing/UniPricing";
import { UniFAQ } from "@/components/uni-landing/UniFAQ";
import { UniFinalCTA } from "@/components/uni-landing/UniFinalCTA";
import { UniFooter } from "@/components/uni-landing/UniFooter";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Landing() {
  const showPricing = !env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS;

  return (
    <div className="min-h-screen bg-background">
      <UniHeader />
      <main>
        <UniHero />
        <UniFeatures />
        <UniHowItWorks />
        {showPricing && <UniPricing />}
        <UniFAQ />
        <UniFinalCTA />
      </main>
      <UniFooter />
    </div>
  );
}
