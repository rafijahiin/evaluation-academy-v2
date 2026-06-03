"use client";
import Link from "next/link";
import { ArrowRight, Check, Play, Flame, Trophy, Layers, Lock } from "lucide-react";
import {
  useProgress,
  useXp,
  computePercent,
  computeBadges,
} from "@/lib/progress";
import { ProgressRing } from "@/components/motion/ProgressRing";
import { CHAPTER_ICONS } from "@/components/illustrations/ChapterIcon";
import {
  Reveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

type ChapterStat = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  tagline: string;
  focus: string[];
  accent: string;
  estimatedMinutes: number;
  totalLessons: number;
  firstLessonHref: string;
  lessonSlugs: string[];
};

export function DashboardClient({
  chapters,
  totalLessons,
}: {
  chapters: ChapterStat[];
  totalLessons: number;
}) {
  const { state } = useProgress();
  const { xp } = useXp();
  const badges = computeBadges(state, totalLessons);
  const earnedBadges = badges.filter((b) => b.earned).length;
  const streak = state.streak?.current ?? 0;
  const completedSet = new Set(state.lessonsCompleted);
  const completedTotal = state.lessonsCompleted.filter((s) =>
    chapters.some((c) => c.lessonSlugs.includes(s)),
  ).length;
  const overallPercent = computePercent(completedTotal, totalLessons);
  const hasProgress = completedTotal > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
              Course dashboard
            </span>
            <h1 className="font-display mt-2 text-[clamp(38px,5vw,56px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
              {hasProgress ? (
                <>
                  Welcome back.{" "}
                  <span
                    className="italic"
                    style={{ color: "var(--un-blue-700)" }}
                  >
                    Pick up where you left off.
                  </span>
                </>
              ) : (
                <>
                  Your course{" "}
                  <span
                    className="italic"
                    style={{ color: "var(--un-blue-700)" }}
                  >
                    awaits.
                  </span>
                </>
              )}
            </h1>
            <p className="mt-3 text-[17px] leading-[1.55] text-ink-2 max-w-xl">
              Five phases, {totalLessons} focused lessons. Walk the journey end
              to end, or jump to the phase you need.
            </p>
          </div>

          {/* Big progress ring */}
          <div className="flex items-center gap-5 shrink-0 sm:bg-white sm:border sm:border-border sm:rounded-2xl sm:px-6 sm:py-4">
            <ProgressRing
              value={overallPercent}
              size={104}
              stroke={9}
              fillColor="var(--un-blue)"
            />
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
                Overall progress
              </div>
              <div className="font-numeric font-semibold text-[24px] tracking-tight text-ink-1 leading-none mt-1">
                <CountUp to={completedTotal} /> / {totalLessons}
              </div>
              <div className="text-[12px] text-ink-3 mt-0.5">lessons</div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Resume CTA */}
      {hasProgress && state.lastChapterSlug && state.lastLessonSlug && (
        <Reveal>
          <Link
            href={`/learn/${state.lastChapterSlug}/${state.lastLessonSlug}`}
            className="block mb-10 rounded-2xl border border-un-200 bg-un-50/60 px-5 sm:px-6 py-5 hover:border-un-300 hover:bg-un-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="inline-flex items-center justify-center w-11 h-11 rounded-full text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
                }}
              >
                <Play
                  className="w-4 h-4 ml-0.5"
                  strokeWidth={2.4}
                  fill="currentColor"
                />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
                  Resume
                </div>
                <div className="text-[15.5px] font-medium text-ink-1 truncate">
                  Continue in {capitalize(state.lastChapterSlug)}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-un-700 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </Reveal>
      )}

      {/* Stats + badges + flashcards */}
      {hasProgress && (
        <Reveal>
          <div className="mb-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4">
            {/* stat tiles */}
            <div className="grid grid-cols-3 gap-3">
              <DashStat
                icon={Trophy}
                value={`${xp}`}
                label="XP earned"
                accent="var(--un-blue)"
              />
              <DashStat
                icon={Flame}
                value={`${streak}`}
                label={streak === 1 ? "day streak" : "day streak"}
                accent="var(--amber)"
              />
              <DashStat
                icon={Check}
                value={`${earnedBadges}/${badges.length}`}
                label="badges"
                accent="var(--teal)"
              />
            </div>
            {/* flashcards CTA */}
            <Link
              href="/review"
              className="group flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 hover:border-un-200 hover:-translate-y-0.5 transition-all"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-un-50 text-un-700">
                <Layers className="w-5 h-5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-ink-1">
                  Review flashcards
                </span>
                <span className="block text-[12px] text-ink-3">
                  Spaced repetition
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-un-700 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* badge rail */}
          <div className="mb-10 flex flex-wrap gap-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                title={b.description}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                  b.earned
                    ? "bg-white border-un-200 text-ink-1"
                    : "bg-surface-2 border-border text-ink-4"
                }`}
              >
                {b.earned ? (
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {b.label}
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Chapter grid */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {chapters.map((c) => {
          const completed = c.lessonSlugs.filter((s) => completedSet.has(s)).length;
          const percent = computePercent(completed, c.totalLessons);
          const done = completed === c.totalLessons && c.totalLessons > 0;
          const inProgress = completed > 0 && !done;
          const Icon = CHAPTER_ICONS[c.slug as keyof typeof CHAPTER_ICONS];
          const accentColor = accentInk(c.accent);

          return (
            <StaggerItem key={c.slug}>
              <Link
                href={c.firstLessonHref}
                className="group block h-full rounded-2xl border border-border bg-white p-5 sm:p-6 hover:border-un-200 hover:-translate-y-1 hover:shadow-bloom transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <ProgressRing
                    value={percent}
                    size={64}
                    stroke={6}
                    fillColor={accentColor}
                    label={done ? "✓" : `${percent}%`}
                  />
                  {Icon && (
                    <div style={{ color: accentColor, opacity: 0.85 }}>
                      <Icon size={42} accent={accentColor} />
                    </div>
                  )}
                </div>

                <div>
                  <span
                    className="text-[11px] uppercase tracking-[0.14em] font-semibold"
                    style={{ color: accentColor }}
                  >
                    Phase {c.number} · {c.estimatedMinutes} min
                  </span>
                  <h3 className="font-display mt-1.5 text-[24px] leading-[1.1] tracking-[-0.01em] text-ink-1" style={{ fontWeight: 500 }}>
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-ink-2 leading-[1.5]">
                    {c.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11.5px] text-ink-3 font-medium">
                    {completed} / {c.totalLessons} lessons
                    {done && (
                      <span className="ml-2 inline-flex items-center gap-1 text-emerald-700">
                        <Check className="w-3 h-3" strokeWidth={3} />
                        complete
                      </span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-un-700">
                    {done ? "Review" : inProgress ? "Continue" : "Start"}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function DashStat({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof Flame;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4 flex items-center gap-3">
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
        style={{
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          color: accent,
        }}
      >
        <Icon className="w-5 h-5" strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <div className="font-numeric font-semibold text-[22px] leading-none tabular-nums text-ink-1">
          {value}
        </div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-3 font-medium">
          {label}
        </div>
      </div>
    </div>
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
