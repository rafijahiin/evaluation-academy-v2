import { TocBuilderClient } from "@/components/toc-builder/TocBuilderClient";

export const metadata = {
  title: "Theory of Change Builder",
  description:
    "Build a Theory of Change for your country programme step by step — six steps, with assumptions, exported as a printable document.",
};

export default function TocBuilderPage() {
  return <TocBuilderClient />;
}
