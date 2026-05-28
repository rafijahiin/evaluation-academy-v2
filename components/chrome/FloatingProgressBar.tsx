"use client";
import { m } from "motion/react";
import { useProgress, computePercent } from "@/lib/progress";
import { COURSE_META } from "@/content/chapters";

/**
 * Slim 3px progress bar at the very top of the viewport.
 * Animates fill on load. Reflects overall lessons completed / total.
 *
 * Reduced-motion handled globally by MotionProvider's MotionConfig.
 */
export function FloatingProgressBar() {
  const { state } = useProgress();
  const percent = computePercent(
    state.lessonsCompleted.length,
    COURSE_META.totalLessons,
  );

  if (percent === 0) return null;

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-40 h-[3px] bg-transparent pointer-events-none"
    >
      <m.div
        className="h-full rounded-r-full"
        style={{
          background:
            "linear-gradient(90deg, var(--un-blue) 0%, var(--teal) 60%, var(--amber) 100%)",
          boxShadow: "0 0 12px rgba(0,111,183,0.5)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2,
        }}
      />
    </div>
  );
}
