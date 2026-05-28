"use client";
import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
  m,
} from "motion/react";

type CountUpProps = {
  to: number;
  duration?: number;
  className?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
};

/**
 * Animates a number from 0 → to when it scrolls into view.
 * Respects reduced-motion by jumping straight to the target value.
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(reduced ? to : 0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration, mv]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <m.span>{rounded}</m.span>
      {suffix}
    </span>
  );
}
