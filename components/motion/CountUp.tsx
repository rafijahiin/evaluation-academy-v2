"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

type CountUpProps = {
  to: number;
  duration?: number;
  className?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
};

/**
 * Animates a number from 0 → `to` when it scrolls into view.
 *
 * Uses plain requestAnimationFrame instead of Motion's animate() to avoid
 * library quirks where motion-value-as-text-child would silently stop
 * updating for certain magnitudes (e.g. 1994 staying at 0).
 *
 * SSR-safe: server renders the final value; client mounts to that same
 * value and animates from 0 once the element scrolls into view.
 */
export function CountUp({
  to,
  duration = 1.2,
  className,
  decimals = 0,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState(() => to.toFixed(decimals));
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView) return;
    let raf = 0;
    let startTs: number | null = null;

    const tick = (t: number) => {
      if (startTs === null) startTs = t;
      const elapsed = (t - startTs) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * to;
      setDisplay(value.toFixed(decimals));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(to.toFixed(decimals));
      }
    };

    setDisplay("0");
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, inView, to, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
