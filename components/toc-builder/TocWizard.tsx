"use client";
import { m, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import {
  STEPS,
  accentInk,
  accentBg,
  type TocData,
  type TocStep,
} from "./steps";
import { TocStrip } from "./TocStrip";
import { cn } from "@/lib/utils";

type Props = {
  step: TocStep;
  stepIndex: number;
  data: TocData;
  onChange: (next: Partial<TocData>) => void;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Single-step wizard card. Backdrop italic numeral, accent chip, bigger
 * Fraunces title. Form fields tinted to the step accent. Example becomes
 * an "Ideas to start with" hint card. Assumption becomes a substantial
 * amber gradient panel.
 */
export function TocWizard({
  step,
  stepIndex,
  data,
  onChange,
  onPrev,
  onNext,
}: Props) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const isContext = step.id === "context";
  const accent = !isContext ? step.accent : "un-blue";
  const ink = accentInk(accent);
  const bg = accentBg(accent);

  return (
    <div className="rounded-3xl bg-white border border-border shadow-card overflow-hidden">
      {/* Accent top bar — gives the card a tabbed feel */}
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{ background: ink }}
      />

      {/* Header with backdrop numeral */}
      <div className="relative px-6 sm:px-10 pt-8 sm:pt-10 pb-2 overflow-hidden">
        {/* Big italic backdrop numeral */}
        <AnimatePresence mode="wait">
          <m.div
            key={`bg-${step.id}`}
            aria-hidden
            initial={{ opacity: 0, scale: 1.04, rotate: -2 }}
            animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute pointer-events-none select-none font-display italic font-medium leading-none tracking-[-0.04em]"
            style={{
              color: ink,
              fontSize: "clamp(120px, 18vw, 200px)",
              top: "-18px",
              right: "-12px",
            }}
          >
            {String(stepIndex + 1).padStart(2, "0")}
          </m.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative max-w-[680px]">
          <div className="flex items-center gap-2.5 mb-3 text-[10.5px] uppercase tracking-[0.16em] font-bold">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ color: ink, background: bg }}
            >
              <span
                aria-hidden
                className="w-1 h-1 rounded-full"
                style={{ background: ink }}
              />
              {isContext ? "Step 1 of 6" : step.chip}
            </span>
            {!isContext && (
              <span className="text-ink-3">
                Step {stepIndex + 1} of {STEPS.length}
              </span>
            )}
          </div>
          <h2
            className="font-display leading-[1.05] tracking-[-0.02em] text-ink-1"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 500,
            }}
          >
            {step.title}
          </h2>
          <p
            className="mt-3 text-[14.5px] text-ink-2 leading-[1.6]"
            style={{ maxWidth: 560 }}
          >
            {step.hint}
          </p>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        <m.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 sm:px-10 py-6 sm:py-8"
        >
          {isContext ? (
            <ContextForm data={data} onChange={onChange} />
          ) : (
            <LevelForm
              step={step}
              data={data}
              onChange={onChange}
              accentInk={ink}
            />
          )}
        </m.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="border-t border-border px-6 sm:px-10 py-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[13.5px] font-medium transition-colors",
            isFirst
              ? "border-border text-ink-4 cursor-not-allowed"
              : "border-border text-ink-1 hover:border-un-200 hover:bg-surface-2",
          )}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13.5px] font-medium hover:shadow-bloom hover:-translate-y-0.5 transition-all"
          style={{
            background: isLast
              ? "linear-gradient(135deg, var(--amber) 0%, #AE4300 100%)"
              : "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
          }}
        >
          {isLast ? "Build my Theory of Change" : "Continue"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chain preview */}
      <div className="border-t border-border bg-surface-2 px-6 sm:px-10 py-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
            Your chain so far
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-4 font-medium">
            Updates as you type
          </div>
        </div>
        <TocStrip data={data} currentStepId={step.id} />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Sub-forms
// ───────────────────────────────────────────────────────────────

function ContextForm({
  data,
  onChange,
}: {
  data: TocData;
  onChange: (next: Partial<TocData>) => void;
}) {
  if (STEPS[0].id !== "context" || !("fields" in STEPS[0])) return null;
  return (
    <div className="grid gap-5">
      {STEPS[0].fields.map((field) => (
        <label key={field.id} className="block">
          <span className="block text-[11.5px] uppercase tracking-[0.10em] font-semibold text-ink-2 mb-2">
            {field.label}
          </span>
          <input
            type="text"
            value={data.context[field.id] ?? ""}
            onChange={(e) =>
              onChange({
                context: { ...data.context, [field.id]: e.target.value },
              })
            }
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-[15px] focus:outline-none focus:border-un-400 focus:ring-2 focus:ring-un-100 transition-colors"
          />
        </label>
      ))}
    </div>
  );
}

function LevelForm({
  step,
  data,
  onChange,
  accentInk,
}: {
  step: TocStep;
  data: TocData;
  onChange: (next: Partial<TocData>) => void;
  accentInk: string;
}) {
  if (step.id === "context") return null;
  const value = data[step.id] as string;
  const assumptionKey = `a_${step.id}` as
    | "a_inputs"
    | "a_activities"
    | "a_outputs"
    | "a_outcomes";
  const isResult = step.isResult ?? false;
  const exampleLines = step.example.split("\n").filter(Boolean);

  return (
    <div className="grid gap-6">
      {/* Main textarea */}
      <label className="block">
        <span className="flex items-center justify-between mb-2">
          <span className="text-[11.5px] uppercase tracking-[0.10em] font-semibold text-ink-2">
            Your {step.chip.toLowerCase()}
          </span>
          <span className="text-[11.5px] text-ink-3">
            One item per line · be specific and measurable
          </span>
        </span>
        <textarea
          rows={isResult ? 3 : 5}
          value={value}
          onChange={(e) =>
            onChange({ [step.id]: e.target.value } as Partial<TocData>)
          }
          placeholder={isResult ? "e.g., " + step.example : "Type each item on a new line…"}
          className="w-full px-4 py-3.5 rounded-2xl border-2 bg-white text-[15px] leading-[1.65] resize-y transition-colors focus:outline-none"
          style={
            {
              borderColor: "var(--border)",
              ["--tw-ring-color" as never]: "rgba(249, 96, 0, 0.12)",
            } as React.CSSProperties
          }
          onFocus={(e) => {
            e.currentTarget.style.borderColor = accentInk;
            e.currentTarget.style.boxShadow = `0 0 0 4px ${accentInk}1A`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </label>

      {/* Ideas to start with */}
      <div
        className="rounded-2xl border px-4 py-4"
        style={{
          background: "rgba(249, 96, 0, 0.04)",
          borderColor: "rgba(249, 96, 0, 0.18)",
          borderStyle: "solid",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-6 h-6 rounded-full"
            style={{
              background: "rgba(249, 96, 0, 0.12)",
              color: "var(--un-blue-700)",
            }}
          >
            <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.2} />
          </span>
          <span className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-un-700">
            Ideas to start with
          </span>
        </div>
        <ul className="space-y-1.5">
          {exampleLines.map((line, i) => (
            <li
              key={i}
              className="relative pl-4 text-[13.5px] leading-[1.55] text-ink-2"
            >
              <span
                aria-hidden
                className="absolute left-0 top-[8px] w-1 h-1 rounded-full"
                style={{ background: "var(--un-blue-300)" }}
              />
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Assumption */}
      {!isResult && step.assumptionPrompt && (
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0.10) 100%)",
            borderColor: "rgba(245, 158, 11, 0.30)",
          }}
        >
          <div className="px-4 py-3 border-b border-amber/20 flex items-center gap-2" style={{ borderColor: "rgba(245, 158, 11, 0.20)" }}>
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--amber) 0%, #AE4300 100%)",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.4} />
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.14em] font-bold"
              style={{ color: "#92400E" }}
            >
              An assumption to test
            </span>
          </div>
          <label className="block px-4 py-4">
            <span
              className="block text-[13.5px] text-ink-1 leading-[1.55] mb-3"
              style={{ color: "#7C2D12" }}
            >
              {step.assumptionPrompt}
            </span>
            <textarea
              rows={2}
              value={(data[assumptionKey] as string) ?? ""}
              onChange={(e) =>
                onChange({
                  [assumptionKey]: e.target.value,
                } as Partial<TocData>)
              }
              placeholder="e.g., Government maintains political will and co-financing commitment"
              className="w-full px-3 py-2.5 rounded-xl border bg-white text-[13.5px] leading-[1.55] focus:outline-none transition-colors resize-y"
              style={{
                borderColor: "rgba(245, 158, 11, 0.35)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#D97706";
                e.currentTarget.style.boxShadow =
                  "0 0 0 4px rgba(245, 158, 11, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(245, 158, 11, 0.35)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div
              className="mt-3 text-[11.5px] leading-[1.5] italic"
              style={{ color: "#92400E" }}
            >
              Why this matters: every link in the chain rests on an assumption. If it doesn't hold, the chain breaks — and that's where you focus your data collection.
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
