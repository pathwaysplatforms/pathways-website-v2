"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { springPress } from "@/lib/motion";

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-accent text-on-accent shadow-raised",
  secondary:
    "bg-surface text-ink border border-hairline shadow-raised",
  quiet: "bg-transparent text-ink-muted hover:text-ink",
};

const SIZE: Record<Size, string> = {
  sm: "px-[0.875rem] py-[0.4375rem] t-small font-medium",
  md: "px-[1.125rem] py-[0.625rem] t-body font-medium",
  lg: "px-[1.75rem] py-[0.875rem] t-lead font-medium",
};

type Props = {
  children: React.ReactNode;
  /** Anchor target. Renders an <a>; omit for a <button>. */
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

/**
 * Feedback lands on pointer-DOWN and stays continuous through the gesture
 * (skill §1) — never only on release. Dragging off the button releases the
 * press and dragging back re-applies it (§10, cancel-by-dragging-away).
 *
 * The scale is a spring, not a CSS transition, so a rapid press/release is
 * interruptible and animates from the live presentation value (§3).
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: Props) {
  const [pressed, setPressed] = useState(false);
  // Pointer is down *somewhere* — lets us re-apply the press on re-entry.
  const holding = useRef(false);

  useEffect(() => {
    if (!holding.current && !pressed) return;
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
  }, [pressed]);

  const down = useCallback(() => {
    if (disabled) return;
    holding.current = true;
    setPressed(true);
  }, [disabled]);

  const enter = useCallback(() => {
    if (holding.current && !disabled) setPressed(true);
  }, [disabled]);

  const leave = useCallback(() => setPressed(false), []);

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-pill " +
    "cursor-pointer select-none no-underline " +
    // ~10px of invisible hit padding around the target (§10)
    "after:absolute after:-inset-[0.625rem] after:content-['']";

  const handlers = {
    onPointerDown: down,
    onPointerEnter: enter,
    onPointerLeave: leave,
  };

  const anim = { scale: pressed ? 0.97 : 1, opacity: disabled ? 0.45 : 1 };
  const cls = `${base} ${VARIANT[variant]} ${SIZE[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        animate={anim}
        transition={springPress}
        {...handlers}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cls}
      animate={anim}
      transition={springPress}
      {...handlers}
    >
      {children}
    </motion.button>
  );
}
