"use client";
import { ArrowDown, ShieldCheck, AlertTriangle } from "lucide-react";
import { LEVELS, GAPS, levelMeta, type TocData } from "./toc";

/**
 * The Theory of Change rendered as a vertical results chain
 * (Inputs → Impact), with assumptions/risks on each link.
 *
 * Deliberately styled with INLINE hex colours (no CSS-variable or
 * oklch utilities) so html-to-image can rasterise it cleanly for the
 * PNG/JPG export. `innerRef` is the capture node.
 */

const INK = "#131619";
const MUTED = "#686A6C";
const BORDER = "#D9DBE1";
const RISK = "#C81E4E";

function textOn(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16),
    g = parseInt(h.slice(2, 4), 16),
    b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? INK : "#FFFFFF";
}

export function TocDiagram({
  data,
  innerRef,
}: {
  data: TocData;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  const title = data.programme || "Theory of Change";
  const meta = [data.country, data.focus].filter(Boolean).join("  ·  ");

  return (
    <div
      ref={innerRef}
      style={{
        background: "#FFFFFF",
        color: INK,
        padding: "32px 28px 24px",
        fontFamily:
          'var(--font-atk), "Atkinson Hyperlegible Next", system-ui, sans-serif',
        maxWidth: 860,
        margin: "0 auto",
        borderRadius: 20,
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${BORDER}`, paddingBottom: 16, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#F96000",
          }}
        >
          Theory of Change · UNFPA results chain
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: 6,
            color: INK,
          }}
        >
          {title}
        </div>
        {meta && (
          <div style={{ fontSize: 13.5, color: MUTED, marginTop: 4 }}>{meta}</div>
        )}
      </div>

      {/* Chain */}
      {LEVELS.map((lvl, i) => {
        const items = data.levels[lvl.id];
        const gap = GAPS[i]; // connector below this level (none after impact)
        const badgeText = textOn(lvl.color);
        return (
          <div key={lvl.id}>
            {/* Level band */}
            <div
              style={{
                display: "flex",
                background: "#FFFFFF",
                border: `1px solid ${BORDER}`,
                borderLeft: `6px solid ${lvl.color}`,
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {/* left: badge + label */}
              <div
                style={{
                  width: 168,
                  flexShrink: 0,
                  padding: "14px 14px",
                  background: `${lvl.color}14`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: lvl.color,
                      color: badgeText,
                      fontSize: 12,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>
                    {lvl.label}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.35 }}>
                  {lvl.short}
                </span>
              </div>

              {/* right: items */}
              <div style={{ flex: 1, padding: "12px 16px", minWidth: 0 }}>
                {items.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#9A9DA2", fontStyle: "italic" }}>
                    (not specified)
                  </div>
                ) : (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {items.map((it) => (
                      <li
                        key={it.id}
                        style={{
                          fontSize: 13.5,
                          lineHeight: 1.5,
                          color: INK,
                          paddingLeft: 14,
                          position: "relative",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 8,
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: lvl.color,
                          }}
                        />
                        {it.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Connector + assumptions/risks (not after Impact) */}
            {gap && (
              <Connector notes={data.notes[gap.id]} color={levelMeta(gap.to).color} />
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: `1px solid ${BORDER}`,
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#9A9DA2",
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span>Built with Evaluation Academy</span>
        <span>UNFPA results chain — Inputs → Impact</span>
      </div>
    </div>
  );
}

function Connector({
  notes,
  color,
}: {
  notes: { id: string; text: string; kind: "assumption" | "risk" }[];
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 12,
        padding: "8px 0 8px 18px",
      }}
    >
      {/* arrow rail */}
      <div
        style={{
          width: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 2, flex: 1, background: BORDER, minHeight: 8 }} />
        <ArrowDown size={16} color={color} strokeWidth={2.4} />
        <div style={{ width: 2, flex: 1, background: BORDER, minHeight: 8 }} />
      </div>

      {/* notes */}
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", minWidth: 0 }}>
        {notes.length === 0 ? (
          <span style={{ fontSize: 11.5, color: "#9A9DA2", fontStyle: "italic" }}>
            leads to (no assumptions noted)
          </span>
        ) : (
          notes.map((nt) => {
            const isRisk = nt.kind === "risk";
            const c = isRisk ? RISK : "#AE4300";
            return (
              <span
                key={nt.id}
                style={{
                  display: "inline-flex",
                  alignItems: "flex-start",
                  gap: 6,
                  maxWidth: "100%",
                  background: isRisk ? "#FFF1F4" : "#FDF0E6",
                  border: `1px solid ${c}55`,
                  color: "#3C2A1E",
                  borderRadius: 8,
                  padding: "5px 9px",
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                {isRisk ? (
                  <AlertTriangle size={12} color={c} strokeWidth={2.4} style={{ marginTop: 2, flexShrink: 0 }} />
                ) : (
                  <ShieldCheck size={12} color={c} strokeWidth={2.4} style={{ marginTop: 2, flexShrink: 0 }} />
                )}
                <span>
                  <strong style={{ color: c, fontWeight: 800, fontSize: 10, letterSpacing: "0.06em" }}>
                    {isRisk ? "RISK " : "IF "}
                  </strong>
                  {nt.text}
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
