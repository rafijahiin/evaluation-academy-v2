/**
 * Custom SVG illustrations for each of the 5 CPE phases.
 * Built to render at 64px (card icon) or 160px (chapter hero).
 * One color (currentColor) + one accent so they tint with theme.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  accent?: string;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 64 64",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

/** Phase 1: Preparation — compass + horizon */
export function PreparationIcon({ size = 64, accent = "currentColor", ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.18" />
      <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.32" />
      <path d="M32 14 L36 32 L32 50 L28 32 Z" fill={accent} opacity="0.9" />
      <path d="M14 32 L32 28 L50 32 L32 36 Z" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="32" r="3" fill={accent} />
      <path d="M32 4 V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 56 V60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Phase 2: Design — matrix / blueprint */
export function DesignIcon({ size = 64, accent = "currentColor", ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="10" y="10" width="44" height="44" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <line x1="10" y1="24" x2="54" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="38" x2="54" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="10" x2="24" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="38" y1="10" x2="38" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="12" y="12" width="10" height="10" rx="1.5" fill={accent} opacity="0.9" />
      <rect x="26" y="26" width="10" height="10" rx="1.5" fill={accent} opacity="0.55" />
      <rect x="40" y="40" width="12" height="12" rx="1.5" fill={accent} opacity="0.3" />
      <circle cx="31" cy="17" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="45" cy="31" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Phase 3: Fieldwork — interview bubble + data dots */
export function FieldworkIcon({ size = 64, accent = "currentColor", ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path
        d="M12 14 Q12 10 16 10 H38 Q42 10 42 14 V32 Q42 36 38 36 H22 L14 42 V36 Q12 36 12 32 Z"
        fill={accent}
        opacity="0.16"
      />
      <path
        d="M12 14 Q12 10 16 10 H38 Q42 10 42 14 V32 Q42 36 38 36 H22 L14 42 V36 Q12 36 12 32 Z"
        stroke={accent}
        strokeWidth="1.5"
      />
      <circle cx="21" cy="23" r="1.6" fill="currentColor" />
      <circle cx="27" cy="23" r="1.6" fill="currentColor" />
      <circle cx="33" cy="23" r="1.6" fill="currentColor" />
      {/* second smaller bubble (FGD) */}
      <path
        d="M30 36 Q30 32 34 32 H50 Q54 32 54 36 V46 Q54 50 50 50 H42 L36 56 V50 Q30 50 30 46 Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M30 36 Q30 32 34 32 H50 Q54 32 54 36 V46 Q54 50 50 50 H42 L36 56 V50 Q30 50 30 46 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.55"
      />
    </svg>
  );
}

/** Phase 4: Reporting — document + chart */
export function ReportingIcon({ size = 64, accent = "currentColor", ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path
        d="M16 8 H38 L48 18 V52 Q48 56 44 56 H16 Q12 56 12 52 V12 Q12 8 16 8 Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M16 8 H38 L48 18 V52 Q48 56 44 56 H16 Q12 56 12 52 V12 Q12 8 16 8 Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M38 8 V18 H48" stroke="currentColor" strokeWidth="1.5" />
      {/* bar chart */}
      <rect x="18" y="42" width="4" height="8" rx="0.8" fill={accent} />
      <rect x="25" y="36" width="4" height="14" rx="0.8" fill={accent} opacity="0.75" />
      <rect x="32" y="40" width="4" height="10" rx="0.8" fill={accent} opacity="0.55" />
      <rect x="39" y="30" width="4" height="20" rx="0.8" fill={accent} opacity="0.9" />
      {/* lines */}
      <line x1="18" y1="22" x2="36" y2="22" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <line x1="18" y1="27" x2="42" y2="27" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}

/** Phase 5: Dissemination — broadcast / network */
export function DisseminationIcon({ size = 64, accent = "currentColor", ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="32" cy="32" r="6" fill={accent} />
      {/* concentric waves */}
      <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      {/* nodes */}
      <circle cx="18" cy="14" r="2.5" fill={accent} opacity="0.85" />
      <circle cx="48" cy="16" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="14" cy="44" r="2.5" fill={accent} opacity="0.55" />
      <circle cx="50" cy="46" r="2.5" fill={accent} opacity="0.8" />
      <circle cx="32" cy="56" r="2.5" fill="currentColor" opacity="0.55" />
      {/* connectors */}
      <line x1="32" y1="32" x2="18" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="32" x2="48" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="32" x2="14" y2="44" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="32" x2="50" y2="46" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/** Convenience lookup by chapter slug */
export const CHAPTER_ICONS = {
  preparation: PreparationIcon,
  design: DesignIcon,
  fieldwork: FieldworkIcon,
  reporting: ReportingIcon,
  dissemination: DisseminationIcon,
} as const;
