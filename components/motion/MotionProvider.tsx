"use client";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wraps the app in LazyMotion + domAnimation so we ship only the ~6KB
 * subset of Motion features we use (animate, drag, layout, exit).
 * MotionConfig pipes prefers-reduced-motion into every child component.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
