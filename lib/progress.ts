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

export type Streak = {
  current: number;
  longest: number;
  lastActive: string; // YYYY-MM-DD
};

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
  /** Gamification */
  xp?: number;
  /** Keys of one-time XP awards already granted (idempotency). */
  xpAwards?: string[];
  /** Daily study streak. */
  streak?: Streak;
  /** Per-lesson notes — lessonKey ("chapter/slug") → text. */
  notes?: Record<string, string>;
  updatedAt?: number;
};

const DEFAULT: ProgressState = { lessonsCompleted: [] };

/** Local YYYY-MM-DD for streak bookkeeping. */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / (24 * 60 * 60 * 1000));
}

/** Update the streak in-place based on today's activity. */
function bumpStreak(state: ProgressState): void {
  const t = today();
  const s = state.streak;
  if (!s) {
    state.streak = { current: 1, longest: 1, lastActive: t };
    return;
  }
  if (s.lastActive === t) return; // already counted today
  const gap = daysBetween(s.lastActive, t);
  const current = gap === 1 ? s.current + 1 : 1;
  state.streak = {
    current,
    longest: Math.max(s.longest, current),
    lastActive: t,
  };
}

/** Grant a one-time XP award keyed by `key` (no double-counting on retakes). */
function awardOnce(state: ProgressState, key: string, amount: number): void {
  const awards = state.xpAwards ?? [];
  if (awards.includes(key)) return;
  state.xpAwards = [...awards, key];
  state.xp = (state.xp ?? 0) + amount;
}

export const XP = {
  LESSON: 10,
  CHAPTER_QUIZ: 25,
  EXAM: 100,
  FLASHCARD: 2,
} as const;

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

  /** Mark a lesson as VIEWED (for "Resume" tracking + daily streak). */
  const markViewed = useCallback(
    (lessonSlug: string, chapterSlug: string) => {
      const current = read();
      current.lastLessonSlug = lessonSlug;
      current.lastChapterSlug = chapterSlug;
      bumpStreak(current);
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
      awardOnce(current, `lesson:${lessonKey}`, XP.LESSON);
      bumpStreak(current);
      write(current);
    },
    [],
  );

  const setExamScore = useCallback((score: number) => {
    const current = read();
    current.examScore = score;
    if (score >= 0.8) awardOnce(current, "exam", XP.EXAM);
    write(current);
  }, []);

  const setChapterQuizScore = useCallback(
    (chapter: string, score: number) => {
      const current = read();
      current.chapterQuizScores = {
        ...(current.chapterQuizScores ?? {}),
        [chapter]: score,
      };
      if (score >= 0.7) awardOnce(current, `quiz:${chapter}`, XP.CHAPTER_QUIZ);
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

/** Focused XP hook — read total XP and award more. */
export function useXp() {
  const [xp, setXp] = useState(0);
  useEffect(() => {
    const sync = () => setXp(read().xp ?? 0);
    sync();
    window.addEventListener("eval-academy-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("eval-academy-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /** Add repeatable XP (e.g. a flashcard recall). Not idempotent by design. */
  const addXp = useCallback((amount: number, _reason?: string) => {
    const current = read();
    current.xp = (current.xp ?? 0) + amount;
    write(current);
  }, []);

  return { xp, addXp };
}

/** Per-lesson note hook. */
export function useNotes(lessonKey: string) {
  const [note, setNote] = useState("");
  useEffect(() => {
    const sync = () => setNote(read().notes?.[lessonKey] ?? "");
    sync();
    window.addEventListener("eval-academy-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("eval-academy-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, [lessonKey]);

  const save = useCallback(
    (text: string) => {
      const current = read();
      const notes = { ...(current.notes ?? {}) };
      if (text.trim()) notes[lessonKey] = text;
      else delete notes[lessonKey];
      current.notes = notes;
      write(current);
    },
    [lessonKey],
  );

  return { note, save };
}

export type Badge = {
  id: string;
  label: string;
  description: string;
  earned: boolean;
};

/**
 * Derive badges from progress state. Pure — call from any component that
 * has the state (e.g. the dashboard).
 */
export function computeBadges(
  state: ProgressState,
  totalLessons: number,
): Badge[] {
  const completed = state.lessonsCompleted.length;
  const chapterPasses = Object.values(state.chapterQuizScores ?? {}).filter(
    (s) => s >= 0.7,
  ).length;
  const streak = state.streak?.current ?? 0;
  const longest = state.streak?.longest ?? 0;
  return [
    {
      id: "first-step",
      label: "First step",
      description: "Complete your first lesson",
      earned: completed >= 1,
    },
    {
      id: "halfway",
      label: "Halfway there",
      description: "Complete half the course",
      earned: totalLessons > 0 && completed >= Math.ceil(totalLessons / 2),
    },
    {
      id: "quiz-ace",
      label: "Quiz ace",
      description: "Pass a chapter quiz",
      earned: chapterPasses >= 1,
    },
    {
      id: "all-quizzes",
      label: "Phase master",
      description: "Pass all five chapter quizzes",
      earned: chapterPasses >= 5,
    },
    {
      id: "streak-3",
      label: "On a roll",
      description: "Study 3 days in a row",
      earned: longest >= 3 || streak >= 3,
    },
    {
      id: "graduate",
      label: "Graduate",
      description: "Pass the final exam",
      earned: (state.examScore ?? 0) >= 0.8,
    },
  ];
}
