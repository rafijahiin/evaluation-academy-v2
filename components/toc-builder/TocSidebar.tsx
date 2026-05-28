"use client";
import { Check, Sparkles } from "lucide-react";
import { STEPS } from "./steps";
import { cn } from "@/lib/utils";

/**
 * Step navigator.
 *   Desktop:  vertical sidebar (left rail)
 *   Mobile:   horizontal scrollable stepper at the top
 */
export function TocSidebar({
  currentStep,
  onJump,
  isProductView,
}: {
  currentStep: number;
  onJump: (index: number) => void;
  isProductView: boolean;
}) {
  return (
    <aside
      className={cn(
        "lg:sticky lg:top-24 lg:self-start",
        "lg:flex lg:flex-col lg:gap-1",
        // Mobile horizontal scroll
        "flex lg:block overflow-x-auto lg:overflow-visible scrollbar-hide gap-1 pb-1 lg:pb-0",
      )}
    >
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-3 font-semibold lg:mb-2 px-1 lg:px-0 shrink-0">
        Steps
      </div>
      {STEPS.map((step, i) => {
        const isActive = !isProductView && i === currentStep;
        const isDone = i < currentStep || isProductView;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onJump(i)}
            className={cn(
              "shrink-0 lg:w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors",
              isActive
                ? "bg-un-50 text-un-800"
                : isDone
                ? "hover:bg-surface-2 text-ink-1"
                : "hover:bg-surface-2 text-ink-2",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[10.5px] font-bold",
                isActive
                  ? "bg-un-700 text-white"
                  : isDone
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-surface-2 text-ink-3 border border-border",
              )}
            >
              {isDone && !isActive ? (
                <Check className="w-3 h-3" strokeWidth={3} />
              ) : (
                i + 1
              )}
            </span>
            <span className="text-[12.5px] font-medium whitespace-nowrap lg:whitespace-normal">
              {step.label}
            </span>
          </button>
        );
      })}
      {/* Product view button */}
      <button
        type="button"
        onClick={() => onJump(STEPS.length)}
        className={cn(
          "shrink-0 lg:w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors",
          isProductView
            ? "bg-amber-50 text-amber-900"
            : "hover:bg-surface-2 text-ink-2",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full",
            isProductView ? "bg-amber-500 text-white" : "bg-surface-2 text-amber",
          )}
        >
          <Sparkles className="w-3 h-3" />
        </span>
        <span className="text-[12.5px] font-medium whitespace-nowrap lg:whitespace-normal">
          Your ToC
        </span>
      </button>

      <style jsx>{`
        :global(.scrollbar-hide::-webkit-scrollbar) {
          display: none;
        }
        :global(.scrollbar-hide) {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </aside>
  );
}
