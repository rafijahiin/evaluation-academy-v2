"use client";
import { useState } from "react";
import { m } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  Check,
  Copy,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { accentInk, accentBg, type TocData } from "./steps";

const LEVELS: {
  id: keyof TocData;
  chip: string;
  accent: "un-blue" | "teal" | "navy" | "amber";
  assumption?: keyof TocData;
}[] = [
  { id: "inputs", chip: "Inputs", accent: "un-blue", assumption: "a_inputs" },
  { id: "activities", chip: "Activities", accent: "teal", assumption: "a_activities" },
  { id: "outputs", chip: "Outputs", accent: "navy", assumption: "a_outputs" },
  { id: "outcomes", chip: "Outcomes", accent: "un-blue", assumption: "a_outcomes" },
  { id: "result", chip: "Transformative Result", accent: "amber" },
];

/**
 * Final printable view of the user's Theory of Change.
 *
 * Vertical-flow document on every viewport — like a one-page Theory of
 * Change you'd hand to a country office. Each level is a full-width card
 * with thick accent top bar, accent-tinted body, bulleted items with
 * coloured dots. Between levels: a downward gradient arrow + a floating
 * italic-amber "If this holds" assumption card centred in the page.
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
          maxWidth: 820,
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
        <header className="px-6 sm:px-10 pt-10 sm:pt-14 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-un-700 font-semibold">
              Theory of Change
            </div>
            <h1
              className="font-display mt-3 leading-[1.04] tracking-[-0.02em] text-ink-1"
              style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500 }}
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

        {/* Vertical chain */}
        <div className="px-4 sm:px-8 pb-10 pt-2">
          {LEVELS.map((level, i) => {
            const value = data[level.id] as string;
            const items = (value || "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            const prevAssumption =
              i > 0 && LEVELS[i - 1].assumption
                ? (data[LEVELS[i - 1].assumption!] as string)
                : "";
            return (
              <div key={level.id}>
                {/* Connector + assumption from previous level */}
                {i > 0 && (
                  <VerticalConnector
                    fromAccent={LEVELS[i - 1].accent}
                    toAccent={level.accent}
                    assumption={prevAssumption}
                    index={i}
                  />
                )}
                {/* Level box */}
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.08 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <LevelBox level={level} items={items} />
                </m.div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="px-6 sm:px-10 py-6 border-t border-border bg-white/50">
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
            size: A4;
            margin: 10mm;
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

function LevelBox({
  level,
  items,
}: {
  level: {
    id: keyof TocData;
    chip: string;
    accent: "un-blue" | "teal" | "navy" | "amber";
  };
  items: string[];
}) {
  const ink = accentInk(level.accent);
  const bg = accentBg(level.accent);

  return (
    <div className="rounded-2xl bg-white border border-border overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ background: ink }} />
      {/* Body */}
      <div className="px-5 sm:px-7 py-5 sm:py-6" style={{ background: bg }}>
        <div
          className="text-[10.5px] uppercase tracking-[0.18em] font-bold mb-3"
          style={{ color: ink }}
        >
          {level.chip}
        </div>
        {items.length === 0 ? (
          <div className="text-[13.5px] text-ink-3 italic">(Not specified)</div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="relative pl-4 text-[14px] leading-[1.6] text-ink-1"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full"
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
 * Centred vertical connector — arrow with gradient + floating
 * "If this holds" assumption card sitting beside the arrow.
 */
function VerticalConnector({
  fromAccent,
  toAccent,
  assumption,
  index,
}: {
  fromAccent: "un-blue" | "teal" | "navy" | "amber";
  toAccent: "un-blue" | "teal" | "navy" | "amber";
  assumption: string;
  index: number;
}) {
  const id = `connector-${fromAccent}-${toAccent}-${index}`;
  const fromColor = accentInk(fromAccent);
  const toColor = accentInk(toAccent);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-5 px-2">
      {/* Spacer for symmetry */}
      <div className="flex-1 hidden sm:block" />
      {/* Arrow */}
      <div className="shrink-0">
        <svg width="28" height="44" viewBox="0 0 28 44" aria-hidden>
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          <line
            x1="14"
            y1="0"
            x2="14"
            y2="32"
            stroke={`url(#${id})`}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 7 28 L 14 40 L 21 28"
            stroke={toColor}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Assumption card */}
      <div className="flex-1 min-w-0">
        {assumption ? (
          <m.div
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className="rounded-xl border px-3.5 py-2.5 max-w-[420px]"
            style={{
              background: "rgba(245, 158, 11, 0.08)",
              borderColor: "rgba(245, 158, 11, 0.30)",
              borderStyle: "dashed",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck
                className="w-3 h-3 shrink-0"
                style={{ color: "#B45309" }}
              />
              <span
                className="text-[9.5px] uppercase tracking-[0.16em] font-bold"
                style={{ color: "#B45309" }}
              >
                If this holds true
              </span>
            </div>
            <div
              className="text-[12.5px] leading-[1.45] italic"
              style={{ color: "#7C2D12" }}
            >
              {assumption}
            </div>
          </m.div>
        ) : (
          <div
            className="max-w-[420px] text-[11.5px] italic text-ink-4 px-3.5"
          >
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              No assumption recorded
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
