"use client";
import { m } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MCQ card used inside the quiz/exam flow.
 *
 * Differs from the inline lesson <QuizQuestion>:
 *   - Doesn't reveal the correct answer (the quiz flow shows all at the end)
 *   - Reports the user's selection up to the parent QuizEngine via onAnswer
 *   - Has Prev/Next-style navigation controlled by the parent
 */
export function MCQCard({
  question,
  options,
  selected,
  onSelect,
  questionNumber,
  totalQuestions,
}: {
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
        <span className="text-[10.5px] uppercase tracking-[0.14em] font-medium text-ink-3">
          Multiple choice
        </span>
      </div>
      <h2 className="font-display text-[22px] sm:text-[26px] leading-[1.2] tracking-[-0.01em] text-ink-1 mb-6">
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
              className={cn(
                "w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-2xl border transition-all",
                isSelected
                  ? "bg-un-50 border-un-300 ring-2 ring-un-200"
                  : "bg-white border-border hover:border-un-200 hover:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors",
                  isSelected
                    ? "bg-un-700 text-white"
                    : "bg-surface-2 text-ink-2 border border-border-strong",
                )}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : letter}
              </span>
              <span className="text-[14.5px] leading-[1.55] text-ink-1 flex-1">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </m.div>
  );
}
