"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import {
  Search,
  BookOpen,
  GraduationCap,
  Layers,
  Award,
  PenTool,
  LayoutDashboard,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import { LESSON_SEARCH_INDEX } from "@/content/lesson-index";

/**
 * ⌘K command palette — fuzzy search + jump across every lesson, quiz,
 * and tool. Pure client-side (no AI, no network). Opens on Cmd/Ctrl+K,
 * on "/" outside inputs, or via the window event "open-command-palette".
 */

type Item = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  kind: "lesson" | "quiz" | "exam" | "tool" | "page" | "review";
  haystack: string;
};

const KIND_META: Record<
  Item["kind"],
  { label: string; Icon: typeof BookOpen; color: string }
> = {
  lesson: { label: "Lesson", Icon: BookOpen, color: "var(--un-blue)" },
  quiz: { label: "Quiz", Icon: GraduationCap, color: "var(--teal)" },
  exam: { label: "Exam", Icon: Award, color: "var(--amber)" },
  tool: { label: "Tool", Icon: PenTool, color: "var(--un-blue-700)" },
  page: { label: "Page", Icon: LayoutDashboard, color: "var(--ink-3)" },
  review: { label: "Review", Icon: Layers, color: "var(--un-blue-900)" },
};

function buildItems(): Item[] {
  const items: Item[] = [];

  // Static destinations
  items.push({
    id: "dashboard",
    title: "Course dashboard",
    subtitle: "All five phases",
    href: "/learn",
    kind: "page",
    haystack: "dashboard learn home phases overview",
  });
  items.push({
    id: "toc",
    title: "Theory of Change builder",
    subtitle: "Interactive tool",
    href: "/toc-builder",
    kind: "tool",
    haystack: "theory of change toc builder logic model results chain tool",
  });
  items.push({
    id: "matrix",
    title: "Evaluation Matrix builder",
    subtitle: "Interactive tool",
    href: "/matrix-builder",
    kind: "tool",
    haystack:
      "evaluation matrix builder questions criteria assumptions indicators sources methods table tool",
  });
  items.push({
    id: "scenario",
    title: "Run a CPE (simulation)",
    subtitle: "Decision game",
    href: "/scenario",
    kind: "tool",
    haystack:
      "run a cpe simulation scenario decision game practice exemplaria choices",
  });
  items.push({
    id: "review",
    title: "Flashcards & review",
    subtitle: "Spaced repetition",
    href: "/review",
    kind: "review",
    haystack: "flashcards review spaced repetition key terms revise study",
  });
  items.push({
    id: "exam",
    title: "Final exam",
    subtitle: "Earn your certificate",
    href: "/exam",
    kind: "exam",
    haystack: "final exam test assessment certificate",
  });
  items.push({
    id: "certificate",
    title: "Certificate",
    subtitle: "Your record of completion",
    href: "/certificate",
    kind: "page",
    haystack: "certificate completion award",
  });

  // Chapters + their quizzes
  for (const c of CHAPTERS) {
    items.push({
      id: `chapter-${c.slug}`,
      title: c.title,
      subtitle: `Phase ${c.number} · chapter`,
      href: `/learn/${c.slug}`,
      kind: "page",
      haystack: `${c.title} phase ${c.number} ${c.subtitle ?? ""} ${c.tagline ?? ""}`,
    });
    items.push({
      id: `quiz-${c.slug}`,
      title: `${c.title} quiz`,
      subtitle: `Phase ${c.number} · test yourself`,
      href: `/quiz/${c.slug}`,
      kind: "quiz",
      haystack: `${c.title} quiz phase ${c.number} test`,
    });
  }

  // Lessons
  for (const l of LESSON_SEARCH_INDEX) {
    const chapter = CHAPTERS.find((c) => c.slug === l.chapter);
    items.push({
      id: `${l.chapter}/${l.slug}`,
      title: l.title,
      subtitle: `${chapter ? chapter.title : l.chapter}${l.section ? ` · §${l.section}` : ""}`,
      href: l.href,
      kind: "lesson",
      haystack: `${l.title} ${l.lede} ${l.section} ${l.chapter}`.toLowerCase(),
    });
  }

  return items;
}

/** Lightweight scorer: token subsequence + substring boosts. */
function score(query: string, item: Item): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = item.title.toLowerCase();
  const hay = item.haystack;
  let s = 0;

  if (title === q) s += 1000;
  if (title.startsWith(q)) s += 200;
  if (title.includes(q)) s += 120;
  if (hay.includes(q)) s += 40;

  // per-token matching
  const tokens = q.split(/\s+/).filter(Boolean);
  for (const t of tokens) {
    if (title.includes(t)) s += 30;
    else if (hay.includes(t)) s += 10;
    else if (subseq(t, title)) s += 6;
    else if (subseq(t, hay)) s += 2;
    else return s > 0 ? s : -1; // a token matched nowhere → weak/none
  }
  return s;
}

/** Is `needle` a subsequence of `hay`? (fuzzy) */
function subseq(needle: string, hay: string): boolean {
  let i = 0;
  for (let j = 0; j < hay.length && i < needle.length; j++) {
    if (hay[j] === needle[i]) i++;
  }
  return i === needle.length;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo(buildItems, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      // default: a useful starter set
      return items
        .filter((i) => i.kind === "page" || i.kind === "tool" || i.kind === "review")
        .slice(0, 8);
    }
    return items
      .map((i) => ({ i, s: score(query, i) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 24)
      .map((x) => x.i);
  }, [query, items]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (item: Item | undefined) => {
      if (!item) return;
      close();
      router.push(item.href);
    },
    [router, close],
  );

  // Global open shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" to open when not typing in a field
      if (
        e.key === "/" &&
        !open &&
        !/^(input|textarea|select)$/i.test(
          (e.target as HTMLElement)?.tagName ?? "",
        ) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [open]);

  // Focus input on open, reset active when results change
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-ink-1/30 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />

          {/* panel */}
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the course"
            className="relative w-full max-w-xl rounded-2xl bg-white border border-border shadow-bloom overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-4 h-4 text-ink-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search lessons, quizzes, tools…"
                className="flex-1 bg-transparent outline-none text-[15px] text-ink-1 placeholder:text-ink-4"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-surface-2 border border-border text-[10px] font-medium text-ink-3">
                Esc
              </kbd>
            </div>

            {/* results */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-[14px] text-ink-3">
                  No matches for “{query}”.
                </div>
              ) : (
                results.map((item, idx) => {
                  const meta = KIND_META[item.kind];
                  const Icon = meta.Icon;
                  const isActive = idx === active;
                  return (
                    <button
                      key={item.id}
                      data-idx={idx}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? "bg-un-50" : "hover:bg-surface-2"
                      }`}
                    >
                      <span
                        className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{
                          background: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
                          color: meta.color,
                        }}
                      >
                        <Icon className="w-4 h-4" strokeWidth={2.2} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-medium text-ink-1 truncate">
                          {item.title}
                        </span>
                        <span className="block text-[12px] text-ink-3 truncate">
                          {item.subtitle}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-[10px] uppercase tracking-[0.12em] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
                          color: meta.color,
                        }}
                      >
                        {meta.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* footer hints */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-[11px] text-ink-3">
              <span className="inline-flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                <ArrowDown className="w-3 h-3" />
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" />
                open
              </span>
              <span className="ml-auto inline-flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border font-medium">
                  ⌘K
                </kbd>
                to toggle
              </span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
