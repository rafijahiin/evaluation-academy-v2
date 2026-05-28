import type { ReactNode } from "react";

/**
 * 2-column key-value grid for definitions, checklists, structured pairs.
 *
 *   <KVGrid>
 *     <KV title="Profile">Junior professional below 35 years...</KV>
 *     <KV title="Skills">Well-versed in evaluation methods...</KV>
 *   </KVGrid>
 */
export function KVGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3">
      {children}
    </div>
  );
}

export function KV({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-1 px-4 py-3.5">
      <div
        className="text-[12px] font-semibold uppercase tracking-[0.06em] mb-1"
        style={{ color: "var(--un-blue-700)" }}
      >
        {title}
      </div>
      <div className="text-[14px] leading-[1.55] text-ink-2">{children}</div>
    </div>
  );
}
