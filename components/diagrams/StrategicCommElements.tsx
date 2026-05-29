"use client";
import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { Target, MessageSquare, Radio, Clock, Zap } from "lucide-react";

/**
 * Five elements of strategic communication — Pentagon layout.
 *
 * Audience · Message · Channel · Timing · Action arranged at the five
 * vertices of a pentagon, connected by lines to suggest interdependence.
 * Each element opens a detail card describing the question to answer
 * and the failure mode of getting it wrong.
 */

type Element = {
  id: string;
  label: string;
  question: string;
  failure: string;
  example: string;
  icon: typeof Target;
  color: string;
};

const ELEMENTS: Element[] = [
  {
    id: "audience",
    label: "Audience",
    question: "Who needs to act on the findings — and what do they already know?",
    failure: "“The general public.” A vague audience leads to vague messaging.",
    example:
      "MoH SRHR Director + 3 regional directors; donors; rights-holders' federation — each a distinct audience.",
    icon: Target,
    color: "var(--un-blue)",
  },
  {
    id: "message",
    label: "Message",
    question: "What is the single thing this audience must remember?",
    failure: "Eight key messages. Anything more than two competes for attention.",
    example:
      "“Adolescent SRHR coverage improved 18% — but rural access widened the equity gap. Next CP must close it.”",
    icon: MessageSquare,
    color: "var(--teal)",
  },
  {
    id: "channel",
    label: "Channel",
    question: "Where does this audience already pay attention?",
    failure: "A 90-page PDF for a minister. The right channel is whatever they already open.",
    example:
      "Closed-door briefing (CO Rep + Minister), 4-page brief, validation workshop with stakeholders, public summary page.",
    icon: Radio,
    color: "var(--un-blue-900)",
  },
  {
    id: "timing",
    label: "Timing",
    question: "When is this audience deciding the thing the CPE can inform?",
    failure: "Releasing the report after the next CP is already drafted. Be earlier.",
    example:
      "Validation workshop before the CCA/UNSDCF cycle; brief to donors before pledging conferences.",
    icon: Clock,
    color: "var(--amber)",
  },
  {
    id: "action",
    label: "Action",
    question: "What should the audience do differently after engaging?",
    failure: "“Raise awareness.” Awareness is not action.",
    example:
      "“Co-sign a joint statement with us at the launch event,” “fund the adolescent component of the next CP,” etc.",
    icon: Zap,
    color: "var(--un-blue-700)",
  },
];

const W = 460;
const H = 420;
const CX = W / 2;
const CY = H / 2 + 10;
const R = 150;

// Pentagon vertex positions (top first, then clockwise)
function vertex(i: number): { x: number; y: number } {
  const angle = ((i * 72 - 90) * Math.PI) / 180;
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
}

export function StrategicCommElements() {
  const [active, setActive] = useState<string>("audience");
  const activeElement = ELEMENTS.find((e) => e.id === active)!;
  const Icon = activeElement.icon;

  return (
    <figure className="my-10 rounded-3xl bg-surface-2 border border-border p-5 sm:p-7">
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
          Interactive
        </div>
        <h3 className="font-display mt-1 text-[20px] sm:text-[24px] leading-tight tracking-[-0.01em] text-ink-1">
          Five elements of strategic communication
        </h3>
        <p className="mt-1 text-[13px] text-ink-3">
          Audience · Message · Channel · Timing · Action — every comm product answers all five.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1fr)] gap-6 items-center">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", maxWidth: 460 }}>
            {/* Connector pentagon */}
            <polygon
              points={ELEMENTS.map((_, i) => {
                const v = vertex(i);
                return `${v.x},${v.y}`;
              }).join(" ")}
              fill="var(--un-blue-50)"
              fillOpacity="0.4"
              stroke="var(--un-blue-200)"
              strokeWidth="1.5"
            />
            {/* Spokes to centre */}
            {ELEMENTS.map((_, i) => {
              const v = vertex(i);
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={v.x}
                  y2={v.y}
                  stroke="var(--un-blue-200)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Centre core */}
            <circle cx={CX} cy={CY} r="34" fill="white" stroke="var(--un-blue-300)" strokeWidth="1.5" />
            <text
              x={CX}
              y={CY - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="var(--un-blue-700)"
              style={{ letterSpacing: "0.16em" }}
            >
              ONE
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="var(--un-blue-700)"
              style={{ letterSpacing: "0.16em" }}
            >
              PRODUCT
            </text>

            {/* Vertex nodes */}
            {ELEMENTS.map((el, i) => {
              const v = vertex(i);
              const isActive = active === el.id;
              const EIcon = el.icon;
              return (
                <g
                  key={el.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActive(el.id)}
                  onMouseEnter={() => setActive(el.id)}
                >
                  <m.circle
                    cx={v.x}
                    cy={v.y}
                    r={isActive ? 30 : 26}
                    fill={isActive ? el.color : "white"}
                    stroke={el.color}
                    strokeWidth="2.5"
                    animate={{ r: isActive ? 30 : 26 }}
                    transition={{ duration: 0.2 }}
                  />
                  <foreignObject
                    x={v.x - 11}
                    y={v.y - 11}
                    width="22"
                    height="22"
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        color: isActive ? "white" : el.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EIcon size={16} strokeWidth={2.2} />
                    </div>
                  </foreignObject>
                  <text
                    x={v.x}
                    y={v.y + (i === 0 ? -42 : i === 1 || i === 4 ? 48 : 48)}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={isActive ? el.color : "var(--ink-1)"}
                    style={{ pointerEvents: "none" }}
                  >
                    {el.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={activeElement.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white border border-border p-5"
            style={{ borderLeftWidth: 3, borderLeftColor: activeElement.color }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ background: activeElement.color }}
              >
                <Icon size={15} strokeWidth={2.2} />
              </div>
              <h4 className="font-display text-[18px] sm:text-[20px] leading-tight tracking-[-0.01em] text-ink-1">
                {activeElement.label}
              </h4>
            </div>
            <div className="mb-3">
              <div
                className="text-[10px] uppercase tracking-[0.14em] font-bold mb-1"
                style={{ color: activeElement.color }}
              >
                The question
              </div>
              <p className="text-[13.5px] leading-[1.55] text-ink-1 font-medium">
                {activeElement.question}
              </p>
            </div>
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                Common failure
              </div>
              <p className="text-[13.5px] leading-[1.55] text-ink-1">{activeElement.failure}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-ink-3 mb-1">
                What good looks like
              </div>
              <p className="text-[13.5px] leading-[1.55] text-ink-1 italic">
                {activeElement.example}
              </p>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}
