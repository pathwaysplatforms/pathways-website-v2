"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { project, rubberband, springMomentum } from "@/lib/motion";

type Card = { value: string; label: string };

/** PLACEHOLDER figures — swap for real numbers when we build this section. */
const CARDS: Card[] = [
  { value: "107", label: "pathways tracked" },
  { value: "Daily", label: "refreshed IRCC data" },
  { value: "00", label: "third stat — TBD" },
  { value: "00", label: "fourth stat — TBD" },
  { value: "00", label: "fifth stat — TBD" },
];

const DRAG_THRESHOLD = 10; // px of hysteresis before committing (skill §10)

/**
 * Draggable horizontal track.
 *
 * - 1:1 tracking from the grab point, with pointer capture so the drag
 *   survives leaving the element (§2).
 * - Velocity history across the last few moves, not just the current point (§2).
 * - On release, the resting position is *projected* from velocity using
 *   Apple's exponential-decay function, then the spring is handed the release
 *   velocity so there's no seam between drag and animation (§5, §6).
 * - Past the ends, resistance grows progressively rather than stopping hard (§9).
 *
 * Under prefers-reduced-motion this degrades to a plain native scroller — the
 * content is all still reachable, just without the momentum physics (§14).
 */
export function DataTrack() {
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);

  const [minX, setMinX] = useState(0);
  const bounds = useRef({ min: 0, width: 0 });

  // Gesture state
  const drag = useRef({
    active: false,
    committed: false,
    startX: 0,
    startVal: 0,
    history: [] as { x: number; t: number }[],
  });

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const overflow = track.scrollWidth - vp.clientWidth;
    const min = Math.min(0, -overflow);
    bounds.current = { min, width: vp.clientWidth };
    setMinX(min);
    if (x.get() < min) x.set(min);
    if (x.get() > 0) x.set(0);
  }, [x]);

  useLayoutEffect(() => {
    measure();
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const clampWithResistance = useCallback((raw: number) => {
    const { min, width } = bounds.current;
    if (raw > 0) return rubberband(raw, width);
    if (raw < min) return min + rubberband(raw - min, width);
    return raw;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (reduced || e.button !== 0) return;
      drag.current = {
        active: true,
        committed: false,
        startX: e.clientX,
        // Animate from the live presentation value, so grabbing a moving
        // track picks it up exactly where it is (§3).
        startVal: x.get(),
        history: [{ x: e.clientX, t: performance.now() }],
      };
    },
    [reduced, x],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;

      const dx = e.clientX - d.startX;

      if (!d.committed) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        d.committed = true;
        // Only capture once we're sure this is a horizontal drag, so a
        // vertical page scroll is never stolen.
        e.currentTarget.setPointerCapture(e.pointerId);
      }

      // Respect where they grabbed it — no snap to center (§2).
      x.set(clampWithResistance(d.startVal + dx));

      const now = performance.now();
      d.history.push({ x: e.clientX, t: now });
      // Keep ~100ms of history; older samples make velocity stale.
      while (d.history.length > 2 && now - d.history[0].t > 100) {
        d.history.shift();
      }
    },
    [clampWithResistance, x],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;

      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (!d.committed) return;

      const first = d.history[0];
      const last = d.history[d.history.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0; // px/s

      const { min } = bounds.current;
      // Animate to where the gesture is *going*, not where it stopped (§6).
      const projected = x.get() + project(velocity);
      const target = Math.max(min, Math.min(0, projected));

      // Hand the release velocity straight to the spring — no seam (§5).
      animate(x, target, { ...springMomentum, velocity });
    },
    [x],
  );

  // Keyboard equivalent — the track is focusable, so momentum isn't the only
  // way through the content (§16, flexibility).
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = bounds.current.width * 0.6;
      let target: number | null = null;
      if (e.key === "ArrowRight") target = x.get() - step;
      if (e.key === "ArrowLeft") target = x.get() + step;
      if (e.key === "Home") target = 0;
      if (e.key === "End") target = bounds.current.min;
      if (target === null) return;
      e.preventDefault();
      animate(x, Math.max(bounds.current.min, Math.min(0, target)), springMomentum);
    },
    [x],
  );

  // Release the grab if the pointer is lost outside the component.
  useEffect(() => {
    const cancel = () => {
      drag.current.active = false;
    };
    window.addEventListener("pointercancel", cancel);
    return () => window.removeEventListener("pointercancel", cancel);
  }, []);

  if (reduced) {
    return (
      <div className="overflow-x-auto px-gutter" tabIndex={0} aria-label="Data figures">
        <ul className="mx-auto flex w-max max-w-none gap-4 py-2">
          {CARDS.map((c, i) => (
            <li key={i}>
              <DataCard {...c} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      className="overflow-hidden px-gutter"
      style={{ touchAction: "pan-y" }}
      tabIndex={0}
      role="group"
      aria-label="Data figures — drag or use arrow keys"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <motion.ul
        ref={trackRef}
        className="flex w-max cursor-grab gap-4 py-2 active:cursor-grabbing"
        style={{ x }}
      >
        {CARDS.map((c, i) => (
          <li key={i}>
            <DataCard {...c} />
          </li>
        ))}
      </motion.ul>
      <p className="t-small mt-4 text-ink-faint" aria-hidden>
        Drag to explore {minX < 0 ? "→" : ""}
      </p>
    </div>
  );
}

function DataCard({ value, label }: Card) {
  return (
    <div className="placeholder flex h-[11rem] w-[16rem] flex-col items-start justify-end gap-1 p-6 text-left sm:h-[13rem] sm:w-[19rem]">
      <span className="t-numeral text-ink">{value}</span>
      <span className="t-small text-ink-muted">{label}</span>
    </div>
  );
}
