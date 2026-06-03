"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { AnimatePresence, m } from "motion/react";
import {
  Plus,
  Trash2,
  PencilLine,
  Network,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Copy,
  Check,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { TocDiagram } from "./TocDiagram";
import {
  LEVELS,
  GAPS,
  THREE_ZEROS,
  levelMeta,
  emptyData,
  exampleData,
  STORAGE_KEY,
  type TocData,
  type LevelId,
  type GapId,
  type NoteKind,
} from "./toc";

type View = "edit" | "diagram";

type State = { data: TocData; view: View; counter: number; mounted: boolean };

type Action =
  | { type: "init"; data: TocData; counter: number }
  | { type: "meta"; patch: Partial<Pick<TocData, "programme" | "country" | "focus">> }
  | { type: "addItem"; level: LevelId; text?: string }
  | { type: "updateItem"; level: LevelId; id: string; text: string }
  | { type: "removeItem"; level: LevelId; id: string }
  | { type: "addNote"; gap: GapId; kind: NoteKind }
  | { type: "updateNote"; gap: GapId; id: string; text: string }
  | { type: "setNoteKind"; gap: GapId; id: string; kind: NoteKind }
  | { type: "removeNote"; gap: GapId; id: string }
  | { type: "view"; view: View }
  | { type: "loadExample" }
  | { type: "reset" };

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "init":
      return { ...state, data: a.data, counter: a.counter, mounted: true };
    case "meta":
      return { ...state, data: { ...state.data, ...a.patch } };
    case "addItem": {
      const id = `i-${state.counter + 1}`;
      return {
        ...state,
        counter: state.counter + 1,
        data: {
          ...state.data,
          levels: {
            ...state.data.levels,
            [a.level]: [...state.data.levels[a.level], { id, text: a.text ?? "" }],
          },
        },
      };
    }
    case "updateItem":
      return {
        ...state,
        data: {
          ...state.data,
          levels: {
            ...state.data.levels,
            [a.level]: state.data.levels[a.level].map((it) =>
              it.id === a.id ? { ...it, text: a.text } : it,
            ),
          },
        },
      };
    case "removeItem":
      return {
        ...state,
        data: {
          ...state.data,
          levels: {
            ...state.data.levels,
            [a.level]: state.data.levels[a.level].filter((it) => it.id !== a.id),
          },
        },
      };
    case "addNote": {
      const id = `n-${state.counter + 1}`;
      return {
        ...state,
        counter: state.counter + 1,
        data: {
          ...state.data,
          notes: {
            ...state.data.notes,
            [a.gap]: [...state.data.notes[a.gap], { id, text: "", kind: a.kind }],
          },
        },
      };
    }
    case "updateNote":
      return {
        ...state,
        data: {
          ...state.data,
          notes: {
            ...state.data.notes,
            [a.gap]: state.data.notes[a.gap].map((n) =>
              n.id === a.id ? { ...n, text: a.text } : n,
            ),
          },
        },
      };
    case "setNoteKind":
      return {
        ...state,
        data: {
          ...state.data,
          notes: {
            ...state.data.notes,
            [a.gap]: state.data.notes[a.gap].map((n) =>
              n.id === a.id ? { ...n, kind: a.kind } : n,
            ),
          },
        },
      };
    case "removeNote":
      return {
        ...state,
        data: {
          ...state.data,
          notes: {
            ...state.data.notes,
            [a.gap]: state.data.notes[a.gap].filter((n) => n.id !== a.id),
          },
        },
      };
    case "view":
      return { ...state, view: a.view };
    case "loadExample":
      return { ...state, data: exampleData(), counter: 1000 };
    case "reset":
      return { ...state, data: emptyData(), counter: 0 };
  }
}

export function TocBuilderClient() {
  const [state, dispatch] = useReducer(reducer, {
    data: emptyData(),
    view: "edit",
    counter: 0,
    mounted: false,
  });
  const diagramRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Load
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && saved.levels) {
        dispatch({ type: "init", data: saved, counter: 5000 });
      } else {
        dispatch({ type: "init", data: emptyData(), counter: 0 });
      }
    } catch {
      dispatch({ type: "init", data: emptyData(), counter: 0 });
    }
  }, []);

  // Persist
  useEffect(() => {
    if (!state.mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch {
      /* ignore quota */
    }
  }, [state.data, state.mounted]);

  const { data, view } = state;
  const fileSlug = data.country
    ? "-" + data.country.toLowerCase().replace(/\s+/g, "-")
    : "";

  function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportImage(kind: "png" | "jpg") {
    const node = diagramRef.current;
    if (!node) return;
    setErr(null);
    setBusy(kind);
    try {
      const lib = await import("html-to-image");
      if (document.fonts?.ready) await document.fonts.ready;
      const opts = {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      };
      const dataUrl =
        kind === "png"
          ? await lib.toPng(node, opts)
          : await lib.toJpeg(node, { ...opts, quality: 0.96 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `theory-of-change${fileSlug}.${kind}`;
      a.click();
    } catch (e) {
      setErr("Image export failed — try again, or use DOCX.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function exportDocx() {
    setErr(null);
    setBusy("docx");
    try {
      const docx = await import("docx");
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;
      const children: InstanceType<typeof Paragraph>[] = [];
      children.push(new Paragraph({ text: "Theory of Change", heading: HeadingLevel.TITLE }));
      if (data.programme)
        children.push(new Paragraph({ text: data.programme, heading: HeadingLevel.HEADING_1 }));
      const metaLine = [data.country, data.focus].filter(Boolean).join("  ·  ");
      if (metaLine)
        children.push(
          new Paragraph({ children: [new TextRun({ text: metaLine, italics: true, color: "686A6C" })] }),
        );
      children.push(new Paragraph({ text: "" }));

      LEVELS.forEach((lvl, i) => {
        children.push(
          new Paragraph({ text: `${i + 1}. ${lvl.label} — ${lvl.short}`, heading: HeadingLevel.HEADING_2 }),
        );
        const items = data.levels[lvl.id];
        if (items.length === 0) {
          children.push(new Paragraph({ children: [new TextRun({ text: "(not specified)", italics: true, color: "9A9DA2" })] }));
        } else {
          items.forEach((it) =>
            children.push(new Paragraph({ text: it.text || "—", bullet: { level: 0 } })),
          );
        }
        const gap = GAPS[i];
        if (gap) {
          const notes = data.notes[gap.id];
          if (notes.length) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `↓ Link to ${levelMeta(gap.to).label}:`,
                    bold: true,
                    color: "AE4300",
                  }),
                ],
                spacing: { before: 80 },
              }),
            );
            notes.forEach((nt) =>
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: nt.kind === "risk" ? "RISK: " : "ASSUMPTION: ",
                      bold: true,
                      color: nt.kind === "risk" ? "C81E4E" : "AE4300",
                    }),
                    new TextRun({ text: nt.text || "—" }),
                  ],
                  bullet: { level: 1 },
                }),
              ),
            );
          }
        }
      });

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      download(blob, `theory-of-change${fileSlug}.docx`);
    } catch (e) {
      setErr("DOCX export failed — try again.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function copyText() {
    const lines: string[] = ["THEORY OF CHANGE", data.programme || "(untitled)"];
    const metaLine = [data.country, data.focus].filter(Boolean).join(" · ");
    if (metaLine) lines.push(metaLine);
    lines.push("");
    LEVELS.forEach((lvl, i) => {
      lines.push(`${i + 1}. ${lvl.label.toUpperCase()} — ${lvl.short}`);
      const items = data.levels[lvl.id];
      if (!items.length) lines.push("   (not specified)");
      items.forEach((it) => lines.push(`   • ${it.text}`));
      const gap = GAPS[i];
      if (gap && data.notes[gap.id].length) {
        data.notes[gap.id].forEach((nt) =>
          lines.push(`   ${nt.kind === "risk" ? "↓ RISK:" : "↓ IF:"} ${nt.text}`),
        );
      }
      lines.push("");
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {/* Header */}
      <Reveal>
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Interactive tool
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          Theory of{" "}
          <span className="italic" style={{ color: "var(--un-blue-700)" }}>
            Change
          </span>{" "}
          builder
        </h1>
        <p className="mt-3 text-[16px] text-ink-2 leading-relaxed max-w-2xl">
          Map your programme along the UNFPA results chain — Inputs →
          Activities → Outputs → Outcomes → Impact — and name the assumptions
          and risks at each link. Add as many items as you need, then export a
          diagram or Word document.
        </p>
      </Reveal>

      {/* Toolbar */}
      <div className="mt-8 mb-6 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-border bg-white p-1">
          <Toggle active={view === "edit"} onClick={() => dispatch({ type: "view", view: "edit" })} icon={PencilLine} label="Edit" />
          <Toggle active={view === "diagram"} onClick={() => dispatch({ type: "view", view: "diagram" })} icon={Network} label="Diagram" />
        </div>
        <div className="flex-1" />
        {view === "edit" ? (
          <>
            <button type="button" onClick={() => dispatch({ type: "loadExample" })} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-un-700 border border-un-200 hover:bg-un-50 transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> Load example
            </button>
            <button type="button" onClick={() => dispatch({ type: "reset" })} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-ink-2 border border-border hover:bg-surface-2 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </>
        ) : (
          <>
            <ExportBtn onClick={copyText} busy={false} icon={copied ? Check : Copy} label={copied ? "Copied" : "Copy text"} />
            <ExportBtn onClick={() => exportImage("png")} busy={busy === "png"} icon={ImageIcon} label="PNG" />
            <ExportBtn onClick={() => exportImage("jpg")} busy={busy === "jpg"} icon={ImageIcon} label="JPG" />
            <button
              type="button"
              onClick={exportDocx}
              disabled={busy === "docx"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)" }}
            >
              {busy === "docx" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              DOCX
            </button>
          </>
        )}
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700">
          {err}
        </div>
      )}

      {view === "edit" ? (
        <EditView data={data} dispatch={dispatch} />
      ) : (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <TocDiagram data={data} innerRef={diagramRef} />
        </m.div>
      )}
    </div>
  );
}

function EditView({ data, dispatch }: { data: TocData; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-4">
      {/* meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={data.programme} onChange={(e) => dispatch({ type: "meta", patch: { programme: e.target.value } })} placeholder="Programme title" className="rounded-xl border border-border bg-white px-4 py-2.5 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300" />
        <input value={data.country} onChange={(e) => dispatch({ type: "meta", patch: { country: e.target.value } })} placeholder="Country / context" className="rounded-xl border border-border bg-white px-4 py-2.5 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300" />
        <input value={data.focus} onChange={(e) => dispatch({ type: "meta", patch: { focus: e.target.value } })} placeholder="Thematic focus" className="rounded-xl border border-border bg-white px-4 py-2.5 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300" />
      </div>

      {LEVELS.map((lvl, i) => {
        const gap = GAPS[i];
        return (
          <div key={lvl.id}>
            <LevelEditor level={lvl.id} index={i} items={data.levels[lvl.id]} dispatch={dispatch} />
            {gap && <GapEditor gap={gap.id} toLabel={levelMeta(gap.to).label} notes={data.notes[gap.id]} dispatch={dispatch} />}
          </div>
        );
      })}
    </div>
  );
}

function LevelEditor({
  level,
  index,
  items,
  dispatch,
}: {
  level: LevelId;
  index: number;
  items: { id: string; text: string }[];
  dispatch: React.Dispatch<Action>;
}) {
  const lvl = levelMeta(level);
  const isImpact = level === "impact";
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden" style={{ borderLeftWidth: 5, borderLeftColor: lvl.color }}>
      <div className="flex items-start gap-3 px-4 sm:px-5 py-3.5 border-b border-border" style={{ background: `color-mix(in srgb, ${lvl.color} 8%, transparent)` }}>
        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ background: lvl.color }}>
          {index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-ink-1">{lvl.label}</span>
            <span className="text-[11.5px] font-medium" style={{ color: lvl.color }}>· {lvl.short}</span>
          </div>
          <p className="text-[12px] text-ink-3 leading-snug mt-0.5">{lvl.hint}</p>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-2">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: lvl.color }} />
            <input
              value={it.text}
              onChange={(e) => dispatch({ type: "updateItem", level, id: it.id, text: e.target.value })}
              placeholder={lvl.placeholder}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300"
            />
            <button type="button" onClick={() => dispatch({ type: "removeItem", level, id: it.id })} aria-label="Remove" className="p-1.5 rounded-lg text-ink-3 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => dispatch({ type: "addItem", level })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium border border-dashed transition-colors" style={{ color: lvl.color, borderColor: `${lvl.color}66` }}>
            <Plus className="w-3.5 h-3.5" /> Add {lvl.label.toLowerCase()}
          </button>
          {isImpact && (
            <span className="inline-flex flex-wrap gap-1.5">
              {THREE_ZEROS.map((z) => (
                <button key={z} type="button" onClick={() => dispatch({ type: "addItem", level, text: z })} className="text-[11px] px-2 py-1 rounded-full border border-border text-ink-2 hover:border-un-200 hover:bg-un-50 transition-colors" title="Add UNFPA transformative result">
                  + {z}
                </button>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function GapEditor({
  gap,
  toLabel,
  notes,
  dispatch,
}: {
  gap: GapId;
  toLabel: string;
  notes: { id: string; text: string; kind: NoteKind }[];
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div className="relative pl-5 my-1.5">
      <div className="flex items-center gap-2 py-2">
        <ArrowDown className="w-4 h-4 text-ink-3 shrink-0" />
        <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ink-3">
          Link to {toLabel} — what must hold?
        </span>
      </div>
      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "setNoteKind", gap, id: n.id, kind: n.kind === "assumption" ? "risk" : "assumption" })}
              className="shrink-0 inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors"
              style={
                n.kind === "risk"
                  ? { color: "#C81E4E", borderColor: "#C81E4E55", background: "#FFF1F4" }
                  : { color: "#AE4300", borderColor: "#AE430055", background: "#FDF0E6" }
              }
              title="Toggle assumption / risk"
            >
              {n.kind === "risk" ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
              {n.kind === "risk" ? "Risk" : "If"}
            </button>
            <input
              value={n.text}
              onChange={(e) => dispatch({ type: "updateNote", gap, id: n.id, text: e.target.value })}
              placeholder={n.kind === "risk" ? "What could break this link?" : "What must be true for this to lead on?"}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-[13.5px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300"
            />
            <button type="button" onClick={() => dispatch({ type: "removeNote", gap, id: n.id })} aria-label="Remove" className="p-1.5 rounded-lg text-ink-3 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => dispatch({ type: "addNote", gap, kind: "assumption" })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium border border-dashed transition-colors" style={{ color: "#AE4300", borderColor: "#AE430055" }}>
            <Plus className="w-3 h-3" /> Assumption
          </button>
          <button type="button" onClick={() => dispatch({ type: "addNote", gap, kind: "risk" })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium border border-dashed transition-colors" style={{ color: "#C81E4E", borderColor: "#C81E4E55" }}>
            <Plus className="w-3 h-3" /> Risk
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof PencilLine; label: string }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${active ? "bg-un-700 text-white" : "text-ink-2 hover:bg-surface-2"}`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function ExportBtn({ onClick, busy, icon: Icon, label }: { onClick: () => void; busy: boolean; icon: typeof ImageIcon; label: string }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-ink-1 border border-border hover:bg-surface-2 transition-colors disabled:opacity-60">
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
