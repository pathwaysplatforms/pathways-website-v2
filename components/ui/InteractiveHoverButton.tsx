"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { springDefault, springPress } from "@/lib/motion";

/**
 * The dot-fill hover button.
 *
 * A small dot sits in the corner at rest. On engage it expands to flood the
 * button, the label slides out to the right and a second label slides in
 * behind it with an arrow.
 *
 * Adapted from the shadcn-style `InteractiveHoverButton` to this project's
 * design authority (.claude/skills/apple-design/SKILL.md):
 *
 * - Springs, not `transition-all duration-300` — the source used CSS
 *   transitions, which the skill rules out for anything a user can touch (§4).
 * - `transform`/`opacity` only. The source animated `left`, `top`, `height`
 *   and `width`, which lay out and paint on every frame (§11).
 * - Engaged on pointer-DOWN as well as hover, so a touch user gets the same
 *   feedback instead of nothing (§1). Hover alone is a mouse-only affordance.
 * - Focus counts as engaged too, so the arrow affordance exists for keyboard.
 * - The fill's transform-origin IS the resting dot, so it enters and exits
 *   along one path anchored to where it started (§7).
 * - `prefers-reduced-motion` drops the travel and the flood, leaving a
 *   cross-fade (§14).
 */

/** Diameter of the resting dot, px. Drives the exact fill scale below. */
const DOT = 8;

/**
 * Distance from the left edge to the dot, px. The source placed it at
 * `left-[20%]`, which only clears the label because its button is a fixed
 * `w-32` holding a much shorter word. This one shrinks to fit its text, so a
 * percentage puts the dot on top of the first letter. A fixed offset keeps it
 * in the padding gutter at any label length.
 */
const DOT_LEFT = 12;

/** How far the labels travel on the swap, px. */
const TRAVEL = 44;

type Props = {
  text: string;
  /** Renders an <a>. Omit for a <button>. */
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
};

export function InteractiveHoverButton({
  text,
  href,
  onClick,
  className = "",
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const holding = useRef(false);

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  // Scale that makes the dot exactly cover the button from where it sits.
  // Measured rather than guessed, so it holds for any label length.
  const [fillScale, setFillScale] = useState(24);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      // Dot centre, matching the placement below.
      const cx = DOT_LEFT + DOT / 2;
      const cy = height / 2;
      const farthest = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(width - cx, cy),
        Math.hypot(cx, height - cy),
        Math.hypot(width - cx, height - cy),
      );
      setFillScale((farthest / (DOT / 2)) * 1.02);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A press that ends anywhere still releases this button.
  useEffect(() => {
    const release = () => {
      holding.current = false;
      setPressed(false);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);

  const down = useCallback(() => {
    holding.current = true;
    setPressed(true);
  }, []);

  const enter = useCallback(() => {
    setHovered(true);
    if (holding.current) setPressed(true);
  }, []);

  const leave = useCallback(() => {
    setHovered(false);
    setPressed(false);
  }, []);

  // Only a keyboard focus ring should trigger the reveal, not a mouse click.
  const focus = useCallback((e: React.FocusEvent<HTMLElement>) => {
    setFocused(e.target.matches(":focus-visible"));
  }, []);

  const engaged = hovered || focused || pressed;
  const travel = reduced ? 0 : TRAVEL;

  const shell =
    "group relative isolate inline-flex cursor-pointer select-none items-center " +
    "justify-center overflow-hidden rounded-pill border border-accent " +
    // Padding is symmetric and wide enough for the dot to sit in the gutter,
    // so both labels centre on the same axis and the swap doesn't shift.
    "bg-surface px-[1.75rem] py-[0.5rem] t-small font-medium no-underline " +
    // ~10px of invisible hit padding, matching the other buttons (§10)
    "before:absolute before:-inset-[0.625rem] before:content-['']";

  const handlers = {
    onPointerDown: down,
    onPointerEnter: enter,
    onPointerLeave: leave,
    onFocus: focus,
    onBlur: () => setFocused(false),
  };

  const body = (
    <>
      {/* The flood. Its origin is the dot, so it grows out of and collapses
          back into exactly the same point. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -z-10 rounded-full bg-accent"
        style={{
          left: DOT_LEFT,
          // Centred without a translate, so nothing competes with `scale`
          // for the transform.
          top: `calc(50% - ${DOT / 2}px)`,
          width: DOT,
          height: DOT,
          transformOrigin: "center",
        }}
        animate={
          reduced
            ? { scale: fillScale, opacity: engaged ? 1 : 0 }
            : { scale: engaged ? fillScale : 1, opacity: 1 }
        }
        transition={pressed ? springPress : springDefault}
      />

      {/* Resting label. Carries the accessible name. */}
      <motion.span
        className="inline-block text-accent"
        animate={{ x: engaged ? travel : 0, opacity: engaged ? 0 : 1 }}
        transition={pressed ? springPress : springDefault}
      >
        {text}
      </motion.span>

      {/* Revealed label. Hidden from assistive tech so the name isn't
          announced twice — the source component read it out both times. */}
      <motion.span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center gap-2 text-on-accent"
        animate={{ x: engaged ? 0 : travel, opacity: engaged ? 1 : 0 }}
        transition={pressed ? springPress : springDefault}
      >
        {text}
        <ArrowRight className="h-4 w-4" />
      </motion.span>
    </>
  );

  const press = { scale: pressed ? 0.97 : 1 };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={`${shell} ${className}`}
        animate={press}
        transition={springPress}
        {...handlers}
      >
        {body}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={`${shell} ${className}`}
      animate={press}
      transition={springPress}
      {...handlers}
    >
      {body}
    </motion.button>
  );
}
