"use client";
import { m, AnimatePresence } from "motion/react";
import { accentInk, accentBg, type TocData } from "./steps";

const LEVELS: {
  id: keyof TocData;
  label: string;
  accent: "un-blue" | "teal" | "navy" | "amber";
}[] = [
  { id: "inputs", label: "Inputs", accent: "un-blue" },
  { id: "activities", label: "Activities", accent: "teal" },
  { id: "outputs", label: "Outputs", accent: "navy" },
  { id: "outcomes", label: "Outcomes", accent: "un-blue" },
  { id: "result", label: "Result", accent: "amber" },
];

/**
 * Horizontal-scroll chain preview at the bottom of the wizard.
 *
 * Each level card: accent top bar, accent-tinted background, item count
 * pill, items animating in with layout transitions. Empty levels show a
 * dashed border + "Not yet" placeholder. The CURRENT step (active in the
 * wizard) gets a soft accent ring. Gradient SVG connectors pick up the
 * accents of both adjacent levels.
 */
export function TocStrip({
  data,
  currentStepId,
}: {
  data: TocData;
  currentStepId?: string;
}) {
  return (
    <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
      <div className="inline-flex items-stretch gap-1.5 sm:gap-2">
        {LEVELS.map((level, idx) => {
          const value = data[level.id] as string;
          const items = (value || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          const isEmpty = items.length === 0;
          const isActive = currentStepId === level.id;
          const ink = accentInk(level.accent);
          const bg = accentBg(level.accent);
          const visible = items.slice(0, 2);
          const overflow = items.length - visible.length;

          return (
            <div
              key={level.id}
              className="flex items-stretch gap-1.5 sm:gap-2 shrink-0"
            >
              <m.div
                layout
                className="relative rounded-2xl overflow-hidden bg-white flex flex-col"
                style={{
                  minWidth: 184,
                  maxWidth: 220,
                  border: `1.5px ${isEmpty ? "dashed" : "solid"} ${
                    isActive ? ink : "var(--border)"
                  }`,
                  boxShadow: isActive
                    ? `0 0 0 4px ${ink}1F, 0 4px 10px -4px ${ink}33`
                    : "0 1px 2px rgba(15,23,42,0.04)",
                  transition: "box-shadow 200ms ease-out, border-color 200ms",
                }}
              >
                {/* Accent top bar */}
                <div
                  aria-hidden
                  className="h-1 w-full shrink-0"
                  style={{ background: ink }}
                />
                {/* Body */}
                <div
                  className="flex-1 px-3 py-2.5 flex flex-col"
                  style={{ background: isEmpty ? "transparent" : bg }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[9.5px] uppercase tracking-[0.16em] font-bold leading-tight"
                      style={{ color: ink }}
                    >
                      {level.label}
                    </span>
                    <span
                      className="text-[9.5px] font-numeric font-semibold tabular-nums leading-tight"
                      style={{ color: isEmpty ? "var(--ink-4)" : ink }}
                    >
                      {items.length}
                    </span>
                  </div>
                  {isEmpty ? (
                    <div className="text-[11.5px] text-ink-4 italic leading-tight mt-0.5">
                      Not yet filled
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      <AnimatePresence initial={false}>
                        {visible.map((item, i) => (
                          <m.li
                            layout
                            key={`${item.slice(0, 24)}-${i}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="text-[11px] leading-[1.4] text-ink-1"
                          >
                            {item.length > 36 ? item.slice(0, 36) + "…" : item}
                          </m.li>
                        ))}
                      </AnimatePresence>
                      {overflow > 0 && (
                        <li
                          className="text-[10px] font-medium pt-0.5"
                          style={{ color: ink }}
                        >
                          +{overflow} more
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Active pulse halo */}
                {isActive && (
                  <m.div
                    aria-hidden
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ border: `1.5px solid ${ink}` }}
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{
                      opacity: [0.5, 0, 0.5],
                      scale: [1, 1.04, 1],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </m.div>

              {/* Connector */}
              {idx < LEVELS.length - 1 && (
                <ChainConnector
                  fromAccent={LEVELS[idx].accent}
                  toAccent={LEVELS[idx + 1].accent}
                />
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        :global(.scrollbar-thin::-webkit-scrollbar) {
          height: 4px;
        }
        :global(.scrollbar-thin::-webkit-scrollbar-thumb) {
          background: var(--border-strong);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

function ChainConnector({
  fromAccent,
  toAccent,
}: {
  fromAccent: "un-blue" | "teal" | "navy" | "amber";
  toAccent: "un-blue" | "teal" | "navy" | "amber";
}) {
  const id = `strip-${fromAccent}-${toAccent}`;
  const a = accentInk(fromAccent);
  const b = accentInk(toAccent);
  return (
    <div className="self-center flex items-center" style={{ width: 22 }}>
      <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0%" x2="100%">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="7"
          x2="14"
          y2="7"
          stroke={`url(#${id})`}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M 11 3 L 18 7 L 11 11"
          stroke={b}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
