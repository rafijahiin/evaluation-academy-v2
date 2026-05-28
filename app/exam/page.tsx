import { QuizEngine } from "@/components/quiz/QuizEngine";
import { FINAL_EXAM, PASS_THRESHOLD } from "@/content/quizzes";

export const metadata = {
  title: "Final exam",
  description:
    "Seventeen-question final exam on the UNFPA CPE methodology — pass to earn your certificate.",
};

export default function ExamPage() {
  return (
    <QuizEngine
      title="Final exam"
      subtitle="Seventeen questions covering the full five-phase CPE methodology. Pass at 80% or higher to earn your certificate."
      questions={FINAL_EXAM}
      passThreshold={PASS_THRESHOLD}
      mode="exam"
      passActionHref="/certificate"
      passActionLabel="Get your certificate"
    />
  );
}
