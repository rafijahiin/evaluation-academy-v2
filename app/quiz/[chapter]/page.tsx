import { notFound } from "next/navigation";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { CHAPTERS } from "@/content/chapters";
import { CHAPTER_QUIZZES } from "@/content/quizzes";

type Params = { chapter: string };

export async function generateStaticParams(): Promise<Params[]> {
  return CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { chapter } = await props.params;
  const c = CHAPTERS.find((ch) => ch.slug === chapter);
  if (!c) return { title: "Quiz not found" };
  return {
    title: `${c.title} chapter quiz`,
    description: `Test your understanding of Phase ${c.number}: ${c.title}.`,
  };
}

export default async function ChapterQuizPage(props: {
  params: Promise<Params>;
}) {
  const { chapter } = await props.params;
  const meta = CHAPTERS.find((c) => c.slug === chapter);
  if (!meta) notFound();
  const questions = CHAPTER_QUIZZES[chapter] ?? [];

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Chapter quiz
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          {meta.title}
        </h1>
        <div className="mt-6 rounded-2xl border border-border bg-white px-5 py-6">
          <p className="text-[15px] text-ink-2 leading-relaxed">
            No chapter quiz is configured for {meta.title} yet. Try the final
            exam — it covers every phase.
          </p>
          <a
            href="/exam"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-[13px] font-medium"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            Go to final exam
          </a>
        </div>
      </div>
    );
  }

  return (
    <QuizEngine
      title={`${meta.title} quiz`}
      subtitle={`Test your understanding of Phase ${meta.number}: ${meta.title}. Pass at 70% or higher.`}
      questions={questions}
      passThreshold={0.7}
      mode="chapter"
      chapter={chapter}
      passActionHref={`/learn/${chapter}`}
      passActionLabel="Back to chapter"
    />
  );
}
