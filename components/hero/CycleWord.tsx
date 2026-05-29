"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";

type Props = {
  words: string[];
  intervalMs?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Cycles through a sequence of words in the same headline slot.
 * Used in the hero italic emphasis position so the headline subtly
 * keeps moving — evaluation → inquiry → contribution → evidence → change.
 */
export function CycleWord({ words, intervalMs = 2600, className, style }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setI((n) => (n + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs]);

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        whiteSpace: "nowrap",
        verticalAlign: "baseline",
      }}
    >
      {/* Invisible widest-word reserve so layout doesn't reflow on each cycle */}
      <span aria-hidden style={{ visibility: "hidden" }} className={className}>
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <m.span
          key={words[i]}
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={className}
          style={{
            ...style,
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            display: "inline-block",
          }}
        >
          {words[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
