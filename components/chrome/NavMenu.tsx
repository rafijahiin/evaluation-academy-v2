"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import {
  ChevronDown,
  LayoutDashboard,
  GitBranch,
  Table2,
  Gamepad2,
  Layers,
  GraduationCap,
  Award,
  BookOpen,
} from "lucide-react";
import { CHAPTERS } from "@/content/chapters";

/**
 * "Learn" navbar menu — a single entry point that reveals every
 * destination on the site, grouped into Course / Tools / Assess.
 */

type Item = { label: string; href: string; icon: typeof BookOpen; sub?: string };

const TOOLS: Item[] = [
  { label: "ToC Builder", href: "/toc-builder", icon: GitBranch, sub: "Theory of Change" },
  { label: "Matrix Builder", href: "/matrix-builder", icon: Table2, sub: "Evaluation matrix" },
  { label: "Run a CPE", href: "/scenario", icon: Gamepad2, sub: "Decision game" },
  { label: "Flashcards", href: "/review", icon: Layers, sub: "Spaced repetition" },
];

const ASSESS: Item[] = [
  { label: "Final exam", href: "/exam", icon: GraduationCap, sub: "Earn your certificate" },
  { label: "Certificate", href: "/certificate", icon: Award, sub: "Record of completion" },
];

export function NavMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const phaseActive = pathname.startsWith("/learn");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13.5px] font-semibold transition-colors ${
          open || phaseActive
            ? "text-un-700 bg-un-50"
            : "text-ink-1 hover:bg-surface-2"
        }`}
      >
        Learn
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full mt-2 w-[min(92vw,520px)] max-h-[75vh] overflow-y-auto rounded-2xl bg-white border border-border shadow-bloom z-50"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Course column */}
              <div className="p-2.5 sm:border-r border-border">
                <MenuHeader>Course</MenuHeader>
                <MenuRow
                  href="/learn"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  sub="Overview & progress"
                  active={pathname === "/learn"}
                />
                {CHAPTERS.map((c) => (
                  <MenuRow
                    key={c.slug}
                    href={`/learn/${c.slug}`}
                    icon={BookOpen}
                    label={c.title}
                    sub={`Phase ${c.number}`}
                    active={pathname === `/learn/${c.slug}`}
                    badge={c.number}
                  />
                ))}
              </div>

              {/* Tools + Assess column */}
              <div className="p-2.5">
                <MenuHeader>Practice &amp; tools</MenuHeader>
                {TOOLS.map((t) => (
                  <MenuRow
                    key={t.href}
                    href={t.href}
                    icon={t.icon}
                    label={t.label}
                    sub={t.sub}
                    active={pathname === t.href}
                  />
                ))}
                <div className="my-2 border-t border-border" />
                <MenuHeader>Assess</MenuHeader>
                {ASSESS.map((t) => (
                  <MenuRow
                    key={t.href}
                    href={t.href}
                    icon={t.icon}
                    label={t.label}
                    sub={t.sub}
                    active={pathname === t.href}
                  />
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-[0.14em] font-bold text-ink-4">
      {children}
    </div>
  );
}

function MenuRow({
  href,
  icon: Icon,
  label,
  sub,
  active,
  badge,
}: {
  href: string;
  icon: typeof BookOpen;
  label: string;
  sub?: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
        active ? "bg-un-50" : "hover:bg-surface-2"
      }`}
    >
      <span
        className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-[12px] font-bold ${
          active ? "text-white" : "text-un-700 bg-un-50 group-hover:bg-white"
        }`}
        style={active ? { background: "var(--un-blue)" } : undefined}
      >
        {badge != null ? (
          String(badge).padStart(2, "0")
        ) : (
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-medium text-ink-1 truncate">
          {label}
        </span>
        {sub && (
          <span className="block text-[11.5px] text-ink-3 truncate">{sub}</span>
        )}
      </span>
    </Link>
  );
}
