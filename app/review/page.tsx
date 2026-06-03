import type { Metadata } from "next";
import { ReviewClient } from "@/components/review/ReviewClient";

export const metadata: Metadata = {
  title: "Flashcards & review",
  description:
    "Spaced-repetition flashcards built from every key term in the course.",
};

export default function ReviewPage() {
  return <ReviewClient />;
}
