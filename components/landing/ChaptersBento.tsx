"use client";
import Link from "next/link";
import { m } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import { CHAPTER_ICONS } from "@/components/illustrations/ChapterIcon";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Bento grid of the 5 phases. 1 large hero card + 4 medium cards.
 * Each card hover-lifts with shadow bloom.
 */
export function ChaptersBento() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
              The journey
            </span>
            <h2 className="font-display mt-2 text-[clamp(34px,5vw,56px)] leading-[1.02] tracking-[-0.02em] text-ink-1">
              Five phases. <span className="italic" style={{ color: "var(--un-blue)" }}>One craft.</span>
            </h2>
          </div>
          <p className="text-ink-2 max-w-md text-[16px] leading-relaxed">
            Each phase is a chapter. Each chapter is a series of focused lessons
            with a hands-on tool at the end.
          </p>
        </div>
      </Reveal>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CHAPTERS.map((chapter, idx) => {
          const Icon = CHAPTER_ICONS[chapter.slug as keyof typeof CHAPTER_ICONS];
          // First card (Preparation) is hero — spans 2 cols on lg for a clean
          // bento: [01 wide][02]  / [03][04][05]
          const isHero = idx === 0;
          return (
            <StaggerItem
              key={chapter.slug}
              className={cn(isHero && "lg:col-span-2")}
            >
              <Link
                href={`/learn/${chapter.slug}`}
                className={cn(
                  "group relative h-full overflow-hidden rounded-2xl bg-white border border-border",
                  "transition-all duration-300 hover:border-un-200 hover:-translate-y-1",
                  "hover:shadow-bloom",
                )}
              >
                {/* accent gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: accentBg(chapter.accent),
                  }}
                />

                <div className={cn(
                  "relative p-6 flex flex-col h-full",
                  isHero ? "sm:p-10" : "sm:p-7",
                )}>
                  {/* numeral + icon */}
                  <div className="flex items-start justify-between mb-auto">
                    <div
                      className={cn(
                        "font-display font-medium leading-none",
                        isHero ? "text-[120px] sm:text-[180px]" : "text-[72px] sm:text-[88px]",
                      )}
                      style={{
                        color: accentInk(chapter.accent),
                        opacity: 0.16,
                        marginTop: isHero ? "-12px" : "-6px",
                        marginLeft: "-4px",
                      }}
                    >
                      {String(chapter.number).padStart(2, "0")}
                    </div>
                    <div
                      className={cn(
                        "shrink-0",
                        isHero ? "mt-2" : "mt-1",
                      )}
                      style={{ color: accentInk(chapter.accent) }}
                    >
                      <Icon size={isHero ? 96 : 56} accent={accentInk(chapter.accent)} />
                    </div>
                  </div>

                  {/* title + tagline */}
                  <div className="mt-2">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
                      Phase {chapter.number} · {chapter.estimatedMinutes} min
                    </div>
                    <h3
                      className={cn(
                        "font-display mt-1.5 leading-[1.05] tracking-[-0.02em] text-ink-1",
                        isHero ? "text-[40px] sm:text-[52px]" : "text-[28px]",
                      )}
                      style={{ fontWeight: 500 }}
                    >
                      {chapter.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 text-ink-2 leading-relaxed",
                        isHero ? "text-[17px] max-w-md" : "text-[14px]",
                      )}
                    >
                      {chapter.tagline}
                    </p>
                  </div>

                  {/* footer */}
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/60">
                    <div className="flex flex-wrap gap-1.5">
                      {chapter.focus.slice(0, isHero ? 4 : 2).map((f) => (
                        <span
                          key={f}
                          className="text-[10.5px] px-2 py-0.5 rounded-full bg-surface-2 text-ink-3 font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <m.div
                      className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-border group-hover:border-un-300 group-hover:bg-un-50"
                      whileHover={{ rotate: 0 }}
                      initial={{ rotate: -8 }}
                      animate={{ rotate: -8 }}
                    >
                      <ArrowUpRight
                        className="w-4 h-4 text-ink-2 group-hover:text-un-700 transition-colors"
                        strokeWidth={2.2}
                      />
                    </m.div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </section>
  );
}

function accentInk(accent: string) {
  switch (accent) {
    case "un-blue": return "var(--un-blue)";
    case "teal": return "var(--teal)";
    case "amber": return "var(--amber)";
    case "navy": return "var(--un-blue-900)";
    default: return "var(--un-blue)";
  }
}

function accentBg(accent: string) {
  switch (accent) {
    case "un-blue": return "linear-gradient(135deg, rgba(249,96,0,0.04) 0%, rgba(249,96,0,0.10) 100%)";
    case "teal": return "linear-gradient(135deg, rgba(33,113,236,0.04) 0%, rgba(33,113,236,0.10) 100%)";
    case "amber": return "linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.12) 100%)";
    case "navy": return "linear-gradient(135deg, rgba(19,22,25,0.04) 0%, rgba(19,22,25,0.09) 100%)";
    default: return "transparent";
  }
}
