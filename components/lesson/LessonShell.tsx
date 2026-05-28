"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Check } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import { useProgress } from "@/lib/progress";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LessonFrontmatter } from "@/content/lessons-manifest";

/**
 * Serializable lesson metadata. The MDX component itself can't be
 * passed across the server→client boundary as a prop, so the server
 * page renders <Content /> inline as `children`.
 */
export type LessonMeta = {
  chapter: string;
  slug: string;
  href: string;
  frontmatter: LessonFrontmatter;
};

type Props = {
  lesson: LessonMeta;
  prev: LessonMeta | null;
  next: LessonMeta | null;
  chapterLessons: LessonMeta[];
  children: ReactNode;
};

export function LessonShell({
  lesson,
  prev,
  next,
  chapterLessons,
  children,
}: Props) {
  const chapter = CHAPTERS.find((c) => c.slug === lesson.chapter);
  const { state, markComplete } = useProgress();
  const isCompleted = state.lessonsCompleted.includes(
    `${lesson.chapter}/${lesson.slug}`,
  );

  // Mark this lesson as the "last lesson" so the navbar Resume goes back here
  useEffect(() => {
    const key = `${lesson.chapter}/${lesson.slug}`;
    if (state.lastLessonSlug !== lesson.slug) {
      markComplete(key, lesson.chapter);
    }
    // Note: markComplete adds to lessonsCompleted as a side effect. We
    // want "viewed" tracking — for now treat opening a lesson as completion.
    // A future Task can split into views vs completions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.chapter, lesson.slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-4 sm:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:gap-12">
        {/* TOC rail */}
        <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-2">
          <Link
            href={`/learn/${lesson.chapter}`}
            className="inline-flex items-center gap-1.5 text-[11.5px] uppercase tracking-[0.14em] font-semibold text-un-700 hover:text-un-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            {chapter ? `Phase ${chapter.number} · ${chapter.title}` : "Back"}
          </Link>

          <ul className="space-y-1">
            {chapterLessons.map((l) => {
              const isActive = l.slug === lesson.slug;
              const done = state.lessonsCompleted.includes(
                `${l.chapter}/${l.slug}`,
              );
              return (
                <li key={l.slug}>
                  <Link
                    href={l.href}
                    className={cn(
                      "group flex items-start gap-2.5 px-2 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "bg-un-50 text-un-800"
                        : "hover:bg-surface-2 text-ink-2",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold",
                        isActive
                          ? "bg-un-700 text-white"
                          : done
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-surface-2 text-ink-3 border border-border",
                      )}
                    >
                      {done && !isActive ? (
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : (
                        l.frontmatter.order
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[12.5px] leading-[1.4]",
                        isActive && "font-medium",
                      )}
                    >
                      {l.frontmatter.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Reading column */}
        <article className="max-w-[680px] mx-auto lg:mx-0">
          {/* Header */}
          <header className="mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-un-700">
                {chapter
                  ? `Phase ${chapter.number} · ${chapter.title}`
                  : "Lesson"}
              </span>
              <span
                aria-hidden
                className="w-1 h-1 rounded-full bg-ink-4"
              />
              <span className="inline-flex items-center gap-1 text-[12px] text-ink-3">
                <Clock className="w-3 h-3" />
                {lesson.frontmatter.estimatedMinutes} min read
              </span>
            </div>
            <h1 className="font-display text-[clamp(32px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
              {lesson.frontmatter.title}
            </h1>
            {lesson.frontmatter.lede && (
              <p className="mt-4 text-[18px] sm:text-[19px] leading-[1.55] text-ink-2 italic">
                {lesson.frontmatter.lede}
              </p>
            )}
            {isCompleted && (
              <div className="mt-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11.5px] font-medium">
                <Check className="w-3 h-3" strokeWidth={3} />
                Lesson complete
              </div>
            )}
          </header>

          {/* MDX body — rendered by the server page and passed as children */}
          <div className="lesson-prose">{children}</div>

          {/* Prev / next */}
          <nav className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
            {prev ? (
              <Link
                href={prev.href}
                className="group flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border bg-white hover:border-un-200 hover:-translate-y-0.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0 text-ink-3 group-hover:text-un-700" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
                    Previous
                  </div>
                  <div className="text-[13.5px] text-ink-1 font-medium truncate">
                    {prev.frontmatter.title}
                  </div>
                </div>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                href={next.href}
                className="group flex-1 flex items-center justify-end gap-3 px-4 py-3.5 rounded-2xl border bg-un-700 hover:bg-un-800 hover:-translate-y-0.5 transition-all text-white"
                style={{
                  borderColor: "var(--un-blue-800)",
                }}
              >
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-un-100 font-semibold">
                    Next
                  </div>
                  <div className="text-[13.5px] text-white font-medium truncate">
                    {next.frontmatter.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ) : (
              <Link
                href="/learn"
                className="flex-1 flex items-center justify-end gap-3 px-4 py-3.5 rounded-2xl border bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all text-white"
              >
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-emerald-100 font-semibold">
                    Course complete
                  </div>
                  <div className="text-[13.5px] text-white font-medium">
                    Back to dashboard
                  </div>
                </div>
                <Check className="w-4 h-4 shrink-0" />
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
