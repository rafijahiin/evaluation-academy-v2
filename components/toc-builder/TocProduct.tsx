"use client";
import { useState } from "react";
import { m } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { accentInk, accentBg, type TocData } from "./steps";

/**
 * Theory of Change rendered as a 3-zone infographic:
 *
 *   LEFT zone:    Inputs (single station card + a_inputs assumption)
 *   MIDDLE zone:  Change pathway — Activities → Outputs → Outcomes,
 *                 stacked vertically with assumptions between them
 *   RIGHT zone:   Destination — the Transformative Result as a bold
 *                 amber-gradient card (with a_outcomes assumption)
 *
 * Arrows flow LEFT → MIDDLE → RIGHT across the page, reading like a
 * journey from invested resources to the ultimate impact.
 *
 * Mobile fallback: single vertical column with all stations and
 * assumptions stacked top-to-bottom.
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

  const inputs = splitItems(data.inputs);
  const activities = splitItems(data.activities);
  const outputs = splitItems(data.outputs);
  const outcomes = splitItems(data.outcomes);
  const result = splitItems(data.result);

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
        <header className="px-6 sm:px-10 pt-10 sm:pt-14 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] uppercase tracking-[0.24em] text-un-700 font-semibold">
              Theory of Change
            </div>
            <h1
              className="font-display mt-3 leading-[1.02] tracking-[-0.02em] text-ink-1"
              style={{ fontSize: "clamp(32px, 4.6vw, 52px)", fontWeight: 500 }}
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

        {/* Zone labels — desktop only */}
        <div className="hidden lg:grid grid-cols-[1fr_1.5fr_1fr] gap-6 px-8 pb-2">
          <ZoneLabel text="Inputs" accent="un-blue" />
          <ZoneLabel text="Change pathway" accent="teal" />
          <ZoneLabel text="Destination" accent="amber" emphasis />
        </div>

        {/* The 3-zone layout (desktop) / vertical stack (mobile) */}
        <div className="px-4 sm:px-8 pb-10 pt-2">
          {/* DESKTOP */}
          <div className="hidden lg:grid grid-cols-[1fr_1.5fr_1fr] gap-6 items-start">
            {/* LEFT ZONE: Inputs */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 relative"
            >
              <StationCard
                accent="un-blue"
                shortLabel="01"
                chip="Inputs"
                items={inputs}
              />
              {/* Inter-zone arrow + a_inputs assumption */}
              <InterZoneAssumption
                direction="right"
                fromAccent="un-blue"
                toAccent="teal"
                assumption={data.a_inputs}
              />
            </m.div>

            {/* MIDDLE ZONE: Activities → Outputs → Outcomes */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-3"
            >
              <StationCard
                accent="teal"
                shortLabel="02"
                chip="Activities"
                items={activities}
              />
              <VerticalAssumption
                assumption={data.a_activities}
                fromAccent="teal"
                toAccent="navy"
              />
              <StationCard
                accent="navy"
                shortLabel="03"
                chip="Outputs"
                items={outputs}
              />
              <VerticalAssumption
                assumption={data.a_outputs}
                fromAccent="navy"
                toAccent="un-blue"
              />
              <StationCard
                accent="un-blue"
                shortLabel="04"
                chip="Outcomes"
                items={outcomes}
              />
            </m.div>

            {/* RIGHT ZONE: Result destination */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-4 relative"
            >
              <InterZoneAssumption
                direction="left"
                fromAccent="un-blue"
                toAccent="amber"
                assumption={data.a_outcomes}
              />
              <ResultCard items={result} />
            </m.div>
          </div>

          {/* MOBILE — single vertical column */}
          <div className="lg:hidden space-y-3">
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StationCard
                accent="un-blue"
                shortLabel="01"
                chip="Inputs"
                items={inputs}
              />
            </m.div>
            <VerticalAssumption
              assumption={data.a_inputs}
              fromAccent="un-blue"
              toAccent="teal"
            />
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <StationCard
                accent="teal"
                shortLabel="02"
                chip="Activities"
                items={activities}
              />
            </m.div>
            <VerticalAssumption
              assumption={data.a_activities}
              fromAccent="teal"
              toAccent="navy"
            />
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <StationCard
                accent="navy"
                shortLabel="03"
                chip="Outputs"
                items={outputs}
              />
            </m.div>
            <VerticalAssumption
              assumption={data.a_outputs}
              fromAccent="navy"
              toAccent="un-blue"
            />
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <StationCard
                accent="un-blue"
                shortLabel="04"
                chip="Outcomes"
                items={outcomes}
              />
            </m.div>
            <VerticalAssumption
              assumption={data.a_outcomes}
              fromAccent="un-blue"
              toAccent="amber"
            />
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ResultCard items={result} />
            </m.div>
          </div>
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
// Helpers
// ───────────────────────────────────────────────────────────────

function splitItems(raw: string): string[] {
  return (raw || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ZoneLabel({
  text,
  accent,
  emphasis,
}: {
  text: string;
  accent: "un-blue" | "teal" | "amber";
  emphasis?: boolean;
}) {
  const ink = accentInk(accent);
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="w-6 h-px"
        style={{ background: ink, opacity: 0.6 }}
      />
      <span
        className={`text-[10px] uppercase tracking-[0.22em] font-bold ${
          emphasis ? "" : ""
        }`}
        style={{ color: ink }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="flex-1 h-px"
        style={{ background: ink, opacity: 0.2 }}
      />
    </div>
  );
}

function StationCard({
  accent,
  shortLabel,
  chip,
  items,
}: {
  accent: "un-blue" | "teal" | "navy" | "amber";
  shortLabel: string;
  chip: string;
  items: string[];
}) {
  const ink = accentInk(accent);
  const bg = accentBg(accent);

  return (
    <div className="rounded-2xl bg-white border border-border overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ background: ink }} />
      {/* Header — badge + chip */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ background: bg }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display italic font-medium text-[15px] shadow-sm shrink-0"
          style={{ background: ink }}
        >
          {shortLabel}
        </div>
        <div
          className="text-[11.5px] uppercase tracking-[0.18em] font-bold leading-tight"
          style={{ color: ink }}
        >
          {chip}
        </div>
      </div>
      {/* Body */}
      <div className="px-4 py-3.5 bg-white">
        {items.length === 0 ? (
          <div className="text-[12.5px] text-ink-3 italic">(Not specified)</div>
        ) : (
          <ul className="space-y-1.5">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="relative pl-3.5 text-[13px] leading-[1.5] text-ink-1"
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

function ResultCard({ items }: { items: string[] }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #FFF8E1 0%, #FDCFB3 100%)",
        border: "2px solid rgba(245, 158, 11, 0.40)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 16px 32px -20px rgba(245, 158, 11, 0.45)",
      }}
    >
      {/* Top accent + badge area */}
      <div className="flex flex-col items-center pt-7 px-6 pb-1">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-card mb-3"
          style={{
            background: "linear-gradient(135deg, var(--amber) 0%, #AE4300 100%)",
          }}
        >
          <Sparkles className="w-7 h-7" strokeWidth={2.2} fill="white" />
        </div>
        <div
          className="text-[10.5px] uppercase tracking-[0.20em] font-bold text-center"
          style={{ color: "#AE4300" }}
        >
          Transformative Result
        </div>
      </div>
      {/* Body */}
      <div className="px-6 pt-4 pb-7 text-center">
        {items.length === 0 ? (
          <div
            className="text-[13.5px] italic"
            style={{ color: "#92400E" }}
          >
            (Not specified)
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="font-display leading-[1.2] tracking-[-0.01em]"
                style={{
                  color: "#7C2D12",
                  fontWeight: 500,
                  fontSize: "clamp(15px, 1.3vw, 18px)",
                }}
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

/**
 * Sticky-note assumption used inside the middle zone (vertical flow) and
 * as the mobile fallback. Down-arrow + amber rotated note.
 */
function VerticalAssumption({
  assumption,
  fromAccent,
  toAccent,
}: {
  assumption: string;
  fromAccent: "un-blue" | "teal" | "navy" | "amber";
  toAccent: "un-blue" | "teal" | "navy" | "amber";
}) {
  const id = `va-${fromAccent}-${toAccent}-${Math.random().toString(36).slice(2, 6)}`;
  const fromColor = accentInk(fromAccent);
  const toColor = accentInk(toAccent);

  return (
    <div className="flex items-center gap-3 my-2 px-2">
      <svg width="22" height="36" viewBox="0 0 22 36" aria-hidden className="shrink-0">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
        <line
          x1="11"
          y1="0"
          x2="11"
          y2="24"
          stroke={`url(#${id})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 5 20 L 11 32 L 17 20"
          stroke={toColor}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {assumption ? (
        <div
          className="flex-1 rounded-md px-3 py-2"
          style={{
            background: "linear-gradient(180deg, #FDCFB3 0%, #FDE68A 100%)",
            border: "1px solid rgba(245, 158, 11, 0.40)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 12px -8px rgba(146, 64, 14, 0.30)",
            transform: "rotate(-0.6deg)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <ShieldCheck
              className="w-3 h-3 shrink-0"
              style={{ color: "#AE4300" }}
            />
            <span
              className="text-[9.5px] uppercase tracking-[0.16em] font-bold"
              style={{ color: "#AE4300" }}
            >
              Key assumption
            </span>
          </div>
          <div
            className="text-[12px] leading-[1.45]"
            style={{ color: "#7C2D12" }}
          >
            {assumption}
          </div>
        </div>
      ) : (
        <div className="flex-1 text-[11px] italic text-ink-4 px-1">
          (no assumption recorded)
        </div>
      )}
    </div>
  );
}

/**
 * Used at the boundary between LEFT/MIDDLE zones (a_inputs) and between
 * MIDDLE/RIGHT zones (a_outcomes). Shows a sticky note with an arrow
 * pointing toward the next zone (right for the left boundary, left for
 * the right boundary).
 */
function InterZoneAssumption({
  direction,
  fromAccent,
  toAccent,
  assumption,
}: {
  direction: "left" | "right";
  fromAccent: "un-blue" | "teal" | "navy" | "amber";
  toAccent: "un-blue" | "teal" | "navy" | "amber";
  assumption: string;
}) {
  const Arrow = direction === "right" ? ArrowRight : ArrowLeft;
  const id = `iza-${fromAccent}-${toAccent}-${direction}`;
  const fromColor = accentInk(fromAccent);
  const toColor = accentInk(toAccent);

  return (
    <div className="mt-4">
      {/* Arrow band — points toward the next zone */}
      <div
        className={`flex items-center gap-1.5 mb-2 ${
          direction === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <svg width="56" height="14" viewBox="0 0 56 14" aria-hidden>
          <defs>
            <linearGradient
              id={id}
              x1={direction === "right" ? "0%" : "100%"}
              x2={direction === "right" ? "100%" : "0%"}
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          <line
            x1="2"
            y1="7"
            x2="54"
            y2="7"
            stroke={`url(#${id})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <Arrow className="w-4 h-4 shrink-0" style={{ color: toColor }} />
      </div>
      {/* Assumption note */}
      {assumption ? (
        <div
          className="rounded-md px-3 py-2"
          style={{
            background: "linear-gradient(180deg, #FDCFB3 0%, #FDE68A 100%)",
            border: "1px solid rgba(245, 158, 11, 0.40)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 12px -8px rgba(146, 64, 14, 0.30)",
            transform:
              direction === "right" ? "rotate(-1.2deg)" : "rotate(1.2deg)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <ShieldCheck
              className="w-3 h-3 shrink-0"
              style={{ color: "#AE4300" }}
            />
            <span
              className="text-[9.5px] uppercase tracking-[0.16em] font-bold"
              style={{ color: "#AE4300" }}
            >
              Key assumption
            </span>
          </div>
          <div
            className="text-[12px] leading-[1.45]"
            style={{ color: "#7C2D12" }}
          >
            {assumption}
          </div>
        </div>
      ) : (
        <div className="text-[11px] italic text-ink-4">
          (no assumption recorded)
        </div>
      )}
    </div>
  );
}
