"use client";
import { useEffect, useRef, useState } from "react";
import { NotebookPen, Check } from "lucide-react";
import { useNotes } from "@/lib/progress";

/**
 * Per-lesson notes. Saved to localStorage (debounced) and surfaced again
 * whenever the learner returns to the lesson. Plain text — no backend.
 */
export function NotesPanel({ lessonKey }: { lessonKey: string }) {
  const { note, save } = useNotes(lessonKey);
  // `draft` is null until the user starts editing — until then we show the
  // stored note (which loads asynchronously from localStorage). This avoids
  // the old bug where a saved note never appeared because the textarea was
  // hydrated to "" before the store had loaded.
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = draft ?? note;

  // Reset editing state when switching lessons (the component is reused).
  useEffect(() => {
    setDraft(null);
    setSaved(false);
  }, [lessonKey]);

  function onChange(next: string) {
    setDraft(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      save(next);
      setSaved(true);
    }, 600);
  }

  function flush() {
    if (timer.current) clearTimeout(timer.current);
    if (draft != null) {
      save(draft);
      setSaved(true);
    }
  }

  return (
    <section className="mt-14 rounded-2xl border border-border bg-surface-2 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="w-4 h-4 text-un-700" />
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
            Your notes
          </span>
        </div>
        {saved && value.trim() && (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-emerald-700">
            <Check className="w-3 h-3" strokeWidth={3} />
            Saved
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={flush}
        placeholder="Jot down a takeaway, a question for your team, or how this applies to your country office…"
        rows={4}
        className="w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-[14.5px] leading-[1.6] text-ink-1 placeholder:text-ink-4 outline-none focus:border-un-300 transition-colors"
      />
      <p className="mt-2 text-[11.5px] text-ink-4">
        Saved on this device only — private to you.
      </p>
    </section>
  );
}
