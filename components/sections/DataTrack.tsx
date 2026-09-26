"use client";

import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { project, springMomentum } from "@/lib/motion";

type Card = { value: string; label: string };

/**
 * What sets Pathways apart: the coverage and freshness of our own data, not
 * general Canadian immigration stats — Problem.tsx already carries those,
 * sourced externally. Every figure below traces to the production app
 * (pathways-final), current as of the September 2026 data audit:
 * - Pathway/step/document counts: docs/backfill/proposal.md — 107 steps
 *   and 86 document requirements across the 14 pathways fully authored
 *   so far.
 * - Refresh cadence: .github/workflows/scraper-draws.yml (Express Entry
 *   draws, every 2 days) and scraper-pathways.yml (full pathway content,
 *   every 7 days).
 * - Matching pipeline stages: docs/voice-onboarding-snapshot.md.
 * - Voice-intake field count: src/lib/completeness.ts (19 fields).
 */
const CARDS: Card[] = [
  { value: "14", label: "Canadian pathways mapped, step by step" },
  { value: "107", label: "individual steps tracked across them" },
  { value: "86", label: "document requirements tracked" },
  { value: "2 days", label: "between Express Entry draw refreshes" },
  { value: "7 days", label: "between full pathway re-scans" },
  { value: "8-stage", label: "AI pipeline behind every match" },
  { value: "19", label: "fields our voice intake actually needs" },
];

const DRAG_THRESHOLD = 10; // px of hysteresis before committing (skill §10)
const AUTOPLAY_PX_PER_SEC = 34; // calm drift — well clear of the ~0.2Hz ceiling in §14

/** Keeps a value inside (-width, 0] by wrapping, not clamping — there's no
 *  edge to stop at, since CARDS renders twice back to back and looping by
 *  exactly one set's width is invisible. */
function wrap(value: number, width: number) {
  if (width <= 0) return value;
  const wrapped = value % width;
  return wrapped > 0 ? wrapped - width : wrapped;
}

/**
 * Infinite drifting track — autoplay with fully interruptible drag.
 *
 * - Drifts left on its own at a constant, gentle rate; CARDS is rendered
 *   twice so wrapping the motion value by one set's width loops seamlessly.
 * - The instant a pointer touches it, the drift stops — feedback belongs on
 *   pointer-*down*, not on release (§1) — and 1:1 tracking takes over from
 *   wherever the drift left off, the live presentation value, not a snapped
 *   target (§3).
 * - Velocity history across the last few moves, not just the current point (§2).
 * - On release, the resting position is *projected* from velocity using
 *   Apple's exponential-decay function, then the spring is handed the release
 *   velocity so there's no seam between drag and animation (§5, §6). Autoplay
 *   resumes only once that spring settles.
 * - A single change listener wraps the motion value whenever it drifts past
 *   a set's width, regardless of whether autoplay, a drag, or the release
 *   spring is what moved it — so nothing needs to special-case the loop
 *   point mid-flight.
 *
 * Under prefers-reduced-motion this degrades to a plain native scroller with
 * no autoplay and no duplicated content — reachable, just without the
 * physics or the loop (§14).
 */
export function DataTrack() {
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);

  const [singleWidth, setSingleWidth] = useState(0);
  const widthRef = useRef(0);
  const autoplayRef = useRef(true);

  // Gesture state
  const drag = useRef({
    active: false,
    committed: false,
    startX: 0,
    startVal: 0,
    history: [] as { x: number; t: number }[],
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Two copies of CARDS sit back to back, so half the track's full width
    // is the width of one loop — the amount a wrap needs to shift by.
    const width = track.scrollWidth / 2;
    widthRef.current = width;
    setSingleWidth(width);
  }, []);

  useLayoutEffect(() => {
    measure();
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Wherever x came from — autoplay, a drag, or the release spring — this
  // is the one place the loop point is enforced, so none of those need to
  // special-case crossing it mid-flight.
  useEffect(() => {
    const unsubscribe = x.on("change", (v) => {
      const width = widthRef.current;
      if (width <= 0) return;
      if (v <= -width || v > 0) x.set(wrap(v, width));
    });
    return unsubscribe;
  }, [x]);

  useAnimationFrame((_, delta) => {
    if (reduced || !autoplayRef.current || widthRef.current <= 0) return;
    x.set(x.get() - (AUTOPLAY_PX_PER_SEC * delta) / 1000);
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (reduced || e.button !== 0) return;
      // Stop the drift the instant it's touched — this is the feedback,
      // not the eventual drag (§1).
      autoplayRef.current = false;
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

      // Respect where they grabbed it — no snap to center (§2). No
      // rubber-banding either: there's no edge, just a loop, so the change
      // listener above wraps this if it runs past a set's width.
      x.set(d.startVal + dx);

      const now = performance.now();
      d.history.push({ x: e.clientX, t: now });
      // Keep ~100ms of history; older samples make velocity stale.
      while (d.history.length > 2 && now - d.history[0].t > 100) {
        d.history.shift();
      }
    },
    [x],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;

      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (!d.committed) {
        // A tap, not a drag — nothing moved, resume drifting.
        autoplayRef.current = true;
        return;
      }

      const first = d.history[0];
      const last = d.history[d.history.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0; // px/s

      // Animate to where the gesture is *going*, not where it stopped (§6).
      // No clamping to a range — it's a loop, so any target is reachable,
      // and the change listener above wraps it into view mid-flight.
      const target = x.get() + project(velocity);

      // Hand the release velocity straight to the spring — no seam (§5).
      // Autoplay only picks back up once the spring has settled.
      animate(x, target, {
        ...springMomentum,
        velocity,
        onComplete: () => {
          autoplayRef.current = true;
        },
      });
    },
    [x],
  );

  // Keyboard equivalent — the track is focusable, so momentum isn't the only
  // way through the content (§16, flexibility).
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = (viewportRef.current?.clientWidth ?? 0) * 0.6;
      let target: number | null = null;
      if (e.key === "ArrowRight") target = x.get() - step;
      if (e.key === "ArrowLeft") target = x.get() + step;
      if (target === null) return;
      e.preventDefault();
      autoplayRef.current = false;
      animate(x, target, {
        ...springMomentum,
        onComplete: () => {
          autoplayRef.current = true;
        },
      });
    },
    [x],
  );

  // Release the grab if the pointer is lost outside the component, and
  // resume drifting since no committed drag means nothing to spring from.
  useEffect(() => {
    const cancel = () => {
      const wasCommitted = drag.current.committed;
      drag.current.active = false;
      if (!wasCommitted) autoplayRef.current = true;
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
      aria-label="Data figures — drifts on its own, drag or use arrow keys to take over"
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
          <li key={`a-${i}`}>
            <DataCard {...c} />
          </li>
        ))}
        {/* Second copy makes the loop seamless (see `wrap`); hidden from
            assistive tech so the figures aren't announced twice. */}
        {CARDS.map((c, i) => (
          <li key={`b-${i}`} aria-hidden>
            <DataCard {...c} />
          </li>
        ))}
      </motion.ul>
      <p className="t-small mt-4 text-ink-faint" aria-hidden>
        Drag anytime to take over — it drifts on its own otherwise
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
