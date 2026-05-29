"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { Coins, Wrench, Package, Sparkles, Globe2 } from "lucide-react";

/**
 * Theory-based contribution analysis — visualised as a horizontal results
 * chain: Inputs → Activities → Outputs → Outcomes → Contribution to impact.
 *
 * Each link has a question the CPE must ask + the type of evidence that
 * answers it. Clicking a link reveals the question and example evidence
 * sources, illustrating how the chain turns into a contribution claim.
 */

type Link = {
  id: string;
  label: string;
  question: string;
  evidence: string[];
  icon: typeof Coins;
  color: string;
};

const LINKS: Link[] = [
  {
    id: "inputs",
    label: "Inputs",
    question: "What human, financial, and technical resources did UNFPA mobilise?",
    evidence: [
      "Country programme budget allocations",
      "Donor agreements and contributions",
      "Implementing partner agreements",
    ],
    icon: Coins,
    color: "var(--un-blue)",
  },
  {
    id: "activities",
    label: "Activities",
    question: "What was actually done with those inputs?",
    evidence: [
      "Implementing partner reports",
      "Training and workshop records",
      "Procurement and distribution logs",
    ],
    icon: Wrench,
    color: "var(--teal)",
  },
  {
    id: "outputs",
    label: "Outputs",
    question: "What goods, services, and products were produced or delivered?",
    evidence: [
      "Service delivery statistics",
      "Number of people trained / commodities distributed",
      "Policy briefs and guidance documents produced",
    ],
    icon: Package,
    color: "#0E7C7B",
  },
  {
    id: "outcomes",
    label: "Outcomes",
    question: "What changes occurred in capacities, behaviours, policies, services?",
    evidence: [
      "Programme monitoring data and routine HMIS",
      "Surveys (DHS, MICS) and rights-holder interviews",
      "Partner and stakeholder accounts of change",
    ],
    icon: Sparkles,
    color: "var(--un-blue-900)",
  },
  {
    id: "contribution",
    label: "Contribution to impact",
    question:
      "To what extent did UNFPA's outputs and outcomes contribute to higher-level results — alongside other actors and factors?",
    evidence: [
      "Triangulation across primary + secondary sources",
      "Counterfactual reasoning + rival explanations tested",
      "Plausibility check with stakeholders and experts",
    ],
    icon: Globe2,
    color: "var(--amber)",
  },
];

export function ContributionChain() {
  const [active, setActive] = useState<string>("outcomes");
  const activeLink = LINKS.find((l) => l.id === active)!;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          The contribution chain
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Each link asks one question and is answered with one type of evidence. Click any link.
        </p>
      </div>

      {/* Chain — responsive horizontal flex */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-stretch">
        {LINKS.map((link, i) => {
          const isActive = active === link.id;
          const Icon = link.icon;
          const isLast = i === LINKS.length - 1;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => setActive(link.id)}
              onMouseEnter={() => setActive(link.id)}
              className="relative flex-1 group text-left rounded-2xl sm:rounded-none sm:first:rounded-l-2xl sm:last:rounded-r-2xl transition-all"
              style={{
                background: isActive ? link.color : "white",
                border: `1px solid ${isActive ? link.color : "var(--border)"}`,
                color: isActive ? "white" : "var(--ink-1)",
                padding: "14px 18px",
                clipPath: isLast
                  ? undefined
                  : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)",
                marginRight: isLast ? 0 : -10,
                zIndex: LINKS.length - i,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  size={16}
                  strokeWidth={2.2}
                  style={{ color: isActive ? "white" : link.color }}
                />
                <span className="text-[10px] uppercase tracking-[0.12em] font-bold opacity-80">
                  Link {i + 1}
                </span>
              </div>
              <div className="font-display text-[15px] sm:text-[16px] leading-tight tracking-[-0.005em]">
                {link.label}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={activeLink.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4"
        >
          <div
            className="rounded-2xl bg-white border border-border p-5"
            style={{ borderLeftWidth: 3, borderLeftColor: activeLink.color }}
          >
            <div
              className="text-[10.5px] uppercase tracking-[0.14em] font-bold mb-2"
              style={{ color: activeLink.color }}
            >
              The evaluation question
            </div>
            <p className="text-[15px] leading-[1.55] text-ink-1 font-medium">
              {activeLink.question}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-border p-5">
            <div className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-2">
              How you answer it
            </div>
            <ul className="space-y-1.5">
              {activeLink.evidence.map((e) => (
                <li key={e} className="flex items-start gap-2 text-[13.5px] text-ink-1 leading-[1.5]">
                  <span
                    aria-hidden
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: activeLink.color }}
                  />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </m.div>
      </AnimatePresence>
    </figure>
  );
}
