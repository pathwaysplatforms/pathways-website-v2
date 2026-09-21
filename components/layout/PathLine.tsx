"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Separator used to fold the `sections` prop into a primitive effect
 * dependency. A newline can never appear inside an HTML id that CSS or the
 * URL fragment can address, so the round-trip is lossless.
 */
const KEY_SEPARATOR = "\n";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Must stay identical to ACTIVE_BAND in components/tour/TourSection.tsx.
 * Both resolve "which section am I on" and they must never disagree: a lit
 * node beside the wrong frame is worse than no node at all.
 */
const ACTIVE_BAND = "-45% 0px -45% 0px";

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** The server cannot know the preference; assume motion, correct on hydration. */
function getReducedMotionOnServer(): boolean {
  return false;
}

type PathLineProps = {
  /** Element ids, in document order (top of page first). */
  sections: string[];
};

/**
 * The signature brand element: one fixed 1px rule in the left gutter, with a
 * 7px node per tour section. The node for the section currently in view turns
 * accent; every other node stays hairline.
 *
 * Mounted ONCE in app/layout.tsx. Pure decoration — aria-hidden, unfocusable,
 * pointer-events-none, and painted before page content so it always sits
 * behind it. Desktop only (hidden below 1024px).
 *
 * Active state is driven by a single IntersectionObserver. There are
 * deliberately no scroll listeners and no measurement loops.
 */
export function PathLine({ sections }: PathLineProps) {
  const sectionsKey = sections.join(KEY_SEPARATOR);

  const [activeId, setActiveId] = useState<string | null>(null);

  // No `window` access during render: useSyncExternalStore uses the server
  // snapshot for SSR and the first hydration pass.
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );

  // Resolve the ids and observe them. Re-runs whenever `sections` changes.
  useEffect(() => {
    const ids = sectionsKey.length > 0 ? sectionsKey.split(KEY_SEPARATOR) : [];

    const resolved: string[] = [];
    const elements: Element[] = [];

    for (const id of ids) {
      const element = document.getElementById(id);
      // Ids that do not resolve are skipped: the page may render a subset.
      if (element === null) continue;
      resolved.push(id);
      elements.push(element);
    }

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        // Tie-break rule for multiple simultaneously visible sections:
        // the TOPMOST one wins. `resolved` preserves the order of the
        // `sections` prop, which is document order, so the first resolved id
        // that is currently intersecting is the topmost visible section.
        // This is order-based rather than geometry-based on purpose: it needs
        // no rect reads and it cannot go stale between observer callbacks.
        // (A stale id from a previous `sections` value is harmless — it simply
        // matches no rendered node, and the new observer's first callback
        // recomputes the winner from an empty set.)
        const next = resolved.find((id) => visible.has(id));
        // Between two sections nothing is in the band. Hold the last node
        // rather than flickering every node back to hairline.
        if (next !== undefined) setActiveId(next);
      },
      { rootMargin: ACTIVE_BAND, threshold: 0 },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionsKey]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-5 z-0 hidden w-px bg-pw-hairline lg:block"
    >
      {sections.map((id, index) => (
        <span
          key={id}
          // Evenly distributed over the line's full vertical extent, with
          // symmetric breathing room at both ends: node i of n sits at
          // (i + 1) / (n + 1).
          style={{ top: `${((index + 1) / (sections.length + 1)) * 100}%` }}
          className={[
            "absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2",
            "rounded-full",
            id === activeId ? "bg-pw-accent" : "bg-pw-hairline",
            // Reduced motion renders static: line + nodes, no transition.
            reducedMotion
              ? ""
              : "transition-[background-color] duration-[400ms] ease-pw",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
