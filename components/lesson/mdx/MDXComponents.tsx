import { Callout } from "./Callout";
import { KVGrid, KV } from "./KVGrid";
import { KeyTerms, Term } from "./KeyTerms";
import { InPractice } from "./InPractice";
import { Checklist, Item } from "./Checklist";
import { QuizQuestion } from "./QuizQuestion";
import { TriangulationDiagram } from "./TriangulationDiagram";
import { EvidenceChain } from "./EvidenceChain";

/**
 * Components exposed inside .mdx lessons. Imported via MDXProvider in
 * the lesson page.
 */
export const mdxComponents = {
  // structural
  Callout,
  KVGrid,
  KV,
  KeyTerms,
  Term,
  InPractice,
  Checklist,
  Item,
  QuizQuestion,
  TriangulationDiagram,
  EvidenceChain,
  // typography overrides — give MDX-rendered prose the same look as v1
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      {...props}
      className="font-display text-[36px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] text-ink-1 mt-12 mb-4 first:mt-0"
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      {...props}
      className="font-display text-[26px] sm:text-[30px] leading-[1.15] tracking-[-0.015em] text-ink-1 mt-10 mb-3"
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      {...props}
      className="text-[18px] font-semibold text-ink-1 mt-8 mb-2"
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p {...props} className="text-[16px] leading-[1.7] text-ink-1 my-4" />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      {...props}
      className="my-4 pl-5 list-disc marker:text-un-300 space-y-2 text-[15.5px] leading-[1.65] text-ink-1"
    />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      {...props}
      className="my-4 pl-5 list-decimal marker:font-semibold marker:text-un-700 space-y-2 text-[15.5px] leading-[1.65] text-ink-1"
    />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li {...props} className="pl-1" />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      {...props}
      className="text-un-700 underline underline-offset-2 hover:text-un-800"
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong {...props} className="font-semibold text-ink-1" />
  ),
  em: (props: React.ComponentProps<"em">) => (
    <em {...props} className="italic" />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
      className="my-5 pl-5 border-l-2 italic text-ink-2"
      style={{ borderLeftColor: "var(--un-blue-200)" }}
    />
  ),
};
