import { Reveal } from "@/components/motion/Reveal";

export const metadata = { title: "Theory of Change Builder" };

export default function TocBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Reveal>
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Interactive tool
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          Build your <span className="italic" style={{ color: "var(--un-blue)" }}>Theory of Change</span>
        </h1>
        <p className="mt-4 text-ink-2 max-w-xl">
          Six-step wizard coming back in a reskinned form. Map your causal chain
          and walk away with a printable document.
        </p>
      </Reveal>
    </div>
  );
}
