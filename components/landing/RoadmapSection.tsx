import { CPERoadmap } from "@/components/diagrams/CPERoadmap";

/**
 * Landing-page wrapper around the CPE Roadmap diagram. Sits between
 * "The Journey" and "Global Mandate" — gives visitors a glance at the
 * 11-month timeline before they click into a chapter.
 */
export function RoadmapSection() {
  return (
    <section className="bg-surface-1 border-t border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-un-700">
            One CPE · eleven months
          </div>
          <h2 className="font-display mt-2 text-[28px] sm:text-[40px] leading-[1.05] tracking-[-0.02em] text-ink-1">
            The roadmap at a glance
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.6] text-ink-3 max-w-2xl mx-auto">
            Five phases, sequenced and overlapping. Click a phase bar to see the milestones,
            tools, and deliverables that come with it.
          </p>
        </div>
        <CPERoadmap />
      </div>
    </section>
  );
}
