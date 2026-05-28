"use client";
import { m } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

/**
 * Scroll-triggered fade + slide-up. Pairs with StaggerChildren for lists.
 *
 * Reduced-motion handling is delegated to the global MotionConfig in
 * MotionProvider (`reducedMotion="user"`), which automatically disables
 * animations for users with the OS preference set. We don't read
 * useReducedMotion here because doing so during render breaks hydration —
 * it returns different values on server vs first client paint.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delayStep?: number;
  initialDelay?: number;
};

export function StaggerChildren({
  children,
  className,
  delayStep = 0.06,
  initialDelay = 0,
}: StaggerProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: delayStep, delayChildren: initialDelay },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </m.div>
  );
}
