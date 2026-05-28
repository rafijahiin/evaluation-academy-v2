/**
 * Progress tracking — localStorage-backed.
 * Schema: { lessonsCompleted: string[], examScore?: number, lastLessonSlug?: string }
 */
"use client";
import { useEffect, useState, useCallback } from "react";

const KEY = "evalAcademy.v3";

export type ProgressState = {
  lessonsCompleted: string[];
  examScore?: number;
  lastChapterSlug?: string;
  lastLessonSlug?: string;
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
    // Broadcast so other listeners in the same tab refresh
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

  const markComplete = useCallback(
    (lessonSlug: string, chapterSlug?: string) => {
      const current = read();
      if (!current.lessonsCompleted.includes(lessonSlug)) {
        current.lessonsCompleted = [...current.lessonsCompleted, lessonSlug];
      }
      current.lastLessonSlug = lessonSlug;
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

  const reset = useCallback(() => {
    write(DEFAULT);
  }, []);

  return { state, markComplete, setExamScore, reset };
}

export function computePercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
