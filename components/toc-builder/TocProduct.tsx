"use client";
import { useState } from "react";
import { m } from "motion/react";
import {
  ArrowLeft,
  Check,
  Copy,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { accentInk, accentBg, type TocData } from "./steps";

const LEVELS: {
  id: keyof TocData;
  chip: string;
  shortLabel: string;
  accent: "un-blue" | "teal" | "navy" | "amber";
  assumption?: keyof TocData;
}[] = [
  { id: "inputs", chip: "Inputs", shortLabel: "01", accent: "un-blue", assumption: "a_inputs" },
  { id: "activities", chip: "Activities", shortLabel: "02", accent: "teal", assumption: "a_activities" },
  { id: "outputs", chip: "Outputs", shortLabel: "03", accent: "navy", assumption: "a_outputs" },
  { id: "outcomes", chip: "Outcomes", shortLabel: "04", accent: "un-blue", assumption: "a_outcomes" },
  { id: "result", chip: "Transformative Result", shortLabel: "05", accent: "amber" },
];

/**
 * Theory of Change document, rendered as a horizontal-flow infographic.
 *
 * Five "stations" connected by a flowing path from left (Inputs) to right
 * (the Transformative Result, treated as the destination — bigger, more
 * prominent, gold). Between each pair of stations sits a rotated
 * "Post-it" style amber assumption note.
 *
 * Mobile fallback: vertical stack with downward arrows and assumption
 * notes inline (no horizontal scroll on small screens).
 *
 * Visual concept inspired by NGO-style infographic ToCs (horizontal
 * pathway with annotated assumptions), but executed in the v2 design
 * language — no decorative illustrations, no hand-drawn aesthetic.
 */
export function TocProduct({
  data,
  onEdit,
}: {
  data: TocData;
  onEdit: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const title = data.context.title || "Theory of Change";
  const country = data.context.country;
  const focus = data.context.focus;

  const buildPlainText = () => {
    const lines = [
      "THEORY OF CHANGE",
      title,
      [country, focus].filter(Boolean).join(" · "),
      "",
      "INPUTS",
      data.inputs || "—",
      "",
      "  ↓ Assumption: " + (data.a_inputs || "—"),
      "",
      "ACTIVITIES",
      data.activities || "—",
      "",
      "  ↓ Assumption: " + (data.a_activities || "—"),
      "",
      "OUTPUTS",
      data.outputs || "—",
      "",
      "  ↓ Assumption: " + (data.a_outputs || "—"),
      "",
      "OUTCOMES",
      data.outcomes || "—",
      "",
      "  ↓ Assumption: " + (data.a_outcomes || "—"),
      "",
      "TRANSFORMATIVE RESULT",
      data.result || "—",
    ];
    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may fail in non-https contexts */
    }
  };

  return (
    <div className="toc-product-page">
      {/* Toolbar (hidden in print) */}
      <div className="toc-toolbar flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy as text
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-[13px] font-medium hover:shadow-bloom hover:-translate-y-0.5 transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* The document */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="toc-product-doc relative rounded-3xl border border-border overflow-hidden shadow-card mx-auto"
        style={{
          background: "linear-gradient(180deg, #FBFAF6 0%, #F5F2EA 100%)",
        }}
      >
        {/* Soft top accent band */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--un-blue) 0%, var(--teal) 28%, var(--un-blue-900) 52%, var(--un-blue) 76%, var(--amber) 100%)",
          }}
        />

        {/* Header */}
        <header className="px-6 sm:px-12 pt-10 sm:pt-14 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] uppercase tracking-[0.24em] text-un-700 font-semibold">
              Theory of Change
            </div>
            <h1
              className="font-display mt-3 leading-[1.02] tracking-[-0.02em] text-ink-1"
              style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 500 }}
            >
              {title}
            </h1>
            {(country || focus) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[13.5px] text-ink-2">
                {country && (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--un-blue)" }}
                    />
                    {country}
                  </span>
                )}
                {country && focus && (
                  <span aria-hidden className="text-ink-4">·</span>
                )}
                {focus && (
                  <span className="italic" style={{ color: "var(--ink-2)" }}>
                    {focus}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-left sm:text-right shrink-0">
            <div className="text-[10px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
              Issued
            </div>
            <div className="mt-0.5 font-numeric text-[13.5px] font-semibold text-ink-1">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Column labels (desktop only) */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1.2fr] gap-3 px-8 mb-2 items-end">
          <ColumnLabel text="Pathway" />
          <div />
          <ColumnLabel text="Pathway" />
          <div />
          <ColumnLabel text="Pathway" />
          <div />
          <ColumnLabel text="Pathway" />
          <div />
          <ColumnLabel text="Destination" emphasis />
        </div>

        {/* The chain — horizontal on desktop, vertical on mobile */}
        <div className="px-4 sm:px-8 pb-10 pt-2">
          {/* DESKTOP horizontal flow */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1.2fr] gap-3 items-stretch">
              {LEVELS.map((level, i) => {
                const value = data[level.id] as string;
                const items = (value || "")
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const isResult = i === LEVELS.length - 1;
                const assumption =
                  i < LEVELS.length - 1 && level.assumption
                    ? (data[level.assumption] as string)
                    : "";
                return (
                  <Step
                    key={`row-${i}`}
                    level={level}
                    items={items}
                    isResult={isResult}
                    assumption={assumption}
                    showConnector={i < LEVELS.length - 1}
                    index={i}
                  />
                );
              })}
            </div>
          </div>

          {/* MOBILE vertical stack */}
          <div className="lg:hidden space-y-4">
            {LEVELS.map((level, i) => {
              const value = data[level.id] as string;
              const items = (value || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const isResult = i === LEVELS.length - 1;
              const assumption =
                i < LEVELS.length - 1 && level.assumption
                  ? (data[level.assumption] as string)
                  : "";
              return (
                <m.div
                  key={level.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <StationCard level={level} items={items} isResult={isResult} />
                  {assumption && (
                    <MobileAssumption assumption={assumption} fromAccent={level.accent} />
                  )}
                </m.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 sm:px-12 py-6 border-t border-border bg-white/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10.5px] uppercase tracking-[0.18em] text-ink-3 font-semibold">
            <span>Built with Evaluation Academy</span>
            <span className="text-ink-4">
              Based on the UNFPA Evaluation Handbook 2024
            </span>
          </div>
        </footer>
      </m.div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          html,
          body {
            background: white !important;
          }
          header,
          nav,
          footer,
          .no-print,
          .toc-toolbar {
            display: none !important;
          }
          .toc-product-page {
            padding: 0 !important;
            max-width: none !important;
          }
          .toc-product-doc {
            box-shadow: none !important;
            border: 1px solid var(--border) !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────────────────────

function ColumnLabel({ text, emphasis }: { text: string; emphasis?: boolean }) {
  return (
    <div
      className={`text-[9.5px] uppercase tracking-[0.20em] font-bold text-center pb-1 ${
        emphasis ? "text-amber" : "text-ink-4"
      }`}
    >
      {text}
    </div>
  );
}

/**
 * Renders BOTH the station card AND the trailing connector + assumption
 * (when not the last level). Used inside the grid; the connector slot is
 * a separate grid column so the assumption note can be positioned exactly
 * between station columns.
 */
function Step({
  level,
  items,
  isResult,
  assumption,
  showConnector,
  index,
}: {
  level: (typeof LEVELS)[number];
  items: string[];
  isResult: boolean;
  assumption: string;
  showConnector: boolean;
  index: number;
}) {
  return (
    <>
      <m.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.12 * index,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-w-0 self-stretch"
      >
        <StationCard level={level} items={items} isResult={isResult} />
      </m.div>
      {showConnector && (
        <Connector assumption={assumption} fromAccent={level.accent} index={index} />
      )}
    </>
  );
}

/**
 * One station card. Top has a circular accent badge with the level number,
 * accent-coloured chip beneath, and the bulleted items in the body. The
 * final station (Result) gets a distinct "destination" treatment — amber
 * gradient circle with sparkle icon, gold accent panel.
 */
function StationCard({
  level,
  items,
  isResult,
}: {
  level: (typeof LEVELS)[number];
  items: string[];
  isResult: boolean;
}) {
  const ink = accentInk(level.accent);
  const bg = accentBg(level.accent);

  if (isResult) {
    return (
      <div
        className="h-full rounded-3xl overflow-hidden flex flex-col items-stretch relative"
        style={{
          background:
            "linear-gradient(180deg, #FFF8E1 0%, #FEF3C7 100%)",
          border: "2px solid rgba(245, 158, 11, 0.40)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 24px -16px rgba(245, 158, 11, 0.45)",
          minHeight: 220,
        }}
      >
        {/* Badge circle */}
        <div className="flex flex-col items-center pt-5 px-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-card mb-2.5"
            style={{
              background:
                "linear-gradient(135deg, var(--amber) 0%, #B45309 100%)",
            }}
          >
            <Sparkles className="w-6 h-6" strokeWidth={2.2} fill="white" />
          </div>
          <div
            className="text-[10.5px] uppercase tracking-[0.18em] font-bold text-amber"
            style={{ color: "#B45309" }}
          >
            {level.chip}
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 px-5 pb-5 pt-3">
          {items.length === 0 ? (
            <div
              className="text-[13.5px] italic text-center"
              style={{ color: "#92400E" }}
            >
              (Not specified)
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="font-display text-[16px] leading-[1.3] tracking-[-0.01em] text-center"
                  style={{ color: "#7C2D12", fontWeight: 500 }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl bg-white border border-border overflow-hidden flex flex-col">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ background: ink }} />
      {/* Header — badge + chip */}
      <div className="px-4 pt-4 pb-3 flex flex-col items-start" style={{ background: bg }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display italic font-medium text-[16px] mb-2 shadow-sm"
          style={{ background: ink }}
        >
          {level.shortLabel}
        </div>
        <div
          className="text-[10.5px] uppercase tracking-[0.18em] font-bold"
          style={{ color: ink }}
        >
          {level.chip}
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 px-4 py-3 bg-white">
        {items.length === 0 ? (
          <div className="text-[12.5px] text-ink-3 italic">(Not specified)</div>
        ) : (
          <ul className="space-y-1.5">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="relative pl-3.5 text-[12.5px] leading-[1.45] text-ink-1"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[8px] w-1.5 h-1.5 rounded-full"
                  style={{ background: ink }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * Connector between two stations on desktop: a horizontal gradient arrow
 * with a rotated amber "sticky note" assumption card below it.
 */
function Connector({
  assumption,
  fromAccent,
  index,
}: {
  assumption: string;
  fromAccent: "un-blue" | "teal" | "navy" | "amber";
  index: number;
}) {
  const id = `desktop-arrow-${index}`;
  const startColor = accentInk(fromAccent);
  const endColor = accentInk(LEVELS[index + 1].accent);

  // Alternate the sticky-note rotation for natural feel
  const rotations = [-2.2, 1.5, -1.8, 2];
  const rotation = rotations[index % rotations.length];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
      className="flex flex-col items-center justify-start gap-3 pt-7"
      style={{ minWidth: 110 }}
    >
      {/* Arrow */}
      <svg width="70" height="22" viewBox="0 0 70 22" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="11"
          x2="58"
          y2="11"
          stroke={`url(#${id})`}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 52 5 L 64 11 L 52 17"
          stroke={endColor}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Assumption sticky note */}
      {assumption ? (
        <m.div
          initial={{ opacity: 0, y: 6, rotate: rotation - 5 }}
          animate={{ opacity: 1, y: 0, rotate: rotation }}
          transition={{
            delay: 0.6 + index * 0.1,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="rounded-md px-2.5 py-2"
          style={{
            background:
              "linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)",
            border: "1px solid rgba(245, 158, 11, 0.40)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 12px -8px rgba(146, 64, 14, 0.35)",
            width: 130,
          }}
        >
          <div className="flex items-center gap-1 mb-0.5">
            <ShieldCheck
              className="w-2.5 h-2.5 shrink-0"
              style={{ color: "#B45309" }}
            />
            <span
              className="text-[8.5px] uppercase tracking-[0.14em] font-bold"
              style={{ color: "#B45309" }}
            >
              Key assumption
            </span>
          </div>
          <div
            className="text-[10.5px] leading-[1.35]"
            style={{ color: "#7C2D12" }}
          >
            {assumption}
          </div>
        </m.div>
      ) : (
        <div className="text-[9.5px] italic text-ink-4" style={{ width: 110 }}>
          (no assumption)
        </div>
      )}
    </m.div>
  );
}

/**
 * Mobile: downward arrow + assumption sticky note shown inline.
 */
function MobileAssumption({
  assumption,
  fromAccent,
}: {
  assumption: string;
  fromAccent: "un-blue" | "teal" | "navy" | "amber";
}) {
  const id = `mobile-arrow-${fromAccent}`;
  const startColor = accentInk(fromAccent);
  return (
    <div className="flex flex-col items-center gap-2 my-3">
      <svg width="20" height="36" viewBox="0 0 20 36" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor="var(--amber)" />
          </linearGradient>
        </defs>
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="24"
          stroke={`url(#${id})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 4 20 L 10 32 L 16 20"
          stroke="var(--amber)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="rounded-md px-3 py-2 max-w-[320px]"
        style={{
          background: "linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)",
          border: "1px solid rgba(245, 158, 11, 0.40)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 12px -8px rgba(146, 64, 14, 0.35)",
          transform: "rotate(-1.5deg)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <ShieldCheck
            className="w-3 h-3 shrink-0"
            style={{ color: "#B45309" }}
          />
          <span
            className="text-[9px] uppercase tracking-[0.14em] font-bold"
            style={{ color: "#B45309" }}
          >
            Key assumption
          </span>
        </div>
        <div
          className="text-[12px] leading-[1.4]"
          style={{ color: "#7C2D12" }}
        >
          {assumption}
        </div>
      </div>
    </div>
  );
}
