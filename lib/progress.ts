/**
 * Progress tracking — localStorage-backed.
 *
 * Two distinct concepts:
 *   - **viewed**: the user opened the lesson (drives "Resume" only)
 *   - **completed**: the user answered the inline QuizQuestion correctly
 *     (drives the progress ring + Lesson complete pill)
 */
"use client";
import { useEffect, useState, useCallback } from "react";

const KEY = "evalAcademy.v3";

export type ProgressState = {
  /** Lessons completed — by passing the inline QuizQuestion. */
  lessonsCompleted: string[];
  /** Final exam score 0..1 */
  examScore?: number;
  /** Per-chapter quiz score 0..1 */
  chapterQuizScores?: Record<string, number>;
  /** For the "Resume" CTA — last lesson viewed (NOT necessarily completed) */
  lastChapterSlug?: string;
  lastLessonSlug?: string;
  /** Learner name for the certificate */
  learnerName?: string;
  updatedAt?: number;
};

const DEFAULT: ProgressState = { lessonsCompleted: [] };

function read(): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.lessonsCompleted)) return parsed;
    return DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...state, updatedAt: Date.now() }),
    );
    window.dispatchEvent(new CustomEvent("eval-academy-progress"));
  } catch {
    /* ignore quota errors */
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(DEFAULT);

  useEffect(() => {
    setState(read());
    const onChange = () => setState(read());
    window.addEventListener("eval-academy-progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("eval-academy-progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  /** Mark a lesson as VIEWED (for "Resume" tracking). Does NOT add to lessonsCompleted. */
  const markViewed = useCallback(
    (lessonSlug: string, chapterSlug: string) => {
      const current = read();
      current.lastLessonSlug = lessonSlug;
      current.lastChapterSlug = chapterSlug;
      write(current);
    },
    [],
  );

  /** Mark a lesson as COMPLETED — happens only when the inline QuizQuestion is answered correctly. */
  const markComplete = useCallback(
    (lessonKey: string, chapterSlug?: string) => {
      const current = read();
      if (!current.lessonsCompleted.includes(lessonKey)) {
        current.lessonsCompleted = [...current.lessonsCompleted, lessonKey];
      }
      current.lastLessonSlug = lessonKey.split("/")[1] ?? current.lastLessonSlug;
      if (chapterSlug) current.lastChapterSlug = chapterSlug;
      write(current);
    },
    [],
  );

  const setExamScore = useCallback((score: number) => {
    const current = read();
    current.examScore = score;
    write(current);
  }, []);

  const setChapterQuizScore = useCallback(
    (chapter: string, score: number) => {
      const current = read();
      current.chapterQuizScores = {
        ...(current.chapterQuizScores ?? {}),
        [chapter]: score,
      };
      write(current);
    },
    [],
  );

  const setLearnerName = useCallback((name: string) => {
    const current = read();
    current.learnerName = name;
    write(current);
  }, []);

  const reset = useCallback(() => {
    write(DEFAULT);
  }, []);

  return {
    state,
    markViewed,
    markComplete,
    setExamScore,
    setChapterQuizScore,
    setLearnerName,
    reset,
  };
}

export function computePercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
