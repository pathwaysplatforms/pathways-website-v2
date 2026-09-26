"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { springDefault } from "@/lib/motion";

/**
 * Entrance on scroll. Critically damped (bounce 0) — no overshoot, because
 * no gesture carried momentum into it (skill §4).
 *
 * Under prefers-reduced-motion the translate is dropped entirely and only
 * the opacity cross-fade remains (§14) — gentler, not absent.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();

  const M = motion[Tag] as typeof motion.div;

  return (
    <M
      ref={ref}
      data-reveal
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ ...springDefault, delay }}
    >
      {children}
    </M>
  );
}
