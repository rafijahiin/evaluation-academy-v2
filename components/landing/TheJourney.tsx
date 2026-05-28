"use client";
import Link from "next/link";
import { m } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import { CHAPTER_ICONS } from "@/components/illustrations/ChapterIcon";
import {
  Reveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * "The Journey" — a 5-step horizontal timeline of the evaluation phases.
 * All cards are equal weight (same size, same type scale) so the journey
 * reads as a sequence, not a hierarchy. A gradient line connects them.
 *
 * Layout:
 *   Mobile  →  vertical stack with left vertical line
 *   Tablet  →  2-up grid
 *   Desktop →  5-up horizontal timeline with connecting line
 */
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
            Each phase is a chapter. Each chapter is a sequence of focused
            lessons with a hands-on tool at the end. Walk the journey end to
            end, or jump to the phase you need.
          </p>
        </div>
      </Reveal>

      <div className="relative">
        {/* Connecting line — desktop horizontal */}
        <div
          aria-hidden
          className="hidden lg:block absolute top-[64px] left-[10%] right-[10%] h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--un-blue-200) 14%, var(--teal) 50%, var(--amber) 86%, transparent 100%)",
          }}
        />
        {/* Connecting line — mobile vertical */}
        <div
          aria-hidden
          className="lg:hidden absolute top-[40px] bottom-[40px] left-[48px] w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, var(--un-blue-200) 0%, var(--teal) 50%, var(--amber) 100%)",
          }}
        />

        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-4"
          delayStep={0.08}
        >
          {CHAPTERS.map((chapter, idx) => {
            const Icon = CHAPTER_ICONS[chapter.slug as keyof typeof CHAPTER_ICONS];
            const accent = accentToken(chapter.accent);
            return (
              <StaggerItem key={chapter.slug}>
                <JourneyStep
                  number={chapter.number}
                  title={chapter.title}
                  subtitle={chapter.subtitle}
                  focus={chapter.focus}
                  minutes={chapter.estimatedMinutes}
                  slug={chapter.slug}
                  accent={accent}
                  Icon={Icon}
                  isFirst={idx === 0}
                  isLast={idx === CHAPTERS.length - 1}
                />
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}

type JourneyStepProps = {
  number: number;
  title: string;
  subtitle: string;
  focus: string[];
  minutes: number;
  slug: string;
  accent: { ring: string; ink: string; soft: string };
  Icon: (props: { size?: number; accent?: string }) => React.ReactElement;
  isFirst: boolean;
  isLast: boolean;
};

function JourneyStep({
  number,
  title,
  subtitle,
  focus,
  minutes,
  slug,
  accent,
  Icon,
  isFirst,
  isLast,
}: JourneyStepProps) {
  return (
    <Link
      href={`/learn/${slug}`}
      className={cn(
        "group relative flex lg:flex-col gap-4 lg:gap-0 lg:text-center lg:items-center",
        "rounded-2xl bg-white border border-border p-5 lg:p-5",
        "transition-all duration-300 hover:border-un-200 hover:-translate-y-1 hover:shadow-bloom",
      )}
    >
      {/* Circle with chapter numeral — same size every card */}
      <div className="relative shrink-0">
        {/* outer pulse on first card */}
        {isFirst && (
          <m.div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: accent.ink }}
            animate={{ opacity: [0.25, 0, 0.25], scale: [1, 1.7, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <div
          className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center bg-white border-2 transition-colors duration-300 group-hover:scale-105"
          style={{
            borderColor: accent.ring,
            boxShadow: `0 0 0 8px var(--surface-0), 0 8px 20px ${accent.soft}`,
          }}
        >
          <span
            className="font-display font-medium text-[34px] leading-none italic"
            style={{ color: accent.ink }}
          >
            {String(number).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 lg:mt-6 min-w-0">
        <div className="flex items-center lg:justify-center gap-2 mb-2">
          <Icon size={20} accent={accent.ink} />
          <span
            className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
            style={{ color: accent.ink }}
          >
            Phase {number}
          </span>
        </div>
        <h3
          className="font-display text-[24px] lg:text-[22px] leading-[1.1] tracking-[-0.01em] text-ink-1"
          style={{ fontWeight: 500 }}
        >
          {title}
        </h3>
        <p className="mt-2 text-[13.5px] text-ink-2 leading-relaxed lg:px-1">
          {subtitle}
        </p>

        {/* focus pills */}
        <div className="mt-3 flex flex-wrap gap-1.5 lg:justify-center">
          {focus.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[10.5px] px-2 py-0.5 rounded-full bg-surface-2 text-ink-3 font-medium"
            >
              {f}
            </span>
          ))}
        </div>

        {/* time + arrow */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between lg:justify-center lg:gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-ink-3 font-medium">
            <Clock className="w-3 h-3" />
            {minutes} min
          </span>
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border lg:hidden group-hover:border-un-300 group-hover:bg-un-50 transition-colors"
          >
            <ArrowUpRight
              className="w-3.5 h-3.5 text-ink-2 group-hover:text-un-700"
              strokeWidth={2.2}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function accentToken(accent: string) {
  // Returns ring border + dark ink + soft shadow color
  switch (accent) {
    case "un-blue":
      return {
        ring: "var(--un-blue-200)",
        ink: "var(--un-blue)",
        soft: "rgba(0,111,183,0.18)",
      };
    case "navy":
      return {
        ring: "rgba(10,37,64,0.25)",
        ink: "var(--un-blue-900)",
        soft: "rgba(10,37,64,0.16)",
      };
    case "teal":
      return {
        ring: "rgba(20,184,166,0.35)",
        ink: "var(--teal)",
        soft: "rgba(20,184,166,0.18)",
      };
    case "amber":
      return {
        ring: "rgba(245,158,11,0.4)",
        ink: "var(--amber)",
        soft: "rgba(245,158,11,0.2)",
      };
    default:
      return {
        ring: "var(--un-blue-200)",
        ink: "var(--un-blue)",
        soft: "rgba(0,111,183,0.18)",
      };
  }
}
