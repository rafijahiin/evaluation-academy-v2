"use client";
import { useEffect, useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLessonContext } from "@/components/lesson/LessonContext";
import { useProgress } from "@/lib/progress";

type Choice = { id: string; label: string };

/**
 * Inline quiz block at the end of a lesson.
 *
 * Reads the lesson context (chapter + slug). When the user picks the correct
 * answer, the lesson is marked complete in localStorage. Without lesson
 * context (e.g. if used outside a lesson) it just behaves as a stand-alone Q.
 */
export function QuizQuestion({
  question,
  choices,
  answer,
  explanation,
}: {
  question: string;
  choices: Choice[];
  answer: string;
  explanation?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === answer;
  const lesson = useLessonContext();
  const { markComplete } = useProgress();

  // When the user selects the correct answer inside a lesson, mark complete.
  useEffect(() => {
    if (revealed && isCorrect && lesson) {
      markComplete(`${lesson.chapter}/${lesson.slug}`, lesson.chapter);
    }
  }, [revealed, isCorrect, lesson, markComplete]);

  return (
    <section className="my-8 rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-un-700">
          Check your understanding
        </span>
        {lesson && !revealed && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-ink-3 font-medium">
            <Sparkles className="w-3 h-3" />
            Answer correctly to complete this lesson
          </span>
        )}
      </div>
      <p className="text-[15.5px] font-medium text-ink-1 leading-relaxed mb-4">
        {question}
      </p>
      <div className="space-y-2">
        {choices.map((c) => {
          const isPicked = selected === c.id;
          const isAnswer = c.id === answer;
          const showState = revealed && (isPicked || isAnswer);
          return (
            <button
              key={c.id}
              type="button"
              disabled={revealed}
              onClick={() => {
                setSelected(c.id);
                setRevealed(true);
              }}
              className={cn(
                "w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors",
                !revealed && "hover:bg-surface-2 hover:border-un-200 cursor-pointer",
                showState && isAnswer && "bg-emerald-50 border-emerald-300",
                showState && isPicked && !isAnswer && "bg-rose-50 border-rose-300",
                revealed && !showState && "opacity-50 border-border",
                !revealed && "border-border",
              )}
            >
              <span
                className={cn(
                  "shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold",
                  !revealed && "bg-surface-2 text-ink-2",
                  showState && isAnswer && "bg-emerald-500 text-white",
                  showState && isPicked && !isAnswer && "bg-rose-500 text-white",
                  revealed && !showState && "bg-surface-2 text-ink-3",
                )}
              >
                {showState && isAnswer ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : showState && isPicked && !isAnswer ? (
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  c.id.toUpperCase()
                )}
              </span>
              <span className="text-[14px] leading-[1.55] text-ink-1 flex-1">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
      {revealed && (
        <div
          className={cn(
            "mt-4 rounded-xl px-4 py-3 text-[13.5px] leading-[1.55]",
            isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900",
          )}
        >
          <strong>{isCorrect ? "Correct." : "Not quite."}</strong>
          {explanation && <> {explanation}</>}
          {lesson && isCorrect && (
            <span className="block mt-1 text-[12px] font-medium opacity-90">
              ✓ Lesson marked complete.
            </span>
          )}
          {!isCorrect && (
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setRevealed(false);
              }}
              className="block mt-2 text-[12.5px] font-semibold underline underline-offset-2 hover:opacity-80"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </section>
  );
}
