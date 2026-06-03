import { Hero } from "@/components/hero/Hero";
import { TheJourney } from "@/components/landing/TheJourney";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { GlobalMandate } from "@/components/landing/GlobalMandate";

// Footer is rendered globally in app/layout.tsx — not here, to avoid duplication.
export default function HomePage() {
  return (
    <>
      <Hero />
      <TheJourney />
      <RoadmapSection />
      <GlobalMandate />
    </>
  );
}
