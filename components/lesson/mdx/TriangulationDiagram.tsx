"use client";
import { useState } from "react";
import { m } from "motion/react";

/**
 * Interactive visual for the triangulation concept (handbook Figure 5).
 *
 * Two concentric rings:
 *   - Inner ring (orange): the unit being analysed — country office staff,
 *     implementing partners, rights-holders, government partners, UN
 *     agencies, development partners, "other organisations".
 *   - Outer ring (teal): the data collection methods — document review,
 *     focus group, on-site observation, survey, key informant interview,
 *     group interview.
 *
 * Hovering any node highlights it. Two example triangulation paths animate
 * across the diagram to show how multiple methods + sources corroborate a
 * single finding (just like the handbook's two worked examples).
 */
type Node = { id: string; label: string; kind: "method" | "source" };

const METHODS: Node[] = [
  { id: "doc",  label: "Document review",      kind: "method" },
  { id: "fgd",  label: "Focus group",          kind: "method" },
  { id: "obs",  label: "On-site observation",  kind: "method" },
  { id: "sur",  label: "Survey",               kind: "method" },
  { id: "kii",  label: "Key informant interview", kind: "method" },
  { id: "grp",  label: "Group interview",      kind: "method" },
];

const SOURCES: Node[] = [
  { id: "co",   label: "Country office staff", kind: "source" },
  { id: "ip",   label: "Implementing partners", kind: "source" },
  { id: "rh",   label: "Rights-holders",       kind: "source" },
  { id: "gov",  label: "Government partners",  kind: "source" },
  { id: "un",   label: "UN agencies",          kind: "source" },
  { id: "dp",   label: "Development partners", kind: "source" },
];

// Two illustrative triangulation paths matching the handbook's examples
const PATHS: { id: string; color: string; nodes: string[]; caption: string }[] = [
  {
    id: "fp",
    color: "#F96000",
    nodes: ["doc", "fgd", "obs"],
    caption: "Documents say contraceptive uptake rose — but FGDs with rights-holders + on-site observation reveal stockouts. The methods disagree, so the finding is qualified.",
  },
  {
    id: "law",
    color: "#2171EC",
    nodes: ["kii", "gov", "doc"],
    caption: "Interviews with UNFPA GEWE staff + the government counterpart + documentary review converge: UNFPA supported a legal framework against child marriage. Triangulated finding.",
  },
];

const RADIUS_METHODS = 175;
const RADIUS_SOURCES = 95;

export function TriangulationDiagram() {
  const [active, setActive] = useState<string | null>(PATHS[1].id);
  const [hover, setHover] = useState<string | null>(null);

  const activePath = PATHS.find((p) => p.id === active);
  const activeNodes = new Set(activePath?.nodes ?? []);

  return (
    <figure className="my-8">
      <div className="relative rounded-2xl bg-surface-2 border border-border px-4 py-6 sm:px-6 sm:py-8">
        <svg
          viewBox="-220 -220 440 440"
          width="100%"
          height="auto"
          style={{ maxHeight: 440 }}
          aria-label="Triangulation of methods and sources"
        >
          {/* Connecting lines for the active path */}
          {activePath &&
            activePath.nodes.map((id, idx) => {
              if (idx === activePath.nodes.length - 1) return null;
              const from = nodePosition(id);
              const to = nodePosition(activePath.nodes[idx + 1]);
              return (
                <m.line
                  key={`${activePath.id}-${id}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={activePath.color}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                />
              );
            })}

          {/* Outer ring — methods */}
          <circle r={RADIUS_METHODS + 26} fill="none" stroke="rgba(33,113,236,0.12)" strokeDasharray="3 4" />
          {/* Inner ring — sources */}
          <circle r={RADIUS_SOURCES + 22} fill="none" stroke="rgba(245,158,11,0.18)" strokeDasharray="3 4" />

          {/* Centre label */}
          <g pointerEvents="none">
            <text
              y={-4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="var(--ink-3)"
              letterSpacing="0.14em"
            >
              TRIANGULATION
            </text>
            <text y={11} textAnchor="middle" fontSize="9" fill="var(--ink-4)">
              methods × sources
            </text>
          </g>

          {/* Source nodes — inner ring */}
          {SOURCES.map((node, i) => {
            const angle = (i / SOURCES.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * RADIUS_SOURCES;
            const y = Math.sin(angle) * RADIUS_SOURCES;
            const isActive = activeNodes.has(node.id);
            const isHover = hover === node.id;
            return (
              <NodeMarker
                key={node.id}
                x={x}
                y={y}
                label={node.label}
                color="#F96000"
                emphasised={isActive || isHover}
                onHover={(h) => setHover(h ? node.id : null)}
              />
            );
          })}

          {/* Method nodes — outer ring */}
          {METHODS.map((node, i) => {
            const angle = (i / METHODS.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * RADIUS_METHODS;
            const y = Math.sin(angle) * RADIUS_METHODS;
            const isActive = activeNodes.has(node.id);
            const isHover = hover === node.id;
            return (
              <NodeMarker
                key={node.id}
                x={x}
                y={y}
                label={node.label}
                color="#2171EC"
                emphasised={isActive || isHover}
                onHover={(h) => setHover(h ? node.id : null)}
              />
            );
          })}
        </svg>

        {/* Path picker */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {PATHS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={`text-[11.5px] px-3 py-1.5 rounded-full font-medium transition-all ${
                  active === p.id
                    ? "text-white"
                    : "bg-white text-ink-2 border border-border hover:border-un-200"
                }`}
                style={active === p.id ? { background: p.color } : undefined}
              >
                {p.id === "fp" ? "Path 1 · contraceptive uptake" : "Path 2 · child-marriage law"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activePath && (
        <figcaption className="mt-3 text-[13px] text-ink-2 leading-relaxed">
          <strong style={{ color: activePath.color }}>Example:</strong>{" "}
          {activePath.caption}
        </figcaption>
      )}
    </figure>
  );
}

function NodeMarker({
  x,
  y,
  label,
  color,
  emphasised,
  onHover,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  emphasised: boolean;
  onHover: (h: boolean) => void;
}) {
  // Adjust label anchor based on side of the diagram
  const anchor: "start" | "middle" | "end" =
    x < -10 ? "end" : x > 10 ? "start" : "middle";
  const labelDx = anchor === "end" ? -12 : anchor === "start" ? 12 : 0;
  const labelDy = y > 0 ? 14 : -8;

  return (
    <g
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: "default" }}
    >
      <circle
        cx={x}
        cy={y}
        r={emphasised ? 9 : 6}
        fill={color}
        opacity={emphasised ? 1 : 0.55}
        style={{ transition: "all 200ms ease-out" }}
      />
      {emphasised && (
        <circle
          cx={x}
          cy={y}
          r={14}
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.35}
        />
      )}
      <text
        x={x + labelDx}
        y={y + labelDy}
        textAnchor={anchor}
        fontSize="10.5"
        fontWeight={emphasised ? "600" : "500"}
        fill={emphasised ? "var(--ink-1)" : "var(--ink-2)"}
      >
        {label}
      </text>
    </g>
  );
}

function nodePosition(id: string) {
  const allNodes = [...METHODS, ...SOURCES];
  const node = allNodes.find((n) => n.id === id);
  if (!node) return { x: 0, y: 0 };
  const list = node.kind === "method" ? METHODS : SOURCES;
  const radius = node.kind === "method" ? RADIUS_METHODS : RADIUS_SOURCES;
  const idx = list.findIndex((n) => n.id === id);
  const angle = (idx / list.length) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}
