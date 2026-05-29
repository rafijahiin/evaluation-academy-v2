"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { Clock, FileText, Target, Wrench } from "lucide-react";

/**
 * The CPE Roadmap (handbook Figure 2) — interactive 11-month journey
 * showing the five phases as horizontal bars on a months timeline,
 * with their key deliverables, milestones, and tools surfaced on click.
 *
 * Designed for the landing page: gives prospective learners a tangible
 * sense of what a CPE looks like end-to-end before they start the
 * course. Also usable inline in lesson 1.1.
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

export function CPERoadmap() {
  const [active, setActive] = useState<string>("preparation");
  const activePhase = PHASES.find((p) => p.id === active)!;

  const totalMonths = 11;

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
      <div className="rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
        {/* Month axis */}
        <div className="hidden sm:block relative h-6 mb-3">
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

        {/* Phase bars */}
        <div className="space-y-2.5">
          {PHASES.map((phase, idx) => {
            const isActive = active === phase.id;
            const leftPct = ((phase.startMonth - 1) / totalMonths) * 100;
            const widthPct =
              ((phase.endMonth - phase.startMonth + 1) / totalMonths) * 100;

            return (
              <m.button
                key={phase.id}
                type="button"
                onClick={() => setActive(phase.id)}
                onMouseEnter={() => setActive(phase.id)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.06 * idx,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative w-full h-12 rounded-xl overflow-hidden block bg-white border border-border hover:border-un-200 transition-colors"
              >
                {/* Bar fill */}
                <m.div
                  className="absolute inset-y-0 rounded-xl flex items-center px-3 sm:px-4 gap-2 sm:gap-3 overflow-hidden"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${phase.accent} 0%, ${phase.accent}DD 100%)`,
                  }}
                  animate={{
                    boxShadow: isActive
                      ? `0 0 0 3px ${phase.accent}33, 0 4px 12px -4px ${phase.accent}55`
                      : "0 0 0 0px transparent, 0 1px 2px rgba(15,23,42,0.04)",
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="font-display italic text-white text-[14px] sm:text-[16px] leading-none shrink-0">
                    0{phase.number}
                  </span>
                  <span className="text-white text-[11.5px] sm:text-[13px] font-semibold tracking-[-0.005em] truncate">
                    {phase.title}
                  </span>
                  <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-white/85 text-[10.5px] font-numeric font-semibold tabular-nums shrink-0">
                    <Clock className="w-3 h-3" />
                    M{phase.startMonth}–{phase.endMonth}
                  </span>
                </m.div>
              </m.button>
            );
          })}
        </div>
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
            style={{ background: `${activePhase.accent}0F` }}
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
          style={{ background: `${accent}1A`, color: accent }}
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
