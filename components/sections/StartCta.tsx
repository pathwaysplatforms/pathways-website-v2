import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { FORM_TARGET } from "@/lib/sections";

/** SKELETON — the page's single loudest moment. One action, nothing else. */
export function StartCta() {
  return (
    <Section id="start" title="Start your application">
      <Container width="measure" className="text-center">
        <Reveal>
          <h2 className="t-title text-balance text-ink">
            Start your application
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="t-lead mt-5 text-ink-muted">
            {/* PLACEHOLDER copy */}
            One line on what happens next and how long it takes.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 flex justify-center">
            <Button
              href={`#${FORM_TARGET}`}
              size="lg"
              className="w-full sm:w-auto sm:px-16"
            >
              Start your application
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
