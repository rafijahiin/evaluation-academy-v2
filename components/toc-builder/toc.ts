/**
 * Data model for the Theory of Change builder.
 *
 * Grounded in the UNFPA results chain (one unified theory of change):
 *   Inputs → Activities → Outputs → Outcomes → Impact
 * with the assumptions that must hold — and the risks that could break —
 * each causal link. Impact aligns with UNFPA's transformative results
 * (the "Three Zeros").
 *
 * Multi-entry: every level holds a list of items, and every link between
 * levels holds a list of assumptions/risks (mirrors the Matrix Builder).
 */

export type TocItem = { id: string; text: string };

export type NoteKind = "assumption" | "risk";
export type Note = { id: string; text: string; kind: NoteKind };

export type LevelId = "inputs" | "activities" | "outputs" | "outcomes" | "impact";
export type GapId = "g1" | "g2" | "g3" | "g4"; // between consecutive levels

export type TocData = {
  programme: string;
  country: string;
  focus: string;
  levels: Record<LevelId, TocItem[]>;
  notes: Record<GapId, Note[]>;
};

export type LevelMeta = {
  id: LevelId;
  label: string;
  color: string;
  short: string; // one-line definition
  hint: string; // editor helper
  placeholder: string;
};

/** Ordered, UNFPA-grounded level definitions. Inputs → Impact. */
export const LEVELS: LevelMeta[] = [
  {
    id: "inputs",
    label: "Inputs",
    color: "#2171EC", // UNFPA Blue (the single accent) — the foundation
    short: "Resources invested",
    hint: "The human, financial, and technical resources committed — funding, staff, expertise, partnerships, commodities.",
    placeholder: "e.g. UNFPA core + co-financing",
  },
  {
    id: "activities",
    label: "Activities",
    color: "#FB904D", // Pastel Orange
    short: "What the programme does",
    hint: "The interventions delivered with those inputs — training, service delivery, advocacy, supply.",
    placeholder: "e.g. Train midwives in EmONC",
  },
  {
    id: "outputs",
    label: "Outputs",
    color: "#F96000", // UNFPA Orange
    short: "Products, services & capacities",
    hint: "What activities directly produce — new knowledge, skills, or the availability of products and services.",
    placeholder: "e.g. Providers trained & equipped",
  },
  {
    id: "outcomes",
    label: "Outcomes",
    color: "#D55200", // deeper orange
    short: "Use & behaviour change",
    hint: "The uptake, adoption, and use by rights-holders — changes in behaviour, attitudes, practices, or conditions.",
    placeholder: "e.g. More women using modern FP",
  },
  {
    id: "impact",
    label: "Impact",
    color: "#AE4300", // Dark Orange — the goal
    short: "Long-term transformative change",
    hint: "The long-term change the programme contributes to — aligned with UNFPA's transformative results (the Three Zeros).",
    placeholder: "e.g. Zero unmet need for family planning",
  },
];

export const GAPS: { id: GapId; from: LevelId; to: LevelId }[] = [
  { id: "g1", from: "inputs", to: "activities" },
  { id: "g2", from: "activities", to: "outputs" },
  { id: "g3", from: "outputs", to: "outcomes" },
  { id: "g4", from: "outcomes", to: "impact" },
];

/** UNFPA's three transformative results — quick-add suggestions for Impact. */
export const THREE_ZEROS = [
  "Zero preventable maternal deaths",
  "Zero unmet need for family planning",
  "Zero gender-based violence & harmful practices",
];

export function levelMeta(id: LevelId): LevelMeta {
  return LEVELS.find((l) => l.id === id)!;
}

export const STORAGE_KEY = "evalAcademy.toc.v3";

export function emptyData(): TocData {
  return {
    programme: "",
    country: "",
    focus: "",
    levels: { inputs: [], activities: [], outputs: [], outcomes: [], impact: [] },
    notes: { g1: [], g2: [], g3: [], g4: [] },
  };
}

/** A worked example so the builder is never a blank slate. */
export function exampleData(): TocData {
  let n = 0;
  const id = () => `seed-${++n}`;
  const items = (...texts: string[]): TocItem[] => texts.map((text) => ({ id: id(), text }));
  const notes = (...pairs: [NoteKind, string][]): Note[] =>
    pairs.map(([kind, text]) => ({ id: id(), kind, text }));
  return {
    programme: "Country Programme 2024–2028",
    country: "Exemplaria",
    focus: "Sexual & reproductive health and rights",
    levels: {
      inputs: items(
        "UNFPA core + co-financing",
        "Technical advisers & national consultants",
        "Partnership with Ministry of Health",
        "Contraceptive commodity supply",
      ),
      activities: items(
        "Train midwives in emergency obstetric & newborn care",
        "Strengthen the contraceptive supply chain",
        "Advocate for the national SRH policy & budget line",
      ),
      outputs: items(
        "Providers trained, certified & retained",
        "Health facilities equipped with commodities",
        "SRH policy adopted with a costed plan",
      ),
      outcomes: items(
        "Increased use of modern family planning",
        "Improved quality of maternal care at facilities",
        "Greater government investment in SRH",
      ),
      impact: items(
        "Zero unmet need for family planning",
        "Zero preventable maternal deaths",
      ),
    },
    notes: {
      g1: notes([
        "assumption",
        "Trained providers remain in post and are deployed where needed",
      ]),
      g2: notes(
        ["assumption", "Commodities reach the last mile without stock-outs"],
        ["risk", "Funding gaps interrupt the supply chain"],
      ),
      g3: notes([
        "assumption",
        "Communities are aware of, and able to access, the services",
      ]),
      g4: notes(
        ["assumption", "Gains are sustained through government ownership"],
        ["risk", "Political or humanitarian shocks reverse progress"],
      ),
    },
  };
}
