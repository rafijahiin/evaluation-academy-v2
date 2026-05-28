"use client";
import { m } from "motion/react";

type ProgressRingProps = {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  trackColor?: string;
  fillColor?: string;
  label?: string;
  className?: string;
};

/**
 * Animated circular progress ring. Stroke-dashoffset transitions on mount.
 */
export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  trackColor = "var(--border)",
  fillColor = "var(--un-blue)",
  label,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0, 0.55, 0.45, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-numeric font-semibold text-[15px]"
        style={{ color: "var(--ink-1)" }}
      >
        {label ?? `${Math.round(clamped)}%`}
      </div>
    </div>
  );
}
