import { CHAPTERS } from "@/content/chapters";
import { LESSONS } from "@/content/lessons-manifest";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Your course dashboard",
  description: "Track progress across the 5-phase evaluation journey.",
};

export default function DashboardPage() {
  // Pre-compute lesson counts per chapter at build time so the client side
  // only has to read localStorage for completion state.
  const chapterStats = CHAPTERS.map((c) => {
    const lessons = LESSONS.filter((l) => l.chapter === c.slug).sort(
      (a, b) => a.frontmatter.order - b.frontmatter.order,
    );
    return {
      slug: c.slug,
      number: c.number,
      title: c.title,
      subtitle: c.subtitle,
      tagline: c.tagline,
      focus: c.focus,
      accent: c.accent,
      estimatedMinutes: c.estimatedMinutes,
      totalLessons: lessons.length,
      firstLessonHref: lessons[0]?.href ?? `/learn/${c.slug}`,
      lessonSlugs: lessons.map((l) => `${l.chapter}/${l.slug}`),
    };
  });

  return <DashboardClient chapters={chapterStats} totalLessons={LESSONS.length} />;
}
