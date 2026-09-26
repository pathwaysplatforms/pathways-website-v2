import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { FORM_TARGET } from "@/lib/sections";

/**
 * SKELETON — the timely one. Deliberately styled apart from its neighbours:
 * sunken surface, hairlines top and bottom, centered and narrow. It reads as
 * an interruption in the page's rhythm, which is the point.
 */
export function NewPathway() {
  return (
    <Section
      id="pathway"
      title="A new pathway just opened"
      className="border-y border-hairline bg-surface-sunken py-24"
    >
      <Container width="measure" className="text-center">
        <Reveal>
          <p className="t-label text-accent">Just opened</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="t-title mt-4 text-balance text-ink">
            {/* PLACEHOLDER — name the actual new pathway */}
            A new pathway just opened
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="t-lead mt-5 text-ink-muted">
            {/* PLACEHOLDER copy */}
            What changed, who it applies to, and why it matters right now.
            Two sentences, no more.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-9 flex justify-center">
            <Button href={`#${FORM_TARGET}`} size="lg">
              See if it applies to you
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
