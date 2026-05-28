"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive checklist with localStorage persistence per lesson.
 *
 *   <Checklist storageKey="ch1-l1-launch">
 *     <Item>Identify CPE Manager and confirm with CO Representative</Item>
 *     <Item>Schedule launch meeting with all CO staff + RO M&E Adviser</Item>
 *   </Checklist>
 */
export function Checklist({
  storageKey,
  children,
  title = "Checklist",
}: {
  storageKey: string;
  children: ReactNode;
  title?: string;
}) {
  return (
    <ChecklistContext.Provider value={storageKey}>
      <section className="my-6 rounded-2xl border border-border bg-surface-1 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-6 h-6 rounded-full"
            style={{ background: "var(--un-blue-50)", color: "var(--un-blue-700)" }}
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2.6} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-2">
            {title}
          </span>
        </div>
        <ul className="space-y-2.5">{children}</ul>
      </section>
    </ChecklistContext.Provider>
  );
}

import { createContext, useContext } from "react";
const ChecklistContext = createContext<string>("");

export function Item({ children }: { children: ReactNode }) {
  const storageKey = useContext(ChecklistContext);
  const itemKey = `${storageKey}::${String(children).slice(0, 60)}`;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("eval-academy.checklists") ?? "{}";
    try {
      const parsed = JSON.parse(raw);
      setChecked(Boolean(parsed[itemKey]));
    } catch {
      /* ignore */
    }
  }, [itemKey]);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    try {
      const raw = localStorage.getItem("eval-academy.checklists") ?? "{}";
      const parsed = JSON.parse(raw);
      parsed[itemKey] = next;
      localStorage.setItem("eval-academy.checklists", JSON.stringify(parsed));
    } catch {
      /* ignore */
    }
  };

  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "w-full text-left flex items-start gap-3 px-3 py-2 rounded-lg transition-colors",
          "hover:bg-surface-2",
          checked && "opacity-60",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
            checked
              ? "border-un-700 bg-un-700"
              : "border-border-strong bg-white",
          )}
        >
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
        <span
          className={cn(
            "text-[14px] leading-[1.5] text-ink-1",
            checked && "line-through",
          )}
        >
          {children}
        </span>
      </button>
    </li>
  );
}
