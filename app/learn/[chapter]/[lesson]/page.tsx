import { notFound } from "next/navigation";
import { LessonShell, type LessonMeta } from "@/components/lesson/LessonShell";
import {
  LESSONS,
  LESSON_INDEX,
  getLessonsByChapter,
  type LessonEntry,
} from "@/content/lessons-manifest";

type Params = { chapter: string; lesson: string };

export async function generateStaticParams(): Promise<Params[]> {
  return LESSONS.map((l) => ({ chapter: l.chapter, lesson: l.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { chapter, lesson } = await props.params;
  const entry = LESSON_INDEX[`${chapter}/${lesson}`];
  if (!entry) return { title: "Lesson not found" };
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.lede,
  };
}

/** Strip the non-serializable Component so it can be passed to the client. */
function toMeta(e: LessonEntry): LessonMeta {
  return {
    chapter: e.chapter,
    slug: e.slug,
    href: e.href,
    frontmatter: e.frontmatter,
  };
}

export default async function LessonPage(props: { params: Promise<Params> }) {
  const { chapter, lesson } = await props.params;
  const entry = LESSON_INDEX[`${chapter}/${lesson}`];
  if (!entry) notFound();

  const chapterLessons = getLessonsByChapter(chapter);
  const idx = chapterLessons.findIndex((l) => l.slug === lesson);
  const prevEntry =
    idx > 0
      ? chapterLessons[idx - 1]
      : findPrevChapterLast(chapter);
  const nextEntry =
    idx >= 0 && idx < chapterLessons.length - 1
      ? chapterLessons[idx + 1]
      : findNextChapterFirst(chapter);

  const Content = entry.Component;

  return (
    <LessonShell
      lesson={toMeta(entry)}
      prev={prevEntry ? toMeta(prevEntry) : null}
      next={nextEntry ? toMeta(nextEntry) : null}
      chapterLessons={chapterLessons.map(toMeta)}
    >
      <Content />
    </LessonShell>
  );
}

const CHAPTER_ORDER = [
  "preparation",
  "design",
  "fieldwork",
  "reporting",
  "dissemination",
] as const;

function findPrevChapterLast(currentChapter: string): LessonEntry | null {
  const idx = CHAPTER_ORDER.indexOf(currentChapter as never);
  if (idx <= 0) return null;
  const prevChapter = CHAPTER_ORDER[idx - 1];
  const lessons = getLessonsByChapter(prevChapter);
  return lessons[lessons.length - 1] ?? null;
}

function findNextChapterFirst(currentChapter: string): LessonEntry | null {
  const idx = CHAPTER_ORDER.indexOf(currentChapter as never);
  if (idx < 0 || idx >= CHAPTER_ORDER.length - 1) return null;
  const nextChapter = CHAPTER_ORDER[idx + 1];
  const lessons = getLessonsByChapter(nextChapter);
  return lessons[0] ?? null;
}
