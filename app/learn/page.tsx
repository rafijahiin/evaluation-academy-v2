import { Reveal } from "@/components/motion/Reveal";

export const metadata = { title: "Course dashboard" };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Reveal>
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Dashboard
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          Your course
        </h1>
        <p className="mt-4 text-ink-2 max-w-xl">
          Dashboard coming soon — the bento chapter grid and progress ring will
          live here. For now, you can dive into a phase from the homepage.
        </p>
      </Reveal>
    </div>
  );
}
