"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import WireframeDottedGlobe from "@/components/ui/wireframe-dotted-globe";
import { FORM_TARGET } from "@/lib/sections";

/**
 * The hero holds still while the next ~1.6 viewports of scroll pass — the
 * "scroll, scroll, scroll" dwell — then shrinks, fades and lifts out of the
 * frame as it releases, so Problem arrives already in motion underneath it
 * rather than just appearing (skill §4: exit along the entry path, driven
 * by the live scroll position rather than a fixed-duration timeline).
 */
export function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.75], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [1, 1, 0.88]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0, -56]);

  return (
    <Section id="hero" title="Pathways" className="relative h-[160vh]" bleed>
      <div ref={pinRef} className="absolute inset-0">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-[9rem] pb-section">
          <motion.div
            style={reduced ? undefined : { opacity, scale, y }}
            className="w-full"
          >
            <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              <div>
                <Reveal>
                  <p className="t-label text-accent">Immigration, made navigable</p>
                </Reveal>

                <Reveal delay={0.06}>
                  <h1 className="t-display mt-4 text-balance text-ink">
                    Harnessing the power of AI to guide you in your immigration
                    journey
                  </h1>
                </Reveal>

                <Reveal delay={0.12}>
                  <p className="t-lead mt-6 max-w-[44ch] text-ink-muted">
                    {/* PLACEHOLDER copy */}
                    One sentence on what Pathways actually does for you — replace
                    with real positioning copy.
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Button href={`#${FORM_TARGET}`} size="lg">
                      Check your eligibility
                    </Button>
                    <Button href="#features" size="lg" variant="secondary">
                      See how it works
                    </Button>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="flex justify-center lg:justify-end">
                <WireframeDottedGlobe />
              </Reveal>
            </Container>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
