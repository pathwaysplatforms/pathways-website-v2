"use client";

import { ArrowUp } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springDefault } from "@/lib/motion";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";

/**
 * A scripted loop of the "Ask Pathways" chat, structured after the real
 * written-chat interface (pathways-final's AskPageClient/ChatInput): a
 * right-aligned user question with an accent left-border, a left-aligned
 * plain-text answer with a source line underneath, and a pill input at the
 * bottom that types each question out before it's "sent". Runs a short
 * back-and-forth (three exchanges, the last one deliberately more layered)
 * rather than a single Q&A — so it reads as an actual conversation and
 * shows the assistant handling a harder, multi-factor question, not just
 * simple lookups.
 */
const EXCHANGES = [
  {
    question: "Am I eligible for Express Entry?",
    answer:
      "With 3 years of skilled work experience and CLB 9 English, you likely qualify through the Federal Skilled Worker Program — your estimated CRS score is competitive for recent draws.",
    source: "ircc.canada.ca › express-entry › eligibility",
  },
  {
    question: "What documents will I need?",
    answer:
      "A valid passport, language test results, an educational credential assessment, and proof of funds. We'll turn this into a personalized checklist once you start your profile.",
    source: "ircc.canada.ca › express-entry › document-checklist",
  },
  {
    question:
      "My spouse's ECA is still pending and I have a job offer in Alberta — does that change which pathway we should pursue?",
    answer:
      "It does. A valid job offer can qualify you for the Alberta Advantage Immigration Program alongside Express Entry, and a provincial nomination adds 600 CRS points — enough to move almost any profile to the top of the pool. We'd suggest starting your AAIP application now while your spouse finishes their ECA, then submitting Express Entry once it lands so your combined score reflects it accurately.",
    source: "alberta.ca › aaip › eligibility",
  },
] as const;

type Phase = "typing" | "sent" | "thinking" | "answered";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function ChatGlimpse() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduced) {
      setTurn(EXCHANGES.length - 1);
      setTyped(EXCHANGES[EXCHANGES.length - 1].question);
      setPhase("answered");
    }
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced) return;
    let active = true;

    async function loop() {
      while (active) {
        for (let t = 0; t < EXCHANGES.length && active; t++) {
          setTurn(t);
          const { question } = EXCHANGES[t];

          setPhase("typing");
          setTyped("");
          for (let i = 1; i <= question.length && active; i++) {
            setTyped(question.slice(0, i));
            await sleep(38);
          }
          if (!active) return;
          await sleep(550);
          setPhase("sent");
          await sleep(750);
          if (!active) return;
          setPhase("thinking");
          await sleep(1690);
          if (!active) return;
          setPhase("answered");
          await sleep(t === EXCHANGES.length - 1 ? 5000 : 2200);
        }
      }
    }

    void loop();
    return () => {
      active = false;
    };
  }, [inView, reduced]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turn, phase, typed]);

  const showUser = phase === "sent" || phase === "thinking" || phase === "answered";

  return (
    <div
      ref={ref}
      className="flex min-h-[24rem] flex-col overflow-hidden rounded-card border border-hairline bg-surface shadow-floating"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-hairline px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
        <span className="t-label ml-2 text-ink-faint">Ask Pathways</span>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="flex max-h-[26rem] flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-7"
      >
        {/* Prior turns, settled */}
        {EXCHANGES.slice(0, turn).map((ex, i) => (
          <div key={i} className="flex flex-col gap-5">
            <div className="flex justify-end">
              <div className="max-w-[75%] border-l-2 border-accent pl-3">
                <p className="t-small text-ink">{ex.question}</p>
              </div>
            </div>
            <div>
              <p className="t-small max-w-[85%] text-ink-muted">{ex.answer}</p>
              <p className="t-label mt-3 text-ink-faint">Source</p>
              <p className="t-small text-ink-faint">{ex.source}</p>
            </div>
          </div>
        ))}

        {/* Current turn, in progress */}
        <div className="flex flex-1 flex-col justify-end gap-4">
          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springDefault}
              className="flex justify-end"
            >
              <div className="max-w-[75%] border-l-2 border-accent pl-3">
                <p className="t-small text-ink">{EXCHANGES[turn].question}</p>
              </div>
            </motion.div>
          )}

          {phase === "thinking" && (
            <div className="flex items-center gap-2" aria-label="Thinking">
              <ThinkingOrb state="composing" size={20} theme="light" />
              <span className="t-small text-ink-faint">Thinking…</span>
            </div>
          )}

          {phase === "answered" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springDefault}
            >
              <p className="t-small max-w-[85%] text-ink-muted">{EXCHANGES[turn].answer}</p>
              <p className="t-label mt-3 text-ink-faint">Source</p>
              <p className="t-small text-ink-faint">{EXCHANGES[turn].source}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input pill */}
      <div className="border-t border-hairline p-4 sm:px-6">
        <div className="flex items-center gap-2 rounded-pill border border-hairline bg-canvas px-4 py-2.5">
          <p className="t-small flex-1 truncate text-ink-faint">
            {phase === "typing" ? (
              <>
                {typed}
                <span className="chat-caret">|</span>
              </>
            ) : (
              "Ask a question about your application…"
            )}
          </p>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-pill bg-ink text-canvas">
            <ArrowUp size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
