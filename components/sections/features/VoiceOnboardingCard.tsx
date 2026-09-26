"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springDefault } from "@/lib/motion";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";
import type { OrbState } from "@/components/ui/thinking-orbs";

/**
 * Scripted after pathways-final's onboarding voice call (VoiceTab.tsx —
 * orb + live waveform, no visible transcript on the real screen). The site
 * can't play audio autoplaying over a landing page, so this trades the
 * waveform for on-screen captions.
 *
 * This is the lower half of card 01's content — Features.tsx supplies the
 * card frame, heading and "Sound off" badge, so this component owns only
 * the live demo: orb, caption, progress. Keeping it unboxed (no border/bg
 * of its own) is what lets it sit inside one unified card instead of a
 * card-in-a-card.
 */
const EXCHANGE = [
  { role: "assistant", text: "What brings you to Canada?", orb: "composing" },
  { role: "user", text: "Finishing a master's in Toronto.", orb: "listening" },
  { role: "assistant", text: "When does your study permit expire?", orb: "composing" },
  { role: "user", text: "April, next year.", orb: "listening" },
  { role: "assistant", text: "Got it — building your pathway now.", orb: "solving" },
] as const satisfies ReadonlyArray<{ role: "assistant" | "user"; text: string; orb: OrbState }>;

const TOTAL_FIELDS = 4;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function VoiceOnboardingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    if (reduced) {
      setTurn(EXCHANGE.length - 1);
    }
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced) return;
    let active = true;

    async function loop() {
      while (active) {
        for (let t = 0; t < EXCHANGE.length && active; t++) {
          setTurn(t);
          await sleep(t === EXCHANGE.length - 1 ? 2200 : 1800);
        }
      }
    }

    void loop();
    return () => {
      active = false;
    };
  }, [inView, reduced]);

  const line = EXCHANGE[turn];
  const fieldsCollected = Math.min(
    TOTAL_FIELDS,
    Math.ceil((turn / (EXCHANGE.length - 1)) * TOTAL_FIELDS),
  );

  return (
    <div ref={ref} className="flex h-full min-h-[9rem] flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <ThinkingOrb state={line.orb} size={64} theme="light" color="#1A56DB" />

        <div className="flex min-h-[3.25rem] w-full max-w-[24ch] flex-col items-center gap-1 text-center">
          <span className="t-label text-ink-faint">
            {line.role === "assistant" ? "Pathways" : "You"}
          </span>
          <AnimatePresence mode="wait">
            <motion.p
              key={turn}
              initial={reduced ? undefined : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={springDefault}
              className="t-small text-ink"
            >
              &ldquo;{line.text}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-hairline pt-4">
        <div className="h-[3px] flex-1 rounded-pill bg-accent-tint">
          <motion.div
            className="h-full rounded-pill bg-accent"
            animate={{ width: `${(fieldsCollected / TOTAL_FIELDS) * 100}%` }}
            transition={springDefault}
          />
        </div>
        <span className="t-label text-ink-faint">
          {fieldsCollected}/{TOTAL_FIELDS}
        </span>
      </div>
    </div>
  );
}
