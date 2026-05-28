import { Hero } from "@/components/hero/Hero";
import { ChaptersBento } from "@/components/landing/ChaptersBento";
import { GlobalMandate } from "@/components/landing/GlobalMandate";
import { Footer } from "@/components/chrome/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ChaptersBento />
      <GlobalMandate />
      <Footer />
    </>
  );
}
