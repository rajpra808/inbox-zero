import Link from "next/link";
import { Inbox } from "lucide-react";
import { cn } from "@/utils";
import { BRAND_NAME } from "@/utils/branding";

export function UniWordmark({
  className,
  href = "/",
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-green text-white shadow-sm transition-transform group-hover:scale-105",
          compact ? "h-7 w-7" : "h-9 w-9",
        )}
      >
        <Inbox
          className={compact ? "h-3.5 w-3.5" : "h-[18px] w-[18px]"}
          strokeWidth={2.25}
        />
      </span>
      <span
        className={cn(
          "font-display font-semibold tracking-tight text-foreground",
          compact ? "text-base" : "text-lg",
        )}
      >
        {BRAND_NAME}
      </span>
    </Link>
  );
}
