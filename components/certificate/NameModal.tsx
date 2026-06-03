"use client";
import { useState } from "react";
import { m } from "motion/react";

/**
 * One-input modal shown on first visit to /certificate (or when the
 * learner clicks "Edit name") so the certificate can render with their
 * real name instead of a placeholder.
 */
export function NameModal({
  initialName = "",
  onSubmit,
  onCancel,
}: {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{
          background: "rgba(19, 22, 25, 0.55)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onCancel}
      />
      <m.form
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit}
        className="relative bg-white rounded-3xl border border-border shadow-bloom max-w-md w-full p-6 sm:p-8"
      >
        <div className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Your certificate
        </div>
        <h2 className="font-display mt-2 text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-ink-1">
          What name should appear?
        </h2>
        <p className="mt-2 text-[14px] text-ink-2 leading-relaxed">
          Enter the full name you want printed on the certificate. We store it
          locally on this device — never sent anywhere.
        </p>

        <label htmlFor="learner-name" className="sr-only">
          Full name
        </label>
        <input
          id="learner-name"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          placeholder="e.g. Rafi Jahin"
          className="mt-5 w-full px-4 py-3 rounded-2xl border border-border bg-white text-[16px] focus:outline-none focus:border-un-300 focus:ring-2 focus:ring-un-100 transition-colors"
          maxLength={80}
        />

        <div className="mt-6 flex items-center justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-2xl text-ink-2 text-[13.5px] font-medium hover:text-ink-1 hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={value.trim().length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13.5px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-bloom hover:-translate-y-0.5 transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            Use this name
          </button>
        </div>
      </m.form>
    </div>
  );
}
