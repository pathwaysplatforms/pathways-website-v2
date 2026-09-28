"use client";

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { springDefault } from "@/lib/motion";

type Stage = "idle" | "submitting" | "success";

/**
 * UI shell for the waitlist capture. Not wired to Supabase yet — `onSubmit`
 * only simulates the round trip so the states (idle/submitting/success) are
 * real and can be reviewed before the network call is added.
 *
 * The form and the confirmation occupy the same slot and swap with a single
 * spring (skill §7, §16 completion feedback) rather than the confirmation
 * appearing below the form, which would shift everything under it.
 */
export function WaitlistForm() {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const reduced = useReducedMotion();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stage === "submitting") return;
    setStage("submitting");
    // PLACEHOLDER — replace with the Supabase insert. Simulated so the
    // submitting -> success states are real to review in the meantime.
    window.setTimeout(() => setStage("success"), 500);
  };

  const slide = reduced ? 0 : 12;

  return (
    <div className="rounded-card border border-hairline bg-surface p-6 shadow-raised sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {stage !== "success" ? (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: slide }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -slide }}
            transition={springDefault}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="waitlist-email">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={stage === "submitting"}
              placeholder="you@example.com"
              className="t-body min-w-0 flex-1 rounded-pill border border-hairline bg-canvas px-5 py-3 text-ink placeholder:text-ink-faint disabled:opacity-60"
            />
            <Button type="submit" size="md" disabled={stage === "submitting"}>
              {stage === "submitting" ? "Joining…" : "Join the beta"}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: slide }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -slide }}
            transition={springDefault}
            className="flex items-center gap-3"
          >
            <CheckCircle2
              aria-hidden
              className="h-6 w-6 shrink-0 text-accent"
              strokeWidth={2}
            />
            <p className="t-body text-ink">
              You&apos;re on the list — we&apos;ll email {email || "you"} as
              soon as a beta spot opens up.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
