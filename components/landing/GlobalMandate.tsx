"use client";
import { m } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

/**
 * Stylised world map with priority UNFPA country pins.
 * Map is a simplified Robinson projection rendered as decorative SVG
 * (not for navigation). Pins pulse subtly on a stagger.
 */
const PINS = [
  { name: "Bangladesh", x: 718, y: 248 },
  { name: "Kenya", x: 595, y: 305 },
  { name: "Mozambique", x: 605, y: 365 },
  { name: "Mali", x: 510, y: 280 },
  { name: "Haiti", x: 295, y: 270 },
  { name: "Indonesia", x: 770, y: 340 },
];

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
        {/* subtle grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* left: copy */}
          <Reveal className="lg:col-span-5">
            <span className="text-[11px] uppercase tracking-[0.16em] text-un-200 font-semibold">
              Global mandate
            </span>
            <h2 className="font-display mt-3 text-[clamp(34px,4.5vw,52px)] leading-[1.04] tracking-[-0.02em] text-white">
              Country Programme Evaluations across{" "}
              <span className="italic" style={{ color: "var(--teal)" }}>
                150+ countries
              </span>
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-un-100/80 max-w-md">
              UNFPA Country Programme Evaluations follow the same five-phase
              method whether the programme is in Dhaka, Nairobi, or Port-au-Prince.
              The handbook is the shared language.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
              <Statline number={150} suffix="+" label="Country offices" />
              <Statline number={6} label="Continents" />
              <Statline number={1994} label="UNFPA founded" decimals={0} />
              <Statline number={5} label="Phases per CPE" />
            </div>
          </Reveal>

          {/* right: map */}
          <div className="lg:col-span-7">
            <m.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[1000/520] w-full"
            >
              <WorldMapSVG />
              {/* pins */}
              {PINS.map((pin, idx) => (
                <m.div
                  key={pin.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: 0.5 + idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute"
                  style={{
                    left: `${(pin.x / 1000) * 100}%`,
                    top: `${(pin.y / 520) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={pin.name}
                >
                  <div className="relative">
                    <m.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--teal)" }}
                      animate={{
                        scale: [1, 2.4, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: idx * 0.3,
                        ease: "easeOut",
                      }}
                    />
                    <div
                      className="relative w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "var(--teal)",
                        boxShadow: "0 0 0 3px rgba(20,184,166,0.25)",
                      }}
                    />
                  </div>
                </m.div>
              ))}
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
  decimals = 0,
}: {
  number: number;
  label: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div>
      <div className="font-numeric font-semibold text-[32px] sm:text-[40px] tracking-tight text-white leading-none">
        <CountUp to={number} decimals={decimals} suffix={suffix} />
      </div>
      <div className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-un-200 font-medium">
        {label}
      </div>
    </div>
  );
}

/**
 * Highly simplified world map paths — decorative, not geographic-grade.
 * Dotted style for a quiet, editorial feel.
 */
function WorldMapSVG() {
  return (
    <svg
      viewBox="0 0 1000 520"
      width="100%"
      height="100%"
      className="opacity-[0.45]"
      aria-hidden
    >
      <defs>
        <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="rgba(159, 201, 232, 0.5)" />
        </pattern>
      </defs>
      {/* Approximate continents — dot-cloud silhouettes */}
      <g fill="url(#dots)">
        {/* North America */}
        <path d="M120,140 Q200,90 290,110 Q360,135 380,200 Q360,260 300,270 Q230,265 170,240 Q120,210 120,140Z" />
        {/* South America */}
        <path d="M290,310 Q330,290 360,330 Q380,400 340,460 Q300,480 280,440 Q270,380 290,310Z" />
        {/* Europe */}
        <path d="M470,140 Q520,120 570,135 Q580,180 540,210 Q500,220 475,195 Q465,170 470,140Z" />
        {/* Africa */}
        <path d="M495,235 Q555,225 590,265 Q615,340 590,400 Q540,440 510,400 Q480,330 495,235Z" />
        {/* Asia */}
        <path d="M600,150 Q700,120 800,140 Q860,180 870,250 Q810,300 720,290 Q620,260 600,200 Q595,170 600,150Z" />
        {/* SE Asia / Oceania */}
        <path d="M780,330 Q830,320 870,355 Q860,400 820,410 Q780,395 770,360 Q770,340 780,330Z" />
        <path d="M840,420 Q880,410 905,440 Q895,470 860,470 Q830,455 840,420Z" />
      </g>
    </svg>
  );
}
