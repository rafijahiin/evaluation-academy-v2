"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import {
  Layers,
  RotateCcw,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import { FLASHCARDS, type Flashcard } from "@/content/flashcards";
import { CHAPTERS } from "@/content/chapters";
import { useSrs, cardId, isDue, type CardState } from "@/lib/srs";
import { useXp } from "@/lib/progress";

/**
 * Flashcards & spaced repetition. Cards are auto-built from every lesson's
 * Key terms. A review session draws all DUE cards (plus new ones) for the
 * selected scope, flips term → definition, and grades with Again / Good.
 */

type Scope = "all" | string;

export function ReviewClient() {
  const { map, grade, resetAll, maxBox } = useSrs();
  const { addXp } = useXp();
  const [scope, setScope] = useState<Scope>("all");
  const [session, setSession] = useState<Flashcard[] | null>(null);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState({ good: 0, again: 0 });

  const now = Date.now();

  const scoped = useMemo(
    () =>
      scope === "all"
        ? FLASHCARDS
        : FLASHCARDS.filter((c) => c.chapter === scope),
    [scope],
  );

  const stats = useMemo(() => {
    let due = 0;
    let learned = 0;
    let neu = 0;
    for (const c of scoped) {
      const st = map[cardId(c.chapter, c.lessonSlug, c.term)];
      if (!st) {
        neu++;
        due++;
      } else {
        if (isDue(st, now)) due++;
        if (st.box >= maxBox - 1) learned++;
      }
    }
    return { total: scoped.length, due, learned, neu };
  }, [scoped, map, now, maxBox]);

  function startSession() {
    const dueCards = scoped.filter((c) =>
      isDue(map[cardId(c.chapter, c.lessonSlug, c.term)], now),
    );
    // light shuffle by rotating from a pseudo-random offset (index-based)
    const deck = dueCards.length ? dueCards : scoped.slice();
    const shuffled = shuffle(deck).slice(0, 30);
    setSession(shuffled);
    setPos(0);
    setRevealed(false);
    setTally({ good: 0, again: 0 });
  }

  function rate(correct: boolean) {
    const card = session![pos];
    grade(cardId(card.chapter, card.lessonSlug, card.term), correct);
    setTally((t) => ({
      good: t.good + (correct ? 1 : 0),
      again: t.again + (correct ? 0 : 1),
    }));
    if (correct) addXp(2, "flashcard");
    const nextPos = pos + 1;
    if (nextPos >= session!.length) {
      setPos(nextPos); // triggers summary
    } else {
      setPos(nextPos);
      setRevealed(false);
    }
  }

  const inSession = session !== null && pos < session.length;
  const sessionDone = session !== null && pos >= session.length;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {/* Header */}
      <div className="mb-7">
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Spaced repetition
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          Flashcards
        </h1>
        <p className="mt-3 text-[15px] text-ink-2 max-w-xl leading-relaxed">
          Every key term from the course, scheduled so you review each one right
          before you’d forget it. {FLASHCARDS.length} cards in total.
        </p>
      </div>

      {!inSession && !sessionDone && (
        <>
          {/* scope selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            <ScopeChip label="All phases" active={scope === "all"} onClick={() => setScope("all")} />
            {CHAPTERS.map((c) => (
              <ScopeChip
                key={c.slug}
                label={c.title}
                active={scope === c.slug}
                onClick={() => setScope(c.slug)}
              />
            ))}
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatBox label="Due now" value={stats.due} accent="var(--un-blue)" />
            <StatBox label="New" value={stats.neu} accent="var(--teal)" />
            <StatBox label="Learned" value={stats.learned} accent="var(--amber)" />
          </div>

          <button
            type="button"
            onClick={startSession}
            disabled={stats.total === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-medium text-[15px] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            <Layers className="w-4 h-4" />
            {stats.due > 0
              ? `Review ${Math.min(stats.due, 30)} card${stats.due === 1 ? "" : "s"}`
              : "Review all cards"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {Object.keys(map).length > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="mt-4 mx-auto flex items-center gap-1.5 text-[12.5px] text-ink-3 hover:text-ink-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all review progress
            </button>
          )}
        </>
      )}

      {/* Session */}
      {inSession && session && (
        <Session
          card={session[pos]}
          pos={pos}
          total={session.length}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onRate={rate}
          state={map[cardId(session[pos].chapter, session[pos].lessonSlug, session[pos].term)]}
        />
      )}

      {/* Summary */}
      {sessionDone && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-border p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-display text-[28px] text-ink-1">Session complete</h2>
          <p className="mt-2 text-[14px] text-ink-2">
            {tally.good} recalled · {tally.again} to revisit · +{tally.good * 2} XP
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSession(null);
                setPos(0);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-[14px]"
              style={{
                background:
                  "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
              }}
            >
              Back to decks
            </button>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-ink-2 font-medium text-[14px] hover:text-ink-1"
            >
              Dashboard
            </Link>
          </div>
        </m.div>
      )}
    </div>
  );
}

function Session({
  card,
  pos,
  total,
  revealed,
  onReveal,
  onRate,
  state,
}: {
  card: Flashcard;
  pos: number;
  total: number;
  revealed: boolean;
  onReveal: () => void;
  onRate: (correct: boolean) => void;
  state: CardState | undefined;
}) {
  const chapter = CHAPTERS.find((c) => c.slug === card.chapter);
  return (
    <div>
      {/* progress */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
          <m.div
            className="h-full rounded-full bg-un-700"
            initial={false}
            animate={{ width: `${(pos / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[11.5px] font-numeric font-semibold text-ink-3 tabular-nums">
          {pos + 1} / {total}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={`${card.chapter}-${card.lessonSlug}-${card.term}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-white border border-border shadow-card overflow-hidden"
        >
          <div className="px-6 pt-5 flex items-center justify-between">
            <span className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-un-700">
              {chapter ? chapter.title : card.chapter}
            </span>
            {state && (
              <span className="text-[10.5px] text-ink-4">Box {state.box}</span>
            )}
          </div>

          {/* term */}
          <div className="px-6 py-10 text-center">
            <div className="font-display text-[26px] sm:text-[32px] leading-tight tracking-[-0.01em] text-ink-1">
              {card.term}
            </div>

            {!revealed ? (
              <button
                type="button"
                onClick={onReveal}
                className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[14px] font-medium text-un-700 border border-un-200 hover:bg-un-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Reveal definition
              </button>
            ) : (
              <m.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-[15.5px] leading-[1.6] text-ink-1 max-w-lg mx-auto"
              >
                {card.definition}
              </m.p>
            )}
          </div>

          {/* source link */}
          <div className="px-6 pb-4 text-center">
            <Link
              href={`/learn/${card.chapter}/${card.lessonSlug}`}
              className="text-[12px] text-ink-3 hover:text-un-700 transition-colors"
            >
              from “{card.lessonTitle}”
            </Link>
          </div>

          {/* grading */}
          {revealed && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 border-t border-border"
            >
              <button
                type="button"
                onClick={() => onRate(false)}
                className="flex items-center justify-center gap-2 py-4 text-[14px] font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Again
              </button>
              <button
                type="button"
                onClick={() => onRate(true)}
                className="flex items-center justify-center gap-2 py-4 text-[14px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors border-l border-border"
              >
                <Check className="w-4 h-4" />
                Good
              </button>
            </m.div>
          )}
        </m.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-[12px] text-ink-4">
        Rate honestly — “Again” reshuffles the card sooner, “Good” pushes it further out.
      </p>
    </div>
  );
}

function ScopeChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
        active
          ? "bg-un-700 text-white border-transparent"
          : "bg-white text-ink-2 border-border hover:border-un-200"
      }`}
    >
      {label}
    </button>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-border px-4 py-4 text-center">
      <div
        className="font-numeric font-semibold text-[28px] leading-none tabular-nums"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-ink-3 font-medium">
        {label}
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
