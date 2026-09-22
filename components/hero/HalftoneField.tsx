"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
   HalftoneField — the hero's scroll instrument.

   This is the ONLY "use client" file in the repo. It draws a halftone grid of
   ink dots with 107 larger "pathway" dots on grid intersections, then culls
   them to 3 as the page scrolls. Nothing here fades: a pathway dot is either
   drawn or it is not. Mechanical, not cinematic.

   It owns no state React needs to know about. Its single output to the DOM is
   the custom property --p on the wrapper, written once per frame; the overlay
   headlines in Hero.tsx read that property in pure CSS and need no JS at all.

   Colour is read from the token layer with getComputedStyle. There is not a
   single hex literal in this file, and there must never be one.
--------------------------------------------------------------------------- */

/** Pathways mapped. Matches DRAW_SUMMARY_FALLBACK.pathwaysMapped. */
const PATHWAY_COUNT = 107;
/** Pathways left standing on the example profile. */
const SURVIVOR_COUNT = 3;

/**
 * Fixed PRNG seed — the ASCII codes of "PATW". Every dot position and the
 * whole elimination order derive from this, so the sequence is identical on
 * the server, on the client, and on every reload. Nothing in this file may
 * reach for the platform's own unseeded generator.
 */
const SEED = 0x50415457;

/** Target spacing between grid intersections, CSS px. */
const CELL = 26;
/** Halftone dot radius and its opacity. */
const BASE_DOT = 1.3;
const BASE_ALPHA = 0.12;
/** Pathway dot radius, and what a survivor grows to. */
const PATHWAY_DOT = 3.2;
const SURVIVOR_DOT = 8.5;
/** The connecting line is structural: 2px, like every other rule on the site. */
const LINE_WIDTH = 2;

/** Retina, but never more. A 3x phone would quadruple fill cost for nothing. */
const DPR_CAP = 2;

/** Scroll windows. 0–0.35 hold, 0.35–0.75 cull, 0.75–1 resolve. */
const CULL_START = 0.35;
const CULL_END = 0.75;
const RESOLVE_START = 0.75;

/**
 * Where the three survivors should end up, in normalised canvas space. The
 * survivors are the picked dots nearest these anchors, so the final line is
 * always a legible left-to-right path rather than an accidental huddle.
 */
const SURVIVOR_ANCHORS: readonly (readonly [number, number])[] = [
  [0.16, 0.66],
  [0.47, 0.31],
  [0.82, 0.58],
];

type Dot = { x: number; y: number };

type Field = {
  /** Eliminated dots first, in kill order; the 3 survivors last. */
  order: Dot[];
  cols: number;
  rows: number;
  originX: number;
  originY: number;
  step: number;
};

/** mulberry32 — 32-bit, seeded, ~2^32 period. Small enough to read. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Lay out the grid and pick the pathway dots. Re-seeded from the same SEED on
 * every resize, so a given viewport always produces the same field.
 */
function buildField(width: number, height: number): Field {
  const step = CELL;
  const cols = Math.max(2, Math.floor(width / step));
  const rows = Math.max(2, Math.floor(height / step));
  const originX = (width - (cols - 1) * step) / 2;
  const originY = (height - (rows - 1) * step) / 2;

  const total = cols * rows;
  const count = Math.min(PATHWAY_COUNT, total);

  // Partial Fisher-Yates: draws `count` distinct intersections without ever
  // rejecting a duplicate, so the count is exact.
  const pool = new Int32Array(total);
  for (let i = 0; i < total; i += 1) pool[i] = i;

  const random = mulberry32(SEED);
  const picked: Dot[] = [];
  for (let i = 0; i < count; i += 1) {
    const j = i + Math.floor(random() * (total - i));
    const swap = pool[i];
    pool[i] = pool[j];
    pool[j] = swap;

    const cell = pool[i];
    const col = cell % cols;
    const row = (cell - col) / cols;
    picked.push({ x: originX + col * step, y: originY + row * step });
  }

  // Survivors: nearest picked dot to each anchor, left to right.
  const survivorIndices: number[] = [];
  for (const [ax, ay] of SURVIVOR_ANCHORS) {
    if (survivorIndices.length >= picked.length) break;
    const targetX = ax * width;
    const targetY = ay * height;
    let best = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < picked.length; i += 1) {
      if (survivorIndices.includes(i)) continue;
      const dx = picked[i].x - targetX;
      const dy = picked[i].y - targetY;
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    if (best >= 0) survivorIndices.push(best);
  }

  const doomed = picked.filter((_, i) => !survivorIndices.includes(i));
  const survivors = survivorIndices.map((i) => picked[i]);

  return { order: [...doomed, ...survivors], cols, rows, originX, originY, step };
}

/**
 * How many pathway dots are lit at progress p. Ceil, not round: the count
 * steps down by whole dots, which is what makes the cull read as switching
 * rather than dissolving.
 */
function litCount(p: number, total: number): number {
  const floorCount = Math.min(SURVIVOR_COUNT, total);
  if (p <= CULL_START) return total;
  if (p >= CULL_END) return floorCount;
  const t = (p - CULL_START) / (CULL_END - CULL_START);
  return Math.max(floorCount, Math.ceil(total - t * (total - floorCount)));
}

type HalftoneFieldProps = {
  /** Overlay content, absolutely positioned over the sticky canvas. */
  children?: ReactNode;
};

/** Fallback so the overlays are not visible before the canvas mounts. */
const FIELD_STYLE = { "--p": "0" } as CSSProperties;

export function HalftoneField({ children }: HalftoneFieldProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let field: Field | null = null;
    /** Pre-rendered halftone layer. Thousands of arcs, drawn once per resize. */
    let halftone: HTMLCanvasElement | null = null;
    let width = 0;
    let height = 0;
    let ink = "";
    let accent = "";
    let lastP = 0;

    const readTokens = () => {
      const styles = getComputedStyle(canvas);
      const inkToken = styles.getPropertyValue("--pw-ink").trim();
      const accentToken = styles.getPropertyValue("--pw-accent").trim();
      // Fall back to inherited colour, never to a literal.
      ink = inkToken || styles.color;
      accent = accentToken || ink;
    };

    const measure = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (nextWidth <= 0 || nextHeight <= 0) return false;

      width = nextWidth;
      height = nextHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      readTokens();
      field = buildField(width, height);

      const layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;
      const layerCtx = layer.getContext("2d");
      if (!layerCtx) {
        halftone = null;
        return true;
      }
      layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layerCtx.fillStyle = ink;
      layerCtx.globalAlpha = BASE_ALPHA;
      for (let row = 0; row < field.rows; row += 1) {
        const y = field.originY + row * field.step;
        for (let col = 0; col < field.cols; col += 1) {
          const x = field.originX + col * field.step;
          layerCtx.beginPath();
          layerCtx.arc(x, y, BASE_DOT, 0, Math.PI * 2);
          layerCtx.fill();
        }
      }
      halftone = layer;
      return true;
    };

    const render = (p: number) => {
      if (!field || width <= 0 || height <= 0) return;

      ctx.clearRect(0, 0, width, height);
      if (halftone) ctx.drawImage(halftone, 0, 0, width, height);

      const { order } = field;
      const lit = litCount(p, order.length);
      const firstLit = order.length - lit;
      const survivorStart = Math.max(0, order.length - SURVIVOR_COUNT);
      const resolve = clamp01((p - RESOLVE_START) / (1 - RESOLVE_START));

      // The path is drawn under the dots so the dots read as the endpoints.
      if (resolve > 0) {
        const points = order.slice(survivorStart);
        if (points.length > 1) {
          const segments: number[] = [];
          let total = 0;
          for (let i = 1; i < points.length; i += 1) {
            const length = Math.hypot(
              points[i].x - points[i - 1].x,
              points[i].y - points[i - 1].y,
            );
            segments.push(length);
            total += length;
          }

          let remaining = total * resolve;
          ctx.strokeStyle = ink;
          ctx.lineWidth = LINE_WIDTH;
          ctx.lineCap = "butt";
          ctx.lineJoin = "miter";
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 0; i < segments.length && remaining > 0; i += 1) {
            const fraction = Math.min(1, remaining / segments[i]);
            const from = points[i];
            const to = points[i + 1];
            ctx.lineTo(
              from.x + (to.x - from.x) * fraction,
              from.y + (to.y - from.y) * fraction,
            );
            remaining -= segments[i];
          }
          ctx.stroke();
        }
      }

      for (let i = firstLit; i < order.length; i += 1) {
        const isSurvivor = i >= survivorStart;
        const radius = isSurvivor
          ? PATHWAY_DOT + (SURVIVOR_DOT - PATHWAY_DOT) * resolve
          : PATHWAY_DOT;
        ctx.fillStyle = isSurvivor && resolve > 0 ? accent : ink;
        ctx.beginPath();
        ctx.arc(order[i].x, order[i].y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let rafId = 0;
    let running = false;
    let visible = false;

    const frame = () => {
      // Measured against the sticky pane, not window.innerHeight: p then hits
      // exactly 1 at the moment the canvas unpins, including on a phone whose
      // toolbar makes innerHeight disagree with 100vh.
      const rect = wrapper.getBoundingClientRect();
      const pane = height > 0 ? height : window.innerHeight;
      const travel = rect.height - pane;
      const p = travel <= 0 ? 0 : clamp01(-rect.top / travel);
      wrapper.style.setProperty("--p", String(p));
      if (p !== lastP) {
        lastP = p;
        render(p);
      }
      rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion.matches) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
    };

    /** Reduced motion gets the finished image and no loop whatsoever. */
    const settle = () => {
      lastP = 1;
      wrapper.style.setProperty("--p", "1");
      render(1);
    };

    let measured = measure();
    if (measured) {
      if (reduceMotion.matches) settle();
      else render(lastP);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(wrapper);

    const resizeObserver = new ResizeObserver(() => {
      measured = measure();
      if (!measured) return;
      if (reduceMotion.matches) settle();
      else render(lastP);
    });
    resizeObserver.observe(canvas);

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        settle();
      } else {
        lastP = -1;
        if (visible) start();
      }
    };
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={FIELD_STYLE}
      className="relative h-[200vh] md:h-[300vh] motion-reduce:h-screen!"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
        {children}
      </div>
    </div>
  );
}
