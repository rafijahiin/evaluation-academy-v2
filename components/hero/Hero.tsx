"use client";
import Link from "next/link";
import { m } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { MorphingBackground } from "./MorphingBackground";
import { COURSE_META } from "@/content/chapters";

/**
 * Full-bleed landing hero. Morphing SVG background, oversized Fraunces
 * headline with italic accent, double CTA, stat strip.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <MorphingBackground />

      {/* content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
        {/* eyebrow */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-un-100 text-un-700 text-[12px] font-medium tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--un-blue)" }} />
          An immersive course · Based on UNFPA Handbook 2024
        </m.div>

        {/* headline */}
        <m.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 text-[clamp(48px,9vw,128px)] leading-[0.95] tracking-[-0.03em] text-ink-1 max-w-5xl"
          style={{ fontWeight: 500 }}
        >
          Learn the craft of{" "}
          <span
            className="italic"
            style={{
              color: "var(--un-blue-800)",
              fontWeight: 600,
              textShadow: "0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            evaluation
          </span>
          <span className="text-ink-2"> — chapter by chapter.</span>
        </m.h1>

        {/* subhead */}
        <m.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-[18px] sm:text-[20px] text-ink-2 leading-[1.55]"
        >
          The exact five-phase journey of an evaluation — from launch meeting to
          dissemination — adapted from the UNFPA handbook into{" "}
          <span className="text-ink-1 font-medium">{COURSE_META.totalLessons} lessons</span>,
          hands-on tools, and a printable certificate.
        </m.p>

        {/* CTAs */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-[15px] shadow-card hover:shadow-bloom hover:-translate-y-0.5 transition-all"
            style={{
              background: "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            Start the course
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/toc-builder"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-ink-1 font-medium text-[15px] bg-white/70 backdrop-blur border border-border hover:border-un-200 hover:bg-white transition-all"
          >
            <BookOpen className="w-4 h-4 text-un-700" />
            Build a Theory of Change
          </Link>
        </m.div>

        {/* stat strip */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-border max-w-3xl"
        >
          <Stat label="Phases" value={String(COURSE_META.totalChapters)} />
          <Stat label="Lessons" value={String(COURSE_META.totalLessons)} />
          <Stat label="Avg read" value={`${Math.round(COURSE_META.totalMinutes / COURSE_META.totalLessons)}m`} />
          <Stat label="Total time" value={`${Math.round(COURSE_META.totalMinutes / 60)}h`} />
        </m.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4 sm:py-5">
      <div className="font-numeric font-semibold text-[24px] sm:text-[28px] tracking-tight text-ink-1 leading-none">
        {value}
      </div>
      <div className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-3 font-medium">
        {label}
      </div>
    </div>
  );
}
