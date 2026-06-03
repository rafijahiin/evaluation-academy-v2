"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";

/**
 * Stakeholder mapping as a power × interest matrix.
 *
 * Each stakeholder type is positioned on a 2D plane; the four quadrants
 * map to the canonical engagement strategy:
 *  - High power · high interest → Manage closely
 *  - High power · low interest  → Keep satisfied
 *  - Low power  · high interest → Keep informed
 *  - Low power  · low interest  → Monitor
 */

type Stakeholder = {
  id: string;
  label: string;
  // 0..1 normalised positions
  power: number;
  interest: number;
  detail: string;
  color: string;
};

const STAKEHOLDERS: Stakeholder[] = [
  {
    id: "minhealth",
    label: "Ministry of Health",
    power: 0.85,
    interest: 0.85,
    color: "var(--un-blue)",
    detail:
      "High power · high interest. The lead government counterpart for SRHR. Engage in design, fieldwork interviews, validation workshop, and the management response.",
  },
  {
    id: "co-rep",
    label: "CO Representative",
    power: 0.92,
    interest: 0.95,
    color: "var(--un-blue-900)",
    detail:
      "Senior decision-maker for the office. Owns the management response. Briefed at every milestone — kick-off, design report, draft report, response workshop.",
  },
  {
    id: "rho",
    label: "Rights-holders' orgs",
    power: 0.35,
    interest: 0.9,
    color: "var(--teal)",
    detail:
      "Low formal power · very high interest. Critical voice in the EQ workshop, focus group discussions, and validation. Sampling must avoid exclusion bias.",
  },
  {
    id: "ip",
    label: "Implementing partners",
    power: 0.55,
    interest: 0.85,
    color: "#184EA5",
    detail:
      "Mid power · high interest. They deliver the interventions and hold operational evidence. Interview during fieldwork; involve in the analysis workshop.",
  },
  {
    id: "donors",
    label: "Donors",
    power: 0.8,
    interest: 0.4,
    color: "var(--amber)",
    detail:
      "High power · variable interest. Keep satisfied with timely briefings on findings — particularly on efficiency and sustainability. Cite contributions accurately.",
  },
  {
    id: "moph-other",
    label: "Other line ministries",
    power: 0.7,
    interest: 0.35,
    color: "#AE4300",
    detail:
      "Education, gender, statistics — relevant for coherence questions. Keep satisfied with summary briefings; deep-dive only on touchpoints with the CP.",
  },
  {
    id: "media",
    label: "Media · public",
    power: 0.25,
    interest: 0.55,
    color: "var(--un-blue-700)",
    detail:
      "Low power · moderate interest. Keep informed via the strategic communication plan. Not part of design or fieldwork — recipients of the published report.",
  },
  {
    id: "academia",
    label: "Academia",
    power: 0.2,
    interest: 0.25,
    color: "var(--ink-3)",
    detail:
      "Monitor. Useful for triangulating secondary data; not a primary stakeholder for the CPE itself.",
  },
];

const QUADRANTS = [
  {
    label: "Manage closely",
    sub: "high power · high interest",
    x: 0.5,
    y: 0,
    w: 0.5,
    h: 0.5,
    color: "var(--un-blue)",
  },
  {
    label: "Keep satisfied",
    sub: "high power · low interest",
    x: 0.5,
    y: 0.5,
    w: 0.5,
    h: 0.5,
    color: "var(--amber)",
  },
  {
    label: "Keep informed",
    sub: "low power · high interest",
    x: 0,
    y: 0,
    w: 0.5,
    h: 0.5,
    color: "var(--teal)",
  },
  {
    label: "Monitor",
    sub: "low power · low interest",
    x: 0,
    y: 0.5,
    w: 0.5,
    h: 0.5,
    color: "var(--ink-3)",
  },
];

const W = 540;
const H = 420;
const PAD_L = 60;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 50;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

function px(p: number) {
  return PAD_L + p * PLOT_W;
}
function py(p: number) {
  // Invert: power=1 at top
  return PAD_T + (1 - p) * PLOT_H;
}

export function StakeholderQuadrant() {
  const [active, setActive] = useState<string>("co-rep");
  const activeStakeholder = STAKEHOLDERS.find((s) => s.id === active)!;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          Mapping stakeholders by power × interest
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Click a bubble to see the engagement strategy implied by its position.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1fr)] gap-6 items-start">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", minWidth: 480 }}>
            {/* Quadrants */}
            {QUADRANTS.map((q) => (
              <g key={q.label}>
                <rect
                  x={PAD_L + q.x * PLOT_W}
                  y={PAD_T + q.y * PLOT_H}
                  width={q.w * PLOT_W}
                  height={q.h * PLOT_H}
                  fill={q.color}
                  opacity="0.07"
                />
                <text
                  x={PAD_L + (q.x + q.w / 2) * PLOT_W}
                  y={PAD_T + (q.y + 0.08) * PLOT_H}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight="700"
                  fill={q.color}
                  style={{ letterSpacing: "0.04em" }}
                >
                  {q.label}
                </text>
                <text
                  x={PAD_L + (q.x + q.w / 2) * PLOT_W}
                  y={PAD_T + (q.y + 0.08) * PLOT_H + 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--ink-3)"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {q.sub.toUpperCase()}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line
              x1={PAD_L}
              y1={PAD_T + PLOT_H / 2}
              x2={PAD_L + PLOT_W}
              y2={PAD_T + PLOT_H / 2}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <line
              x1={PAD_L + PLOT_W / 2}
              y1={PAD_T}
              x2={PAD_L + PLOT_W / 2}
              y2={PAD_T + PLOT_H}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />

            {/* Axis frame */}
            <rect
              x={PAD_L}
              y={PAD_T}
              width={PLOT_W}
              height={PLOT_H}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />

            {/* Y axis (power) */}
            <text
              x={20}
              y={PAD_T + PLOT_H / 2}
              fontSize="11"
              fontWeight="700"
              fill="var(--ink-2)"
              textAnchor="middle"
              transform={`rotate(-90, 20, ${PAD_T + PLOT_H / 2})`}
              style={{ letterSpacing: "0.14em" }}
            >
              POWER →
            </text>

            {/* X axis (interest) */}
            <text
              x={PAD_L + PLOT_W / 2}
              y={H - 18}
              fontSize="11"
              fontWeight="700"
              fill="var(--ink-2)"
              textAnchor="middle"
              style={{ letterSpacing: "0.14em" }}
            >
              INTEREST →
            </text>

            {/* Stakeholders */}
            {STAKEHOLDERS.map((s) => {
              const isActive = active === s.id;
              return (
                <g
                  key={s.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActive(s.id)}
                  onMouseEnter={() => setActive(s.id)}
                >
                  <m.circle
                    cx={px(s.interest)}
                    cy={py(s.power)}
                    r={isActive ? 14 : 10}
                    fill={s.color}
                    opacity={isActive ? 1 : 0.78}
                    stroke="white"
                    strokeWidth="2"
                    animate={{ r: isActive ? 14 : 10 }}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={px(s.interest)}
                    y={py(s.power) - (isActive ? 22 : 18)}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight={isActive ? 700 : 600}
                    fill={isActive ? s.color : "var(--ink-2)"}
                    style={{ pointerEvents: "none" }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={activeStakeholder.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white border border-border p-5"
            style={{
              borderLeftWidth: 3,
              borderLeftColor: activeStakeholder.color,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                aria-hidden
                className="w-2 h-2 rounded-full"
                style={{ background: activeStakeholder.color }}
              />
              <span className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3">
                Stakeholder profile
              </span>
            </div>
            <h4 className="font-display text-[18px] sm:text-[20px] leading-tight tracking-[-0.01em] text-ink-1 mb-1.5">
              {activeStakeholder.label}
            </h4>
            <p className="text-[13.5px] leading-[1.55] text-ink-1">
              {activeStakeholder.detail}
            </p>
          </m.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}
