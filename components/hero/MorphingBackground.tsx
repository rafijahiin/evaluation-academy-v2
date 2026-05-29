"use client";
import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";

/**
 * Hero background — "enlightenment" theme.
 *
 * Three layers, all in subtle UNFPA blue:
 *  1. Dawn wash         — a pale linear gradient warm-cool top-to-bottom
 *                          with a soft UN-blue radial glow upper-left.
 *  2. Light rays        — long thin semi-transparent rays fanning down
 *                          from an off-canvas focal point, like sunbeams
 *                          through a window. Drift gently.
 *  3. Floating motes    — small particles slowly drifting upward,
 *                          fading in and out. Suggest knowledge / insight.
 *
 * Everything is decorative (aria-hidden) and tuned soft enough that
 * the headline stays high-contrast on top.
 */

const RAYS = [
  // [angle deg, length factor, opacity, duration sec, delay sec]
  { angle: -18, length: 1.35, opacity: 0.06, duration: 14, delay: 0 },
  { angle: -10, length: 1.4, opacity: 0.05, duration: 17, delay: 1.2 },
  { angle: -4, length: 1.3, opacity: 0.07, duration: 13, delay: 0.6 },
  { angle: 3, length: 1.45, opacity: 0.05, duration: 16, delay: 2.1 },
  { angle: 11, length: 1.32, opacity: 0.06, duration: 15, delay: 0.3 },
  { angle: 19, length: 1.4, opacity: 0.045, duration: 18, delay: 1.6 },
  { angle: 28, length: 1.3, opacity: 0.05, duration: 14, delay: 2.4 },
];

// Focal point (in viewBox units) — where rays appear to emanate from.
// Slightly off-canvas top-left so the spread feels like a sunrise.
const FOCAL_X = -50;
const FOCAL_Y = -80;

function Ray({
  angle,
  length,
  opacity,
  duration,
  delay,
}: {
  angle: number;
  length: number;
  opacity: number;
  duration: number;
  delay: number;
}) {
  // Build a long thin triangle from focal point along `angle` degrees
  // (measured from straight down). Width is small near focal, wider far away.
  const rad = ((angle + 90) * Math.PI) / 180; // 0 deg = straight down
  const farX = FOCAL_X + Math.cos(rad) * 1100 * length;
  const farY = FOCAL_Y + Math.sin(rad) * 1100 * length;
  const perpX = -Math.sin(rad) * 70;
  const perpY = Math.cos(rad) * 70;

  return (
    <m.path
      d={`M ${FOCAL_X} ${FOCAL_Y} L ${farX + perpX} ${farY + perpY} L ${farX - perpX} ${farY - perpY} Z`}
      fill="url(#ray-grad)"
      style={{ opacity, mixBlendMode: "multiply" }}
      animate={{ opacity: [opacity, opacity * 1.7, opacity] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

type Mote = {
  x: number;
  y: number;
  r: number;
  drift: number;
  duration: number;
  delay: number;
  opacity: number;
};

function makeMotes(n: number, seed = 7): Mote[] {
  // deterministic pseudo-random so SSR + client match
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out: Mote[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: rand() * 100, // % of width
      y: 65 + rand() * 45, // start lower half
      r: 0.6 + rand() * 1.4,
      drift: 30 + rand() * 40, // travel distance upward
      duration: 12 + rand() * 10,
      delay: rand() * 8,
      opacity: 0.25 + rand() * 0.35,
    });
  }
  return out;
}

export function MorphingBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const motes = useMemo(() => makeMotes(22), []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Layer 1 — Dawn wash (CSS gradient, GPU-cheap) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,255,255,0.95), rgba(255,255,255,0) 65%),
            radial-gradient(ellipse 60% 50% at 12% 5%, rgba(31,98,191,0.10), rgba(31,98,191,0) 70%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(20,184,166,0.06), rgba(20,184,166,0) 75%),
            linear-gradient(180deg, #FCFDFF 0%, #F2F6FB 55%, #E9F0F8 100%)
          `,
        }}
      />

      {/* Layer 2 — Light rays (SVG with soft multiply) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ray-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(31,98,191,0.7)" />
            <stop offset="40%" stopColor="rgba(31,98,191,0.18)" />
            <stop offset="100%" stopColor="rgba(31,98,191,0)" />
          </linearGradient>
          <radialGradient id="halo" cx="12%" cy="8%" r="42%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="50%" stopColor="rgba(159,201,232,0.18)" />
            <stop offset="100%" stopColor="rgba(159,201,232,0)" />
          </radialGradient>
          <radialGradient id="mote-grad">
            <stop offset="0%" stopColor="rgba(31,98,191,0.55)" />
            <stop offset="60%" stopColor="rgba(31,98,191,0.18)" />
            <stop offset="100%" stopColor="rgba(31,98,191,0)" />
          </radialGradient>
        </defs>

        {/* The halo bloom around the focal point */}
        <circle cx="120" cy="80" r="320" fill="url(#halo)" />

        {/* Static rays for SSR / first paint */}
        {!mounted &&
          RAYS.map((r, i) => (
            <Ray
              key={`s-${i}`}
              angle={r.angle}
              length={r.length}
              opacity={r.opacity}
              duration={r.duration}
              delay={r.delay}
            />
          ))}

        {/* Animated rays after hydration */}
        {mounted &&
          RAYS.map((r, i) => (
            <Ray
              key={i}
              angle={r.angle}
              length={r.length}
              opacity={r.opacity}
              duration={r.duration}
              delay={r.delay}
            />
          ))}
      </svg>

      {/* Layer 3 — Floating motes (positioned in % so they reflow with viewport) */}
      <div className="absolute inset-0">
        {motes.map((mote, i) => (
          <m.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              width: mote.r * 4,
              height: mote.r * 4,
              background:
                "radial-gradient(circle, rgba(31,98,191,0.55) 0%, rgba(31,98,191,0.12) 55%, rgba(31,98,191,0) 100%)",
              opacity: 0,
            }}
            animate={
              mounted
                ? {
                    y: [0, -mote.drift, -mote.drift * 1.4],
                    opacity: [0, mote.opacity, 0],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: mote.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: mote.delay,
            }}
          />
        ))}
      </div>

      {/* Layer 4 — Soft vignette at the bottom to keep CTAs readable */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(252,253,255,0) 0%, rgba(252,253,255,0.65) 100%)",
        }}
      />
    </div>
  );
}
