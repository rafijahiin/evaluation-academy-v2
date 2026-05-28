"use client";
import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
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
 * Server-renders the final value to avoid hydration mismatch;
 * mounts the animated motion value client-side and re-animates.
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView) return;
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [mounted, inView, to, duration, mv]);

  // Server + first client render: show the final value statically
  // After mount: switch to animated motion value
  return (
    <span ref={ref} className={className}>
      {prefix}
      {mounted ? <m.span>{rounded}</m.span> : <span>{to.toFixed(decimals)}</span>}
      {suffix}
    </span>
  );
}
