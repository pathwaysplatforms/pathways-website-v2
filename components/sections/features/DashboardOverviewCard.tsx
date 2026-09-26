"use client";

import { Check } from "lucide-react";
import { Fragment } from "react";
import { motion } from "motion/react";
import { springDefault } from "@/lib/motion";

/**
 * Scripted after pathways-final's dashboard "mission control" view
 * (DashboardMissionControl.tsx's executing state — StatusHero + CrsGaugeCard
 * + JourneyPhaseStrip) plus the Application tab's ActivePathwayTracker
 * checklist: a CRS position against the latest cutoff, a six-phase journey
 * stepper, and a step-by-step "what's left" list with per-item status.
 *
 * A static, richer sample profile — this is the one card meant to read as
 * "here's everything, already in progress," not a single interaction, so
 * unlike cards 01–03 there's nothing to click. Kept deliberately compact
 * (one line per section) since the checklist — the actual "what's still to
 * do" — is the point, and it needs to still be visible without the card's
 * scroll fallback kicking in on an ordinary laptop-height viewport.
 *
 * Every row but the checklist is `shrink-0`: a flex item with `overflow:
 * hidden` in its ancestry (here, `truncate`, and separately the outer
 * card's own overflow-y-auto slot) gets an automatic minimum size of zero
 * per the flexbox spec, so under real space pressure the flex-col was
 * compressing the greeting line to 0px — invisible, not just tight —
 * instead of leaving it be and letting only the `flex-1` checklist (which
 * already has a scroll fallback) absorb the squeeze.
 */
const PHASES = ["Profile", "Eligibility", "Pathway", "Documents", "Application", "Submitted"];
const CURRENT_PHASE = 3;

type StepStatus = "done" | "progress" | "todo";

const STEPS: ReadonlyArray<{ label: string; status: StepStatus }> = [
  { label: "Profile & eligibility", status: "done" },
  { label: "Documents — 4 of 6 uploaded", status: "progress" },
  { label: "Submit application", status: "todo" },
];

const STATUS_LABEL: Record<StepStatus, string> = {
  done: "Done",
  progress: "In progress",
  todo: "To do",
};

const STATUS_PILL: Record<StepStatus, string> = {
  done: "bg-ink text-canvas",
  progress: "border border-accent text-accent",
  todo: "bg-surface-sunken text-ink-faint",
};

const PROGRESS_PERCENT = 68;

export function DashboardOverviewCard() {
  return (
    <div className="flex h-full flex-col gap-2">
      <p className="t-small shrink-0 truncate text-ink">
        <span className="text-ink-faint">Aiden ·</span>{" "}
        <span className="font-semibold">Express Entry — Federal Skilled Worker</span>
      </p>

      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[1.125rem] leading-none font-semibold tracking-tight text-ink">
            478
          </span>
          <span className="t-label text-ink-faint">CRS</span>
        </div>
        <span className="t-label rounded-pill bg-ink px-2.5 py-1 text-canvas">
          +14 above cutoff
        </span>
      </div>

      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <span className="t-label text-ink-faint">Application progress</span>
          <span className="t-label text-ink">{PROGRESS_PERCENT}%</span>
        </div>
        <div className="mt-1 h-[5px] rounded-pill bg-accent-tint">
          <motion.div
            className="h-full rounded-pill bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${PROGRESS_PERCENT}%` }}
            transition={springDefault}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center">
          {PHASES.map((phase, i) => (
            <Fragment key={phase}>
              <span
                className={`shrink-0 rounded-full ${
                  i < CURRENT_PHASE
                    ? "h-2 w-2 bg-accent"
                    : i === CURRENT_PHASE
                      ? "h-2.5 w-2.5 bg-accent ring-4 ring-accent-tint"
                      : "h-2 w-2 border border-hairline bg-canvas"
                }`}
                aria-hidden
              />
              {i < PHASES.length - 1 && (
                <span
                  className={`h-px flex-1 ${i < CURRENT_PHASE ? "bg-accent" : "bg-hairline"}`}
                  aria-hidden
                />
              )}
            </Fragment>
          ))}
        </div>
        <span className="t-label shrink-0 text-ink-faint">{PHASES[CURRENT_PHASE]}</span>
      </div>

      <ul className="flex flex-1 flex-col justify-center gap-1 border-t border-hairline pt-2">
        {STEPS.map((step) => (
          <li key={step.label} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {step.status === "done" ? (
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ink text-canvas">
                  <Check size={10} aria-hidden />
                </span>
              ) : step.status === "progress" ? (
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-accent" aria-hidden />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-hairline" aria-hidden />
              )}
              <span className="t-small truncate text-ink">{step.label}</span>
            </div>
            <span className={`t-label shrink-0 rounded-pill px-2 py-0.5 ${STATUS_PILL[step.status]}`}>
              {STATUS_LABEL[step.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
