"use client";
import { createContext, useContext } from "react";

/**
 * Provides the currently-rendered lesson's identifier to descendant
 * components (notably the inline <QuizQuestion>) so a correct answer
 * can mark the lesson complete in localStorage.
 *
 * Outside a lesson (e.g. on the exam page), the context value is null
 * and components fall back to non-lesson behaviour.
 */
type LessonContextValue = {
  chapter: string;
  slug: string;
} | null;

const LessonContext = createContext<LessonContextValue>(null);

export function LessonContextProvider({
  value,
  children,
}: {
  value: LessonContextValue;
  children: React.ReactNode;
}) {
  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
}

export function useLessonContext() {
  return useContext(LessonContext);
}
