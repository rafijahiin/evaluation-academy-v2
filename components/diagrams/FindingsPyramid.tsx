"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";

/**
 * From evidence to recommendations — visualised as a 4-tier pyramid.
 *
 * Each tier rests on the one below: evidence supports findings;
 * findings synthesise into conclusions; conclusions justify
 * recommendations. The pyramid shows the narrowing, the test each
 * tier must pass, and the failure mode if it doesn't.
 */

type Tier = {
  id: string;
  label: string;
  test: string;
  failure: string;
  example: string;
  color: string;
  // visual proportions
  widthPct: number;
};

const TIERS: Tier[] = [
  {
    id: "evidence",
    label: "Evidence",
    test: "Triangulated across at least three sources.",
    failure: "Anecdote presented as data. One KII does not make a finding.",
    example: "Two FGDs + monitoring data + IP interviews all describe the same uptake pattern.",
    color: "var(--un-blue)",
    widthPct: 100,
  },
  {
    id: "findings",
    label: "Findings",
    test: "Each finding is a defensible claim about what happened.",
    failure: "Activity descriptions repackaged as findings (no analytical claim).",
    example:
      "“Service uptake in target districts increased between 2021 and 2024, with the strongest gains in adolescent attendance.”",
    color: "var(--teal)",
    widthPct: 80,
  },
  {
    id: "conclusions",
    label: "Conclusions",
    test: "Each conclusion synthesises multiple findings and answers an evaluation question.",
    failure:
      "Conclusions that simply restate one finding, or jump to claims the findings don't support.",
    example:
      "“Outcome-level changes are consistent with UNFPA's contribution, given the absence of alternative explanations.”",
    color: "var(--un-blue-900)",
    widthPct: 60,
  },
  {
    id: "recommendations",
    label: "Recommendations",
    test: "Actionable, addressed to a specific decision-maker, derived from a conclusion.",
    failure: "Wish-lists, vague calls to “strengthen capacity,” or actions no-one owns.",
    example:
      "“In the next CP, UNFPA should co-design the youth-engagement strategy with rights-holders, with a named focal point in the SRHR programme.”",
    color: "var(--amber)",
    widthPct: 40,
  },
];

const TIER_H = 70;
const W = 520;
const H = TIERS.length * (TIER_H + 6);

export function FindingsPyramid() {
  const [active, setActive] = useState<string>("findings");
  const activeTier = TIERS.find((t) => t.id === active)!;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          From evidence to recommendations
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Each tier rests on the one below. Click a tier to see the test it must pass and what
          failure looks like.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1fr)] gap-6 items-start">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", minWidth: 380 }}>
            {TIERS.map((tier, i) => {
              const isActive = active === tier.id;
              const width = (tier.widthPct / 100) * W;
              const x = (W - width) / 2;
              const y = i * (TIER_H + 6);
              return (
                <g
                  key={tier.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActive(tier.id)}
                  onMouseEnter={() => setActive(tier.id)}
                >
                  <m.rect
                    x={x}
                    y={y}
                    width={width}
                    height={TIER_H}
                    rx="10"
                    fill={isActive ? tier.color : "white"}
                    stroke={tier.color}
                    strokeWidth="2"
                    animate={{ scale: isActive ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: `${x + width / 2}px ${y + TIER_H / 2}px` }}
                  />
                  <text
                    x={W / 2}
                    y={y + TIER_H / 2 - 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill={isActive ? "white" : tier.color}
                    style={{ letterSpacing: "0.16em", pointerEvents: "none" }}
                  >
                    TIER {i + 1}
                  </text>
                  <text
                    x={W / 2}
                    y={y + TIER_H / 2 + 14}
                    textAnchor="middle"
                    fontSize="17"
                    fontWeight="700"
                    fill={isActive ? "white" : "var(--ink-1)"}
                    style={{
                      pointerEvents: "none",
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                    }}
                  >
                    {tier.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={activeTier.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white border border-border p-5"
            style={{ borderLeftWidth: 3, borderLeftColor: activeTier.color }}
          >
            <div
              className="text-[10.5px] uppercase tracking-[0.14em] font-bold mb-2"
              style={{ color: activeTier.color }}
            >
              {activeTier.label}
            </div>
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                The test it must pass
              </div>
              <p className="text-[13.5px] leading-[1.55] text-ink-1">{activeTier.test}</p>
            </div>
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                Common failure
              </div>
              <p className="text-[13.5px] leading-[1.55] text-ink-1">{activeTier.failure}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                What good looks like
              </div>
              <p className="text-[13.5px] leading-[1.55] text-ink-1 italic">
                {activeTier.example}
              </p>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}
