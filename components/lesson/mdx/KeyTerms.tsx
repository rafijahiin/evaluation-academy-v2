import type { ReactNode } from "react";

/**
 * Defined-terms pane — sits at the end of a lesson or in a sidebar.
 *
 *   <KeyTerms>
 *     <Term name="CPE">Country Programme Evaluation — the full-cycle...</Term>
 *     <Term name="ERG">Evaluation Reference Group — multi-stakeholder...</Term>
 *   </KeyTerms>
 */
export function KeyTerms({ children }: { children: ReactNode }) {
  return (
    <section className="my-8 rounded-2xl bg-surface-2 border border-border p-5 sm:p-6">
      <div
        className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-3"
        style={{ color: "var(--un-blue-700)" }}
      >
        Key terms
      </div>
      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

export function Term({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4">
      <dt className="text-[14px] font-semibold text-ink-1">{name}</dt>
      <dd className="text-[13.5px] text-ink-2 leading-[1.55]">{children}</dd>
    </div>
  );
}
