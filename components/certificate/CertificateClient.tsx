"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Share2,
  Pencil,
  Check,
  AlertCircle,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  Loader2,
} from "lucide-react";
import { Certificate } from "./Certificate";
import { NameModal } from "./NameModal";
import { useProgress } from "@/lib/progress";
import { PASS_THRESHOLD } from "@/content/quizzes";

/**
 * Client-side gate + composition for the /certificate page.
 *
 * Behaviour:
 *   - mounting state: show neutral placeholder until localStorage loads
 *   - no exam taken: friendly "take the exam" card with a CTA
 *   - exam failed: score card + retake CTA
 *   - exam passed (>= 80%): render the Certificate
 *   - first time on /certificate after passing: show NameModal
 *   - "Edit name" pencil opens NameModal again
 *   - Print/Share buttons handle the obvious things
 */
export function CertificateClient() {
  const { state, setLearnerName } = useProgress();
  const [mounted, setMounted] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-show modal first time after pass, if name not set yet
  useEffect(() => {
    if (!mounted) return;
    const score = state.examScore ?? 0;
    if (score >= PASS_THRESHOLD && !state.learnerName) {
      setShowNameModal(true);
    }
  }, [mounted, state.examScore, state.learnerName]);

  function nameSlug() {
    const n = state.learnerName;
    return n ? "-" + n.toLowerCase().replace(/\s+/g, "-") : "";
  }

  function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportImage(kind: "png" | "jpg") {
    const node = certificateRef.current;
    if (!node) return;
    setErr(null);
    setBusy(kind);
    try {
      const lib = await import("html-to-image");
      if (document.fonts?.ready) await document.fonts.ready;
      const opts = { pixelRatio: 2, backgroundColor: "#ffffff", cacheBust: true };
      const dataUrl =
        kind === "png"
          ? await lib.toPng(node, opts)
          : await lib.toJpeg(node, { ...opts, quality: 0.96 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `certificate${nameSlug()}.${kind}`;
      a.click();
    } catch (e) {
      setErr("Image export failed — try again, or use DOCX.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function exportDocx() {
    setErr(null);
    setBusy("docx");
    try {
      const docx = await import("docx");
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
      const name = state.learnerName || "Learner";
      const pct = Math.round((state.examScore ?? 0) * 100);
      const dateStr = (state.updatedAt ? new Date(state.updatedAt) : new Date()).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric" },
      );
      const C = AlignmentType.CENTER;
      const children = [
        new Paragraph({ alignment: C, children: [new TextRun({ text: "EVALUATION ACADEMY", bold: true, color: "F96000" })] }),
        new Paragraph({ alignment: C, children: [new TextRun({ text: "CERTIFICATE OF COMPLETION", bold: true, color: "686A6C" })] }),
        new Paragraph({ text: "" }),
        new Paragraph({ alignment: C, heading: HeadingLevel.HEADING_2, children: [new TextRun("This certifies that")] }),
        new Paragraph({ alignment: C, children: [new TextRun({ text: name, bold: true, italics: true, size: 48, color: "013E55" })] }),
        new Paragraph({ text: "" }),
        new Paragraph({
          alignment: C,
          children: [
            new TextRun(
              "has successfully completed the course in the UNFPA Country Programme Evaluation methodology — covering all five phases from preparation through dissemination — and passed the final exam with a score of ",
            ),
            new TextRun({ text: `${pct}%.`, bold: true }),
          ],
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ alignment: C, children: [new TextRun({ text: `Date of completion: ${dateStr}`, color: "686A6C" })] }),
        new Paragraph({ alignment: C, children: [new TextRun({ text: "Independent learning · Based on the UNFPA Evaluation Handbook 2024", color: "9A9DA2", size: 16 })] }),
      ];
      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      download(blob, `certificate${nameSlug()}.docx`);
    } catch (e) {
      setErr("DOCX export failed — try again.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may fail in non-https contexts */
    }
  };

  // SSR-safe placeholder
  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
          Certificate
        </div>
        <p className="mt-4 text-ink-3">Loading…</p>
      </div>
    );
  }

  const examScore = state.examScore ?? null;
  const scorePercent = examScore != null ? Math.round(examScore * 100) : 0;
  const passed = examScore != null && examScore >= PASS_THRESHOLD;
  const learnerName = state.learnerName || "Learner";

  // No exam attempt
  if (examScore == null) {
    return (
      <GatewayCard
        title="No exam attempt yet"
        body="You need to pass the final exam before you can earn the certificate. Twenty minutes — and you walk away with a printable record of completion."
        cta={{ href: "/exam", label: "Take the final exam" }}
      />
    );
  }

  // Failed
  if (!passed) {
    return (
      <GatewayCard
        title="Almost there"
        scorePercent={scorePercent}
        thresholdPercent={Math.round(PASS_THRESHOLD * 100)}
        body="Your exam result is below the certificate threshold. Retake the exam — you can pick up where you left off, and your previous answers don't carry over."
        cta={{ href: "/exam", label: "Retake the final exam" }}
        failed
      />
    );
  }

  // Passed — show certificate
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-20 cert-page">
      {/* Toolbar (hidden in print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 no-print">
        <div>
          <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
            Certificate
          </span>
          <h1 className="font-display mt-1 text-[clamp(28px,4vw,40px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
            You passed at{" "}
            <span className="italic" style={{ color: "var(--un-blue-700)" }}>
              {scorePercent}%
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNameModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit name
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Copy link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => exportImage("png")}
            disabled={busy === "png"}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors disabled:opacity-60"
          >
            {busy === "png" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
            PNG
          </button>
          <button
            type="button"
            onClick={() => exportImage("jpg")}
            disabled={busy === "jpg"}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium text-ink-1 border border-border hover:border-un-200 hover:bg-surface-2 transition-colors disabled:opacity-60"
          >
            {busy === "jpg" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
            JPG
          </button>
          <button
            type="button"
            onClick={exportDocx}
            disabled={busy === "docx"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-[13px] font-medium hover:shadow-bloom hover:-translate-y-0.5 transition-all disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
            }}
          >
            {busy === "docx" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            DOCX
          </button>
        </div>
      </div>

      {err && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700 no-print">
          {err}
        </div>
      )}

      {/* The certificate itself */}
      <Certificate
        ref={certificateRef}
        learnerName={learnerName}
        completedAt={state.updatedAt ? new Date(state.updatedAt) : new Date()}
        scorePercent={scorePercent}
      />

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <m.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-white bg-emerald-600 shadow-card"
          >
            <Check className="w-3.5 h-3.5" />
            Link copied to clipboard
          </m.div>
        )}
      </AnimatePresence>

      {/* Name modal */}
      <AnimatePresence>
        {showNameModal && (
          <NameModal
            initialName={state.learnerName ?? ""}
            onSubmit={(name) => {
              setLearnerName(name);
              setShowNameModal(false);
            }}
            onCancel={
              state.learnerName ? () => setShowNameModal(false) : undefined
            }
          />
        )}
      </AnimatePresence>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html,
          body {
            background: white !important;
          }
          header,
          nav,
          footer,
          .no-print {
            display: none !important;
          }
          .cert-page {
            padding: 0 !important;
            max-width: none !important;
          }
          .certificate-paper {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function GatewayCard({
  title,
  body,
  cta,
  scorePercent,
  thresholdPercent,
  failed,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
  scorePercent?: number;
  thresholdPercent?: number;
  failed?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <span className="text-[11px] uppercase tracking-[0.16em] text-un-700 font-semibold">
        Certificate
      </span>
      <h1 className="font-display mt-2 text-[clamp(34px,5vw,52px)] leading-[1.04] tracking-[-0.02em] text-ink-1">
        {title}
      </h1>

      <div
        className={`mt-6 rounded-2xl border px-5 sm:px-6 py-5 sm:py-6 ${
          failed ? "border-amber-200 bg-amber-50/60" : "border-border bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
              failed ? "bg-amber-100 text-amber-700" : "bg-un-50 text-un-700"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
          </span>
          <div className="flex-1">
            {scorePercent != null && thresholdPercent != null && (
              <div className="text-[12.5px] text-ink-2 mb-2">
                <strong className="text-ink-1">{scorePercent}%</strong> on your
                last attempt — the certificate requires{" "}
                <strong className="text-ink-1">{thresholdPercent}%</strong> or
                higher.
              </div>
            )}
            <p className="text-[14.5px] text-ink-2 leading-[1.6]">{body}</p>
          </div>
        </div>

        <Link
          href={cta.href}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13.5px] font-medium hover:shadow-bloom hover:-translate-y-0.5 transition-all"
          style={{
            background:
              "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
          }}
        >
          {cta.label}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
