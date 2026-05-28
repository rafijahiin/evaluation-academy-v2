import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import { getLessonsByChapter } from "@/content/lessons-manifest";
import { CHAPTER_ICONS } from "@/components/illustrations/ChapterIcon";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/motion/Reveal";

type Params = { chapter: string };

export async function generateStaticParams(): Promise<Params[]> {
  return CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { chapter } = await props.params;
  const c = CHAPTERS.find((ch) => ch.slug === chapter);
  if (!c) return { title: "Chapter not found" };
  return { title: `${c.title} — Phase ${c.number}`, description: c.tagline };
}

export default async function ChapterIndexPage(props: {
  params: Promise<Params>;
}) {
  const { chapter } = await props.params;
  const meta = CHAPTERS.find((c) => c.slug === chapter);
  if (!meta) notFound();

  const lessons = getLessonsByChapter(chapter);
  const Icon = CHAPTER_ICONS[chapter as keyof typeof CHAPTER_ICONS];
  const accentColor = accentInk(meta.accent);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-12">
          {/* big numeral + icon */}
          <div className="shrink-0 flex items-center gap-4">
            <div
              className="font-display font-medium text-[120px] sm:text-[160px] leading-none"
              style={{ color: accentColor, opacity: 0.22 }}
            >
              {String(meta.number).padStart(2, "0")}
            </div>
            {Icon && (
              <div style={{ color: accentColor }}>
                <Icon size={88} accent={accentColor} />
              </div>
            )}
          </div>

          {/* title block */}
          <div className="flex-1 min-w-0">
            <span
              className="text-[11px] uppercase tracking-[0.14em] font-semibold"
              style={{ color: accentColor }}
            >
              Phase {meta.number} · {meta.estimatedMinutes} min
            </span>
            <h1 className="font-display mt-2 text-[clamp(36px,5vw,56px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
              {meta.title}
            </h1>
            <p className="mt-3 text-[19px] leading-[1.5] text-ink-2 max-w-2xl">
              {meta.subtitle}
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-ink-3 max-w-2xl">
              {meta.tagline}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-2 mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3">
        <span className="w-6 h-px bg-ink-4" />
        {lessons.length} lessons
      </div>

      <StaggerChildren className="space-y-3">
        {lessons.map((l, idx) => (
          <StaggerItem key={l.slug}>
            <Link
              href={l.href}
              className="group flex items-center gap-5 sm:gap-6 px-5 sm:px-6 py-4 sm:py-5 rounded-2xl border border-border bg-white hover:border-un-200 hover:-translate-y-0.5 hover:shadow-bloom transition-all"
            >
              {/* number bubble */}
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-display italic font-medium text-[20px]"
                style={{
                  background: "var(--surface-2)",
                  border: `2px solid ${accentColor}33`,
                  color: accentColor,
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>
              {/* content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-ink-1 leading-tight">
                  {l.frontmatter.title}
                </h3>
                {l.frontmatter.lede && (
                  <p className="mt-1 text-[13.5px] text-ink-2 leading-[1.5] line-clamp-2">
                    {l.frontmatter.lede}
                  </p>
                )}
              </div>
              {/* meta + arrow */}
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <span className="inline-flex items-center gap-1 text-[12px] text-ink-3 font-medium">
                  <Clock className="w-3 h-3" />
                  {l.frontmatter.estimatedMinutes}m
                </span>
                <ArrowRight
                  className="w-4 h-4 text-ink-3 group-hover:text-un-700 group-hover:translate-x-1 transition-all"
                  strokeWidth={2.2}
                />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
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
