import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutVariant = "key" | "tip" | "warn";

type CalloutProps = {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
};

const VARIANT_STYLES: Record<
  CalloutVariant,
  { bg: string; border: string; icon: string; iconBg: string; iconColor: string; titleColor: string }
> = {
  key: {
    bg: "rgba(0, 111, 183, 0.04)",
    border: "rgba(0, 111, 183, 0.18)",
    icon: "◆",
    iconBg: "var(--un-blue-100)",
    iconColor: "var(--un-blue-700)",
    titleColor: "var(--un-blue-800)",
  },
  tip: {
    bg: "rgba(20, 184, 166, 0.05)",
    border: "rgba(20, 184, 166, 0.22)",
    icon: "✓",
    iconBg: "rgba(20, 184, 166, 0.15)",
    iconColor: "#0F766E",
    titleColor: "#0F766E",
  },
  warn: {
    bg: "rgba(245, 158, 11, 0.06)",
    border: "rgba(245, 158, 11, 0.30)",
    icon: "!",
    iconBg: "rgba(245, 158, 11, 0.18)",
    iconColor: "#B45309",
    titleColor: "#92400E",
  },
};

/**
 * In-lesson callout block.
 *   <Callout variant="key" title="11-month minimum">
 *     The handbook says explicitly...
 *   </Callout>
 */
export function Callout({ variant = "key", title, children }: CalloutProps) {
  const s = VARIANT_STYLES[variant];
  return (
    <aside
      className={cn(
        "my-6 flex items-start gap-3.5 rounded-2xl border px-5 py-4",
      )}
      style={{ background: s.bg, borderColor: s.border }}
    >
      <span
        aria-hidden
        className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold"
        style={{ background: s.iconBg, color: s.iconColor }}
      >
        {s.icon}
      </span>
      <div className="min-w-0 flex-1">
        {title && (
          <div
            className="text-[13.5px] font-semibold leading-tight mb-1"
            style={{ color: s.titleColor }}
          >
            {title}
          </div>
        )}
        <div className="text-[14.5px] leading-[1.6] text-ink-1">
          {children}
        </div>
      </div>
    </aside>
  );
}
