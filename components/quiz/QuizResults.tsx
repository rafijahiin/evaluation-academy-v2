"use client";
import Link from "next/link";
import { m } from "motion/react";
import { Check, X, RotateCcw, Award, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Seal } from "./Seal";
import { CountUp } from "@/components/motion/CountUp";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { Question } from "@/content/quizzes";

type AnswerRecord = {
  question: Question;
  // For mcq/scenario: the selected option index
  // For arrange: the user's ordered indices into question.items
  userAnswer: number | number[] | null;
  correct: boolean;
  awardedWeight: number;
};

type Props = {
  title: string;
  results: AnswerRecord[];
  scoreFraction: number; // 0..1
  passThreshold: number; // 0..1
  /** Where to send the learner after passing */
  passActionHref?: string;
  passActionLabel?: string;
  /** Persistence target */
  mode: "exam" | "chapter";
  chapter?: string;
  /** Reset handler */
  onRetake: () => void;
};

export function QuizResults({
  title,
  results,
  scoreFraction,
  passThreshold,
  passActionHref,
  passActionLabel,
  mode,
  chapter,
  onRetake,
}: Props) {
  const { setExamScore, setChapterQuizScore } = useProgress();
  const passed = scoreFraction >= passThreshold;
  const scorePercent = Math.round(scoreFraction * 100);
  const passPercent = Math.round(passThreshold * 100);
  const correctCount = results.filter((r) => r.correct).length;

  // Persist the score on mount
  useEffect(() => {
    if (mode === "exam") setExamScore(scoreFraction);
    else if (mode === "chapter" && chapter) setChapterQuizScore(chapter, scoreFraction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, chapter, scoreFraction]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top — score reveal */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative rounded-3xl border p-8 sm:p-10 text-center overflow-hidden",
          passed
            ? "bg-emerald-50 border-emerald-200"
            : "bg-amber-50 border-amber-200",
        )}
      >
        {/* Decorative seal on pass */}
        {passed && (
          <div className="absolute -top-4 -right-4 sm:-right-2 opacity-90">
            <Seal size={120} label="Passed" delay={0.4} />
          </div>
        )}

        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-3">
          {title} · Result
        </div>
        <div className="mt-4 font-display text-[clamp(56px,12vw,96px)] leading-none tracking-tight">
          <span
            className={cn(
              "font-numeric font-semibold",
              passed ? "text-emerald-700" : "text-amber-700",
            )}
          >
            <CountUp to={scorePercent} duration={1.4} suffix="%" />
          </span>
        </div>
        <div className="mt-2 text-[15px] text-ink-2">
          {correctCount} of {results.length} correct ·{" "}
          {passed ? (
            <span className="font-semibold text-emerald-700">
              Passed (≥ {passPercent}%)
            </span>
          ) : (
            <span className="font-semibold text-amber-700">
              Not yet ({passPercent}% needed)
            </span>
          )}
        </div>

        <h2 className="font-display mt-6 text-[28px] sm:text-[36px] leading-[1.05] tracking-[-0.02em] text-ink-1">
          {passed ? (
            <>
              Well done.{" "}
              <span className="italic" style={{ color: "var(--un-blue-700)" }}>
                The craft holds.
              </span>
            </>
          ) : (
            <>
              Close.{" "}
              <span className="italic" style={{ color: "var(--amber)" }}>
                Try again.
              </span>
            </>
          )}
        </h2>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {passed && passActionHref ? (
            <Link
              href={passActionHref}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-[14px] shadow-card hover:shadow-bloom hover:-translate-y-0.5 transition-all"
              style={{
                background:
                  "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
              }}
            >
              <Award className="w-4 h-4" />
              {passActionLabel ?? "Continue"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-ink-1 font-medium text-[14px] bg-white border border-border hover:border-un-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </button>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-ink-2 font-medium text-[14px] hover:text-ink-1 transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </m.div>

      {/* Question-by-question review */}
      <div className="mt-10">
        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-4">
          Review
        </div>
        <ol className="space-y-3">
          {results.map((r, i) => (
            <m.li
              key={r.question.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.05 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "rounded-2xl border px-4 sm:px-5 py-4",
                r.correct
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-rose-50/40 border-rose-200",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white",
                    r.correct ? "bg-emerald-500" : "bg-rose-500",
                  )}
                >
                  {r.correct ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : (
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-3 font-semibold mb-1">
                    Question {i + 1} · {labelForType(r.question.type)}
                  </div>
                  <p className="text-[14px] font-medium text-ink-1 leading-[1.5]">
                    {r.question.question}
                  </p>
                  {r.question.type !== "arrange" && r.question.options && (
                    <div className="mt-3 space-y-1">
                      {r.question.options.map((opt, oi) => {
                        const isAnswer = oi === r.question.correct;
                        const isPicked = oi === r.userAnswer;
                        if (!isAnswer && !isPicked) return null;
                        return (
                          <div
                            key={oi}
                            className={cn(
                              "text-[13px] px-3 py-1.5 rounded-lg border",
                              isAnswer &&
                                "bg-emerald-100 border-emerald-300 text-emerald-900",
                              isPicked &&
                                !isAnswer &&
                                "bg-rose-100 border-rose-300 text-rose-900",
                            )}
                          >
                            <span className="font-semibold mr-2">
                              {isAnswer ? "Correct answer:" : "You picked:"}
                            </span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </m.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function labelForType(t: Question["type"]) {
  if (t === "scenario") return "Scenario";
  if (t === "arrange") return "Arrange in order";
  return "Multiple choice";
}
