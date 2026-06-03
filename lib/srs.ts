/**
 * Spaced-repetition store (Leitner system) — localStorage-backed.
 *
 * Each flashcard moves through 5 boxes. A correct recall ("Good") promotes
 * it one box and pushes the next review further out; a miss ("Again")
 * sends it back to box 1, due immediately. Cards never seen are "new".
 */
"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "evalAcademy.srs.v1";

// Interval (in days) before a card in box N is due again. Box 1 = same day.
const BOX_INTERVALS_DAYS = [0, 1, 3, 7, 21];
const MAX_BOX = BOX_INTERVALS_DAYS.length; // 5
const DAY_MS = 24 * 60 * 60 * 1000;

export type CardState = {
  box: number; // 1..5
  due: number; // epoch ms
  seen: number; // times reviewed
};

export type SrsMap = Record<string, CardState>;

export function cardId(chapter: string, lessonSlug: string, term: string) {
  return `${chapter}::${lessonSlug}::${term}`;
}

function read(): SrsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function write(map: SrsMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("eval-academy-srs"));
  } catch {
    /* ignore quota */
  }
}

export function isDue(state: CardState | undefined, now: number): boolean {
  if (!state) return true; // new cards are always due
  return state.due <= now;
}

export function useSrs() {
  const [map, setMap] = useState<SrsMap>({});

  useEffect(() => {
    setMap(read());
    const onChange = () => setMap(read());
    window.addEventListener("eval-academy-srs", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("eval-academy-srs", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  /** Grade a card. correct=true promotes; false demotes to box 1. */
  const grade = useCallback((id: string, correct: boolean) => {
    const current = read();
    const prev = current[id];
    const now = Date.now();
    let box: number;
    if (correct) {
      box = Math.min(MAX_BOX, (prev?.box ?? 0) + 1);
    } else {
      box = 1;
    }
    const intervalDays = BOX_INTERVALS_DAYS[box - 1] ?? 0;
    current[id] = {
      box,
      due: now + intervalDays * DAY_MS,
      seen: (prev?.seen ?? 0) + 1,
    };
    write(current);
  }, []);

  const resetAll = useCallback(() => write({}), []);

  return { map, grade, resetAll, maxBox: MAX_BOX };
}
