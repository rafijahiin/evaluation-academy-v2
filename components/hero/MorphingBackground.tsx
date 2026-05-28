"use client";
import { useEffect, useState } from "react";
import { m } from "motion/react";

/**
 * Three soft UN-blue blobs slowly morphing & drifting behind the hero.
 * Pure SVG + Motion's `animate` on `d` (path morphing) for organic feel.
 *
 * Each blob has 3 keyframe paths it cycles through with long durations,
 * giving a subtle ambient motion. Plus a slow translate to add drift.
 */
const blobA = [
  "M421.5,308.5Q391,377,322,407.5Q253,438,178.5,402Q104,366,84,283Q64,200,124,128.5Q184,57,266,71Q348,85,403.5,142.5Q459,200,421.5,308.5Z",
  "M408,317Q387,384,317.5,420Q248,456,167,418.5Q86,381,79,290.5Q72,200,138.5,130.5Q205,61,283,77Q361,93,401,146.5Q441,200,408,317Z",
  "M430,304Q399,378,326,406Q253,434,177,397.5Q101,361,87,280.5Q73,200,127.5,124Q182,48,267,69Q352,90,400.5,145Q449,200,430,304Z",
];

const blobB = [
  "M433,310Q403,380,330,408Q257,436,180,403.5Q103,371,93,285.5Q83,200,140,127Q197,54,274,77Q351,100,402,150Q453,200,433,310Z",
  "M420,316Q393,378,323,408Q253,438,175,401.5Q97,365,87,282.5Q77,200,141.5,131.5Q206,63,283,79Q360,95,407,147.5Q454,200,420,316Z",
  "M444,306Q416,378,341,407.5Q266,437,184,401Q102,365,86,282.5Q70,200,136,127Q202,54,279,77Q356,100,408,150Q460,200,444,306Z",
];

const blobC = [
  "M425,314Q393,378,320,408Q247,438,170,401.5Q93,365,85,282.5Q77,200,140,131.5Q203,63,281,77Q359,91,403,145.5Q447,200,425,314Z",
  "M438,309Q406,378,331,409Q256,440,177,403Q98,366,85,283Q72,200,136,130Q200,60,277,76Q354,92,407,146Q460,200,438,309Z",
  "M415,317Q387,378,317,409Q247,440,170,403Q93,366,88,283Q83,200,142.5,128.5Q202,57,279,75Q356,93,401.5,146.5Q447,200,415,317Z",
];

function Blob({
  paths,
  color,
  duration,
  delay = 0,
  drift,
}: {
  paths: string[];
  color: string;
  duration: number;
  delay?: number;
  drift: { x: number[]; y: number[] };
}) {
  return (
    <m.g
      initial={false}
      animate={{ x: drift.x, y: drift.y }}
      transition={{
        duration: duration * 2.4,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <m.path
        d={paths[0]}
        fill={color}
        initial={false}
        animate={{ d: paths }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay,
        }}
      />
    </m.g>
  );
}

export function MorphingBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ filter: "blur(48px) saturate(110%)" }}
    >
      <svg
        viewBox="0 0 500 500"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        className="absolute -inset-1 opacity-90"
      >
        {/* gradients */}
        <defs>
          <radialGradient id="grad-a" cx="40%" cy="35%">
            <stop offset="0%" stopColor="rgba(0, 111, 183, 0.55)" />
            <stop offset="100%" stopColor="rgba(0, 111, 183, 0)" />
          </radialGradient>
          <radialGradient id="grad-b" cx="70%" cy="60%">
            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.4)" />
            <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
          </radialGradient>
          <radialGradient id="grad-c" cx="30%" cy="75%">
            <stop offset="0%" stopColor="rgba(10, 37, 64, 0.42)" />
            <stop offset="100%" stopColor="rgba(10, 37, 64, 0)" />
          </radialGradient>
        </defs>

        {/* Static fallback for SSR + first paint — paths only, no transforms */}
        {!mounted && (
          <>
            <path d={blobA[0]} fill="url(#grad-a)" />
            <path d={blobB[0]} fill="url(#grad-b)" />
            <path d={blobC[0]} fill="url(#grad-c)" />
          </>
        )}

        {/* Animated blobs — mount only after hydration to avoid transform mismatch */}
        {mounted && (
          <>
            <Blob
              paths={blobA}
              color="url(#grad-a)"
              duration={14}
              drift={{ x: [-30, 30], y: [-20, 20] }}
            />
            <Blob
              paths={blobB}
              color="url(#grad-b)"
              duration={18}
              delay={2}
              drift={{ x: [40, -20], y: [10, -30] }}
            />
            <Blob
              paths={blobC}
              color="url(#grad-c)"
              duration={22}
              delay={4}
              drift={{ x: [-10, 50], y: [30, -10] }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
