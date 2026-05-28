"use client";
import { m, AnimatePresence } from "motion/react";
import { ArrowDown, RotateCcw } from "lucide-react";
import type { ArrangeItem } from "@/content/quizzes";

/**
 * Arrange-type question — the learner clicks items in causal order to
 * build the chain. Reset to start over. The parent QuizEngine receives
 * the current order as an array of original-array indices.
 */
export function ArrangeCard({
  scenarioTitle,
  scenarioBody,
  question,
  items,
  order,
  onChange,
  questionNumber,
  totalQuestions,
}: {
  scenarioTitle?: string;
  scenarioBody?: string;
  question: string;
  items: ArrangeItem[];
  /** indices into `items` representing the current user-built order */
  order: number[];
  onChange: (next: number[]) => void;
  questionNumber: number;
  totalQuestions: number;
}) {
  const placed = new Set(order);
  const available = items
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => !placed.has(i));

  const handlePick = (idx: number) => {
    onChange([...order, idx]);
  };
  const handleReset = () => onChange([]);

  const isComplete = order.length === items.length;

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
        <span className="text-[10.5px] uppercase tracking-[0.14em] font-medium text-teal">
          Arrange in order
        </span>
      </div>

      {/* Scenario */}
      {scenarioBody && (
        <div className="rounded-2xl bg-un-50 border border-un-100 px-5 py-4 mb-6">
          {scenarioTitle && (
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700 mb-2">
              {scenarioTitle}
            </div>
          )}
          <div
            className="text-[14px] leading-[1.65] text-ink-1 scenario-body"
            dangerouslySetInnerHTML={{ __html: scenarioBody }}
          />
        </div>
      )}

      <h2 className="font-display text-[20px] sm:text-[24px] leading-[1.25] tracking-[-0.01em] text-ink-1 mb-5">
        {question}
      </h2>

      {/* Available pool */}
      <div className="mb-3 text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3">
        {available.length > 0 ? "Click in causal order" : "All items placed"}
      </div>
      <div className="space-y-2 mb-6">
        <AnimatePresence>
          {available.map(({ item, i }) => (
            <m.button
              key={i}
              layout
              type="button"
              onClick={() => handlePick(i)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-white hover:border-un-200 hover:bg-surface-2 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-ink-3 shrink-0 w-20">
                {item.chip}
              </span>
              <span className="text-[14px] text-ink-1 flex-1">{item.text}</span>
            </m.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Built order */}
      {order.length > 0 && (
        <div className="rounded-2xl bg-surface-2 border border-border px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
              Your order
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11.5px] text-ink-2 hover:text-ink-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <ol className="space-y-2">
            {order.map((idx, position) => {
              const item = items[idx];
              return (
                <li
                  key={`${idx}-${position}`}
                  className="flex items-center gap-3 bg-white border border-border rounded-xl px-3 py-2.5"
                >
                  <span
                    aria-hidden
                    className="shrink-0 w-6 h-6 rounded-full bg-un-700 text-white text-[11px] font-bold flex items-center justify-center"
                  >
                    {position + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-ink-3 shrink-0 w-20">
                    {item.chip}
                  </span>
                  <span className="text-[13.5px] text-ink-1 flex-1">{item.text}</span>
                  {position < order.length - 1 && (
                    <ArrowDown
                      aria-hidden
                      className="w-3 h-3 text-ink-4 shrink-0"
                    />
                  )}
                </li>
              );
            })}
          </ol>
          {isComplete && (
            <div className="mt-3 text-[12px] text-emerald-700 font-medium">
              ✓ All items placed.
            </div>
          )}
        </div>
      )}

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
