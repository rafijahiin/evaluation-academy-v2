"use client";
import { useState } from "react";
import { ArrowDown, ArrowLeft, Check, Copy, Printer, ShieldCheck } from "lucide-react";
import { accentInk, accentBg, type TocData } from "./steps";

const LEVELS: {
  id: keyof TocData;
  chip: string;
  accent: "un-blue" | "teal" | "navy" | "amber";
  assumption?: keyof TocData;
}[] = [
  { id: "inputs", chip: "Inputs", accent: "un-blue", assumption: "a_inputs" },
  { id: "activities", chip: "Activities", accent: "teal", assumption: "a_activities" },
  { id: "outputs", chip: "Outputs", accent: "navy", assumption: "a_outputs" },
  { id: "outcomes", chip: "Outcomes", accent: "un-blue", assumption: "a_outcomes" },
  { id: "result", chip: "Transformative Result", accent: "amber" },
];

/**
 * Final printable view of the user's Theory of Change.
 *
 * Layout:
 *   Desktop — five columns side by side, connecting arrows between them
 *   Mobile — vertical stack with downward arrows
 *
 * Each connector between two levels shows the assumption that must hold
 * for the chain to extend (orange "Assumption" box).
 */
export function TocProduct({
  data,
  onEdit,
}: {
  data: TocData;
  onEdit: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const title = data.context.title || "Theory of Change";
  const country = data.context.country;
  const focus = data.context.focus;

  const buildPlainText = () => {
    const lines = [
      "THEORY OF CHANGE",
      title,
      [country, focus].filter(Boolean).join(" · "),
      "",
      "INPUTS",
      data.inputs || "—",
      "",
      "  ↓ Assumption: " + (data.a_inputs || "—"),
      "",
      "ACTIVITIES",
      data.activities || "—",
      "",
      "  ↓ Assumption: " + (data.a_activities || "—"),
      "",
      "OUTPUTS",
      data.outputs || "—",
      "",
      "  ↓ Assumption: " + (data.a_outputs || "—"),
      "",
      "OUTCOMES",
      data.outcomes || "—",
      "",
      "  ↓ Assumption: " + (data.a_outcomes || "—"),
      "",
      "TRANSFORMATIVE RESULT",
      data.result || "—",
    ];
    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may fail in non-https contexts */
    }
  };

  return (
    <div className="toc-product-page">
      {/* Toolbar (hidden in print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy as text
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-[13px] font-medium hover:shadow-bloom hover:-translate-y-0.5 transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* The document */}
      <div className="toc-product-doc rounded-3xl bg-white border border-border shadow-card overflow-hidden">
        {/* Header */}
        <header className="px-6 sm:px-10 py-7 sm:py-8 border-b border-border flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-un-700 font-semibold">
              Theory of Change
            </div>
            <h1 className="font-display mt-2 text-[clamp(28px,4vw,40px)] leading-[1.05] tracking-[-0.02em] text-ink-1">
              {title}
            </h1>
            {(country || focus) && (
              <p className="mt-1.5 text-[13.5px] text-ink-2">
                {[country, focus].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div className="text-[12px] text-ink-3 font-medium">
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        {/* Chain */}
        <div className="px-4 sm:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-3 lg:gap-2 items-stretch">
            {LEVELS.map((level, i) => {
              const value = data[level.id] as string;
              const items = (value || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const assumption = level.assumption
                ? (data[level.assumption] as string)
                : "";
              const ink = accentInk(level.accent);
              const bg = accentBg(level.accent);

              return (
                <div
                  key={level.id}
                  className="contents lg:contents"
                  style={{
                    // Each level box occupies one of the 5 odd columns
                    // (columns 1,3,5,7,9), connectors are even columns (2,4,6,8).
                  }}
                >
                  {/* Connector (between levels) */}
                  {i > 0 && (
                    <div className="flex lg:flex-col items-center justify-center lg:col-span-1 lg:py-4 py-2">
                      {/* Arrow + assumption */}
                      <div className="flex lg:flex-col items-center gap-2 w-full">
                        <ArrowDown
                          aria-hidden
                          className="w-4 h-4 text-ink-3 shrink-0 lg:block hidden"
                          strokeWidth={2.2}
                          style={{ transform: "rotate(-90deg)" }}
                        />
                        <ArrowDown
                          aria-hidden
                          className="w-4 h-4 text-ink-3 shrink-0 lg:hidden"
                          strokeWidth={2.2}
                        />
                        {assumption && (
                          <div
                            className="text-[10.5px] leading-[1.4] italic text-amber-700 px-2 py-1.5 rounded-md border lg:max-w-full max-w-[280px]"
                            style={{
                              background: "rgba(245, 158, 11, 0.08)",
                              borderColor: "rgba(245, 158, 11, 0.25)",
                            }}
                          >
                            <span className="inline-flex items-center gap-1 font-semibold not-italic mr-1">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Assumption
                            </span>
                            {assumption}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Level box */}
                  <div className="lg:col-span-1 rounded-2xl border px-4 py-4" style={{ background: bg, borderColor: "var(--border)" }}>
                    <div
                      className="text-[10px] uppercase tracking-[0.16em] font-bold mb-2"
                      style={{ color: ink }}
                    >
                      {level.chip}
                    </div>
                    {items.length === 0 ? (
                      <div className="text-[12.5px] text-ink-3 italic">—</div>
                    ) : (
                      <ul className="space-y-1.5">
                        {items.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-[12.5px] leading-[1.5] text-ink-1 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:rounded-full"
                            style={
                              {
                                "--bullet": ink,
                                ["--tw-content" as never]: "",
                              } as React.CSSProperties
                            }
                          >
                            <span
                              aria-hidden
                              className="absolute left-0 top-[8px] w-1.5 h-1.5 rounded-full"
                              style={{ background: ink }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 sm:px-10 py-5 border-t border-border text-center">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3 font-semibold">
            Built with Evaluation Academy · Based on the UNFPA Evaluation Handbook 2024
          </div>
        </footer>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          html,
          body {
            background: white !important;
          }
          header,
          nav,
          footer,
          .no-print,
          .toc-toolbar {
            display: none !important;
          }
          .toc-product-page {
            padding: 0 !important;
            max-width: none !important;
          }
          .toc-product-doc {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
