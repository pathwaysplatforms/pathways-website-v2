"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ArrowLeftRight, Captions, LayoutDashboard, Sparkles, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { VoiceOnboardingCard } from "@/components/sections/features/VoiceOnboardingCard";
import { PathwayMatchesCard } from "@/components/sections/features/PathwayMatchesCard";
import { DocumentDraftCard } from "@/components/sections/features/DocumentDraftCard";
import { DashboardOverviewCard } from "@/components/sections/features/DashboardOverviewCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Features in the order a user actually meets them, so the section doubles
 * as a walkthrough of the product (skill §16, mapping). Only the headline
 * features belong here; everything else stays one level deeper.
 *
 * All four are built: pathways-final's voice onboarding (VoiceTab.tsx), its
 * ranked pathway matches (PathwayRecommendations.tsx), its AI document
 * drafting (AiGenerateModal.tsx / StepDetailDrawer's CoverLetterSection) and
 * its dashboard "mission control" (DashboardMissionControl.tsx's executing
 * state + ActivePathwayTracker's checklist) are the user's actual four
 * steps, so those cards carry recreations of those screens instead of
 * scaffolding. `badge` names the interaction each demo needs explained
 * (there's no audio; the list scrolls; the draft is one click away) the
 * same way a real screen would with a status pill — 04 has nothing to
 * explain, since it's a snapshot rather than something to do.
 */
const STEPS: ReadonlyArray<{
  step: string;
  title: string;
  note: string;
  badge?: { icon: LucideIcon; label: string };
  content?: ReactNode;
}> = [
  {
    step: "01",
    title: "Tell us, out loud",
    note: "A short voice conversation replaces the intake form.",
    badge: { icon: Captions, label: "Sound off" },
    content: <VoiceOnboardingCard />,
  },
  {
    step: "02",
    title: "Ranked for you",
    note: "Three pathways, ordered by match strength.",
    badge: { icon: ArrowLeftRight, label: "Scroll to compare" },
    content: <PathwayMatchesCard />,
  },
  {
    step: "03",
    title: "Drafted for you",
    note: "AI drafts the documents each pathway asks for, ready to download.",
    badge: { icon: Sparkles, label: "AI drafted" },
    content: <DocumentDraftCard />,
  },
  {
    step: "04",
    title: "Everything, tracked",
    note: "One dashboard for your CRS score, documents, and what's left.",
    badge: { icon: LayoutDashboard, label: "Live overview" },
    content: <DashboardOverviewCard />,
  },
];

// ============================================================
// Tunables — everything the scroll choreography depends on.
// ============================================================
const CARD_COUNT = STEPS.length;

/** Every card's height cap, in rem — the "slight size issue" was each card
 *  sizing to its own content (a short placeholder next to a demo with a
 *  scrolling list next to one with a generate button that changes its own
 *  height), so the grid's row heights drifted by a few px card to card.
 *  One shared height, applied here and nowhere else, makes that impossible
 *  by construction — cards fill it and scroll internally (each demo
 *  already manages its own overflow) rather than resize it, including
 *  across DocumentDraftCard's idle → generating → ready states. It's a cap
 *  rather than a flat value because it also has to fit two rows inside the
 *  pinned h-screen viewport — see the `min()` where it's applied below. */
const CARD_HEIGHT_REM = 32;

/** Scroll distance dedicated to each card's turn in focus, in vh. */
const SEGMENT_VH = 100;

/** wrapperRef's own reserved height, in vh: CARD_COUNT segments of pin
 *  duration, PLUS one more for the pinned box's own natural resting
 *  height (SEGMENT_VH, since it's exactly one h-screen). GSAP's pin
 *  spacer is sized to (that resting height + the pin duration) — under-
 *  reserving it here made the spacer overflow wrapperRef's own box by
 *  that resting height, which the next section (New pathway) would
 *  then render underneath during the overlap. */
const WRAPPER_VH = (CARD_COUNT + 1) * SEGMENT_VH;

/** How large the focused card grows (~25% beyond the previous 1.22). This is
 *  the ceiling: build() clamps it per card so the scaled card never exceeds
 *  the pinned viewport (single-column mobile, short screens). */
const PEAK_SCALE = 1.52;

/** Breathing room kept between a fully-grown card and the viewport edge. */
const PEAK_VIEWPORT_MARGIN_PX = 24;

/** Fraction of a card's segment spent easing in/out of focus (vs. holding). */
const RAMP_FRACTION = 0.28;

/** How much a card's ramp bleeds into its neighbor's segment, so the
 *  handoff crossfades instead of snapping at the boundary. */
const OVERLAP_FRACTION = 0.05;

const RECEDE_OPACITY = 0.45;
const RECEDE_BLUR_PX = 2;
const REST_SHADOW = "0 1px 4px rgba(20, 22, 40, 0.06)";
const FOCUS_SHADOW = "0 34px 74px rgba(20, 22, 40, 0.22)";
const EASE_IN = "power2.out";
const EASE_OUT = "power2.in";

/** The exact px translation that puts `card`'s center on `container`'s
 *  center — grid-position-agnostic, so it's correct at any breakpoint
 *  (single column on mobile, 2 columns on desktop, etc.) rather than a
 *  fixed nudge that only happened to look centered at one width. */
function centerOffset(card: HTMLElement, container: HTMLElement) {
  const cardRect = card.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    dx: containerRect.left + containerRect.width / 2 - (cardRect.left + cardRect.width / 2),
    dy: containerRect.top + containerRect.height / 2 - (cardRect.top + cardRect.height / 2),
  };
}

export function Features() {
  const reduced = useReducedMotion();
  // wrapperRef: plain (never pinned) trigger, sized to CARD_COUNT segments —
  // reserves the scroll distance in normal document flow.
  // pinTargetRef: the actual h-screen content, pinned in place while the
  // wrapper scrolls past underneath it. Two elements, not one, so the
  // pinned element's own layout height stays 100vh — pinning the same
  // element that carries the 400vh scroll-distance height would double
  // that height into the page (reserved once by GSAP's pin-spacer, again
  // by the element's own inline style) once it unpins.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  useLayoutEffect(() => {
    if (reduced) return; // static grid, no scroll-jacking (skill §14)
    if (!wrapperRef.current || !pinTargetRef.current) return;

    const cards = cardRefs.current.filter((el): el is HTMLLIElement => !!el);
    if (cards.length !== CARD_COUNT) return;

    let ctx: gsap.Context | undefined;

    // (Re)builds the whole timeline. Each card's center-offset is measured
    // fresh via getBoundingClientRect, so a rebuild — on mount, and on
    // resize since the grid reflows across breakpoints — always targets
    // the screen's actual center rather than a value baked in at one width.
    function build() {
      const container = pinTargetRef.current;
      if (!container) return;

      ctx = gsap.context(() => {
        gsap.set(cards, {
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          boxShadow: REST_SHADOW,
          zIndex: 1,
        });
        gsap.set(container, { zIndex: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            // A relative pixel offset, not "bottom top": wrapperRef's own
            // height is WRAPPER_VH (one segment taller than the pin
            // duration, see its style below), so anchoring "end" to its
            // bottom would make the pin last a segment longer than every
            // card-focus time below assumes. This keeps the pin duration
            // at exactly CARD_COUNT segments regardless of that padding.
            end: () => `+=${(CARD_COUNT * SEGMENT_VH * window.innerHeight) / 100}`,
            scrub: true,
            pin: pinTargetRef.current,
            anticipatePin: 1,
            // Still scoped to "actually pinned" (not a permanent class):
            // harmless while pinned, but a fixed element with z-index:auto
            // doesn't paint above later DOM siblings, so this is what makes
            // the grid opaque-on-top of whatever's mid-transition beneath
            // it while pinned, without staying elevated once it releases.
            onToggle: (self) => {
              if (container) container.style.zIndex = self.isActive ? "10" : "0";
            },
          },
        });

        // One "timeline second" per card — an arbitrary unit, not real time
        // (scrub maps it onto the pinned scroll range), but it's what makes
        // "segment i starts at time i" a clean 1:1 split.
        cards.forEach((card, i) => {
          const { dx, dy } = centerOffset(card, container);
          // Layout size (offsetWidth/Height ignore transforms), so this is
          // the card's true rest size even if a rebuild lands mid-scroll.
          const peak = Math.max(
            1,
            Math.min(
              PEAK_SCALE,
              (container.clientWidth - PEAK_VIEWPORT_MARGIN_PX * 2) / card.offsetWidth,
              (container.clientHeight - PEAK_VIEWPORT_MARGIN_PX * 2) / card.offsetHeight,
            ),
          );
          const others = cards.filter((_, j) => j !== i);

          const segmentStart = i;
          const segmentEnd = i + 1;
          const upStart = Math.max(0, segmentStart - OVERLAP_FRACTION);
          const downEnd = Math.min(CARD_COUNT, segmentEnd + OVERLAP_FRACTION);
          const downStart = downEnd - RAMP_FRACTION;

          tl.to(
            card,
            { scale: peak, x: dx, y: dy, boxShadow: FOCUS_SHADOW, ease: EASE_IN, duration: RAMP_FRACTION },
            upStart,
          )
            .set(card, { zIndex: 20 }, upStart)
            .to(
              others,
              { opacity: RECEDE_OPACITY, filter: `blur(${RECEDE_BLUR_PX}px)`, ease: EASE_IN, duration: RAMP_FRACTION },
              upStart,
            )
            .to(
              card,
              { scale: 1, x: 0, y: 0, boxShadow: REST_SHADOW, ease: EASE_OUT, duration: RAMP_FRACTION },
              downStart,
            )
            .to(
              others,
              { opacity: 1, filter: "blur(0px)", ease: EASE_OUT, duration: RAMP_FRACTION },
              downStart,
            )
            .set(card, { zIndex: 1 }, downStart + RAMP_FRACTION);
        });
      }, wrapperRef);
    }

    build();

    // The grid reflows at breakpoints (single column → 2 columns), which
    // moves every card's center — rebuild so dx/dy stay correct.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ctx?.revert();
        build();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    // Reverting the context kills the timeline and its ScrollTrigger, and
    // restores every inline style gsap.set/to touched — the cleanup this
    // effect owes on unmount (and on every reduced-motion toggle).
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <Section id="features" title="How it works">
      <Container>
        <Reveal>
          <p className="t-label text-accent">How it works</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="t-title mt-4 max-w-[22ch] text-balance text-ink">
            Every step of your application, in the order you meet it
          </h2>
        </Reveal>
      </Container>

      <div
        ref={wrapperRef}
        className="relative mt-14"
        style={reduced ? undefined : { height: `${WRAPPER_VH}vh` }}
      >
        {/* z-index is set imperatively (onToggle, above) rather than as a
            permanent class: a fixed element with z-index:auto doesn't
            paint above later DOM siblings, so it's load-bearing while
            actually pinned — but left on permanently, it also elevates
            this box's own (harmless, expected-to-be-covered) overflow
            above New pathway/Our data once unpinned. bg-canvas stays
            permanent — the grid's own gaps need to be opaque whenever
            this is pinned, no reason to ever turn that off. */}
        <div
          ref={pinTargetRef}
          className="relative flex h-screen items-center overflow-hidden bg-canvas"
        >
          <Container>
            <ol className="grid gap-6 md:grid-cols-2">
              {STEPS.map((f, i) => (
                <li
                  key={f.step}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="feature-card overflow-hidden rounded-card"
                  style={{
                    // Capped at CARD_HEIGHT_REM, but shrinks to fit two rows
                    // within the pinned h-screen viewport on shorter
                    // screens — otherwise a 2-row grid taller than the
                    // viewport gets centered by the pin wrapper and clipped
                    // top and bottom (rows overflowing equally on each
                    // side). Each card's own overflow-y-auto (below) is
                    // the fallback if that shrink ever gets tight.
                    height: `min(${CARD_HEIGHT_REM}rem, calc((100vh - 3.5rem) / 2))`,
                    ...(reduced ? undefined : { transformOrigin: "center", willChange: "transform" }),
                  }}
                >
                  {f.content ? (
                    // One unified card — kicker/badge row, heading, a
                    // divider, then the live demo — rather than a text
                    // block floating above a separately-boxed mockup, so
                    // it reads as symmetric with the plain single-box
                    // placeholders it sits beside in the grid.
                    <div className="flex h-full flex-col gap-4 rounded-card border border-hairline bg-surface p-6 shadow-raised">
                      <div className="flex items-start justify-between gap-3">
                        <p className="t-label text-accent">{f.step}</p>
                        {f.badge && (
                          <span className="flex items-center gap-1 text-ink-faint">
                            <f.badge.icon size={14} aria-hidden />
                            <span className="t-label">{f.badge.label}</span>
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="t-heading text-ink">{f.title}</h3>
                        <p className="t-small mt-1 max-w-[34ch] text-ink-muted">{f.note}</p>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto border-t border-hairline pt-4">
                        {f.content}
                      </div>
                    </div>
                  ) : (
                    <Placeholder
                      label={`${f.step} · ${f.title}`}
                      note={f.note}
                      className="h-full"
                    />
                  )}
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </div>
    </Section>
  );
}
