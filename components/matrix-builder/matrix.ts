/**
 * Data model for the Evaluation Matrix Builder.
 *
 * The evaluation matrix is the CPE's analytical backbone (handbook §2.2.2):
 * each evaluation question is unpacked into a DAC criterion, the
 * assumptions to be assessed, indicators, data sources, and methods.
 */

export type CriterionId =
  | "relevance"
  | "coherence"
  | "effectiveness"
  | "efficiency"
  | "sustainability"
  | "coverage"
  | "connectedness";

export type Criterion = {
  id: CriterionId;
  label: string;
  color: string;
  humanitarian?: boolean;
};

export const CRITERIA: Criterion[] = [
  { id: "relevance", label: "Relevance", color: "var(--un-blue)" },
  { id: "coherence", label: "Coherence", color: "var(--teal)" },
  { id: "effectiveness", label: "Effectiveness", color: "var(--un-blue-900)" },
  { id: "efficiency", label: "Efficiency", color: "#184EA5" },
  { id: "sustainability", label: "Sustainability", color: "var(--un-blue-700)" },
  { id: "coverage", label: "Coverage", color: "var(--amber)", humanitarian: true },
  { id: "connectedness", label: "Connectedness", color: "#AE4300", humanitarian: true },
];

export function criterion(id: CriterionId): Criterion {
  return CRITERIA.find((c) => c.id === id) ?? CRITERIA[0];
}

export type MatrixRow = {
  id: string;
  criterion: CriterionId;
  question: string;
  /** One item per line for the list-style columns. */
  assumptions: string;
  indicators: string;
  sources: string;
  methods: string;
};

export type MatrixData = {
  programme: string;
  country: string;
  rows: MatrixRow[];
};

export const STORAGE_KEY = "evalAcademy.matrix.v1";

export const COLUMN_HELP: Record<
  keyof Omit<MatrixRow, "id" | "criterion" | "question">,
  { label: string; hint: string; placeholder: string }
> = {
  assumptions: {
    label: "Assumptions to assess",
    hint: "The “if X, then Y” hypotheses drawn from the theory of change that this question tests.",
    placeholder:
      "Trained midwives remain in post\nCommodities reach the last mile",
  },
  indicators: {
    label: "Indicators",
    hint: "What you will measure to judge the assumption — quantitative or qualitative.",
    placeholder:
      "% of facilities with no stock-outs\nClient-reported quality of counselling",
  },
  sources: {
    label: "Data sources",
    hint: "Where the evidence comes from. Triangulate across at least three.",
    placeholder: "HMIS / DHIS2\nKey informant interviews\nFacility records",
  },
  methods: {
    label: "Methods",
    hint: "How you will collect and analyse the evidence.",
    placeholder: "Document review\nKII with district officers\nOn-site observation",
  },
};

export function newRow(criterionId: CriterionId = "relevance"): MatrixRow {
  return {
    // id derived from a counter at call site to stay deterministic
    id: "",
    criterion: criterionId,
    question: "",
    assumptions: "",
    indicators: "",
    sources: "",
    methods: "",
  };
}

/** A worked example so the builder is never an intimidating blank slate. */
export const EXAMPLE: MatrixData = {
  programme: "UNFPA Country Programme 2024–2028",
  country: "Exemplaria",
  rows: [
    {
      id: "ex-1",
      criterion: "relevance",
      question:
        "To what extent did the country programme respond to the SRH needs of adolescents and the most marginalised groups?",
      assumptions:
        "Programme design was informed by up-to-date needs analysis\nMarginalised groups were consulted during design",
      indicators:
        "Degree of alignment between CP outcomes and national SRH priorities\nEvidence of LNOB groups reflected in the results framework",
      sources:
        "CPD and results framework\nNeeds assessments / situation analyses\nKII with government and rights-holder organisations",
      methods: "Document review\nKey informant interviews\nStakeholder mapping",
    },
    {
      id: "ex-2",
      criterion: "effectiveness",
      question:
        "To what extent did the programme achieve its intended outputs on modern contraceptive access?",
      assumptions:
        "Trained providers remained in post\nCommodity supply chain functioned as planned",
      indicators:
        "% increase in facilities offering ≥3 modern methods\nNumber of providers trained and retained",
      sources: "HMIS / service statistics\nProgramme monitoring data\nFacility surveys",
      methods: "Secondary data analysis\nFacility observation\nFGDs with clients",
    },
  ],
};
