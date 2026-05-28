"use client";
import { m } from "motion/react";
import { ArrowRight } from "lucide-react";
import { accentInk, type TocData } from "./steps";

const LEVELS: { id: keyof TocData; label: string; accent: "un-blue" | "teal" | "navy" | "amber" }[] = [
  { id: "inputs", label: "Inputs", accent: "un-blue" },
  { id: "activities", label: "Activities", accent: "teal" },
  { id: "outputs", label: "Outputs", accent: "navy" },
  { id: "outcomes", label: "Outcomes", accent: "un-blue" },
  { id: "result", label: "Result", accent: "amber" },
];

/**
 * Horizontal-scroll glass-card carousel showing the chain so far.
 * Each box shows up to two items from the relevant level; empty boxes
 * show a placeholder dash.
 */
export function TocStrip({ data }: { data: TocData }) {
  return (
    <div className="overflow-x-auto pb-1 -mx-1 px-1">
      <div className="inline-flex items-stretch gap-2 sm:gap-2.5">
        {LEVELS.map((level, idx) => {
          const value = data[level.id];
          const text = typeof value === "string" ? value : "";
          const items = text
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 2);
          const isEmpty = items.length === 0;
          const ink = accentInk(level.accent);

          return (
            <div key={level.id} className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <m.div
                layout
                className="relative rounded-2xl border px-3 py-2.5 min-w-[150px] max-w-[200px] backdrop-blur"
                style={{
                  background: isEmpty
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.85)",
                  borderColor: isEmpty
                    ? "var(--border)"
                    : "rgba(0, 111, 183, 0.18)",
                }}
              >
                <div
                  className="text-[9.5px] uppercase tracking-[0.16em] font-bold mb-1"
                  style={{ color: ink }}
                >
                  {level.label}
                </div>
                {isEmpty ? (
                  <div className="text-[12px] text-ink-3">—</div>
                ) : (
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className="text-[11.5px] leading-[1.35] text-ink-1"
                      >
                        {item.length > 32 ? item.slice(0, 32) + "…" : item}
                      </li>
                    ))}
                  </ul>
                )}
              </m.div>
              {idx < LEVELS.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="w-3 h-3 text-ink-4 shrink-0"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
