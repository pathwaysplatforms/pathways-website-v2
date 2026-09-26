import { ChatGlimpse } from "@/components/ui/ChatGlimpse";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { StatCard } from "@/components/ui/StatCard";

/**
 * SKELETON — stats on why the process is broken today, then a first look at
 * the product. Copy and figures are all placeholders.
 */
export function Problem() {
  return (
    <Section id="problem" title="Why now">
      <Container>
        <Reveal>
          <p className="t-label text-accent">The problem</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="t-title mt-4 max-w-[20ch] text-balance text-ink">
            Applicants are guessing, and guessing is expensive
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="t-lead mt-5 max-w-measure text-ink-muted">
            {/* PLACEHOLDER copy */}
            Two or three sentences on where people get stuck today — wrong
            stream, missed deadline, outdated requirement, cost of bad advice.
          </p>
        </Reveal>

        {/* Stats row */}
        <ul className="mt-14 grid gap-4 sm:grid-cols-3">
          <StatCard
            index={0}
            countTo={6}
            suffix=" mo"
            label="Average Express Entry processing time"
            source={{ label: "IRCC via Moving2Canada ↗", href: "https://moving2canada.com/immigration/ircc-processing-times/" }}
          />
          <StatCard
            index={1}
            countTo={31.5}
            decimals={1}
            suffix="%"
            label="Express Entry–aligned applications refused, H1 2026"
            source={{ label: "IRCC data via Moving2Canada ↗", href: "https://moving2canada.com/?p=106686" }}
          />
          <StatCard
            index={2}
            staticValue="$1–5K+"
            label="Typical consultant fee, on top of filing fees"
            source={{ label: "CICTalks ↗", href: "https://cictalks.com/best-immigration-consultants-in-canada/" }}
          />
        </ul>

        {/* First look at the product */}
        <Reveal delay={0.12} className="mt-4">
          <ChatGlimpse />
        </Reveal>
      </Container>
    </Section>
  );
}
