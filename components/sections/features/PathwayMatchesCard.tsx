"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Scripted after pathways-final's ranked-matches view (PathwayRecommendations
 * → CardStack/PathwayCardContent, and the written MatchCard on /onboarding
 * /matches): country, program type, an AI match score with a bar, a tier
 * badge, and the top requirements — ordered most- to least-relevant.
 *
 * Unlike the real product's stack (tap to advance one card at a time), this
 * is a plain horizontally snap-scrolling row: on a landing page the honest
 * affordance is "you can scroll this," not a custom gesture to discover.
 */
type Tier = "excellent" | "good" | "possible";

const PATHWAYS: ReadonlyArray<{
  name: string;
  country: string;
  type: string;
  timeline: string;
  score: number;
  tier: Tier;
  requirements: string[];
}> = [
  {
    name: "Express Entry — Federal Skilled Worker",
    country: "Canada",
    type: "Permanent residency",
    timeline: "6–12 months",
    score: 92,
    tier: "excellent",
    requirements: ["3+ years skilled work experience", "CLB 9 English results", "ECA-verified degree"],
  },
  {
    name: "Ontario PNP — Human Capital Priorities",
    country: "Canada",
    type: "Permanent residency",
    timeline: "15–19 months",
    score: 78,
    tier: "good",
    requirements: ["Active Express Entry profile", "No job offer required", "Ontario NOC alignment"],
  },
  {
    name: "Post-Graduation Work Permit",
    country: "Canada",
    type: "Work permit",
    timeline: "80–180 days",
    score: 61,
    tier: "possible",
    requirements: ["8+ month program completed", "Valid study permit", "Continuous enrollment"],
  },
];

const TIER_LABEL: Record<Tier, string> = {
  excellent: "Excellent match",
  good: "Good match",
  possible: "Possible match",
};

const TIER_CLASS: Record<Tier, string> = {
  excellent: "bg-ink text-canvas",
  good: "border border-hairline text-ink",
  possible: "bg-surface-sunken text-ink-faint",
};

export function PathwayMatchesCard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
      setActive(Math.min(PATHWAYS.length - 1, Math.max(0, index)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="flex h-full min-h-[9rem] flex-col">
      <div
        ref={scrollRef}
        className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PATHWAYS.map((p, i) => (
          <article
            key={p.name}
            className="flex w-full shrink-0 snap-center flex-col gap-2.5 rounded-lg border border-hairline bg-canvas p-4"
          >
            <p className="t-label text-ink-faint">
              {String(i + 1).padStart(2, "0")} / {String(PATHWAYS.length).padStart(2, "0")} · {p.country}
            </p>
            <h4 className="t-small font-semibold leading-snug text-ink">{p.name}</h4>
            <p className="t-label text-ink-faint">
              {p.type} · {p.timeline}
            </p>

            <div className="flex items-center gap-3">
              <span className="text-[1.125rem] leading-none font-semibold tracking-tight text-ink">
                {p.score}%
              </span>
              <div className="h-[3px] flex-1 rounded-pill bg-accent-tint">
                <div className="h-full rounded-pill bg-accent" style={{ width: `${p.score}%` }} />
              </div>
            </div>

            <span className={`t-label w-fit rounded-pill px-2.5 py-1 ${TIER_CLASS[p.tier]}`}>
              {TIER_LABEL[p.tier]}
            </span>

            <ul className="flex flex-col gap-1 border-t border-hairline pt-2.5">
              {p.requirements.map((r) => (
                <li key={r} className="flex items-start gap-1.5">
                  <Check size={12} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span className="t-small text-ink-muted">{r}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Scroll position — dots, not arrows, so the affordance stays "drag
          this," matching the badge above rather than adding a click target. */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {PATHWAYS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to pathway ${i + 1}`}
            className={`h-1.5 rounded-pill transition-all ${
              i === active ? "w-4 bg-accent" : "w-1.5 bg-hairline"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
