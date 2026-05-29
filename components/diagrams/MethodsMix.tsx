"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  FileSearch,
  BarChart3,
  Users,
  MessageCircle,
  Eye,
  Camera,
} from "lucide-react";

/**
 * Mixed methods — visualised as a quant ↔ qual spectrum with method chips
 * positioned according to their typical data character.
 *
 * Each method shows the type of question it answers, the data it
 * produces, and where it sits between counting (quant) and understanding
 * (qual). The whole CPE blends them; the chart makes the blend visible.
 */

type Method = {
  id: string;
  label: string;
  // 0 = fully quant, 1 = fully qual
  quantQual: number;
  // 0 = low effort, 1 = high effort (used for vertical positioning)
  effort: number;
  icon: typeof Users;
  best: string;
  watchOut: string;
  example: string;
};

const METHODS: Method[] = [
  {
    id: "deskreview",
    label: "Document review",
    quantQual: 0.5,
    effort: 0.2,
    icon: FileSearch,
    best: "Establishing the baseline — what was planned, what was reported, what context shifted.",
    watchOut: "Reports describe intentions, not always realities. Triangulate every claim.",
    example: "CP document, annual reports, monitoring data, donor reviews, government strategies.",
  },
  {
    id: "secondary",
    label: "Secondary data",
    quantQual: 0.05,
    effort: 0.35,
    icon: BarChart3,
    best: "Tracking national-level change — coverage, uptake, demographic trends.",
    watchOut: "Survey cycles rarely align with CP cycles. State the time gap explicitly.",
    example: "DHS, MICS, SDG indicators, HMIS service statistics.",
  },
  {
    id: "kii",
    label: "Key informant interviews",
    quantQual: 0.85,
    effort: 0.55,
    icon: MessageCircle,
    best: "Eliciting depth — decisions, blockers, coordination dynamics, sensitive topics.",
    watchOut: "Each KII is a single perspective. Map informants against the stakeholder map first.",
    example: "Government officials, IPs, donors, UN agency colleagues, CO staff.",
  },
  {
    id: "fgd",
    label: "FGDs",
    quantQual: 0.95,
    effort: 0.7,
    icon: Users,
    best: "Surfacing collective views and norms among rights-holders — especially on access and acceptability.",
    watchOut: "Group dynamics distort. Compose groups for safe disclosure.",
    example: "Adolescent girls' groups, midwives' associations, community health volunteers.",
  },
  {
    id: "survey",
    label: "Surveys",
    quantQual: 0.15,
    effort: 0.85,
    icon: BarChart3,
    best: "Generating numeric evidence where it doesn't exist — but only justified by a clear gap.",
    watchOut: "Costly, slow, and often add little when secondary data exists. Use sparingly.",
    example: "Facility-readiness survey, beneficiary satisfaction survey.",
  },
  {
    id: "observation",
    label: "On-site observation",
    quantQual: 0.75,
    effort: 0.5,
    icon: Eye,
    best: "Verifying what reports claim — actual delivery, quality of service, infrastructure.",
    watchOut: "Observation is a single time slice. Combine with informants' historical view.",
    example: "Health facility walk-throughs, youth centre visits, training sessions.",
  },
  {
    id: "photo",
    label: "Photography",
    quantQual: 0.65,
    effort: 0.25,
    icon: Camera,
    best: "Visual evidence for the report — places, conditions, context.",
    watchOut: "Always with informed consent. Never include identifiable faces of rights-holders.",
    example: "Facility infrastructure, materials in use, community settings.",
  },
];

const W = 600;
const H = 320;
const PAD_L = 50;
const PAD_R = 30;
const PAD_T = 30;
const PAD_B = 50;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

function px(p: number) {
  return PAD_L + p * PLOT_W;
}
function py(p: number) {
  return PAD_T + (1 - p) * PLOT_H;
}

function methodColor(qq: number): string {
  // Interpolate un-blue (0) → teal (0.5) → amber (1)
  if (qq < 0.5) return "var(--un-blue)";
  if (qq < 0.75) return "var(--teal)";
  return "var(--amber)";
}

export function MethodsMix() {
  const [active, setActive] = useState<string>("kii");
  const activeMethod = METHODS.find((m) => m.id === active)!;
  const Icon = activeMethod.icon;
  const accent = methodColor(activeMethod.quantQual);

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          The methods mix
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          No single method is enough. The chart places each method on the quant ↔ qual spectrum and
          against the effort it costs.
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", minWidth: 540 }}>
          <defs>
            <linearGradient id="mm-band" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--un-blue)" stopOpacity="0.16" />
              <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--amber)" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          {/* Background band */}
          <rect
            x={PAD_L}
            y={PAD_T}
            width={PLOT_W}
            height={PLOT_H}
            fill="url(#mm-band)"
            rx="14"
          />

          {/* X-axis labels */}
          <text
            x={PAD_L}
            y={H - 18}
            fontSize="10.5"
            fontWeight="700"
            fill="var(--un-blue)"
            style={{ letterSpacing: "0.14em" }}
          >
            QUANTITATIVE
          </text>
          <text
            x={PAD_L + PLOT_W}
            y={H - 18}
            textAnchor="end"
            fontSize="10.5"
            fontWeight="700"
            fill="var(--amber)"
            style={{ letterSpacing: "0.14em" }}
          >
            QUALITATIVE
          </text>
          <text
            x={PAD_L + PLOT_W / 2}
            y={H - 18}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill="var(--teal)"
            style={{ letterSpacing: "0.14em" }}
          >
            MIXED
          </text>

          {/* Y-axis label */}
          <text
            x={18}
            y={PAD_T + PLOT_H / 2}
            fontSize="10.5"
            fontWeight="700"
            fill="var(--ink-3)"
            textAnchor="middle"
            transform={`rotate(-90, 18, ${PAD_T + PLOT_H / 2})`}
            style={{ letterSpacing: "0.14em" }}
          >
            EFFORT →
          </text>

          {/* Methods */}
          {METHODS.map((m) => {
            const isActive = active === m.id;
            const color = methodColor(m.quantQual);
            const MIcon = m.icon;
            return (
              <g
                key={m.id}
                style={{ cursor: "pointer" }}
                onClick={() => setActive(m.id)}
                onMouseEnter={() => setActive(m.id)}
              >
                <circle
                  cx={px(m.quantQual)}
                  cy={py(m.effort)}
                  r={isActive ? 26 : 22}
                  fill={isActive ? color : "white"}
                  stroke={color}
                  strokeWidth="2.2"
                  style={{ transition: "r 0.2s" }}
                />
                <foreignObject
                  x={px(m.quantQual) - 10}
                  y={py(m.effort) - 10}
                  width="20"
                  height="20"
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      color: isActive ? "white" : color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MIcon size={15} strokeWidth={2.2} />
                  </div>
                </foreignObject>
                <text
                  x={px(m.quantQual)}
                  y={py(m.effort) + (isActive ? 42 : 38)}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight={isActive ? 700 : 600}
                  fill={isActive ? color : "var(--ink-2)"}
                  style={{ pointerEvents: "none" }}
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={activeMethod.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 rounded-2xl bg-white border border-border p-5"
          style={{ borderLeftWidth: 3, borderLeftColor: accent }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: accent }}
            >
              <Icon size={15} strokeWidth={2.2} />
            </div>
            <h4 className="font-display text-[18px] sm:text-[20px] leading-tight tracking-[-0.01em] text-ink-1">
              {activeMethod.label}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                Best for
              </div>
              <p className="text-[13px] leading-[1.5] text-ink-1">{activeMethod.best}</p>
            </div>
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                Watch out
              </div>
              <p className="text-[13px] leading-[1.5] text-ink-1">{activeMethod.watchOut}</p>
            </div>
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                Examples
              </div>
              <p className="text-[13px] leading-[1.5] text-ink-1">{activeMethod.example}</p>
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </figure>
  );
}
