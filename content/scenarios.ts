/**
 * "Run a CPE" — a decision-point simulation threaded through a fictional
 * country, Exemplaria. The evaluation always proceeds (as a real one
 * must); the player's choices shape its QUALITY, not whether it happens.
 *
 * Each choice is graded against handbook guidance:
 *   good  — the handbook-aligned move (+2)
 *   risky — defensible but creates problems (+1)
 *   wrong — contradicts the methodology (0)
 */

export type Verdict = "good" | "risky" | "wrong";

export type Choice = {
  label: string;
  verdict: Verdict;
  feedback: string;
  ref: string; // handbook section
};

export type ScenarioNode = {
  id: string;
  phase: string; // CPE phase label
  phaseSlug: string;
  title: string;
  situation: string;
  choices: Choice[];
};

export const SCORE: Record<Verdict, number> = { good: 2, risky: 1, wrong: 0 };

export const SCENARIO: { country: string; intro: string; nodes: ScenarioNode[] } = {
  country: "Exemplaria",
  intro:
    "You are the CPE Manager in the UNFPA Country Office in Exemplaria. The next five-year cycle is approaching and the office has commissioned a Country Programme Evaluation. Over the next eleven months, the decisions you make will shape how credible and useful that evaluation turns out to be. There are no second cycles — choose well.",
  nodes: [
    {
      id: "launch",
      phase: "Preparation",
      phaseSlug: "preparation",
      title: "The first hire",
      situation:
        "The launch meeting is done and the timeline is set. You have budget to begin recruiting the evaluation team. Who do you bring on first?",
      choices: [
        {
          label: "Recruit the Young & Emerging Evaluator (YEE) now, before the main team",
          verdict: "good",
          feedback:
            "Correct. Stage 1 is the YEE, recruited first so they can support you through preparation — building the repository, the catalogue, the stakeholder map — and then join the full team.",
          ref: "§1.6",
        },
        {
          label: "Recruit the international team leader first — they should drive everything",
          verdict: "risky",
          feedback:
            "The team leader matters, but recruiting them first inverts the two-stage process. The YEE comes first; the main team (including the leader) is Stage 2, recruited through pre-selection and RO pre-qualification.",
          ref: "§1.6",
        },
        {
          label: "Skip the YEE — it's an optional extra that slows things down",
          verdict: "wrong",
          feedback:
            "The YEE is a deliberate part of the UNFPA CPE model, not an optional extra. Dropping it removes a capacity-building commitment and a working pair of hands during preparation.",
          ref: "§1.6",
        },
      ],
    },
    {
      id: "tor",
      phase: "Preparation",
      phaseSlug: "preparation",
      title: "Drafting the ToR",
      situation:
        "It's time to draft the Terms of Reference. A colleague suggests writing them from scratch to 'make them really specific to Exemplaria'. What do you do?",
      choices: [
        {
          label: "Use the R2U ToR template and invest your energy in the evaluation questions workshop",
          verdict: "good",
          feedback:
            "Right. The Ready-to-Use template handles the boilerplate so you can focus on what actually needs local adaptation — context-specific evaluation questions developed through a participatory workshop.",
          ref: "§1.4",
        },
        {
          label: "Write the ToR from scratch for maximum specificity",
          verdict: "risky",
          feedback:
            "Understandable instinct, but it wastes lead time and re-invents sections the R2U template already standardises. The specificity belongs in the evaluation questions, not the boilerplate.",
          ref: "§1.4",
        },
        {
          label: "Draft the ToR alone and quickly to keep the schedule",
          verdict: "wrong",
          feedback:
            "The ToR is a team effort under CO senior management, quality-assured by the RO M&E Adviser. Drafting it alone skips the participatory development of evaluation questions — the most important part.",
          ref: "§1.4",
        },
      ],
    },
    {
      id: "matrix",
      phase: "Design",
      phaseSlug: "design",
      title: "Locking the matrix",
      situation:
        "The team has built the evaluation matrix and the design report v2 is approved. Mid-fieldwork, the team leader wants to add two new evaluation questions that 'just emerged'. Your call?",
      choices: [
        {
          label: "Hold the line — the matrix is fixed at design report v2 approval",
          verdict: "good",
          feedback:
            "Correct. Once the design report v2 is approved, the matrix is fixed and cannot be amended during fieldwork. New questions would undermine the agreed analytical framework.",
          ref: "§2.2.2",
        },
        {
          label: "Allow it, but document the change and inform the ERG",
          verdict: "risky",
          feedback:
            "Transparency is good, but the matrix is meant to be fixed at v2 approval precisely to prevent scope drift mid-fieldwork. Capture the idea as a limitation or a future-cycle note instead.",
          ref: "§2.2.2",
        },
        {
          label: "Add the questions quietly to keep the team leader happy",
          verdict: "wrong",
          feedback:
            "Changing the matrix mid-fieldwork without process breaks the credibility of the whole evaluation. The fixed matrix is what makes findings defensible.",
          ref: "§2.2.2",
        },
      ],
    },
    {
      id: "triangulation",
      phase: "Fieldwork",
      phaseSlug: "fieldwork",
      title: "A striking claim",
      situation:
        "During fieldwork, one senior official gives a vivid, quotable account of a programme failure. It would make a powerful finding. No other source mentions it. What do you advise the team?",
      choices: [
        {
          label: "Treat it as a lead and seek to triangulate across other sources before it becomes a finding",
          verdict: "good",
          feedback:
            "Exactly. A single account is a lead, not a finding. Findings must be triangulated across at least three sources to hold up.",
          ref: "§2.2.3",
        },
        {
          label: "Use it as a finding but flag it as based on a single source",
          verdict: "risky",
          feedback:
            "Flagging is honest, but a vivid anecdote presented as a finding — even caveated — invites challenge. Triangulate first; if it can't be corroborated, it stays a lead.",
          ref: "§2.2.3",
        },
        {
          label: "Put it straight in the report — it's from a senior official, so it's authoritative",
          verdict: "wrong",
          feedback:
            "Seniority is not corroboration. Mixed-methods triangulation exists precisely so that one strong voice doesn't become an unverified finding.",
          ref: "§2.2.3",
        },
      ],
    },
    {
      id: "recommendation",
      phase: "Reporting",
      phaseSlug: "reporting",
      title: "Writing a recommendation",
      situation:
        "The team drafts a recommendation: 'UNFPA should strengthen its capacity.' The CO Representative loves it. What's your response?",
      choices: [
        {
          label: "Send it back — it isn't actionable, addressed to anyone, or clearly derived from a conclusion",
          verdict: "good",
          feedback:
            "Right. A recommendation must be actionable, addressed to a specific decision-maker, and stem directly from a conclusion. 'Strengthen capacity' is a wish, not a recommendation.",
          ref: "§4.3",
        },
        {
          label: "Keep it but add a named owner and a deadline",
          verdict: "risky",
          feedback:
            "Adding an owner helps, but the recommendation still needs to trace to a specific conclusion and name a concrete action. Co-create it properly through the recommendations process.",
          ref: "§4.3",
        },
        {
          label: "Keep it as is — senior management approves, so it's fine",
          verdict: "wrong",
          feedback:
            "Approval doesn't make a vague recommendation usable. Weak recommendations are the most common reason management responses stall.",
          ref: "§4.3",
        },
      ],
    },
    {
      id: "pushback",
      phase: "Reporting",
      phaseSlug: "reporting",
      title: "Government pushback",
      situation:
        "A government partner is unhappy with a well-evidenced negative finding and asks you, informally, to soften it before the report is finalised. How do you handle it?",
      choices: [
        {
          label: "Keep the finding; it's evidenced and triangulated. Engage the partner through the ERG and management response process",
          verdict: "good",
          feedback:
            "Correct. Evaluator independence is non-negotiable. The proper channel for partner views is the ERG and, later, the management response — not editing findings under pressure.",
          ref: "§1.5",
        },
        {
          label: "Re-check the evidence, then keep the finding but soften the wording",
          verdict: "risky",
          feedback:
            "Re-checking evidence is always fair. But softening wording to placate a partner edges toward compromising independence. Adjust tone for fairness, never to obscure an evidenced finding.",
          ref: "§1.5",
        },
        {
          label: "Soften the finding to preserve the relationship",
          verdict: "wrong",
          feedback:
            "This compromises the integrity and independence of the evaluation. The relationship is managed through process and the management response — not by bending the evidence.",
          ref: "§1.5",
        },
      ],
    },
    {
      id: "response",
      phase: "Dissemination",
      phaseSlug: "dissemination",
      title: "The management response",
      situation:
        "The report is finalised. A recommendation is only partly feasible for the CO. How should the management response handle it?",
      choices: [
        {
          label: "Mark it 'partially accepted', explain which part isn't feasible and why, and commit to action on the rest",
          verdict: "good",
          feedback:
            "Correct. 'Partially accepted' is a valid position — provided you explain the limitation and specify action, owner, and date for the parts you accept.",
          ref: "§5.3.1",
        },
        {
          label: "Mark it 'accepted' to look cooperative, then quietly do what's feasible",
          verdict: "risky",
          feedback:
            "Accepting and under-delivering damages credibility and is visible in TeamCentral tracking. An honest 'partially accepted' with reasons is stronger than a hollow 'accepted'.",
          ref: "§5.3.1",
        },
        {
          label: "Defer it indefinitely — note it for 'a future cycle'",
          verdict: "wrong",
          feedback:
            "There is no 'defer indefinitely' position. Every recommendation gets an explicit, explained response: accepted, partially accepted, or not accepted.",
          ref: "§5.3.1",
        },
      ],
    },
  ],
};

export const MAX_SCORE = SCENARIO.nodes.length * SCORE.good;

export function ratingFor(score: number): { title: string; blurb: string } {
  const pct = MAX_SCORE > 0 ? score / MAX_SCORE : 0;
  if (pct >= 0.85)
    return {
      title: "Exemplary CPE Manager",
      blurb:
        "You ran a credible, defensible evaluation — methodology respected, independence intact, recommendations usable.",
    };
  if (pct >= 0.6)
    return {
      title: "Solid, with some risks",
      blurb:
        "A sound evaluation overall, but a few choices introduced avoidable risk to credibility or use.",
    };
  if (pct >= 0.35)
    return {
      title: "Shaky ground",
      blurb:
        "The evaluation proceeded, but several decisions weakened its rigour. Revisit the phases where you slipped.",
    };
  return {
    title: "Back to the handbook",
    blurb:
      "This CPE would struggle to withstand scrutiny. Work through the lessons and try again — you'll see the difference.",
  };
}
