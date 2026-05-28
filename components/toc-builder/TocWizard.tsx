"use client";
import { m, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
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
 * Single-step UI: header, form, footer with prev/next, chain preview at bottom.
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

  return (
    <div className="rounded-3xl bg-white border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
        <div className="flex items-start gap-4 sm:gap-5">
          <span
            className="font-display italic font-medium text-[36px] sm:text-[48px] leading-none tracking-[-0.02em] opacity-25 shrink-0"
            style={{ color: isContext ? "var(--un-blue-700)" : accentInk(step.accent) }}
          >
            {String(stepIndex + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            {!isContext && (
              <span
                className="inline-block text-[10px] uppercase tracking-[0.16em] font-bold mb-2 px-2 py-0.5 rounded-full"
                style={{
                  color: accentInk(step.accent),
                  background: accentBg(step.accent),
                }}
              >
                {step.chip}
              </span>
            )}
            <h2 className="font-display text-[24px] sm:text-[28px] leading-[1.15] tracking-[-0.01em] text-ink-1">
              {step.title}
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-2 leading-[1.55]">
              {step.hint}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        <m.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 sm:px-8 py-6"
        >
          {isContext ? (
            <ContextForm data={data} onChange={onChange} />
          ) : (
            <LevelForm step={step} data={data} onChange={onChange} />
          )}
        </m.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="border-t border-border px-6 sm:px-8 py-4 flex items-center justify-between gap-3">
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
              ? "linear-gradient(135deg, var(--amber) 0%, #B45309 100%)"
              : "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
          }}
        >
          {isLast ? "Build my Theory of Change" : "Continue"}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chain preview */}
      <div className="border-t border-border bg-surface-2 px-6 sm:px-8 py-4">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-3 font-semibold mb-2.5">
          Your chain so far
        </div>
        <TocStrip data={data} />
      </div>
    </div>
  );
}

function ContextForm({
  data,
  onChange,
}: {
  data: TocData;
  onChange: (next: Partial<TocData>) => void;
}) {
  return (
    <div className="grid gap-4">
      {STEPS[0].id === "context" &&
        "fields" in STEPS[0] &&
        STEPS[0].fields.map((field) => (
          <label key={field.id} className="block">
            <span className="block text-[12px] uppercase tracking-[0.08em] font-semibold text-ink-2 mb-1.5">
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
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-white text-[14.5px] focus:outline-none focus:border-un-300 focus:ring-2 focus:ring-un-100 transition-colors"
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
}: {
  step: TocStep;
  data: TocData;
  onChange: (next: Partial<TocData>) => void;
}) {
  if (step.id === "context") return null;
  const value = data[step.id] as string;
  const assumptionKey = `a_${step.id}` as
    | "a_inputs"
    | "a_activities"
    | "a_outputs"
    | "a_outcomes";
  const isResult = step.isResult ?? false;

  return (
    <div className="grid gap-5">
      {/* Main textarea */}
      <label className="block">
        <span className="block text-[12px] uppercase tracking-[0.08em] font-semibold text-ink-2 mb-1.5">
          Your {step.chip.toLowerCase()}
        </span>
        <span className="block text-[12.5px] text-ink-3 mb-2">
          One item per line — be specific and measurable.
        </span>
        <textarea
          rows={isResult ? 3 : 5}
          value={value}
          onChange={(e) => onChange({ [step.id]: e.target.value } as Partial<TocData>)}
          placeholder={step.example
            .split("\n")
            .map((l) => "e.g., " + l)
            .join("\n")}
          className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-[14.5px] leading-[1.6] focus:outline-none focus:border-un-300 focus:ring-2 focus:ring-un-100 transition-colors resize-y"
        />
      </label>

      {/* Example block */}
      <div className="rounded-2xl border border-border bg-surface-2 px-4 py-3">
        <div className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-1.5">
          Example
        </div>
        <pre className="whitespace-pre-wrap text-[12.5px] text-ink-2 leading-[1.55] font-sans">
{step.example}
        </pre>
      </div>

      {/* Assumption */}
      {!isResult && step.assumptionPrompt && (
        <label
          className="block rounded-2xl border px-4 py-4"
          style={{
            background: "rgba(245, 158, 11, 0.05)",
            borderColor: "rgba(245, 158, 11, 0.30)",
          }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] font-bold mb-1.5"
            style={{ color: "#B45309" }}
          >
            <ShieldCheck className="w-3 h-3" />
            Assumption
          </span>
          <span className="block text-[13px] text-ink-2 leading-[1.55] mb-2">
            {step.assumptionPrompt}
          </span>
          <textarea
            rows={2}
            value={(data[assumptionKey] as string) ?? ""}
            onChange={(e) =>
              onChange({ [assumptionKey]: e.target.value } as Partial<TocData>)
            }
            placeholder="e.g., Government maintains political will and co-financing commitment"
            className="w-full px-3 py-2 rounded-xl border border-amber/30 bg-white text-[13.5px] leading-[1.55] focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-colors resize-y"
          />
        </label>
      )}
    </div>
  );
}
