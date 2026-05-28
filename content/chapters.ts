/**
 * Evaluation Academy — Chapter manifest.
 * Source: UNFPA Evaluation Handbook 2024.
 *
 * Lessons are authored as MDX under content/lessons/[slug]/[lesson-slug].mdx
 * and indexed at build time. This file declares the canonical chapter
 * order, titles, taglines, and theme color.
 */

export type Chapter = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  tagline: string;
  focus: string[];
  estimatedMinutes: number;
  // Token names that map to design system colors
  accent: "un-blue" | "teal" | "amber" | "navy";
};

export const CHAPTERS: Chapter[] = [
  {
    slug: "preparation",
    number: 1,
    title: "Preparation",
    subtitle: "Launch the evaluation with rigour",
    tagline:
      "Set up the governance, scope, and team before any data is collected.",
    focus: ["Launch meeting", "Evaluability assessment", "Stakeholder mapping", "ToR"],
    estimatedMinutes: 64,
    accent: "un-blue",
  },
  {
    slug: "design",
    number: 2,
    title: "Design",
    subtitle: "Build the matrix that drives every choice",
    tagline:
      "From DAC criteria to sampling — the design phase is where rigour is decided.",
    focus: ["Evaluation matrix", "Methods", "Sampling", "Theory of Change"],
    estimatedMinutes: 78,
    accent: "navy",
  },
  {
    slug: "fieldwork",
    number: 3,
    title: "Fieldwork",
    subtitle: "Collect data that holds up to scrutiny",
    tagline:
      "KIIs, FGDs, surveys, observation — each method has its discipline.",
    focus: ["KIIs", "FGDs", "Survey", "Triangulation"],
    estimatedMinutes: 56,
    accent: "teal",
  },
  {
    slug: "reporting",
    number: 4,
    title: "Reporting",
    subtitle: "From findings to recommendations",
    tagline:
      "A report has to be read, understood, and acted on — not just submitted.",
    focus: ["Findings", "Conclusions", "Recommendations", "Quality assurance"],
    estimatedMinutes: 48,
    accent: "amber",
  },
  {
    slug: "dissemination",
    number: 5,
    title: "Dissemination",
    subtitle: "Make the evaluation count",
    tagline:
      "Strategic communication, follow-up, and turning findings into change.",
    focus: ["Management response", "Comms strategy", "Knowledge products"],
    estimatedMinutes: 36,
    accent: "navy",
  },
];

export const COURSE_META = {
  totalChapters: CHAPTERS.length,
  totalLessons: 51, // current target after expansion
  totalMinutes: CHAPTERS.reduce((s, c) => s + c.estimatedMinutes, 0),
  source: "UNFPA Evaluation Handbook 2024",
  sourceUrl:
    "https://www.unfpa.org/sites/default/files/admin-resource/Final_Eval%20Handbook%202024.pdf",
};
