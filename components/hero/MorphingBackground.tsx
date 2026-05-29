"use client";
import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";

/**
 * Hero background — "enlightenment" theme, visible edition.
 *
 * Four stacked layers:
 *   1. Dawn wash       — pale gradient with a visible UN-blue glow upper-left
 *   2. Sun halo        — a soft bright corona at the focal point
 *   3. Light rays      — seven semi-transparent UN-blue beams fanning down,
 *                        breathing in opacity and gently rotating
 *   4. Drifting motes  — 28 glowing particles slowly rising and fading
 *   5. Bottom vignette — pulls focus toward text, keeps CTAs readable
 *
 * Tuned so the headline stays high-contrast but the motion is actually
 * perceptible — not buried at opacity 0.05.
 */

const RAYS = [
  { angle: -22, length: 1.4, opacity: 0.17, duration: 14, delay: 0 },
  { angle: -12, length: 1.45, opacity: 0.14, duration: 17, delay: 1.2 },
  { angle: -3, length: 1.35, opacity: 0.19, duration: 13, delay: 0.6 },
  { angle: 7, length: 1.5, opacity: 0.13, duration: 16, delay: 2.1 },
  { angle: 17, length: 1.38, opacity: 0.16, duration: 15, delay: 0.3 },
  { angle: 27, length: 1.45, opacity: 0.12, duration: 18, delay: 1.6 },
  { angle: 37, length: 1.35, opacity: 0.14, duration: 14, delay: 2.4 },
];

// Focal point (viewBox 0..1000, 0..700). Slightly inside the canvas so the
// halo is clearly visible upper-left.
const FOCAL_X = 90;
const FOCAL_Y = 30;

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
  const rad = ((angle + 90) * Math.PI) / 180;
  const farX = FOCAL_X + Math.cos(rad) * 1300 * length;
  const farY = FOCAL_Y + Math.sin(rad) * 1300 * length;
  const perpX = -Math.sin(rad) * 95;
  const perpY = Math.cos(rad) * 95;

  return (
    <m.path
      d={`M ${FOCAL_X} ${FOCAL_Y} L ${farX + perpX} ${farY + perpY} L ${farX - perpX} ${farY - perpY} Z`}
      fill="url(#ray-grad)"
      style={{ opacity }}
      animate={{ opacity: [opacity * 0.7, opacity * 1.5, opacity * 0.7] }}
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
  size: number;
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
      x: rand() * 100,
      y: 55 + rand() * 50,
      size: 8 + rand() * 18, // px diameter
      drift: 80 + rand() * 120,
      duration: 10 + rand() * 9,
      delay: rand() * 9,
      opacity: 0.5 + rand() * 0.4,
    });
  }
  return out;
}

export function MorphingBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const motes = useMemo(() => makeMotes(28), []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Layer 1 — Dawn wash with a clear bright corner */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 9% 3%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 70%),
            radial-gradient(ellipse 70% 60% at 9% 3%, rgba(31,98,191,0.32) 0%, rgba(31,98,191,0.10) 45%, rgba(31,98,191,0) 75%),
            radial-gradient(ellipse 50% 50% at 92% 85%, rgba(20,184,166,0.10) 0%, rgba(20,184,166,0) 70%),
            linear-gradient(165deg, #F4F8FD 0%, #E7EFF8 50%, #DCE7F4 100%)
          `,
        }}
      />

      {/* Layer 2 — Sun corona, breathing */}
      <m.div
        className="absolute"
        style={{
          left: "-4%",
          top: "-12%",
          width: "44%",
          aspectRatio: "1",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(159,201,232,0.55) 25%, rgba(31,98,191,0.18) 55%, rgba(31,98,191,0) 80%)",
          filter: "blur(4px)",
        }}
        animate={
          mounted
            ? { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }
            : { opacity: 0.85 }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 3 — Light rays */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ray-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="15%" stopColor="rgba(159,201,232,0.85)" />
            <stop offset="50%" stopColor="rgba(31,98,191,0.45)" />
            <stop offset="100%" stopColor="rgba(31,98,191,0)" />
          </linearGradient>
        </defs>

        {/* Static rays for SSR / first paint */}
        {!mounted &&
          RAYS.map((r, i) => (
            <Ray key={`s-${i}`} {...r} />
          ))}

        {/* Animated rays after hydration */}
        {mounted && RAYS.map((r, i) => <Ray key={i} {...r} />)}
      </svg>

      {/* Layer 4 — Drifting motes */}
      <div className="absolute inset-0">
        {motes.map((mote, i) => (
          <m.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              width: mote.size,
              height: mote.size,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(31,98,191,0.55) 35%, rgba(31,98,191,0.18) 65%, rgba(31,98,191,0) 100%)",
              opacity: 0,
              filter: "blur(0.5px)",
            }}
            animate={
              mounted
                ? {
                    y: [0, -mote.drift, -mote.drift * 1.5],
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

      {/* Layer 5 — Bottom vignette for legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,251,255,0) 0%, rgba(248,251,255,0.55) 65%, rgba(248,251,255,0.85) 100%)",
        }}
      />
    </div>
  );
}
