"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { Megaphone, FileText, Users, ShieldCheck, GraduationCap, Briefcase } from "lucide-react";

/**
 * Figure 4 — Two-stage process for recruiting the CPE evaluation team.
 *
 * Stage 1 (YEE) and Stage 2 (main team) run as parallel tracks both
 * starting at the CPE launch meeting and both feeding into the Design
 * phase induction. Visualises the temporal offset: YEE is recruited
 * first to support preparation; main team comes later through pre-
 * selection, RO pre-qualification, interviews.
 */

type Step = {
  id: string;
  label: string;
  owner: string;
  detail: string;
  icon: typeof Users;
  track: "yee" | "main" | "shared";
  col: number;
};

const STEPS: Step[] = [
  {
    id: "launch",
    label: "Launch meeting",
    owner: "CO Rep · CPE Manager · CO staff",
    detail:
      "The CO Representative gathers staff. The CPE timeline is fixed (11 months minimum) and the composition of both teams is agreed.",
    icon: Megaphone,
    track: "shared",
    col: 0,
  },
  // YEE track
  {
    id: "yee-tor",
    label: "YEE ToR drafted",
    owner: "CPE Manager",
    detail:
      "CPE Manager prepares the YEE Terms of Reference using the YEE ToR template (CPE Management Kit). CO Representative approves.",
    icon: FileText,
    track: "yee",
    col: 1,
  },
  {
    id: "yee-call",
    label: "Call for YEE",
    owner: "CPE Manager · Operations",
    detail:
      "Call for consultancy for young and emerging evaluators published. Transparent and competitive — inclusive of youth from groups least represented.",
    icon: Megaphone,
    track: "yee",
    col: 2,
  },
  {
    id: "yee-select",
    label: "Panel + interviews",
    owner: "Selection panel",
    detail:
      "Selection panel reviews candidates; interviews shortlisted applicants. Under 35, less than 5 years of experience, evaluation-method skills.",
    icon: Users,
    track: "yee",
    col: 3,
  },
  {
    id: "yee-recruited",
    label: "YEE recruited",
    owner: "CPE Manager",
    detail:
      "YEE joins the CO. Supports the CPE Manager during the preparation phase — documentation, repository, stakeholder map.",
    icon: GraduationCap,
    track: "yee",
    col: 4,
  },
  // Main team track
  {
    id: "main-call",
    label: "Call for team",
    owner: "CPE Manager · Procurement",
    detail:
      "Call for evaluation consultancy published with CPE ToR (annexes A and D only). Sources include the pre-qualified CPE consultant directory and the UNFPA roster.",
    icon: Briefcase,
    track: "main",
    col: 2,
  },
  {
    id: "main-preselect",
    label: "Panel pre-selection",
    owner: "Selection panel (3+, one external)",
    detail:
      "Panel chaired by the CPE Manager scores CVs against the pre-selection scorecard. Panel must include at least one external member.",
    icon: Users,
    track: "main",
    col: 3,
  },
  {
    id: "main-prequalify",
    label: "RO pre-qualification",
    owner: "Regional M&E Adviser",
    detail:
      "Scorecards and CVs of shortlisted candidates shared with the RO M&E Adviser for pre-qualification. Only pre-qualified candidates go to interview.",
    icon: ShieldCheck,
    track: "main",
    col: 4,
  },
  {
    id: "main-interview",
    label: "Interviews",
    owner: "CPE Manager + panel",
    detail:
      "Interviews of pre-qualified candidates. Confirms team composition: team leader + national thematic consultants.",
    icon: Users,
    track: "main",
    col: 5,
  },
  {
    id: "main-recruited",
    label: "Main team recruited",
    owner: "CPE Manager · CO Operations",
    detail:
      "Team contracted in compliance with UNFPA Policy and Procedures for Contracting Individual Consultants. Mandatory: BSAFE, PSEA, UNFPA e-learning on CPEs.",
    icon: Briefcase,
    track: "main",
    col: 6,
  },
  {
    id: "induction",
    label: "Design induction",
    owner: "CPE Manager + evaluation team",
    detail:
      "Both tracks converge into the design phase induction meeting. The YEE is now a full member of the team and participates in every subsequent phase.",
    icon: GraduationCap,
    track: "shared",
    col: 7,
  },
];

export function TeamRecruitmentFlow() {
  const [active, setActive] = useState<string>("launch");
  const activeStep = STEPS.find((s) => s.id === active)!;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Figure 4 · Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          Recruiting the evaluation team
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Two parallel tracks — YEE (top) and main team (bottom) — converge into the design phase.
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg
          viewBox="0 0 880 260"
          preserveAspectRatio="xMidYMid meet"
          style={{ minWidth: 760, width: "100%", height: "auto" }}
        >
          <defs>
            <linearGradient id="rec-track-yee" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--un-blue)" />
              <stop offset="100%" stopColor="var(--teal)" />
            </linearGradient>
            <linearGradient id="rec-track-main" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--un-blue)" />
              <stop offset="100%" stopColor="var(--un-blue-900)" />
            </linearGradient>
          </defs>

          {/* Launch splits to both tracks */}
          <path
            d="M 80 130 Q 130 80 180 80"
            stroke="url(#rec-track-yee)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 80 130 Q 130 180 280 180"
            stroke="url(#rec-track-main)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* YEE track horizontal line */}
          <line
            x1="180"
            y1="80"
            x2="480"
            y2="80"
            stroke="var(--teal)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Main team track horizontal line */}
          <line
            x1="280"
            y1="180"
            x2="680"
            y2="180"
            stroke="var(--un-blue-900)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Both tracks merge to induction node */}
          <path
            d="M 480 80 Q 600 80 720 130"
            stroke="var(--teal)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 680 180 Q 700 180 720 130"
            stroke="var(--un-blue-900)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Track labels */}
          <text x="330" y="40" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--teal)" style={{ letterSpacing: "0.14em" }}>
            STAGE 1 · YEE
          </text>
          <text x="480" y="225" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--un-blue-900)" style={{ letterSpacing: "0.14em" }}>
            STAGE 2 · MAIN TEAM
          </text>

          {/* Nodes */}
          {STEPS.map((step) => {
            const x = nodeX(step);
            const y = nodeY(step);
            const isActive = active === step.id;
            const color = trackColor(step.track);
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
                  y={step.track === "yee" ? y - 30 : step.track === "main" ? y + 38 : y + 38}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fill={isActive ? color : "var(--ink-2)"}
                  style={{ pointerEvents: "none" }}
                >
                  {step.label}
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
            borderLeftColor: trackColor(activeStep.track),
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full"
              style={{ background: trackColor(activeStep.track) }}
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
  if (step.id === "launch") return 80;
  if (step.id === "induction") return 720;
  // Spread other nodes along their tracks
  if (step.track === "yee") {
    const yeeCols = ["yee-tor", "yee-call", "yee-select", "yee-recruited"];
    const idx = yeeCols.indexOf(step.id);
    return 180 + idx * 100;
  }
  if (step.track === "main") {
    const mainCols = ["main-call", "main-preselect", "main-prequalify", "main-interview", "main-recruited"];
    const idx = mainCols.indexOf(step.id);
    return 280 + idx * 100;
  }
  return 0;
}
function nodeY(step: Step): number {
  if (step.track === "yee") return 80;
  if (step.track === "main") return 180;
  return 130; // shared
}
function trackColor(track: Step["track"]): string {
  if (track === "yee") return "var(--teal)";
  if (track === "main") return "var(--un-blue-900)";
  return "var(--un-blue-700)";
}
