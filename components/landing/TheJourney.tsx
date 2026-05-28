"use client";
import Link from "next/link";
import { m } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import {
  Reveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/Reveal";

/**
 * "The Journey" — 5 equal-weight, colour-coded phase cards.
 *
 * Each card:
 *   • Solid accent colour background per chapter
 *   • Giant italic numeral (decorative, ghosted)
 *   • PHASE N label
 *   • Title in Fraunces
 *   • Hover: lift + tilt + numeral scale-up + corner arrow slide-in
 *           + sheen overlay traverses left → right
 *
 * Layout: 5-up on desktop with a connecting gradient line; vertical
 * stack on mobile.
 */

type Palette = {
  // Solid background
  bg: string;
  // Numeral colour (used for the giant decorative number)
  numeral: string;
  // Text colour (label, title, body)
  text: string;
  // Eyebrow / sublabel
  eyebrow: string;
  // Arrow + chip background
  accent: string;
  // Sheen line colour (used by the on-hover sweep)
  sheen: string;
};

function paletteFor(accent: string): Palette {
  switch (accent) {
    case "un-blue":
      return {
        bg: "linear-gradient(135deg, #006FB7 0%, #004576 100%)",
        numeral: "rgba(255,255,255,0.12)",
        text: "#FFFFFF",
        eyebrow: "rgba(207, 229, 244, 0.95)",
        accent: "#9FC9E8",
        sheen: "rgba(255,255,255,0.18)",
      };
    case "navy":
      return {
        bg: "linear-gradient(135deg, #0A2540 0%, #061c33 100%)",
        numeral: "rgba(255,255,255,0.10)",
        text: "#FFFFFF",
        eyebrow: "rgba(159, 201, 232, 0.95)",
        accent: "#9FC9E8",
        sheen: "rgba(255,255,255,0.15)",
      };
    case "teal":
      return {
        bg: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)",
        numeral: "rgba(255,255,255,0.16)",
        text: "#FFFFFF",
        eyebrow: "rgba(204, 251, 241, 0.95)",
        accent: "#CCFBF1",
        sheen: "rgba(255,255,255,0.2)",
      };
    case "amber":
      return {
        bg: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
        numeral: "rgba(255,255,255,0.18)",
        text: "#FFFFFF",
        eyebrow: "rgba(254, 243, 199, 0.95)",
        accent: "#FEF3C7",
        sheen: "rgba(255,255,255,0.22)",
      };
    default:
      return {
        bg: "linear-gradient(135deg, #006FB7 0%, #004576 100%)",
        numeral: "rgba(255,255,255,0.12)",
        text: "#FFFFFF",
        eyebrow: "rgba(207, 229, 244, 0.95)",
        accent: "#9FC9E8",
        sheen: "rgba(255,255,255,0.18)",
      };
  }
}

export function TheJourney() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <Reveal>
        <div className="flex flex-col items-start gap-3 mb-14 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
            <span
              className="w-6 h-px"
              style={{ background: "var(--un-blue)" }}
            />
            The journey
          </span>
          <h2 className="font-display text-[clamp(34px,5vw,56px)] leading-[1.02] tracking-[-0.02em] text-ink-1">
            Five phases.{" "}
            <span
              className="italic"
              style={{ color: "var(--un-blue-700)" }}
            >
              One craft.
            </span>
          </h2>
          <p className="text-ink-2 max-w-xl text-[16px] leading-relaxed">
            Each phase is a chapter. Walk the journey end to end, or jump to the
            phase you need.
          </p>
        </div>
      </Reveal>

      <div className="relative">
        {/* Connecting line — desktop horizontal */}
        <div
          aria-hidden
          className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[4%] right-[4%] h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--un-blue-300) 10%, var(--teal) 50%, var(--amber) 90%, transparent 100%)",
            opacity: 0.35,
          }}
        />

        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-5 relative"
          delayStep={0.08}
        >
          {CHAPTERS.map((chapter) => {
            const p = paletteFor(chapter.accent);
            return (
              <StaggerItem key={chapter.slug}>
                <JourneyCard
                  number={chapter.number}
                  title={chapter.title}
                  slug={chapter.slug}
                  palette={p}
                />
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}

type CardProps = {
  number: number;
  title: string;
  slug: string;
  palette: Palette;
};

function JourneyCard({ number, title, slug, palette }: CardProps) {
  return (
    <m.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="relative"
    >
      <Link
        href={`/learn/${slug}`}
        className="group relative block aspect-[4/5] rounded-3xl overflow-hidden"
        style={{
          background: palette.bg,
          // Inner shadow + subtle border highlight for depth
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.18) inset, 0 12px 30px -12px rgba(15,23,42,0.45)",
        }}
      >
        {/* Sheen sweep on hover */}
        <m.div
          aria-hidden
          className="absolute inset-y-0 pointer-events-none"
          style={{
            width: "55%",
            background: `linear-gradient(105deg, transparent 0%, ${palette.sheen} 50%, transparent 100%)`,
            filter: "blur(2px)",
          }}
          variants={{
            rest: { x: "-130%", opacity: 0 },
            hover: { x: "230%", opacity: 1 },
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Giant decorative numeral (background layer) */}
        <m.div
          aria-hidden
          className="absolute font-display italic font-medium leading-none pointer-events-none select-none"
          style={{
            color: palette.numeral,
            fontSize: "260px",
            top: "-18px",
            right: "-22px",
            // tightening for italic numerals
            letterSpacing: "-0.02em",
          }}
          variants={{
            rest: { scale: 1, rotate: 0 },
            hover: { scale: 1.08, rotate: -3 },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {String(number).padStart(2, "0")}
        </m.div>

        {/* Subtle radial sheen on top-left to lift the surface */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 10% 0%, rgba(255,255,255,0.18) 0%, transparent 55%)",
            mixBlendMode: "soft-light",
          }}
        />

        {/* Content overlay */}
        <div className="relative h-full flex flex-col justify-between p-6 sm:p-7">
          {/* top */}
          <div>
            {/* small foreground numeral (italic) */}
            <m.div
              className="font-display italic font-medium leading-none text-[44px] sm:text-[52px]"
              style={{ color: palette.text }}
              variants={{
                rest: { x: 0 },
                hover: { x: 3 },
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {String(number).padStart(2, "0")}
            </m.div>
            <div
              className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold"
              style={{
                color: palette.eyebrow,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <span
                aria-hidden
                className="w-1 h-1 rounded-full"
                style={{ background: palette.accent }}
              />
              Phase {number}
            </div>
          </div>

          {/* bottom: title + arrow */}
          <div>
            <m.h3
              className="font-display tracking-[-0.01em] leading-[1.02] text-[28px] sm:text-[34px]"
              style={{ color: palette.text, fontWeight: 500 }}
              variants={{
                rest: { y: 0 },
                hover: { y: -2 },
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {title}
            </m.h3>

            <m.div
              className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full"
              style={{
                background: "rgba(255,255,255,0.16)",
                color: palette.text,
                border: "1px solid rgba(255,255,255,0.25)",
              }}
              variants={{
                rest: { x: 0, rotate: -10, scale: 1 },
                hover: { x: 4, rotate: 0, scale: 1.08 },
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </m.div>
          </div>
        </div>

        {/* Outer hover lift (CSS-side, parallel to motion) */}
        <m.div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }}
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.35 }}
        />
      </Link>
    </m.div>
  );
}
