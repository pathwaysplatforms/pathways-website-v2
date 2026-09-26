"use client";

import { motion, useInView, useMotionValue, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springDefault } from "@/lib/motion";

/**
 * A stat with a numeric lead-in ("6", "31.5") plus a fixed prefix/suffix
 * ("~", " months", "%") counts up from 0 once it enters view. A stat with
 * no `countTo` (e.g. a dollar range) just gets the same spring entrance
 * without the count.
 */
export function StatCard({
  index,
  prefix = "",
  countTo,
  decimals = 0,
  suffix = "",
  staticValue,
  label,
  source,
}: {
  index: number;
  prefix?: string;
  countTo?: number;
  decimals?: number;
  suffix?: string;
  staticValue?: string;
  label: string;
  source: { label: string; href: string };
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced || countTo === undefined ? countTo ?? 0 : 0);
  const value = useMotionValue(0);

  useEffect(() => {
    if (!inView || countTo === undefined) return;
    if (reduced) {
      setDisplay(countTo);
      return;
    }
    const controls = animate(value, countTo, {
      duration: 1.1,
      delay: 0.15 + index * 0.08,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, countTo, reduced, index, value]);

  return (
    <motion.li
      ref={ref}
      className="relative flex min-h-[9rem] flex-col justify-between rounded-card border border-hairline bg-surface p-6 shadow-raised"
      initial={{ opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ ...springDefault, delay: index * 0.08 }}
      whileHover={reduced ? undefined : { y: -3 }}
      whileTap={reduced ? undefined : { scale: 0.985, y: -1 }}
      style={{ transformOrigin: "center bottom" }}
    >
      <div className="relative">
        <p className="t-numeral text-ink">
          {staticValue ?? (
            <>
              {prefix}
              {display.toFixed(decimals)}
              {suffix}
            </>
          )}
        </p>
        <p className="t-small mt-2 max-w-[26ch] text-ink-muted">{label}</p>
      </div>

      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="t-small relative mt-4 self-end text-ink-faint underline decoration-hairline underline-offset-2 transition-colors hover:text-accent"
      >
        {source.label}
      </a>
    </motion.li>
  );
}
