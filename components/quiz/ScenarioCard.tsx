"use client";
import { m } from "motion/react";
import { MCQCard } from "./MCQCard";

/**
 * Scenario-style question — short case study above the MCQ.
 *
 * The scenario body is HTML (from the migrated v1 data) and is rendered
 * via dangerouslySetInnerHTML inside a contained glass card. The MCQ
 * portion reuses MCQCard styling/handling.
 */
export function ScenarioCard({
  scenarioTitle,
  scenarioBody,
  question,
  options,
  selected,
  onSelect,
  questionNumber,
  totalQuestions,
}: {
  scenarioTitle?: string;
  scenarioBody?: string;
  question: string;
  options: string[];
  selected: number | null;
  onSelect: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}) {
  return (
    <m.div
      key={questionNumber}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl bg-white border border-border shadow-card p-6 sm:p-8"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-[10.5px] uppercase tracking-[0.14em] font-medium text-amber">
          Scenario
        </span>
      </div>

      {/* Scenario box */}
      <div
        className="rounded-2xl bg-un-50 border border-un-100 px-5 py-4 mb-6"
      >
        {scenarioTitle && (
          <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700 mb-2">
            {scenarioTitle}
          </div>
        )}
        {scenarioBody && (
          <div
            className="text-[14px] leading-[1.65] text-ink-1 scenario-body"
            dangerouslySetInnerHTML={{ __html: scenarioBody }}
          />
        )}
      </div>

      <h2 className="font-display text-[20px] sm:text-[24px] leading-[1.25] tracking-[-0.01em] text-ink-1 mb-5">
        {question}
      </h2>
      <div className="space-y-2.5">
        {options.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? "bg-un-50 border-un-300 ring-2 ring-un-200"
                  : "bg-white border-border hover:border-un-200 hover:bg-surface-2"
              }`}
            >
              <span
                className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                  isSelected
                    ? "bg-un-700 text-white"
                    : "bg-surface-2 text-ink-2 border border-border-strong"
                }`}
              >
                {letter}
              </span>
              <span className="text-[14.5px] leading-[1.55] text-ink-1 flex-1">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        :global(.scenario-body p) {
          margin: 0 0 0.5em 0;
        }
        :global(.scenario-body p:last-child) {
          margin: 0;
        }
        :global(.scenario-body strong) {
          font-weight: 600;
          color: var(--un-blue-800);
        }
        :global(.scenario-body em) {
          font-style: italic;
        }
      `}</style>
    </m.div>
  );
}
