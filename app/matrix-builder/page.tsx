import type { Metadata } from "next";
import { MatrixBuilderClient } from "@/components/matrix-builder/MatrixBuilderClient";

export const metadata: Metadata = {
  title: "Evaluation Matrix Builder",
  description:
    "Build a CPE evaluation matrix question by question — criteria, assumptions, indicators, sources, and methods — then print or export to CSV.",
};

export default function MatrixBuilderPage() {
  return <MatrixBuilderClient />;
}
