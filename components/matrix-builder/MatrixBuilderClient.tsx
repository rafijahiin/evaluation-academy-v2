"use client";
import { useEffect, useReducer } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { m, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Copy,
  Printer,
  Download,
  Table2,
  PencilLine,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  CRITERIA,
  criterion,
  COLUMN_HELP,
  EXAMPLE,
  STORAGE_KEY,
  type CriterionId,
  type MatrixData,
  type MatrixRow,
} from "./matrix";

/**
 * Evaluation Matrix Builder — a row-per-question editor for the CPE's
 * central analytical artifact. Persists to localStorage, exports to CSV,
 * and prints to a clean one-page table.
 */

type View = "edit" | "matrix";

type State = {
  data: MatrixData;
  view: View;
  counter: number;
  mounted: boolean;
};

type Action =
  | { type: "init"; data: MatrixData; counter: number }
  | { type: "meta"; patch: Partial<Pick<MatrixData, "programme" | "country">> }
  | { type: "add" }
  | { type: "remove"; id: string }
  | { type: "duplicate"; id: string }
  | { type: "update"; id: string; patch: Partial<MatrixRow> }
  | { type: "view"; view: View }
  | { type: "loadExample" }
  | { type: "reset" };

const EMPTY: MatrixData = { programme: "", country: "", rows: [] };

function makeRow(counter: number, criterionId: CriterionId = "relevance"): MatrixRow {
  return {
    id: `row-${counter}`,
    criterion: criterionId,
    question: "",
    assumptions: "",
    indicators: "",
    sources: "",
    methods: "",
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return { ...state, data: action.data, counter: action.counter, mounted: true };
    case "meta":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "add":
      return {
        ...state,
        counter: state.counter + 1,
        data: { ...state.data, rows: [...state.data.rows, makeRow(state.counter + 1)] },
      };
    case "remove":
      return {
        ...state,
        data: { ...state.data, rows: state.data.rows.filter((r) => r.id !== action.id) },
      };
    case "duplicate": {
      const src = state.data.rows.find((r) => r.id === action.id);
      if (!src) return state;
      const copy = { ...src, id: `row-${state.counter + 1}` };
      const idx = state.data.rows.findIndex((r) => r.id === action.id);
      const rows = [...state.data.rows];
      rows.splice(idx + 1, 0, copy);
      return { ...state, counter: state.counter + 1, data: { ...state.data, rows } };
    }
    case "update":
      return {
        ...state,
        data: {
          ...state.data,
          rows: state.data.rows.map((r) =>
            r.id === action.id ? { ...r, ...action.patch } : r,
          ),
        },
      };
    case "view":
      return { ...state, view: action.view };
    case "loadExample":
      return {
        ...state,
        data: JSON.parse(JSON.stringify(EXAMPLE)),
        counter: EXAMPLE.rows.length + 1,
      };
    case "reset":
      return { ...state, data: { ...EMPTY, rows: [makeRow(1)] }, counter: 1 };
  }
}

export function MatrixBuilderClient() {
  const [state, dispatch] = useReducer(reducer, {
    data: EMPTY,
    view: "edit",
    counter: 0,
    mounted: false,
  });

  // Load
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && Array.isArray(saved.rows) && saved.rows.length) {
        dispatch({
          type: "init",
          data: saved,
          counter: saved.rows.length + 1,
        });
      } else {
        dispatch({ type: "init", data: { ...EMPTY, rows: [makeRow(1)] }, counter: 1 });
      }
    } catch {
      dispatch({ type: "init", data: { ...EMPTY, rows: [makeRow(1)] }, counter: 1 });
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

  function exportCsv() {
    const cols = ["EQ #", "Criterion", "Evaluation question", "Assumptions", "Indicators", "Data sources", "Methods"];
    const esc = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
    const lines = [cols.map(esc).join(",")];
    data.rows.forEach((r, i) => {
      lines.push(
        [
          String(i + 1),
          criterion(r.criterion).label,
          r.question,
          r.assumptions.replace(/\n/g, "; "),
          r.indicators.replace(/\n/g, "; "),
          r.sources.replace(/\n/g, "; "),
          r.methods.replace(/\n/g, "; "),
        ]
          .map(esc)
          .join(","),
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluation-matrix${data.country ? "-" + data.country.toLowerCase().replace(/\s+/g, "-") : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {/* Header */}
      <Reveal>
        <div className="print:hidden">
          <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
            Interactive tool · §2.2.2
          </span>
          <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
            Evaluation{" "}
            <span className="italic" style={{ color: "var(--un-blue-700)" }}>
              matrix
            </span>{" "}
            builder
          </h1>
          <p className="mt-3 text-[16px] text-ink-2 leading-relaxed max-w-2xl">
            Unpack each evaluation question into a DAC criterion, the assumptions
            you’ll assess, indicators, data sources, and methods — the backbone
            of a defensible CPE. Build it here, then print or export to CSV.
          </p>
        </div>
      </Reveal>

      {/* Toolbar */}
      <div className="mt-8 mb-6 flex flex-wrap items-center gap-2 print:hidden">
        <div className="inline-flex rounded-xl border border-border bg-white p-1">
          <ToolbarToggle
            active={view === "edit"}
            onClick={() => dispatch({ type: "view", view: "edit" })}
            icon={PencilLine}
            label="Edit"
          />
          <ToolbarToggle
            active={view === "matrix"}
            onClick={() => dispatch({ type: "view", view: "matrix" })}
            icon={Table2}
            label="Matrix"
          />
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => dispatch({ type: "loadExample" })}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-un-700 border border-un-200 hover:bg-un-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load example
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-ink-1 border border-border hover:bg-surface-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-white transition-all hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
          }}
        >
          <Printer className="w-3.5 h-3.5" />
          Print / PDF
        </button>
      </div>

      {/* Context fields */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
        <input
          value={data.programme}
          onChange={(e) => dispatch({ type: "meta", patch: { programme: e.target.value } })}
          placeholder="Programme title (e.g. Country Programme 2024–2028)"
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300"
        />
        <input
          value={data.country}
          onChange={(e) => dispatch({ type: "meta", patch: { country: e.target.value } })}
          placeholder="Country / context"
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300"
        />
      </div>

      {view === "edit" ? (
        <EditView data={data} dispatch={dispatch} />
      ) : (
        <MatrixView data={data} />
      )}
    </div>
  );
}

function EditView({
  data,
  dispatch,
}: {
  data: MatrixData;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {data.rows.map((row, i) => (
          <m.div
            key={row.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <RowEditor
              row={row}
              index={i}
              onChange={(patch) => dispatch({ type: "update", id: row.id, patch })}
              onRemove={() => dispatch({ type: "remove", id: row.id })}
              onDuplicate={() => dispatch({ type: "duplicate", id: row.id })}
            />
          </m.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => dispatch({ type: "add" })}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-dashed border-border text-ink-2 hover:border-un-200 hover:text-un-700 hover:bg-un-50/40 transition-all text-[14px] font-medium"
      >
        <Plus className="w-4 h-4" />
        Add evaluation question
      </button>

      {data.rows.length > 0 && (
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          className="mx-auto flex items-center gap-1.5 text-[12.5px] text-ink-3 hover:text-rose-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear matrix
        </button>
      )}
    </div>
  );
}

function completeness(row: MatrixRow): number {
  const fields = [row.question, row.assumptions, row.indicators, row.sources, row.methods];
  const filled = fields.filter((f) => f.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

function RowEditor({
  row,
  index,
  onChange,
  onRemove,
  onDuplicate,
}: {
  row: MatrixRow;
  index: number;
  onChange: (patch: Partial<MatrixRow>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const crit = criterion(row.criterion);
  const pct = completeness(row);

  return (
    <div
      className="rounded-2xl border border-border bg-white overflow-hidden"
      style={{ borderLeftWidth: 4, borderLeftColor: crit.color }}
    >
      {/* Row header */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-border bg-surface-2/50">
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
          style={{ background: crit.color }}
        >
          {index + 1}
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3">
          Evaluation question {index + 1}
        </span>
        {/* completeness meter — transparency nod */}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block w-20 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: crit.color }}
            />
          </div>
          <span className="text-[11px] tabular-nums text-ink-3">{pct}%</span>
          <button
            type="button"
            onClick={onDuplicate}
            aria-label="Duplicate"
            className="p-1.5 rounded-lg text-ink-3 hover:text-ink-1 hover:bg-surface-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="p-1.5 rounded-lg text-ink-3 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Criterion selector */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.12em] font-semibold text-ink-3 mb-2">
            DAC criterion
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CRITERIA.map((c) => {
              const active = c.id === row.criterion;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ criterion: c.id })}
                  className="px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all"
                  style={
                    active
                      ? { background: c.color, color: "white", borderColor: "transparent" }
                      : {
                          background: "white",
                          color: "var(--ink-2)",
                          borderColor: "var(--border)",
                        }
                  }
                >
                  {c.label}
                  {c.humanitarian && !active && (
                    <span className="ml-1 text-[9px] text-ink-4">+H</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.12em] font-semibold text-ink-3 mb-1.5">
            Evaluation question
          </label>
          <textarea
            value={row.question}
            onChange={(e) => onChange({ question: e.target.value })}
            rows={2}
            placeholder="To what extent did…"
            className="w-full resize-y rounded-xl border border-border bg-white px-3.5 py-2.5 text-[14.5px] leading-[1.5] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300"
          />
        </div>

        {/* Four list columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(["assumptions", "indicators", "sources", "methods"] as const).map((field) => {
            const help = COLUMN_HELP[field];
            return (
              <div key={field}>
                <label className="block text-[11px] uppercase tracking-[0.12em] font-semibold text-ink-3 mb-1">
                  {help.label}
                </label>
                <p className="text-[11.5px] text-ink-4 mb-1.5 leading-snug">{help.hint}</p>
                <textarea
                  value={row[field]}
                  onChange={(e) => onChange({ [field]: e.target.value } as Partial<MatrixRow>)}
                  rows={3}
                  placeholder={help.placeholder}
                  className="w-full resize-y rounded-xl border border-border bg-white px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300"
                />
                <p className="mt-1 text-[10.5px] text-ink-4">One per line</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MatrixView({ data }: { data: MatrixData }) {
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
  return (
    <div>
      {/* print header */}
      <div className="mb-4">
        <h2 className="font-display text-[24px] text-ink-1">
          Evaluation matrix
          {data.country ? ` · ${data.country}` : ""}
        </h2>
        {data.programme && (
          <p className="text-[13px] text-ink-3">{data.programme}</p>
        )}
      </div>

      {data.rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-3">
          No questions yet — switch to Edit and add one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="bg-surface-2 text-left">
                <Th className="w-8">#</Th>
                <Th>Criterion</Th>
                <Th className="min-w-[220px]">Evaluation question</Th>
                <Th>Assumptions</Th>
                <Th>Indicators</Th>
                <Th>Sources</Th>
                <Th>Methods</Th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, i) => {
                const crit = criterion(r.criterion);
                return (
                  <tr key={r.id} className="border-t border-border align-top">
                    <Td className="font-semibold text-ink-3">{i + 1}</Td>
                    <Td>
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold text-white whitespace-nowrap"
                        style={{ background: crit.color }}
                      >
                        {crit.label}
                      </span>
                    </Td>
                    <Td className="text-ink-1 font-medium">{r.question || "—"}</Td>
                    <Td><Cell items={lines(r.assumptions)} /></Td>
                    <Td><Cell items={lines(r.indicators)} /></Td>
                    <Td><Cell items={lines(r.sources)} /></Td>
                    <Td><Cell items={lines(r.methods)} /></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2.5 text-[10.5px] uppercase tracking-[0.1em] font-semibold text-ink-3 ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 text-ink-2 ${className}`}>{children}</td>;
}
function Cell({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-ink-4">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-1.5">
          <span className="text-ink-4">·</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function ToolbarToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Table2;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
        active ? "bg-un-700 text-white" : "text-ink-2 hover:bg-surface-2"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
