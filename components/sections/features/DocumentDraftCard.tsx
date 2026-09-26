"use client";

import { Check, Download, FileText, Loader2, RotateCw, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { springDefault } from "@/lib/motion";

/**
 * Scripted after pathways-final's AI-draft flow (AiGenerateModal.tsx, and
 * StepDetailDrawer's CoverLetterSection's "Generate Cover Letter" button):
 * a checklist item that needs a document surfaces a "Generate" pill with a
 * sparkle icon; generating shows a spinner; the result carries the real
 * app's own disclaimer verbatim — "AI-generated first draft · Review
 * before submitting." The real product hands back text to copy; this demo
 * takes it one step further into a generated file, since a landing page
 * can sell "you get a PDF" more concretely than "you get a textarea."
 *
 * Unlike cards 01–02 this one is a real click, not an ambient loop: drafting
 * a document is something a visitor does, not something that plays at them.
 */
const FILE_NAME = "cover-letter-express-entry.pdf";

type State = "idle" | "generating" | "ready";
type DownloadState = "idle" | "downloading" | "done";

export function DocumentDraftCard() {
  const reduced = useReducedMotion();
  const [state, setState] = useState<State>("idle");
  const [download, setDownload] = useState<DownloadState>("idle");

  function generate() {
    setState("generating");
    setDownload("idle");
    setTimeout(() => setState("ready"), 1400);
  }

  function fakeDownload() {
    // No real file — the point is the affordance, not the bytes. Feedback
    // still lands immediately and clears on its own, same reasoning as the
    // copy button on the other cards: a demo shouldn't hang on I/O.
    setDownload("downloading");
    setTimeout(() => setDownload("done"), 900);
    setTimeout(() => setDownload("idle"), 2500);
  }

  return (
    <div className="flex h-full min-h-[9rem] flex-col">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-canvas px-4 py-3">
        <div className="min-w-0">
          <p className="t-small font-semibold text-ink">Cover letter</p>
          <p className="t-label mt-0.5 text-ink-faint">Required · Express Entry</p>
        </div>
        {state !== "ready" && (
          <Button size="sm" onClick={generate} disabled={state === "generating"} className="shrink-0">
            {state === "generating" ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Sparkles size={14} aria-hidden />
            )}
            {state === "generating" ? "Generating…" : "Generate PDF"}
          </Button>
        )}
      </div>

      <div className="mt-3 flex-1">
        <AnimatePresence mode="wait">
          {state === "ready" ? (
            <motion.div
              key="ready"
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springDefault}
              className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-hairline bg-canvas p-5 text-center"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent-tint text-accent">
                <FileText size={20} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="t-small font-semibold break-all text-ink">{FILE_NAME}</p>
                <p className="t-label mt-0.5 text-ink-faint">1 page · Generated just now</p>
              </div>

              <Button size="sm" onClick={fakeDownload} disabled={download === "downloading"}>
                {download === "downloading" ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                ) : download === "done" ? (
                  <Check size={14} aria-hidden />
                ) : (
                  <Download size={14} aria-hidden />
                )}
                {download === "downloading" ? "Preparing…" : download === "done" ? "Downloaded" : "Download PDF"}
              </Button>

              {/* Verbatim disclaimer from the real product's cover-letter
                  flow — honesty about provenance matters more here than on
                  the ambient cards (skill §16, responsibility). */}
              <p className="t-label text-ink-faint">AI-generated · review before submitting</p>

              <button
                type="button"
                onClick={generate}
                className="t-label flex items-center gap-1 text-ink-faint underline underline-offset-2 hover:text-ink"
              >
                <RotateCw size={11} aria-hidden />
                Regenerate
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={springDefault}
              className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-hairline px-4 py-6 text-center"
            >
              {state === "generating" ? (
                <>
                  <Loader2 size={20} className="animate-spin text-accent" aria-hidden />
                  <p className="t-small text-ink-muted">Generating your PDF…</p>
                </>
              ) : (
                <p className="t-small max-w-[26ch] text-ink-faint">
                  Ask Pathways to draft this one for you — you fill in the specifics.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
