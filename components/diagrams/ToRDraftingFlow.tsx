"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { Users, FileText, Edit3, ShieldCheck, Megaphone, Send } from "lucide-react";

/**
 * Figure 3 — Process for drafting the CPE ToR.
 *
 * Two parallel preparation tracks (CO staff contributing to annexes B/C
 * + the EQ workshop generating 6–8 questions) converge into the CPE
 * Manager's drafting work. After consolidation, the ToR moves through
 * ERG review, RO M&E approval, CO Rep approval, and publication.
 *
 * Each step is an interactive node showing who's responsible.
 */

type Step = {
  id: string;
  label: string;
  owner: string;
  detail: string;
  icon: typeof Users;
  track: "top" | "bottom" | "main";
  col: number; // 0..N for horizontal position
};

const STEPS: Step[] = [
  {
    id: "launch",
    label: "Launch meeting",
    owner: "CO Rep · CPE Manager · all CO staff",
    detail:
      "Tasks distributed for the ToR + annexes. The CPE Manager presents the CPE Roadmap to all staff.",
    icon: Megaphone,
    track: "main",
    col: 0,
  },
  // Top track — EQ workshop
  {
    id: "eq-workshop",
    label: "EQ workshop",
    owner: "Stakeholders · ERG · RO M&E Adviser",
    detail:
      "Reality-check the theory of change. Generate and prioritise 6–8 evaluation questions.",
    icon: Users,
    track: "top",
    col: 1,
  },
  // Bottom track — CO staff contributions
  {
    id: "co-contrib-ad",
    label: "Annex A, D drafted",
    owner: "CO staff (under CPE Manager)",
    detail:
      "Programme, operations and communication staff prepare contributions to the ToR's methodological annex and work plan.",
    icon: FileText,
    track: "bottom",
    col: 1,
  },
  // Main track resumes
  {
    id: "manager-drafts",
    label: "ToR drafted",
    owner: "CPE Manager",
    detail:
      "CPE Manager consolidates inputs into the ToR main body using the R2U ToR template.",
    icon: Edit3,
    track: "main",
    col: 2,
  },
  {
    id: "erg-review",
    label: "ERG review",
    owner: "Evaluation Reference Group",
    detail:
      "ERG members review the draft ToR and submit comments — the first of four ERG consultations across the CPE.",
    icon: ShieldCheck,
    track: "main",
    col: 3,
  },
  {
    id: "consolidate",
    label: "Comments consolidated",
    owner: "CPE Manager",
    detail:
      "ERG feedback consolidated; the ToR is revised.",
    icon: Edit3,
    track: "main",
    col: 4,
  },
  {
    id: "ro-approve",
    label: "RO M&E approves",
    owner: "Regional M&E Adviser",
    detail:
      "Regional Office Monitoring & Evaluation Adviser reviews and gives technical sign-off.",
    icon: ShieldCheck,
    track: "main",
    col: 5,
  },
  {
    id: "co-approve",
    label: "CO Rep approves",
    owner: "Country Office Representative",
    detail:
      "The CO Representative signs off on the final ToR with annexes A and D.",
    icon: ShieldCheck,
    track: "main",
    col: 6,
  },
  {
    id: "publish",
    label: "Call published",
    owner: "CO Procurement Unit",
    detail:
      "Final ToR + annexes A and D published with the call for evaluation consultancy. Annexes B and C completed in parallel and attached to selected consultants' contracts.",
    icon: Send,
    track: "main",
    col: 7,
  },
];

export function ToRDraftingFlow() {
  const [active, setActive] = useState<string>("launch");
  const activeStep = STEPS.find((s) => s.id === active)!;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Figure 3 · Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          The ToR drafting flow
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Two parallel tracks converge into the CPE Manager. Hover any node.
        </p>
      </div>

      {/* SVG flow */}
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 880 240"
          preserveAspectRatio="xMidYMid meet"
          style={{ minWidth: 720, width: "100%", height: "auto" }}
        >
          <defs>
            <linearGradient id="tor-track-top" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--un-blue)" />
              <stop offset="100%" stopColor="var(--teal)" />
            </linearGradient>
            <linearGradient id="tor-track-bottom" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--un-blue)" />
              <stop offset="100%" stopColor="var(--un-blue-900)" />
            </linearGradient>
            <linearGradient id="tor-track-main" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--teal)" />
              <stop offset="100%" stopColor="var(--amber)" />
            </linearGradient>
          </defs>

          {/* Track lines */}
          {/* Launch node connects to both tracks */}
          <path
            d="M 80 120 Q 130 80 180 80"
            stroke="url(#tor-track-top)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 80 120 Q 130 160 180 160"
            stroke="url(#tor-track-bottom)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Both tracks merge into the manager-drafts node */}
          <path
            d="M 280 80 Q 330 80 360 120"
            stroke="url(#tor-track-top)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 280 160 Q 330 160 360 120"
            stroke="url(#tor-track-bottom)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Main horizontal line for steps 3..7 */}
          <line
            x1="380"
            y1="120"
            x2="800"
            y2="120"
            stroke="url(#tor-track-main)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Render the nodes */}
          {STEPS.map((step) => {
            const x = nodeX(step);
            const y = nodeY(step);
            const isActive = active === step.id;
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
                  fill={isActive ? trackColor(step.track, true) : "white"}
                  stroke={trackColor(step.track, false)}
                  strokeWidth="2"
                  animate={{
                    r: isActive ? 22 : 19,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <foreignObject x={x - 9} y={y - 9} width="18" height="18">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      color: isActive ? "white" : trackColor(step.track, false),
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
                  y={step.track === "top" ? y - 30 : y + 38}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill={isActive ? trackColor(step.track, false) : "var(--ink-2)"}
                  style={{ pointerEvents: "none" }}
                >
                  {step.label}
                </text>
              </g>
            );
          })}

          {/* Track labels */}
          <text x="230" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink-3)" style={{ letterSpacing: "0.14em" }}>
            EQ WORKSHOP
          </text>
          <text x="230" y="200" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink-3)" style={{ letterSpacing: "0.14em" }}>
            CO STAFF CONTRIB.
          </text>
        </svg>
      </div>

      {/* Detail panel */}
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
            borderLeftColor: trackColor(activeStep.track, false),
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full"
              style={{ background: trackColor(activeStep.track, false) }}
            />
            <span className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3">
              {activeStep.owner}
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

function nodeX(step: Step): number {
  const PAD_X = 80;
  const SPACING = 100;
  return PAD_X + step.col * SPACING;
}
function nodeY(step: Step): number {
  if (step.track === "top") return 80;
  if (step.track === "bottom") return 160;
  return 120;
}
function trackColor(track: Step["track"], soft: boolean): string {
  if (track === "top") return soft ? "var(--teal)" : "var(--teal)";
  if (track === "bottom") return soft ? "var(--un-blue-900)" : "var(--un-blue-900)";
  return soft ? "var(--amber)" : "var(--un-blue-700)";
}
