/**
 * Quiz shuffling — keeps the same question content but rearranges:
 *   1. The order in which questions are presented.
 *   2. The order of MCQ / scenario options (and remaps `correct` accordingly).
 *
 * This prevents users from memorising "the answer is always C." A fresh
 * shuffle is generated each session (and each retake) so two attempts on
 * the same quiz almost certainly differ.
 *
 * The functions are pure — given a seeded RNG you can make them
 * deterministic, but we use Math.random by default since per-session
 * variation is exactly what we want.
 */

import type { Question } from "@/content/quizzes";

function fisherYates<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffle a single question's options, remapping `correct` to its new index.
 * Arrange-type questions are returned unchanged (their order IS the answer).
 */
function shuffleOptions(q: Question, rand: () => number = Math.random): Question {
  if (q.type === "arrange") return q;
  if (!q.options || typeof q.correct !== "number") return q;

  const indices = q.options.map((_, i) => i);
  const shuffled = fisherYates(indices, rand);
  const newOptions = shuffled.map((i) => q.options![i]);
  const newCorrect = shuffled.indexOf(q.correct);

  return { ...q, options: newOptions, correct: newCorrect };
}

/**
 * Shuffle a set of questions and (for MCQ/scenario) their options.
 */
export function shuffleQuiz(
  questions: Question[],
  rand: () => number = Math.random,
): Question[] {
  return fisherYates(questions, rand).map((q) => shuffleOptions(q, rand));
}
