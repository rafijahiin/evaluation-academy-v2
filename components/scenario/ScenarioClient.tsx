"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import {
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  RotateCcw,
  Trophy,
  MapPin,
  BookOpen,
} from "lucide-react";
import {
  SCENARIO,
  SCORE,
  MAX_SCORE,
  ratingFor,
  type Verdict,
  type Choice,
} from "@/content/scenarios";
import { useXp } from "@/lib/progress";

/**
 * "Run a CPE" — decision-point simulation. The player advances through a
 * fixed sequence of decisions; each choice is graded against the handbook
 * and contributes to a final quality score.
 */

type Decision = { nodeId: string; choiceIndex: number; verdict: Verdict };

type VerdictMeta = {
  label: string;
  color: string;
  bg: string;
  Icon: typeof Check;
};

const VERDICT_META: Record<Verdict, VerdictMeta> = {
  good: { label: "Strong call", color: "#047857", bg: "#ECFDF5", Icon: Check },
  risky: { label: "Risky", color: "#AE4300", bg: "#FFFBEB", Icon: AlertTriangle },
  wrong: { label: "Misstep", color: "#BE123C", bg: "#FFF1F2", Icon: X },
};

export function ScenarioClient() {
  const { addXp } = useXp();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [history, setHistory] = useState<Decision[]>([]);
  const awarded = useRef(false);

  const nodes = SCENARIO.nodes;
  const node = nodes[index];
  const finished = started && index >= nodes.length;

  const score = useMemo(
    () => history.reduce((s, r) => s + SCORE[r.verdict], 0),
    [history],
  );

  function choose(choiceIndex: number) {
    if (picked !== null) return;
    setPicked(choiceIndex);
    const choice = node.choices[choiceIndex];
    setHistory((h) => [
      ...h,
      { nodeId: node.id, choiceIndex, verdict: choice.verdict },
    ]);
  }

  function next() {
    setPicked(null);
    setIndex((i) => i + 1);
  }

  function restart() {
    setStarted(false);
    setIndex(0);
    setPicked(null);
    setHistory([]);
  }

  // Award XP once when the simulation completes.
  if (finished && !awarded.current) {
    awarded.current = true;
    addXp(15, "scenario");
  }

  // ---- Intro ----
  if (!started) {
    return (
      <Shell>
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Simulation
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          Run a{" "}
          <span className="italic" style={{ color: "var(--un-blue-700)" }}>
            CPE
          </span>
        </h1>
        <div className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
          <MapPin className="w-3.5 h-3.5 text-un-700" />
          {SCENARIO.country} · {nodes.length} decisions
        </div>
        <p className="mt-5 text-[16px] leading-[1.65] text-ink-1 max-w-2xl">
          {SCENARIO.intro}
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-medium text-[15px] hover:-translate-y-0.5 transition-all"
          style={{
            background:
              "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
          }}
        >
          Begin the evaluation
          <ArrowRight className="w-4 h-4" />
        </button>
      </Shell>
    );
  }

  // ---- Summary ----
  if (finished) {
    const rating = ratingFor(score);
    return (
      <Shell>
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-border p-7 sm:p-9"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-un-50 text-un-700">
              <Trophy className="w-6 h-6" />
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
                CPE complete
              </div>
              <h2 className="font-display text-[26px] leading-tight text-ink-1">
                {rating.title}
              </h2>
            </div>
            <div className="ml-auto text-right">
              <div className="font-numeric font-semibold text-[34px] leading-none text-ink-1 tabular-nums">
                {score}
                <span className="text-ink-4 text-[20px]">/{MAX_SCORE}</span>
              </div>
              <div className="text-[11px] text-ink-3 mt-1">+15 XP</div>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-[1.6] text-ink-2">{rating.blurb}</p>

          {/* decision review */}
          <div className="mt-6 space-y-2.5">
            {history.map((r, i) => {
              const n = nodes[i];
              const c = n.choices[r.choiceIndex];
              const meta = VERDICT_META[r.verdict];
              const Icon = meta.Icon;
              return (
                <div
                  key={n.id}
                  className="flex items-start gap-3 rounded-xl border border-border p-3"
                >
                  <span
                    className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.6} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ink-3">
                      {n.phase} · {n.title}
                    </div>
                    <div className="text-[13.5px] text-ink-1">{c.label}</div>
                  </div>
                  <span
                    className="ml-auto shrink-0 text-[10.5px] uppercase tracking-[0.1em] font-bold"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-[14px]"
              style={{
                background:
                  "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Run it again
            </button>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-ink-2 font-medium text-[14px] hover:text-ink-1"
            >
              Back to lessons
            </Link>
          </div>
        </m.div>
      </Shell>
    );
  }

  // ---- A decision node ----
  const pickedChoice: Choice | null = picked !== null ? node.choices[picked] : null;
  const pickedMeta = pickedChoice ? VERDICT_META[pickedChoice.verdict] : null;

  return (
    <Shell>
      {/* progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
          <m.div
            className="h-full rounded-full bg-un-700"
            initial={false}
            animate={{ width: `${(index / nodes.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[11.5px] font-numeric font-semibold text-ink-3 tabular-nums">
          {index + 1} / {nodes.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={node.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
            {node.phase}
          </div>
          <h2 className="font-display mt-1.5 text-[24px] sm:text-[28px] leading-tight tracking-[-0.01em] text-ink-1">
            {node.title}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.65] text-ink-1">
            {node.situation}
          </p>

          {/* choices */}
          <div className="mt-6 space-y-3">
            {node.choices.map((c, i) => {
              const isPicked = picked === i;
              const dim = picked !== null && !isPicked;
              const meta = VERDICT_META[c.verdict];
              return (
                <button
                  key={i}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => choose(i)}
                  className="w-full text-left rounded-2xl border p-4 transition-all disabled:cursor-default"
                  style={{
                    borderColor: isPicked ? meta.color : "var(--border)",
                    background: isPicked ? meta.bg : "white",
                    opacity: dim ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold border"
                      style={{
                        borderColor: isPicked ? meta.color : "var(--border)",
                        color: isPicked ? meta.color : "var(--ink-3)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-[14.5px] leading-[1.5] text-ink-1">
                      {c.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* outcome */}
          <AnimatePresence>
            {pickedChoice && pickedMeta && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border p-5"
                style={{ borderColor: pickedMeta.color, background: pickedMeta.bg }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <pickedMeta.Icon
                    className="w-4 h-4"
                    style={{ color: pickedMeta.color }}
                    strokeWidth={2.6}
                  />
                  <span
                    className="text-[11px] uppercase tracking-[0.12em] font-bold"
                    style={{ color: pickedMeta.color }}
                  >
                    {pickedMeta.label} · +{SCORE[pickedChoice.verdict]}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-ink-3">
                    <BookOpen className="w-3 h-3" />
                    {pickedChoice.ref}
                  </span>
                </div>
                <p className="text-[14px] leading-[1.6] text-ink-1">
                  {pickedChoice.feedback}
                </p>
                <button
                  type="button"
                  onClick={next}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13.5px] font-medium hover:-translate-y-0.5 transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
                  }}
                >
                  {index + 1 >= nodes.length ? "See your result" : "Continue"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </AnimatePresence>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {children}
    </div>
  );
}
