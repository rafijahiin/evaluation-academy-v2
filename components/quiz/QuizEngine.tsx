"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { MCQCard } from "./MCQCard";
import { ScenarioCard } from "./ScenarioCard";
import { ArrangeCard } from "./ArrangeCard";
import { QuizResults } from "./QuizResults";
import { cn } from "@/lib/utils";
import type { Question } from "@/content/quizzes";
import { shuffleQuiz } from "@/lib/shuffle";

type AnswerRecord = {
  question: Question;
  userAnswer: number | number[] | null;
  correct: boolean;
  awardedWeight: number;
};

type Props = {
  title: string;
  subtitle?: string;
  questions: Question[];
  passThreshold: number;
  mode: "exam" | "chapter";
  chapter?: string;
  passActionHref?: string;
  passActionLabel?: string;
};

export function QuizEngine({
  title,
  subtitle,
  questions: incomingQuestions,
  passThreshold,
  mode,
  chapter,
  passActionHref,
  passActionLabel,
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[] | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [version, setVersion] = useState(0); // forces remount + reshuffle on retake

  // Shuffle question order AND option order on mount and on every retake.
  // Done in an effect (post-hydration) so SSR markup matches the initial
  // unshuffled render — then the client swaps to a shuffled set on mount,
  // and the user only ever sees the shuffled state.
  const [questions, setQuestions] = useState<Question[]>(incomingQuestions);
  useEffect(() => {
    setQuestions(shuffleQuiz(incomingQuestions));
    // version is the retake counter; we re-shuffle when it bumps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, incomingQuestions]);

  const total = questions.length;
  const current = questions[index];

  const isAnswered = (q: Question) => {
    const a = answers[q.id];
    if (a == null) return false;
    if (q.type === "arrange") {
      return Array.isArray(a) && a.length === (q.items?.length ?? 0);
    }
    return typeof a === "number";
  };

  const allAnswered = questions.every(isAnswered);

  const setAnswer = (q: Question, value: number | number[]) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const results = useMemo<AnswerRecord[]>(() => {
    return questions.map((q) => {
      const userAnswer = answers[q.id] ?? null;
      let correct = false;
      if (q.type === "arrange" && Array.isArray(userAnswer) && q.items) {
        // Correct ordering is items sorted by their `level` field.
        const correctOrder = q.items
          .map((item, i) => ({ item, i }))
          .sort((a, b) => a.item.level - b.item.level)
          .map((x) => x.i);
        correct =
          userAnswer.length === correctOrder.length &&
          userAnswer.every((v, i) => v === correctOrder[i]);
      } else if (typeof userAnswer === "number" && typeof q.correct === "number") {
        correct = userAnswer === q.correct;
      }
      return {
        question: q,
        userAnswer,
        correct,
        awardedWeight: correct ? q.weight : 0,
      };
    });
  }, [questions, answers]);

  const totalWeight = useMemo(
    () => questions.reduce((s, q) => s + q.weight, 0),
    [questions],
  );
  const awarded = results.reduce((s, r) => s + r.awardedWeight, 0);
  const scoreFraction = totalWeight > 0 ? awarded / totalWeight : 0;

  // ---- results view ----
  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
        <QuizResults
          title={title}
          results={results}
          scoreFraction={scoreFraction}
          passThreshold={passThreshold}
          passActionHref={passActionHref}
          passActionLabel={passActionLabel}
          mode={mode}
          chapter={chapter}
          onRetake={() => {
            setAnswers({});
            setIndex(0);
            setSubmitted(false);
            setVersion((v) => v + 1);
          }}
        />
      </div>
    );
  }

  // ---- quiz flow ----
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {/* Header */}
      <div className="mb-7">
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          {mode === "exam" ? "Final exam" : "Chapter quiz"}
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[15px] text-ink-2 max-w-xl">{subtitle}</p>
        )}

        {/* Progress dots */}
        <div className="mt-6 flex items-center gap-1.5">
          {questions.map((q, i) => {
            const answered = isAnswered(q);
            const isCurrent = i === index;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to question ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  isCurrent ? "w-8 bg-un-700" : answered ? "w-3 bg-emerald-500" : "w-3 bg-border-strong",
                )}
              />
            );
          })}
          <span className="ml-3 text-[11.5px] font-numeric font-semibold text-ink-2">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Card stack */}
      <div key={version} className="relative min-h-[420px]">
        <AnimatePresence mode="wait">
          {current.type === "scenario" ? (
            <ScenarioCard
              key={current.id}
              scenarioTitle={current.scenarioTitle}
              scenarioBody={current.scenarioBody}
              question={current.question}
              options={current.options ?? []}
              selected={
                typeof answers[current.id] === "number"
                  ? (answers[current.id] as number)
                  : null
              }
              onSelect={(i) => setAnswer(current, i)}
              questionNumber={index + 1}
              totalQuestions={total}
            />
          ) : current.type === "arrange" ? (
            <ArrangeCard
              key={current.id}
              scenarioTitle={current.scenarioTitle}
              scenarioBody={current.scenarioBody}
              question={current.question}
              items={current.items ?? []}
              order={
                Array.isArray(answers[current.id])
                  ? (answers[current.id] as number[])
                  : []
              }
              onChange={(next) => setAnswer(current, next)}
              questionNumber={index + 1}
              totalQuestions={total}
            />
          ) : (
            <MCQCard
              key={current.id}
              question={current.question}
              options={current.options ?? []}
              selected={
                typeof answers[current.id] === "number"
                  ? (answers[current.id] as number)
                  : null
              }
              onSelect={(i) => setAnswer(current, i)}
              questionNumber={index + 1}
              totalQuestions={total}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[13.5px] font-medium transition-colors",
            index === 0
              ? "border-border text-ink-4 cursor-not-allowed"
              : "border-border text-ink-1 hover:border-un-200 hover:bg-surface-2",
          )}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        {index < total - 1 ? (
          <button
            type="button"
            onClick={() => setIndex(Math.min(total - 1, index + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13.5px] font-medium hover:shadow-bloom hover:-translate-y-0.5 transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13.5px] font-medium transition-all",
              allAnswered
                ? "text-white hover:shadow-bloom hover:-translate-y-0.5"
                : "bg-surface-2 text-ink-3 cursor-not-allowed border border-border",
            )}
            style={
              allAnswered
                ? {
                    background:
                      "linear-gradient(135deg, var(--amber) 0%, #AE4300 100%)",
                  }
                : undefined
            }
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        )}
      </div>

      {!allAnswered && index === total - 1 && (
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-[12px] text-amber-700 text-center"
        >
          Answer every question before submitting — tap the dots above to jump to any unanswered question.
        </m.p>
      )}
    </div>
  );
}
