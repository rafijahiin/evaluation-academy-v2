"use client";
import { m } from "motion/react";

/**
 * Animated certification-style seal SVG.
 *
 * Animation choreography (matches the certificate spec):
 *   opacity 0 → 1, scale 0.6 → 1, rotate -8° → 0°
 *   spring (stiffness: 220, damping: 14), ~900ms
 *
 * Used for both the exam-pass result celebration and the certificate page.
 */
export function Seal({
  size = 128,
  label = "Passed",
  delay = 0,
}: {
  size?: number;
  label?: string;
  delay?: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 14,
        delay,
      }}
      style={{ width: size, height: size }}
      className="relative"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-label="Certification seal"
      >
        <defs>
          <radialGradient id="seal-grad" cx="0.5" cy="0.45">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
          <radialGradient id="seal-highlight" cx="0.35" cy="0.3" r="0.5">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* outer scalloped ring */}
        <g>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 46;
            const y = 50 + Math.sin(a) * 46;
            return (
              <circle key={i} cx={x} cy={y} r={3.2} fill="url(#seal-grad)" />
            );
          })}
        </g>
        {/* main disc */}
        <circle cx={50} cy={50} r={40} fill="url(#seal-grad)" />
        <circle cx={50} cy={50} r={40} fill="url(#seal-highlight)" />
        {/* inner ring */}
        <circle
          cx={50}
          cy={50}
          r={34}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={0.6}
        />
        <circle
          cx={50}
          cy={50}
          r={30}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={0.4}
        />
        {/* checkmark */}
        <m.path
          d="M 35 50 L 46 60 L 65 40"
          fill="none"
          stroke="white"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.4, ease: "easeOut" }}
        />
        {/* label arc */}
        <defs>
          <path
            id={`seal-text-${size}`}
            d="M 18 50 A 32 32 0 0 0 82 50"
          />
        </defs>
        <text
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="2"
          fill="white"
          opacity="0.85"
        >
          <textPath
            href={`#seal-text-${size}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {label.toUpperCase()}
          </textPath>
        </text>
      </svg>
    </m.div>
  );
}
