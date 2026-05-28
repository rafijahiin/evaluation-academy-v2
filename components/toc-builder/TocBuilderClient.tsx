"use client";
import { useEffect, useReducer } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TocSidebar } from "./TocSidebar";
import { TocWizard } from "./TocWizard";
import { TocProduct } from "./TocProduct";
import { STEPS, DEFAULT_TOC, STORAGE_KEY, type TocData } from "./steps";

type State = {
  data: TocData;
  step: number; // STEPS.length means "product view"
  mounted: boolean;
};

type Action =
  | { type: "init"; data: TocData; step: number }
  | { type: "update"; patch: Partial<TocData> }
  | { type: "goto"; step: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return { ...state, data: action.data, step: action.step, mounted: true };
    case "update":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "goto":
      return { ...state, step: Math.max(0, Math.min(STEPS.length, action.step)) };
  }
}

/**
 * Top-level Theory of Change Builder client component.
 *
 * Mirrors v1's wizard logic step-for-step. State persisted to
 * localStorage under STORAGE_KEY. Six steps (0–5) plus a final
 * product view (step === STEPS.length).
 */
export function TocBuilderClient() {
  const [state, dispatch] = useReducer(reducer, {
    data: DEFAULT_TOC,
    step: 0,
    mounted: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved === "object") {
        dispatch({
          type: "init",
          data: { ...DEFAULT_TOC, ...saved.data },
          step: typeof saved.step === "number" ? saved.step : 0,
        });
      } else {
        dispatch({ type: "init", data: DEFAULT_TOC, step: 0 });
      }
    } catch {
      dispatch({ type: "init", data: DEFAULT_TOC, step: 0 });
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!state.mounted) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: state.data, step: state.step }),
      );
    } catch {
      /* ignore quota errors */
    }
  }, [state.data, state.step, state.mounted]);

  const isProductView = state.step >= STEPS.length;
  const currentStep = isProductView ? STEPS.length - 1 : state.step;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20">
      {/* Header */}
      <Reveal>
        <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Interactive tool
        </span>
        <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
          Build your{" "}
          <span className="italic" style={{ color: "var(--un-blue-700)" }}>
            Theory of Change
          </span>
        </h1>
        <p className="mt-3 text-[16px] text-ink-2 leading-relaxed max-w-2xl">
          Six steps from programme inputs to transformative result. Walk through
          the wizard, and walk away with a printable Theory of Change you can
          share with your country office.
        </p>
      </Reveal>

      {/* Wizard + product */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-6 lg:gap-10">
        <TocSidebar
          currentStep={currentStep}
          isProductView={isProductView}
          onJump={(i) => dispatch({ type: "goto", step: i })}
        />

        <div className="min-w-0">
          {isProductView ? (
            <TocProduct
              data={state.data}
              onEdit={() => dispatch({ type: "goto", step: STEPS.length - 1 })}
            />
          ) : (
            <TocWizard
              step={STEPS[state.step]}
              stepIndex={state.step}
              data={state.data}
              onChange={(patch) => dispatch({ type: "update", patch })}
              onPrev={() => dispatch({ type: "goto", step: state.step - 1 })}
              onNext={() => dispatch({ type: "goto", step: state.step + 1 })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
