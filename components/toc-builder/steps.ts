/**
 * Step definitions for the Theory of Change builder.
 *
 * Faithfully ports v1's STEPS array — same fields, same prompts, same
 * example content. Visual styling (colour assignment) updated to use the
 * new v2 design tokens.
 */

export type TocStep =
  | {
      id: "context";
      label: string;
      title: string;
      hint: string;
      fields: { id: "title" | "country" | "focus"; label: string; placeholder: string }[];
    }
  | {
      id: "inputs" | "activities" | "outputs" | "outcomes" | "result";
      label: string;
      chip: string;
      title: string;
      hint: string;
      example: string;
      assumptionPrompt?: string;
      isResult?: boolean;
      accent: "un-blue" | "teal" | "navy" | "amber";
    };

export const STEPS: TocStep[] = [
  {
    id: "context",
    label: "Context",
    title: "Name your programme",
    hint: "Give your Theory of Change a title and context so the final document makes sense when printed and shared.",
    fields: [
      {
        id: "title",
        label: "Programme title",
        placeholder: "e.g., UNFPA Country Programme 2024–2028",
      },
      {
        id: "country",
        label: "Country / Context",
        placeholder: "e.g., Bangladesh",
      },
      {
        id: "focus",
        label: "Thematic focus",
        placeholder: "e.g., Sexual & Reproductive Health",
      },
    ],
  },
  {
    id: "inputs",
    label: "Inputs",
    chip: "INPUTS",
    accent: "un-blue",
    title: "What does the programme bring?",
    hint: "Inputs are the resources you invest — funding, staff, expertise, partnerships, materials. One item per line.",
    example:
      "UNFPA core resources\nNational government co-financing\n12 technical advisers deployed\nContraceptive commodity supply chain",
    assumptionPrompt: "For these inputs to enable the activities, what must be true?",
  },
  {
    id: "activities",
    label: "Activities",
    chip: "ACTIVITIES",
    accent: "teal",
    title: "What does the programme do?",
    hint: "Activities are the specific actions and interventions your programme implements. One item per line.",
    example:
      "Train 320 midwives in FP counselling\nDistribute contraceptive commodities to 45 health centres\nAdvocacy with Ministry of Health on SRH policy",
    assumptionPrompt: "For these activities to produce the outputs, what must be true?",
  },
  {
    id: "outputs",
    label: "Outputs",
    chip: "OUTPUTS",
    accent: "navy",
    title: "What does the programme directly produce?",
    hint: "Outputs are the tangible deliverables and services resulting directly from your activities. One item per line.",
    example:
      "320 midwives trained and certified\n45 health centres equipped with commodities\nFamily planning counselling available at all programme sites",
    assumptionPrompt: "For these outputs to shift the outcomes, what must be true?",
  },
  {
    id: "outcomes",
    label: "Outcomes",
    chip: "OUTCOMES",
    accent: "un-blue",
    title: "What changes in behaviour or systems?",
    hint: "Outcomes are the changes in people's behaviour, knowledge, or systems that result from using the outputs. One item per line.",
    example:
      "15,000 additional women using modern family planning\nImproved quality of maternal care at target facilities\nStronger government commitment to SRH budget allocation",
    assumptionPrompt:
      "For these outcomes to contribute to the transformative result, what must be true?",
  },
  {
    id: "result",
    label: "Transformative Result",
    chip: "TRANSFORMATIVE RESULT",
    accent: "amber",
    title: "What is the ultimate goal?",
    hint: "The transformative result is the long-term impact your programme contributes to. Align it with UNFPA's three transformative results where possible.",
    example: "Zero unmet need for family planning by 2030",
    isResult: true,
  },
];

export type TocData = {
  context: { title: string; country: string; focus: string };
  inputs: string;
  activities: string;
  outputs: string;
  outcomes: string;
  result: string;
  a_inputs: string;
  a_activities: string;
  a_outputs: string;
  a_outcomes: string;
};

export const DEFAULT_TOC: TocData = {
  context: { title: "", country: "", focus: "" },
  inputs: "",
  activities: "",
  outputs: "",
  outcomes: "",
  result: "",
  a_inputs: "",
  a_activities: "",
  a_outputs: "",
  a_outcomes: "",
};

export const STORAGE_KEY = "evalAcademy.toc.v2";

export function accentInk(accent: "un-blue" | "teal" | "navy" | "amber"): string {
  switch (accent) {
    case "un-blue":
      return "var(--un-blue-700)";
    case "teal":
      return "var(--teal)";
    case "navy":
      return "var(--un-blue-900)";
    case "amber":
      return "var(--amber)";
  }
}

export function accentBg(accent: "un-blue" | "teal" | "navy" | "amber"): string {
  switch (accent) {
    case "un-blue":
      return "rgba(249, 96, 0, 0.08)";
    case "teal":
      return "rgba(33, 113, 236, 0.10)";
    case "navy":
      return "rgba(19, 22, 25, 0.08)";
    case "amber":
      return "rgba(245, 158, 11, 0.10)";
  }
}
