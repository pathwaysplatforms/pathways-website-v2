import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * SKELETON — features in the order a user actually meets them, so the section
 * doubles as a walkthrough of the product (skill §16, mapping). Only the
 * headline features belong here; everything else stays one level deeper.
 */
const STEPS = [
  { step: "01", title: "Feature one", note: "First thing a user does." },
  { step: "02", title: "Feature two", note: "What follows from it." },
  { step: "03", title: "Feature three", note: "The impressive one." },
  { step: "04", title: "Feature four", note: "Where they end up." },
];

export function Features() {
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

        <ol className="mt-14 grid gap-4 md:grid-cols-2">
          {STEPS.map((f, i) => (
            <Reveal as="li" key={f.step} delay={0.05 * i}>
              <Placeholder
                label={`${f.step} · ${f.title}`}
                note={f.note}
                minHeight="15rem"
              />
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
