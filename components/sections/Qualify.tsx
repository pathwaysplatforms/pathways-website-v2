"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { springDefault } from "@/lib/motion";

/**
 * SKELETON — eligibility check.
 *
 * Flow: intro -> questions -> either "qualified" (into the platform) or
 * "waitlist" (capture an email and recontact once the route is supported).
 *
 * All questions, the scoring rule and both endpoints are placeholders. What
 * IS real here is the shape: one question per screen, a visible position in
 * the flow, and a way back at every step so nobody is ever trapped
 * (skill §16, agency + wayfinding).
 */

/** PLACEHOLDER — replace with the real PEQ screening questions. */
const QUESTIONS = [
  "Question one — placeholder",
  "Question two — placeholder",
  "Question three — placeholder",
];

type Stage = "intro" | "questions" | "qualified" | "waitlist";

export function Qualify() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  // +1 forward, -1 back. Panels enter and exit along the same path (§7).
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion();

  const answer = (qualifies: boolean) => {
    setDir(1);
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    // PLACEHOLDER scoring — the real PEQ rules go here.
    setStage(qualifies ? "qualified" : "waitlist");
  };

  const back = () => {
    setDir(-1);
    if (stage === "questions" && index > 0) {
      setIndex(index - 1);
    } else if (stage === "questions") {
      setStage("intro");
    } else {
      setStage("questions");
      setIndex(QUESTIONS.length - 1);
    }
  };

  const slide = reduced ? 0 : 24;

  return (
    <Section
      id="qualify"
      title="Check your eligibility"
      className="border-t border-hairline bg-surface-sunken"
    >
      <Container width="measure">
        <Reveal className="text-center">
          <p className="t-label text-accent">Eligibility</p>
          <h2 className="t-title mt-4 text-balance text-ink">
            Find out where you stand in two minutes
          </h2>
        </Reveal>

        <div className="mt-12 rounded-card border border-hairline bg-surface p-6 shadow-raised sm:p-10">
          {/* Position in the flow — ongoing status (§16, feedback) */}
          {stage === "questions" ? (
            <p className="t-label text-ink-faint">
              Step {index + 1} of {QUESTIONS.length}
            </p>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage === "questions" ? `q-${index}` : stage}
              initial={{ opacity: 0, x: dir * slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -slide }}
              transition={springDefault}
            >
              {stage === "intro" ? (
                <div>
                  <p className="t-lead text-ink-muted">
                    {/* PLACEHOLDER copy */}
                    A few short questions about your situation. Nothing is
                    submitted until the end.
                  </p>
                  <div className="mt-8">
                    <Button
                      size="lg"
                      onClick={() => {
                        setDir(1);
                        setStage("questions");
                      }}
                    >
                      Begin
                    </Button>
                  </div>
                </div>
              ) : null}

              {stage === "questions" ? (
                <div>
                  <p className="t-heading mt-3 text-ink">{QUESTIONS[index]}</p>
                  <p className="t-small mt-2 text-ink-faint">
                    Placeholder — the real answer inputs go here.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button onClick={() => answer(true)}>Yes</Button>
                    <Button variant="secondary" onClick={() => answer(false)}>
                      No
                    </Button>
                  </div>
                </div>
              ) : null}

              {stage === "qualified" ? (
                <div>
                  <p className="t-heading text-ink">
                    You may qualify — placeholder result
                  </p>
                  <p className="t-body mt-3 text-ink-muted">
                    Real copy and the handoff into the platform go here.
                  </p>
                  <div className="mt-8">
                    <Button size="lg" href="#">
                      Continue to Pathways
                    </Button>
                  </div>
                </div>
              ) : null}

              {stage === "waitlist" ? (
                <div>
                  <p className="t-heading text-ink">
                    Not this pathway — placeholder result
                  </p>
                  <p className="t-body mt-3 text-ink-muted">
                    Leave an email and we will get in touch as soon as the
                    route that fits you is supported.
                  </p>
                  <form
                    className="mt-6 flex flex-col gap-3 sm:flex-row"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label className="sr-only" htmlFor="waitlist-email">
                      Email address
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="t-body min-w-0 flex-1 rounded-pill border border-hairline bg-canvas px-5 py-3 text-ink placeholder:text-ink-faint"
                    />
                    <Button type="submit">Keep me posted</Button>
                  </form>
                  <p className="t-small mt-3 text-ink-faint">
                    Placeholder — not wired up yet.
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Never trap the user (§16, wayfinding) */}
          {stage !== "intro" ? (
            <div className="mt-8 border-t border-hairline pt-5">
              <Button variant="quiet" size="sm" onClick={back}>
                Back
              </Button>
            </div>
          ) : null}
        </div>

        {/* Responsibility (§16.3): high-stakes domain, stated up front. */}
        <p className="t-small mt-6 text-center text-ink-faint">
          This tool gives guidance, not legal advice, and does not decide your
          application.
        </p>
      </Container>
    </Section>
  );
}
