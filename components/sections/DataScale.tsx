import { DataTrack } from "@/components/sections/DataTrack";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * SKELETON — the scale of the data behind Pathways. The heading sits in the
 * page gutter; the track below it runs full-bleed so cards can continue past
 * the viewport edge, which is what makes it read as draggable.
 */
export function DataScale() {
  return (
    <Section id="data" title="The data behind it">
      <Container>
        <Reveal>
          <p className="t-label text-accent">The data</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="t-title mt-4 max-w-[20ch] text-balance text-ink">
            Built on more immigration data than anyone should read alone
          </h2>
        </Reveal>
      </Container>

      <Reveal delay={0.1} className="mt-12">
        <DataTrack />
      </Reveal>
    </Section>
  );
}
