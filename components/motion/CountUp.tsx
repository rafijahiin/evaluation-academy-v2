"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "motion/react";

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
 * SSR-safe: server renders the final value, client mounts to 0 and
 * animates up. Uses animate()'s onUpdate callback to write the
 * formatted value into React state — more reliable than embedding
 * a MotionValue as children, which depends on Motion's text-content
 * sync and can silently fail.
 *
 * Reduced-motion handled globally by MotionProvider's MotionConfig.
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
  // Server + first client render: show the final value (matches SSR output)
  const [display, setDisplay] = useState(() => to.toFixed(decimals));
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView) return;
    // Restart the animation from zero on client when it enters view
    mv.set(0);
    setDisplay("0".padStart(1, "0") + (decimals > 0 ? "." + "0".repeat(decimals) : ""));
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [mounted, inView, to, duration, decimals, mv]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
