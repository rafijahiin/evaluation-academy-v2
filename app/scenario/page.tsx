import type { Metadata } from "next";
import { ScenarioClient } from "@/components/scenario/ScenarioClient";

export const metadata: Metadata = {
  title: "Run a CPE — simulation",
  description:
    "A decision-point simulation: manage a Country Programme Evaluation through eleven months of choices, graded against the handbook.",
};

export default function ScenarioPage() {
  return <ScenarioClient />;
}
