"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Users,
  FileText,
  ShieldCheck,
  Database,
  Repeat,
  CheckCircle2,
  Flag,
  Send,
} from "lucide-react";

/**
 * Figure 8 — Management response workflow.
 *
 * After the CPE report is finalised, UNFPA tracks how each recommendation
 * is acted on. Four lanes:
 *  - CO (CPE Manager + staff + CO Representative) — drafts the response
 *  - RO (Regional M&E Adviser) — quality and routing
 *  - IEO (Independent Evaluation Office) — EQA rating
 *  - PD (Programme Division) — ongoing follow-up
 *
 * Eight steps flow through the lanes and converge into the evaluation
 * database and follow-up reporting.
 */

type Lane = "co" | "ro" | "ieo" | "pd";

type Step = {
  id: string;
  label: string;
  owner: string;
  detail: string;
  icon: typeof Users;
  lane: Lane;
  col: number;
};

const STEPS: Step[] = [
  {
    id: "workshop",
    label: "MR workshop",
    owner: "CPE Manager · CO staff",
    detail:
      "Management response workshop convened after the report is finalised. Each recommendation is reviewed and assigned to a responsible CO unit with a deadline.",
    icon: Users,
    lane: "co",
    col: 0,
  },
  {
    id: "draft",
    label: "Draft response",
    owner: "CO units",
    detail:
      "CO units draft accept / partially accept / reject decisions per recommendation and propose specific key actions, owners, and dates.",
    icon: FileText,
    lane: "co",
    col: 1,
  },
  {
    id: "consolidate",
    label: "Consolidate + approve",
    owner: "CPE Manager → CO Rep",
    detail:
      "CPE Manager consolidates inputs into the management response matrix. The CO Representative reviews and approves on behalf of the office.",
    icon: CheckCircle2,
    lane: "co",
    col: 2,
  },
  {
    id: "ro-check",
    label: "RO check + route",
    owner: "Regional M&E Adviser",
    detail:
      "RO M&E Adviser provides guidance, checks that the response is responsive to each recommendation, and routes the package (report + response) to IEO.",
    icon: ShieldCheck,
    lane: "ro",
    col: 3,
  },
  {
    id: "eqa",
    label: "EQA rating",
    owner: "IEO",
    detail:
      "Independent Evaluation Office performs the External Quality Assessment (EQA) of the report. The rating (satisfactory or unsatisfactory) is shared back to the CO and RO.",
    icon: Flag,
    lane: "ieo",
    col: 4,
  },
  {
    id: "publish",
    label: "Publish to database",
    owner: "CPE Manager",
    detail:
      "Final report, management response matrix, and EQA rating are uploaded to the UNFPA evaluation database — making them publicly accessible.",
    icon: Database,
    lane: "co",
    col: 5,
  },
  {
    id: "report",
    label: "Implementation reporting",
    owner: "CPE Manager → TeamCentral",
    detail:
      "At least twice a year, the CPE Manager updates TeamCentral on the status of each key action. PD monitors progress at HQ level.",
    icon: Repeat,
    lane: "pd",
    col: 6,
  },
  {
    id: "close",
    label: "Closure",
    owner: "Programme Division",
    detail:
      "PD closes the management response once all key actions are fully implemented — or after five years, whichever comes first.",
    icon: Send,
    lane: "pd",
    col: 7,
  },
];

const LANES: { id: Lane; label: string; color: string; y: number }[] = [
  { id: "co", label: "CO · CPE Manager + staff", color: "var(--un-blue)", y: 70 },
  { id: "ro", label: "RO · M&E Adviser", color: "var(--teal)", y: 140 },
  { id: "ieo", label: "IEO · independent", color: "var(--amber)", y: 210 },
  { id: "pd", label: "PD · follow-up", color: "var(--un-blue-900)", y: 280 },
];

const COL_X = [70, 170, 270, 370, 470, 570, 670, 780];

export function ManagementResponseFlow() {
  const [active, setActive] = useState<string>("workshop");
  const activeStep = STEPS.find((s) => s.id === active)!;
  const activeLane = LANES.find((l) => l.id === activeStep.lane)!;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Figure 8 · Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          From recommendations to closure
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Four actors — CO, RO, IEO, PD — track each recommendation from workshop to closure.
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 880 340"
          preserveAspectRatio="xMidYMid meet"
          style={{ minWidth: 820, width: "100%", height: "auto" }}
        >
          <defs>
            {LANES.map((l) => (
              <linearGradient key={l.id} id={`mr-lane-${l.id}`} x1="0%" x2="100%">
                <stop offset="0%" stopColor={l.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={l.color} stopOpacity="0.04" />
              </linearGradient>
            ))}
          </defs>

          {/* Swim lanes */}
          {LANES.map((lane) => (
            <g key={lane.id}>
              <rect
                x="40"
                y={lane.y - 28}
                width="820"
                height="56"
                fill={`url(#mr-lane-${lane.id})`}
                rx="14"
              />
              <text
                x="50"
                y={lane.y - 14}
                fontSize="9"
                fontWeight="700"
                fill={lane.color}
                style={{ letterSpacing: "0.14em" }}
              >
                {lane.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Connectors between consecutive steps */}
          {STEPS.slice(0, -1).map((step, i) => {
            const next = STEPS[i + 1];
            const x1 = COL_X[step.col];
            const x2 = COL_X[next.col];
            const y1 = LANES.find((l) => l.id === step.lane)!.y;
            const y2 = LANES.find((l) => l.id === next.lane)!.y;
            const midX = (x1 + x2) / 2;
            const color = LANES.find((l) => l.id === next.lane)!.color;
            return (
              <path
                key={`c-${step.id}`}
                d={`M ${x1 + 20} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2 - 20} ${y2}`}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
            );
          })}

          {/* Nodes */}
          {STEPS.map((step) => {
            const x = COL_X[step.col];
            const y = LANES.find((l) => l.id === step.lane)!.y;
            const isActive = active === step.id;
            const color = LANES.find((l) => l.id === step.lane)!.color;
            const Icon = step.icon;
            return (
              <g
                key={step.id}
                style={{ cursor: "pointer" }}
                onClick={() => setActive(step.id)}
                onMouseEnter={() => setActive(step.id)}
              >
                <m.circle
                  cx={x}
                  cy={y}
                  r={isActive ? 22 : 19}
                  fill={isActive ? color : "white"}
                  stroke={color}
                  strokeWidth="2"
                  animate={{ r: isActive ? 22 : 19 }}
                  transition={{ duration: 0.2 }}
                />
                <foreignObject x={x - 9} y={y - 9} width="18" height="18">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      color: isActive ? "white" : color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={14} strokeWidth={2.2} />
                  </div>
                </foreignObject>
                <text
                  x={x}
                  y={y + 38}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fill={isActive ? color : "var(--ink-2)"}
                  style={{ pointerEvents: "none" }}
                >
                  {step.label}
                </text>
                <text
                  x={x}
                  y={y - 28}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="var(--ink-3)"
                >
                  {step.col + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={activeStep.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 rounded-2xl bg-white border border-border p-5"
          style={{
            borderLeftWidth: 3,
            borderLeftColor: activeLane.color,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full"
              style={{ background: activeLane.color }}
            />
            <span className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3">
              Step {activeStep.col + 1} · {activeStep.owner}
            </span>
          </div>
          <h4 className="font-display text-[18px] sm:text-[20px] leading-tight tracking-[-0.01em] text-ink-1 mb-1.5">
            {activeStep.label}
          </h4>
          <p className="text-[13.5px] leading-[1.55] text-ink-1">
            {activeStep.detail}
          </p>
        </m.div>
      </AnimatePresence>
    </figure>
  );
}
