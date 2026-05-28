"use client";
import { forwardRef } from "react";
import { m } from "motion/react";
import { Compass } from "lucide-react";
import { Seal } from "@/components/quiz/Seal";

type Props = {
  learnerName: string;
  completedAt: Date;
  scorePercent: number;
};

/**
 * The actual certificate composition — rendered as a centered card with
 * a cream paper texture, oversized Fraunces title, learner name in italic,
 * date, and an animated seal in the corner.
 *
 * forwardRef so the parent can target it for print + html2canvas if needed.
 */
export const Certificate = forwardRef<HTMLDivElement, Props>(function Certificate(
  { learnerName, completedAt, scorePercent },
  ref,
) {
  const dateString = completedAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="certificate-paper relative mx-auto"
      style={{
        background:
          "linear-gradient(180deg, #FBFAF6 0%, #F5F2EA 100%)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-2xl)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 60px -25px rgba(15,23,42,0.18)",
        width: "min(100%, 880px)",
        aspectRatio: "1.414 / 1", // A4 landscape proportion
        padding: "clamp(28px, 5vw, 60px)",
      }}
    >
      {/* Decorative double border */}
      <div
        aria-hidden
        className="absolute inset-4 sm:inset-6 rounded-2xl pointer-events-none"
        style={{
          border: "1px solid rgba(0, 111, 183, 0.18)",
          boxShadow: "inset 0 0 0 4px rgba(0, 111, 183, 0.04)",
        }}
      />

      {/* Header brand */}
      <div className="relative flex items-center gap-2.5 mb-4">
        <span
          aria-hidden
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
          }}
        >
          <Compass className="w-5 h-5 text-white" strokeWidth={2.2} />
        </span>
        <div className="leading-tight">
          <div
            className="font-display font-semibold text-[16px] tracking-tight"
            style={{ color: "var(--ink-1)" }}
          >
            Evaluation{" "}
            <span className="italic" style={{ color: "var(--un-blue-700)" }}>
              Academy
            </span>
          </div>
          <div className="text-[9.5px] uppercase tracking-[0.16em] text-ink-3 font-medium mt-0.5">
            UNFPA Evaluation Handbook 2024
          </div>
        </div>
      </div>

      {/* Main composition */}
      <div className="relative text-center mt-2">
        <div className="text-[11px] uppercase tracking-[0.22em] font-semibold text-un-700">
          Certificate of Completion
        </div>

        <m.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 leading-[1.05] tracking-[-0.02em] text-ink-1"
          style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 500 }}
        >
          This certifies that
        </m.h1>

        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-6 sm:mt-8"
        >
          <div
            className="font-display italic font-medium leading-none tracking-[-0.02em]"
            style={{
              fontSize: "clamp(36px, 7vw, 72px)",
              color: "var(--un-blue-800)",
            }}
          >
            {learnerName}
          </div>
        </m.div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 sm:mt-8 max-w-2xl mx-auto text-ink-2 leading-relaxed"
          style={{ fontSize: "clamp(13px, 1.6vw, 16px)" }}
        >
          has successfully completed the course in the{" "}
          <strong className="text-ink-1 font-semibold">
            UNFPA Country Programme Evaluation methodology
          </strong>{" "}
          — covering all five phases from preparation through dissemination —
          and passed the final exam with a score of{" "}
          <strong className="text-ink-1 font-semibold">{scorePercent}%</strong>.
        </m.p>

        {/* Date + seal row */}
        <div className="mt-10 sm:mt-12 flex items-end justify-between gap-6 px-2 sm:px-6">
          <div className="text-left flex-1 min-w-0">
            <div
              className="border-b border-ink-2 pb-1 mb-1"
              style={{ width: "min(220px, 60%)" }}
            />
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
              Date of completion
            </div>
            <div className="mt-0.5 font-numeric text-[13.5px] font-semibold text-ink-1">
              {dateString}
            </div>
          </div>
          <div className="shrink-0">
            <Seal size={96} label="Certified" delay={0.85} />
          </div>
        </div>
      </div>

      {/* Footer fine print */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 right-6 sm:right-10 text-center">
        <div className="text-[9.5px] uppercase tracking-[0.18em] text-ink-3 font-medium">
          Independent learning · Based on the UNFPA Evaluation Handbook 2024
        </div>
      </div>
    </m.div>
  );
});
