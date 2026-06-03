"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";

/**
 * Interactive visual for the analytical chain in a CPE:
 *   data → evidence → finding → conclusion → recommendation
 *
 * Each step has its own tile. Hover/click to reveal the example for that
 * stage. The connecting arrows animate as the chain "fills" left-to-right.
 *
 * Worked example threads the same midwifery scenario through every step.
 */

type Stage = "data" | "evidence" | "finding" | "conclusion" | "recommendation";

const STAGES: { id: Stage; label: string; color: string; text: string }[] = [
  {
    id: "data",
    label: "Data",
    color: "#94A3B8",
    text: "Government registry: 8,400 midwives certified between 2020–2024. KIIs (n=14) with Ministry of Health, Midwives' Association, three regional health offices. FGDs (n=6) with practising midwives at five health centres.",
  },
  {
    id: "evidence",
    label: "Evidence",
    color: "#0EA5E9",
    text: "Certification numbers tripled across the cycle. Practising midwives describe new pre-service curriculum positively but flag weak supportive supervision. Two regional offices report retention dropping below 60%.",
  },
  {
    id: "finding",
    label: "Finding",
    color: "#2171EC",
    text: "UNFPA's policy and standards-development support has substantially strengthened the pre-service midwifery curriculum, but supportive supervision and retention systems remain weak — limiting the curriculum's effect on service quality.",
  },
  {
    id: "conclusion",
    label: "Conclusion",
    color: "#F96000",
    text: "The country programme's contribution to midwifery workforce development is most effective at the policy-and-training end of the chain, and weakest at the in-service and retention end — a strategic gap that constrains UNFPA's contribution to outcome-level changes in maternal health.",
  },
  {
    id: "recommendation",
    label: "Recommendation",
    color: "#F96000",
    text: "Reorient programme resources in the next cycle to in-service mentorship and retention incentives — building on the pre-service investments already made. Co-implement with Ministry of Health regional offices and Midwives' Association.",
  },
];

export function EvidenceChain() {
  const [active, setActive] = useState<Stage>("data");
  const activeIndex = STAGES.findIndex((s) => s.id === active);
  const activeStage = STAGES[activeIndex];

  return (
    <figure className="my-8">
      <div className="rounded-2xl bg-surface-2 border border-border p-5 sm:p-6">
        {/* Chain visual */}
        <div className="flex items-stretch gap-1 sm:gap-2 mb-5 overflow-x-auto pb-1">
          {STAGES.map((stage, i) => {
            const isActive = stage.id === active;
            const isReached = i <= activeIndex;
            return (
              <div
                key={stage.id}
                className="flex items-stretch gap-1 sm:gap-2 shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setActive(stage.id)}
                  className={`relative px-3 sm:px-4 py-2.5 rounded-xl border text-[12px] sm:text-[13px] font-medium transition-all ${
                    isActive
                      ? "text-white shadow-card"
                      : isReached
                      ? "bg-white border-border text-ink-1 hover:border-un-200"
                      : "bg-white border-border text-ink-3 hover:border-un-200"
                  }`}
                  style={
                    isActive
                      ? { background: stage.color, borderColor: stage.color }
                      : undefined
                  }
                >
                  <span className="block text-[10px] uppercase tracking-[0.14em] opacity-70">
                    Step {i + 1}
                  </span>
                  {stage.label}
                </button>
                {i < STAGES.length - 1 && (
                  <m.div
                    aria-hidden
                    className="self-center h-px"
                    style={{
                      width: 14,
                      background: isReached ? stage.color : "var(--border-strong)",
                    }}
                    animate={{
                      width: isReached ? 20 : 14,
                      opacity: isReached ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Active step content */}
        <AnimatePresence mode="wait">
          <m.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28 }}
            className="rounded-xl bg-white border border-border px-4 sm:px-5 py-4 sm:py-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                aria-hidden
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: activeStage.color }}
              />
              <span
                className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
                style={{ color: activeStage.color }}
              >
                Step {activeIndex + 1} · {activeStage.label}
              </span>
            </div>
            <p className="text-[14.5px] leading-[1.65] text-ink-1">
              {activeStage.text}
            </p>
          </m.div>
        </AnimatePresence>

        {/* Box 16 takeaway */}
        <div className="mt-4 text-[11.5px] text-ink-3 leading-relaxed">
          Every conclusion must be solidly based on a number of findings. Every
          recommendation must stem directly from one or more conclusions.
          Weak links break the report's credibility.
        </div>
      </div>

      <figcaption className="mt-3 text-[12.5px] text-ink-3">
        Worked example: midwifery workforce contribution analysis.
      </figcaption>
    </figure>
  );
}
