import type { ReactNode } from "react";

/**
 * "In practice" block — anchors abstract content to a real CPE scenario.
 *
 *   <InPractice country="Bangladesh, 2024">
 *     The launch meeting brought together 14 CO staff plus the RO M&E Adviser...
 *   </InPractice>
 */
export function InPractice({
  country,
  children,
}: {
  country?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="my-6 rounded-2xl border-l-[3px] pl-5 pr-5 py-4"
      style={{
        background: "rgba(19, 22, 25, 0.025)",
        borderLeftColor: "var(--un-blue-900)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          aria-hidden
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--un-blue-900)" }}
        />
        <span
          className="text-[10.5px] uppercase tracking-[0.16em] font-semibold"
          style={{ color: "var(--un-blue-900)" }}
        >
          In practice {country && `· ${country}`}
        </span>
      </div>
      <div className="text-[14.5px] leading-[1.65] text-ink-1 italic">
        {children}
      </div>
    </section>
  );
}
