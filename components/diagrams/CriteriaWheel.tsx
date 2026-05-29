"use client";
import { useState } from "react";
import { m } from "motion/react";

/**
 * OECD-DAC Evaluation Criteria — interactive segmented wheel.
 *
 * Five primary criteria (Relevance, Coherence, Effectiveness, Efficiency,
 * Sustainability) arranged as donut segments around a central "CPE"
 * core. Hover or click a segment to see the handbook definition. A
 * toggle reveals the two additional humanitarian criteria (Coverage,
 * Connectedness) as an outer ring.
 *
 * Reads the segments via SVG arc paths computed from polar coordinates;
 * keeps everything resolution-independent and print-friendly.
 */

type Criterion = {
  id: string;
  label: string;
  short: string;
  definition: string;
  color: string;
  tagline: string;
};

const PRIMARY: Criterion[] = [
  {
    id: "relevance",
    label: "Relevance",
    short: "Right thing",
    color: "var(--un-blue)",
    tagline: "Does it match rights-holder and partner priorities?",
    definition:
      "The extent to which the intervention objectives and design respond to rights-holders, country, and partner/institution needs, policies, and priorities — and continue to do so if circumstances change.",
  },
  {
    id: "coherence",
    label: "Coherence",
    short: "Fits together",
    color: "var(--teal)",
    tagline: "Does it work with other UN, partner, and government efforts?",
    definition:
      "The compatibility of the intervention with other interventions in the country, sector, or institution — within UNFPA programming and with projects by other UN agencies, INGOs, and partners.",
  },
  {
    id: "effectiveness",
    label: "Effectiveness",
    short: "Achieved results",
    color: "var(--un-blue-900)",
    tagline: "Did it actually achieve what it set out to?",
    definition:
      "The extent to which the intervention achieved, or is expected to achieve, its objectives and results — including any differential results across groups.",
  },
  {
    id: "efficiency",
    label: "Efficiency",
    short: "Good use of resources",
    color: "#0E7C7B",
    tagline: "Could the same results have come more economically?",
    definition:
      "The extent to which the intervention delivers, or is likely to deliver, results in an economic and timely way. Could the same results have been achieved with fewer financial or technical resources?",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    short: "Lasts beyond",
    color: "var(--un-blue-700)",
    tagline: "Will the benefits continue when funding ends?",
    definition:
      "The extent to which the net benefits of the intervention continue, or are likely to continue, even if or when the intervention ends.",
  },
];

const HUMANITARIAN: Criterion[] = [
  {
    id: "coverage",
    label: "Coverage",
    short: "Reached those in need",
    color: "var(--amber)",
    tagline: "Did life-saving services reach affected populations?",
    definition:
      "The extent to which major population groups facing life-threatening conditions were reached by humanitarian action. Evaluators assess inclusion bias (people receiving support who shouldn't have) and exclusion bias (groups who should have been covered but weren't) — disaggregated by sex, socio-economic grouping, and ethnicity.",
  },
  {
    id: "connectedness",
    label: "Connectedness",
    short: "Linked short to long",
    color: "#B45309",
    tagline: "Do emergency activities consider longer-term context?",
    definition:
      "The extent to which short-term emergency activities are carried out in a context that takes longer-term and interconnected problems into account — a nexus approach — and indicates the complementarity of UNFPA with other partner interventions.",
  },
];

const CX = 200;
const CY = 200;
const INNER_R = 70;
const OUTER_R = 130;
const HUMANITARIAN_INNER = 138;
const HUMANITARIAN_OUTER = 168;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const a = polarToCartesian(cx, cy, rOuter, endDeg);
  const b = polarToCartesian(cx, cy, rOuter, startDeg);
  const c = polarToCartesian(cx, cy, rInner, startDeg);
  const d = polarToCartesian(cx, cy, rInner, endDeg);
  return [
    `M ${a.x} ${a.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 0 ${b.x} ${b.y}`,
    `L ${c.x} ${c.y}`,
    `A ${rInner} ${rInner} 0 ${large} 1 ${d.x} ${d.y}`,
    "Z",
  ].join(" ");
}

export function CriteriaWheel() {
  const [active, setActive] = useState<string>("relevance");
  const [showHumanitarian, setShowHumanitarian] = useState(false);

  const criteria = showHumanitarian ? [...PRIMARY, ...HUMANITARIAN] : PRIMARY;
  const activeCriterion = [...PRIMARY, ...HUMANITARIAN].find((c) => c.id === active) ?? PRIMARY[0];

  const primarySliceDeg = 360 / PRIMARY.length;
  const humanitarianSliceDeg = 360 / HUMANITARIAN.length;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="text-center mb-6">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          OECD-DAC evaluation criteria
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Click any segment to read the handbook definition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)] gap-6 items-center">
        {/* Wheel SVG */}
        <div className="flex justify-center">
          <svg viewBox="0 0 400 400" width="100%" height="auto" style={{ maxWidth: 380 }}>
            {/* Primary criteria segments */}
            {PRIMARY.map((c, i) => {
              const startDeg = i * primarySliceDeg;
              const endDeg = (i + 1) * primarySliceDeg;
              const isActive = active === c.id;
              const midDeg = (startDeg + endDeg) / 2;
              const labelPos = polarToCartesian(CX, CY, (INNER_R + OUTER_R) / 2, midDeg);

              return (
                <g key={c.id}>
                  <m.path
                    d={arcPath(CX, CY, INNER_R, OUTER_R, startDeg, endDeg)}
                    fill={c.color}
                    opacity={isActive ? 1 : 0.85}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: "pointer", transformOrigin: `${CX}px ${CY}px` }}
                    animate={{ scale: isActive ? 1.04 : 1 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActive(c.id)}
                    onMouseEnter={() => setActive(c.id)}
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                    style={{ pointerEvents: "none", letterSpacing: "0.04em" }}
                  >
                    {c.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Humanitarian outer ring (toggleable) */}
            {showHumanitarian &&
              HUMANITARIAN.map((c, i) => {
                const startDeg = i * humanitarianSliceDeg + 90;
                const endDeg = (i + 1) * humanitarianSliceDeg + 90;
                const isActive = active === c.id;
                const midDeg = (startDeg + endDeg) / 2;
                const labelPos = polarToCartesian(
                  CX,
                  CY,
                  (HUMANITARIAN_INNER + HUMANITARIAN_OUTER) / 2,
                  midDeg,
                );

                return (
                  <m.g
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <m.path
                      d={arcPath(CX, CY, HUMANITARIAN_INNER, HUMANITARIAN_OUTER, startDeg, endDeg)}
                      fill={c.color}
                      opacity={isActive ? 1 : 0.85}
                      stroke="white"
                      strokeWidth="2"
                      style={{ cursor: "pointer", transformOrigin: `${CX}px ${CY}px` }}
                      animate={{ scale: isActive ? 1.03 : 1 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setActive(c.id)}
                      onMouseEnter={() => setActive(c.id)}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="9.5"
                      fontWeight="700"
                      style={{ pointerEvents: "none", letterSpacing: "0.06em" }}
                    >
                      {c.label.toUpperCase()}
                    </text>
                  </m.g>
                );
              })}

            {/* Centre core */}
            <circle cx={CX} cy={CY} r={INNER_R - 2} fill="white" stroke="var(--border)" strokeWidth="1" />
            <text
              x={CX}
              y={CY - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--ink-3)"
              style={{ letterSpacing: "0.14em" }}
            >
              CPE
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="9"
              fill="var(--ink-3)"
              style={{ letterSpacing: "0.10em" }}
            >
              CRITERIA
            </text>
          </svg>
        </div>

        {/* Detail panel */}
        <m.div
          key={activeCriterion.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-white border border-border p-5 sm:p-6 min-h-[200px]"
          style={{ borderLeftWidth: 4, borderLeftColor: activeCriterion.color }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full"
              style={{ background: activeCriterion.color }}
            />
            <span
              className="text-[10.5px] uppercase tracking-[0.16em] font-bold"
              style={{ color: activeCriterion.color }}
            >
              {HUMANITARIAN.some((h) => h.id === activeCriterion.id)
                ? "Humanitarian +2"
                : "DAC criterion"}
            </span>
          </div>
          <h4 className="font-display text-[22px] sm:text-[26px] leading-tight tracking-[-0.01em] text-ink-1 mb-1">
            {activeCriterion.label}
          </h4>
          <div className="text-[13px] italic text-ink-3 mb-3">
            {activeCriterion.tagline}
          </div>
          <p className="text-[14px] leading-[1.65] text-ink-1">
            {activeCriterion.definition}
          </p>
        </m.div>
      </div>

      {/* Humanitarian toggle */}
      <div className="mt-5 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setShowHumanitarian((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-medium border transition-colors"
          style={{
            background: showHumanitarian
              ? "linear-gradient(135deg, var(--amber) 0%, #B45309 100%)"
              : "white",
            color: showHumanitarian ? "white" : "var(--ink-2)",
            borderColor: showHumanitarian ? "transparent" : "var(--border)",
          }}
        >
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: showHumanitarian ? "white" : "var(--amber)",
            }}
          />
          {showHumanitarian ? "Hide" : "Add"} humanitarian +2 (coverage · connectedness)
        </button>
      </div>
    </figure>
  );
}
