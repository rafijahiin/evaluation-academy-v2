"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "motion/react";
import { cn } from "@/lib/utils";
import { useProgress, computePercent } from "@/lib/progress";
import { COURSE_META } from "@/content/chapters";
import { ArrowRight, Compass } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { state } = useProgress();
  const percent = computePercent(state.lessonsCompleted.length, COURSE_META.totalLessons);
  const hasProgress = state.lessonsCompleted.length > 0;
  const resumeHref = state.lastChapterSlug && state.lastLessonSlug
    ? `/learn/${state.lastChapterSlug}/${state.lastLessonSlug}`
    : "/learn";

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <m.nav
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-2xl shadow-card flex items-center justify-between gap-3 px-4 sm:px-5 py-3"
        >
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Evaluation Academy — home"
          >
            <span
              aria-hidden
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
                boxShadow: "0 4px 10px rgba(0,111,183,0.28)",
              }}
            >
              <Compass className="w-5 h-5 text-white" strokeWidth={2.2} />
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[18px] font-semibold tracking-tight text-ink-1">
                Evaluation <span className="italic" style={{ color: "var(--un-blue)" }}>Academy</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-ink-3 mt-0.5">
                UNFPA Handbook 2024
              </span>
            </span>
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {hasProgress && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-un-50 text-un-700 text-xs font-medium">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--un-blue)" }}
                />
                {percent}% complete
              </div>
            )}

            <Link
              href="/toc-builder"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium",
                "text-un-700 border border-un-200 hover:bg-un-50 transition-colors",
              )}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <rect x="2" y="8" width="5" height="8" rx="1.5" />
                <rect x="9.5" y="8" width="5" height="8" rx="1.5" />
                <rect x="17" y="8" width="5" height="8" rx="1.5" />
                <path d="M7 12h2.5M14.5 12H17" />
              </svg>
              <span>ToC Builder</span>
            </Link>

            {hasProgress && (
              <Link
                href={resumeHref}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-ink-1 border border-border hover:bg-surface-2 transition-colors"
              >
                Resume
              </Link>
            )}

            <Link
              href={hasProgress ? resumeHref : "/learn"}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium text-white transition-all",
                "shadow-card hover:shadow-bloom hover:-translate-y-0.5",
              )}
              style={{
                background:
                  "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
              }}
            >
              {hasProgress ? "Continue" : "Start reading"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </m.nav>
      </div>
    </header>
  );
}
