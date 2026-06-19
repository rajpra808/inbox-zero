import Link from "next/link";
import { UniWordmark } from "@/components/uni-landing/UniWordmark";
import { BRAND_NAME } from "@/utils/branding";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/login" },
    ],
  },
];

export function UniFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <UniWordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The AI inbox that runs itself. One calm workspace for every account.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-foreground">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <p>Built for inbox zero.</p>
        </div>
      </div>
    </footer>
  );
}
