import { Hero } from "@/components/hero/Hero";
import { TheJourney } from "@/components/landing/TheJourney";
import { GlobalMandate } from "@/components/landing/GlobalMandate";
import { Footer } from "@/components/chrome/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TheJourney />
      <GlobalMandate />
      <Footer />
    </>
  );
}
