"use client";
import { m } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { WorldMap } from "./WorldMap";

export function GlobalMandate() {
  return (
    <section
      className="relative overflow-hidden border-y border-border"
      style={{
        background:
          "linear-gradient(180deg, var(--un-blue-900) 0%, #061c33 100%)",
      }}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* faint grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* left: copy + stats */}
          <Reveal className="lg:col-span-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-un-200 font-semibold">
              Global mandate
            </span>
            <h2 className="font-display mt-3 text-[clamp(32px,4.5vw,52px)] leading-[1.04] tracking-[-0.02em] text-white">
              The same five phases — across{" "}
              <span className="italic" style={{ color: "var(--teal)" }}>
                150+ countries
              </span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-un-100/80 max-w-md">
              UNFPA Country Programme Evaluations follow the same method
              whether the programme is in Dhaka, Nairobi, or Port-au-Prince.
              The handbook is the shared language.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
              <Statline number={150} suffix="+" label="Country offices" />
              <Statline number={6} label="Continents" />
              <Statline number={1994} label="UNFPA founded" />
              <Statline number={5} label="Phases per CPE" />
            </div>
          </Reveal>

          {/* right: world map */}
          <div className="lg:col-span-8">
            <m.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <WorldMap />
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Statline({
  number,
  label,
  suffix,
}: {
  number: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="font-numeric font-semibold text-[30px] sm:text-[36px] tracking-tight text-white leading-none">
        <CountUp to={number} suffix={suffix} />
      </div>
      <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.14em] text-un-200 font-medium">
        {label}
      </div>
    </div>
  );
}
