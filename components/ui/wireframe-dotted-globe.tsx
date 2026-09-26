"use client";

import { geoBounds, geoGraticule, geoOrthographic, geoPath, timer } from "d3";
import type { GeoPermissibleObjects } from "d3";
import { useEffect, useRef, useState } from "react";

const LAND_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json";

type LandFeature = {
  properties?: { featurecla?: string };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

type LandCollection = { features: LandFeature[] };

type Dot = { lng: number; lat: number; driftX: number; driftY: number };

function pointInRing(point: [number, number], ring: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInFeature(point: [number, number], feature: LandFeature): boolean {
  const { geometry } = feature;

  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates as number[][][];
    if (!pointInRing(point, rings[0])) return false;
    for (let i = 1; i < rings.length; i++) {
      if (pointInRing(point, rings[i])) return false;
    }
    return true;
  }

  const polygons = geometry.coordinates as number[][][][];
  for (const polygon of polygons) {
    if (!pointInRing(point, polygon[0])) continue;
    let inHole = false;
    for (let i = 1; i < polygon.length; i++) {
      if (pointInRing(point, polygon[i])) {
        inHole = true;
        break;
      }
    }
    if (!inHole) return true;
  }
  return false;
}

/** Deterministic pseudo-random in [0, 1), seeded from a dot's own coordinates so its drift never changes between renders. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function dotsForFeature(feature: LandFeature, spacing: number): Dot[] {
  const dots: Dot[] = [];
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(
    feature as unknown as GeoPermissibleObjects,
  );
  const step = spacing * 0.08;

  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      if (pointInFeature([lng, lat], feature)) {
        const angle = seededRandom(lng * 91.7 + lat * 13.3) * Math.PI * 2;
        const spread = 0.5 + seededRandom(lat * 57.1 + lng * 3.7) * 0.9;
        dots.push({
          lng,
          lat,
          driftX: Math.cos(angle) * spread,
          // Biased downward so the globe dissolves toward the section below it.
          driftY: Math.abs(Math.sin(angle)) * spread + 0.7,
        });
      }
    }
  }
  return dots;
}

/** Resolves a design token to the color string canvas needs (var() isn't valid in a 2D context fillStyle). */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Same as `token`, but mixed toward white by `percent` — lightens a token without a new CSS variable. */
function lightenedToken(name: string, percent: number): string {
  const probe = document.createElement("div");
  probe.style.color = `color-mix(in oklab, var(${name}), white ${percent}%)`;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

interface WireframeDottedGlobeProps {
  className?: string;
}

/**
 * Hero visual. A dotted wireframe globe, direct-manipulation drag-to-rotate
 * (feedback continuous through the gesture, skill §1) and idle auto-spin.
 * Auto-spin — the one motion nobody triggered — stops under
 * prefers-reduced-motion; drag stays available either way (§14).
 *
 * Scrolling the globe past the top of the viewport scrubs a dissolve: the
 * dots drift apart and fade, tracking scroll position 1:1 rather than
 * playing on a timer, so it reverses cleanly if the user scrolls back up.
 */
export default function WireframeDottedGlobe({ className = "" }: WireframeDottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !wrapper || !context) return;

    let destroyed = false;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const size = wrapper.getBoundingClientRect().width;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    context.scale(dpr, dpr);

    const radius = size / 2.2;
    const projection = geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .clipAngle(90);
    const path = geoPath(projection, context);

    const colorEdge = token("--color-hairline");
    const colorGraticule = token("--color-hairline");
    const colorDot = lightenedToken("--color-ink-muted", 10);

    let landFeatures: LandCollection | null = null;
    let allDots: Dot[] = [];
    const rotation: [number, number] = [0, 0];
    let scrollProgress = 0;
    const maxDrift = size * 0.6;

    const render = () => {
      context.clearRect(0, 0, size, size);
      const scaleFactor = projection.scale() / radius;
      const dissolve = reducedMotionQuery.matches ? 0 : scrollProgress;
      const shapeAlpha = 1 - scrollProgress;

      if (shapeAlpha > 0) {
        context.beginPath();
        context.arc(size / 2, size / 2, projection.scale(), 0, 2 * Math.PI);
        context.strokeStyle = colorEdge;
        context.lineWidth = 1.25 * scaleFactor;
        context.globalAlpha = 0.5 * shapeAlpha;
        context.stroke();
        context.globalAlpha = 1;
      }

      if (!landFeatures) return;

      if (shapeAlpha > 0) {
        const graticule = geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = colorGraticule;
        context.lineWidth = 1 * scaleFactor;
        context.globalAlpha = 0.35 * shapeAlpha;
        context.stroke();
        context.globalAlpha = 1;
      }

      if (shapeAlpha <= 0) return;

      context.fillStyle = colorDot;
      context.globalAlpha = shapeAlpha;
      for (const dot of allDots) {
        const projected = projection([dot.lng, dot.lat]);
        if (!projected) continue;
        const x = projected[0] + dot.driftX * maxDrift * dissolve;
        const y = projected[1] + dot.driftY * maxDrift * dissolve;
        if (x < -20 || x > size + 20 || y < -20 || y > size + 20) continue;
        context.beginPath();
        context.arc(x, y, 1.3 * scaleFactor, 0, 2 * Math.PI);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    let autoRotate = !reducedMotionQuery.matches;
    const rotationSpeed = 0.35;
    const rotationTimer = timer(() => {
      if (!autoRotate) return;
      rotation[0] += rotationSpeed;
      projection.rotate(rotation);
      render();
    });

    const handleReducedMotionChange = () => {
      autoRotate = !reducedMotionQuery.matches;
    };
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(LAND_URL);
        if (!response.ok) throw new Error("Failed to load land data");
        const data = (await response.json()) as LandCollection;
        if (destroyed) return;

        landFeatures = data;
        allDots = data.features.flatMap((feature) => dotsForFeature(feature, 16));

        setIsLoading(false);
        render();
      } catch {
        if (!destroyed) {
          setError("Failed to load globe data");
          setIsLoading(false);
        }
      }
    };
    loadWorldData();

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startRotation: [number, number] = [0, 0];

    const handlePointerDown = (event: PointerEvent) => {
      autoRotate = false;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startRotation = [...rotation];
      canvas.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const sensitivity = 0.4;
      rotation[0] = startRotation[0] + (event.clientX - startX) * sensitivity;
      rotation[1] = Math.max(
        -90,
        Math.min(90, startRotation[1] - (event.clientY - startY) * sensitivity),
      );
      projection.rotate(rotation);
      render();
    };

    const endDrag = () => {
      dragging = false;
      autoRotate = !reducedMotionQuery.matches;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    // Scrubs the dissolve 1:1 with scroll position: 0 while the globe is
    // still fully below the viewport top, 1 once it has scrolled fully
    // past it. requestAnimationFrame-throttled since scroll fires rapidly.
    let scrollQueued = false;
    const updateScrollProgress = () => {
      scrollQueued = false;
      const rect = wrapper.getBoundingClientRect();
      const next = Math.max(0, Math.min(1, -rect.top / rect.height));
      if (next !== scrollProgress) {
        scrollProgress = next;
        render();
      }
    };
    const handleScroll = () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(updateScrollProgress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollProgress();

    render();

    return () => {
      destroyed = true;
      rotationTimer.stop();
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (error) {
    return (
      <div
        ref={wrapperRef}
        className={`placeholder aspect-square w-full max-w-[30rem] rounded-full ${className}`}
      >
        <span className="t-label">{error}</span>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative aspect-square w-full max-w-[30rem] ${className}`}>
      <canvas
        ref={canvasRef}
        className="touch-none rounded-full"
        aria-label="Rotating globe. Drag to rotate."
        role="img"
      />
      {isLoading ? (
        <div className="absolute inset-0 grid place-items-center rounded-full">
          <span className="t-label text-ink-faint">Loading globe…</span>
        </div>
      ) : null}
    </div>
  );
}
