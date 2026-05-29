"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Clock,
  FileText,
  Target,
  Wrench,
  Flag,
  Footprints,
  MapPin,
} from "lucide-react";

/**
 * The CPE Roadmap (handbook Figure 2) — interactive 11-month journey
 * showing the five phases as horizontal bars on a months timeline.
 *
 * Designed for the landing page: gives prospective learners a tangible
 * sense of what a CPE looks like end-to-end before they start the
 * course. Also usable inline in lesson 1.1.
 *
 * Visual language: phase bars sit on a dashed travel "path" with a
 * launch marker at M1 and a destination flag at M11, evoking a
 * journey rather than a Gantt chart.
 */

type Phase = {
  id: string;
  number: number;
  title: string;
  startMonth: number; // 1..11
  endMonth: number;
  accent: string;
  shortBlurb: string;
  milestones: string[];
  tools: string[];
  deliverables: string[];
};

const PHASES: Phase[] = [
  {
    id: "preparation",
    number: 1,
    title: "Preparation",
    startMonth: 1,
    endMonth: 4,
    accent: "var(--un-blue)",
    shortBlurb:
      "Launch the CPE, recruit the team, draft the ToR, set up the foundations.",
    milestones: [
      "Launch meeting + CPE Manager designated",
      "Young & Emerging Evaluator recruited (Stage 1)",
      "Evaluation questions workshop",
      "Draft ToR + annexes prepared",
      "ERG formed; main team recruited (Stage 2)",
    ],
    tools: [
      "R2U ToR template",
      "YEE ToR template",
      "Document repository checklist",
      "Stakeholder map (annex B)",
    ],
    deliverables: [
      "Final ToR with all four annexes",
      "Document repository populated",
      "Catalogue of UNFPA interventions",
      "Stakeholder map",
    ],
  },
  {
    id: "design",
    number: 2,
    title: "Design",
    startMonth: 4,
    endMonth: 5,
    accent: "var(--un-blue-900)",
    shortBlurb:
      "Induction, desk review, theory-of-change analysis, design report.",
    milestones: [
      "Induction + orientation meetings",
      "Desk review + first-round interviews",
      "Contribution analysis built",
      "Design report v1 → ERG review",
      "Design report v2 approved; matrix fixed",
    ],
    tools: [
      "Evaluation matrix template (Table 5)",
      "Stakeholder selection criteria (Table 7)",
      "Interview guide checklist (Box 7)",
      "Design report QA checklist (Box 8)",
    ],
    deliverables: [
      "Design Report (max 55 pages)",
      "Evaluation matrix",
      "Stakeholder sample + site selection",
      "Field-phase agenda (first 2 weeks confirmed)",
    ],
  },
  {
    id: "fieldwork",
    number: 3,
    title: "Fieldwork",
    startMonth: 5,
    endMonth: 6,
    accent: "var(--teal)",
    shortBlurb:
      "Three weeks of data collection through interviews, FGDs, surveys, observation.",
    milestones: [
      "Field-phase kick-off",
      "Key informant interviews",
      "Focus groups + group interviews",
      "On-site observation",
      "Analysis workshop + debriefing meeting",
    ],
    tools: [
      "Interview guides (per cluster)",
      "Survey questionnaires",
      "On-site observation checklists",
      "Photography consent forms",
    ],
    deliverables: [
      "Completed evaluation matrix",
      "Preliminary findings",
      "Debriefing meeting record",
      "Photographic material to CO Comms",
    ],
  },
  {
    id: "reporting",
    number: 4,
    title: "Reporting",
    startMonth: 6,
    endMonth: 8,
    accent: "var(--amber)",
    shortBlurb:
      "Findings → Conclusions → Recommendations (co-created with the ERG).",
    milestones: [
      "Findings developed from the matrix",
      "Conclusions established",
      "Tentative recommendations drafted",
      "CPE Report v1 → ERG + recommendations workshop",
      "CPE Report v2 approved; IEO quality assessment",
    ],
    tools: [
      "Recommendations protocol + worksheet (Box 17)",
      "QA checklist (Box 8 applied to report)",
      "EQA grid",
    ],
    deliverables: [
      "CPE Report (max 80 pages)",
      "Executive summary",
      "All five mandatory annexes",
    ],
  },
  {
    id: "dissemination",
    number: 5,
    title: "Dissemination",
    startMonth: 8,
    endMonth: 11,
    accent: "var(--un-blue-700)",
    shortBlurb:
      "Strategic communication and facilitation of use of the results.",
    milestones: [
      "Communication plan finalised + approved by CO Rep",
      "Minimum communications package released",
      "Management response workshop (within 6 weeks)",
      "Management response approved → TeamCentral",
      "Long-term facilitation of use (up to 5 years)",
    ],
    tools: [
      "Strategic communication plan template",
      "Minimum communications package toolkit",
      "TeamCentral tracking",
    ],
    deliverables: [
      "Comms products: report, executive summary, brief, video",
      "Management response document",
      "Published on UNFPA evaluation database",
    ],
  },
];

const totalMonths = 11;

// color-mix produces an accent with alpha; works with CSS vars (unlike
// hex-alpha concatenation, which silently fails when the base is a var()).
function withAlpha(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

export function CPERoadmap() {
  const [active, setActive] = useState<string>("preparation");
  const activePhase = PHASES.find((p) => p.id === active)!;
  const activeIdx = PHASES.findIndex((p) => p.id === active);

  return (
    <section className="my-12">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.18em] text-un-700 font-semibold">
          Figure 2 · The CPE Roadmap
        </div>
        <h3 className="font-display mt-2 text-[clamp(28px,4vw,40px)] leading-[1.05] tracking-[-0.02em] text-ink-1">
          The 11-month journey
        </h3>
        <p className="mt-3 text-[15px] text-ink-2 leading-[1.6] max-w-2xl">
          The handbook prescribes a minimum of 11 months from the launch meeting
          to the final report. Click a phase to see its milestones, tools, and
          deliverables.
        </p>
      </div>

      {/* Timeline canvas */}
      <div
        className="relative rounded-3xl bg-surface-2 border border-border p-5 sm:p-7 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(31,98,191,0.04), transparent 60%), radial-gradient(circle at 100% 100%, rgba(20,184,166,0.05), transparent 55%)",
        }}
      >
        {/* Journey markers — Launch flag at M1, Destination flag at M11 */}
        <div className="absolute left-4 sm:left-5 top-4 sm:top-5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-border shadow-sm">
          <Footprints className="w-3 h-3 text-un-700" />
          <span className="text-[9.5px] uppercase tracking-[0.14em] font-bold text-un-700">
            Launch
          </span>
        </div>
        <div className="absolute right-4 sm:right-5 top-4 sm:top-5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full text-white shadow-sm" style={{ background: "var(--un-blue-900)" }}>
          <Flag className="w-3 h-3" />
          <span className="text-[9.5px] uppercase tracking-[0.14em] font-bold">
            Report
          </span>
        </div>

        {/* Month axis */}
        <div className="hidden sm:block relative h-6 mt-7 mb-3">
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalMonths }).map((_, i) => (
              <div
                key={i}
                className="flex-1 relative border-r border-border last:border-r-0"
              >
                <span className="absolute -top-0.5 left-1.5 text-[9.5px] font-numeric font-semibold tabular-nums text-ink-3">
                  M{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase bars + journey path overlay */}
        <div className="relative">
          {/* Travel path — a dashed road behind the bars */}
          <svg
            className="absolute inset-0 pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%" }}
            aria-hidden
          >
            <path
              d="M 0 12 Q 25 4, 50 26 T 100 50 Q 75 70, 50 75 T 0 92"
              stroke="var(--un-blue-200)"
              strokeWidth="0.4"
              strokeDasharray="2 2"
              fill="none"
              opacity="0.7"
            />
          </svg>

          <div className="relative space-y-2.5">
            {PHASES.map((phase, idx) => {
              const isActive = active === phase.id;
              const leftPct = ((phase.startMonth - 1) / totalMonths) * 100;
              const widthPct =
                ((phase.endMonth - phase.startMonth + 1) / totalMonths) * 100;
              const isCurrent = idx === activeIdx;

              return (
                <m.button
                  key={phase.id}
                  type="button"
                  onClick={() => setActive(phase.id)}
                  onMouseEnter={() => setActive(phase.id)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.07 * idx,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative w-full h-12 rounded-xl block bg-white border border-border hover:border-un-200 transition-colors"
                >
                  {/* Bar fill */}
                  <m.div
                    className="absolute inset-y-0 rounded-xl flex items-center px-3 sm:px-4 gap-2 sm:gap-3 overflow-hidden"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      background: `linear-gradient(90deg, ${phase.accent} 0%, ${withAlpha(
                        phase.accent,
                        85,
                      )} 100%)`,
                    }}
                    animate={{
                      boxShadow: isActive
                        ? `0 0 0 3px ${withAlpha(phase.accent, 22)}, 0 6px 18px -6px ${withAlpha(phase.accent, 55)}`
                        : "0 0 0 0px transparent, 0 1px 2px rgba(15,23,42,0.06)",
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <m.span
                      className="font-display italic text-white leading-none shrink-0"
                      style={{
                        textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        fontSize: "clamp(14px, 1.6vw, 18px)",
                        fontWeight: 600,
                      }}
                      animate={{ scale: isCurrent ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      0{phase.number}
                    </m.span>
                    <span className="text-white text-[11.5px] sm:text-[13px] font-semibold tracking-[-0.005em] truncate" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.12)" }}>
                      {phase.title}
                    </span>
                    <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-white/85 text-[10.5px] font-numeric font-semibold tabular-nums shrink-0">
                      <Clock className="w-3 h-3" />
                      M{phase.startMonth}–{phase.endMonth}
                    </span>
                  </m.div>

                  {/* Waypoint pin at start of each phase */}
                  <span
                    className="absolute -top-1.5 z-10 flex items-center justify-center"
                    style={{
                      left: `calc(${leftPct}% - 9px)`,
                      width: 18,
                      height: 18,
                    }}
                    aria-hidden
                  >
                    <m.span
                      className="w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ background: phase.accent }}
                      animate={{
                        scale: isCurrent ? [1, 1.3, 1] : 1,
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: isCurrent ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    />
                  </span>
                </m.button>
              );
            })}
          </div>
        </div>

        {/* Active-phase traveler marker — moves along the timeline */}
        <m.div
          className="relative mt-3 h-4 hidden sm:block"
          aria-hidden
          initial={false}
        >
          <m.div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center gap-0.5"
            animate={{
              left: `${
                ((activePhase.startMonth - 0.5) / totalMonths) * 100
              }%`,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MapPin
              className="w-4 h-4"
              style={{ color: activePhase.accent }}
              fill="white"
              strokeWidth={2.4}
            />
          </m.div>
        </m.div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <m.div
          key={activePhase.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 rounded-3xl bg-white border border-border overflow-hidden"
          style={{ borderTopWidth: 4, borderTopColor: activePhase.accent }}
        >
          {/* Detail header */}
          <div
            className="px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            style={{ background: withAlpha(activePhase.accent, 7) }}
          >
            <div>
              <div
                className="text-[10.5px] uppercase tracking-[0.16em] font-bold"
                style={{ color: activePhase.accent }}
              >
                Phase {String(activePhase.number).padStart(2, "0")} ·{" "}
                {activePhase.endMonth - activePhase.startMonth + 1} month
                {activePhase.endMonth - activePhase.startMonth + 1 !== 1 && "s"}
              </div>
              <h4 className="font-display mt-1 text-[24px] sm:text-[28px] leading-tight tracking-[-0.01em] text-ink-1">
                {activePhase.title}
              </h4>
              <p className="mt-1 text-[13.5px] text-ink-2 leading-[1.55]">
                {activePhase.shortBlurb}
              </p>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[11.5px] font-numeric font-semibold tabular-nums text-ink-1 border border-border">
              <Clock className="w-3 h-3 text-ink-3" />
              Months {activePhase.startMonth}–{activePhase.endMonth}
            </div>
          </div>

          {/* 3-column detail grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <DetailColumn
              icon={Target}
              label="Milestones"
              items={activePhase.milestones}
              accent={activePhase.accent}
            />
            <DetailColumn
              icon={Wrench}
              label="Tools"
              items={activePhase.tools}
              accent={activePhase.accent}
            />
            <DetailColumn
              icon={FileText}
              label="Deliverables"
              items={activePhase.deliverables}
              accent={activePhase.accent}
            />
          </div>
        </m.div>
      </AnimatePresence>
    </section>
  );
}

function DetailColumn({
  icon: Icon,
  label,
  items,
  accent,
}: {
  icon: typeof Target;
  label: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="px-5 sm:px-6 py-5">
      <div className="flex items-center gap-2 mb-3">
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ background: withAlpha(accent, 10), color: accent }}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
        </span>
        <span
          className="text-[10.5px] uppercase tracking-[0.14em] font-bold"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="relative pl-3.5 text-[12.5px] leading-[1.5] text-ink-1"
          >
            <span
              aria-hidden
              className="absolute left-0 top-[8px] w-1.5 h-1.5 rounded-full"
              style={{ background: accent }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
