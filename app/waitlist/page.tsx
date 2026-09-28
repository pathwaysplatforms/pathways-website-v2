import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WaitlistForm } from "@/components/sections/waitlist/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the beta — Pathways",
  description:
    "Pathways is in beta with a small group of test users. Leave your email to join.",
};

/**
 * A dedicated destination, not a section of the homepage — "Try it now" is a
 * commitment (skill §16, purpose) that deserves its own screen instead of
 * competing with everything else on the page. Nav and Footer still wrap it
 * (from the root layout), so wayfinding back out is never lost (§16).
 */
export default function WaitlistPage() {
  return (
    <main id="main">
      <section
        aria-label="Join the waitlist"
        className="flex min-h-[calc(100vh-4.25rem)] items-center py-section"
      >
        <Container width="measure">
          <Reveal>
            <Link
              href="/"
              className="t-small inline-flex items-center gap-1.5 text-ink-muted no-underline hover:text-ink"
            >
              <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
              Back to Pathways
            </Link>
          </Reveal>

          <Reveal delay={0.06} className="mt-6 text-center">
            <p className="t-label text-accent">Beta</p>
            <h1 className="t-title mt-4 text-balance text-ink">
              Pathways is currently in beta
            </h1>
            <p className="t-lead mt-5 text-ink-muted">
              We&apos;re testing with a small group of users before opening
              up. Leave your email and we&apos;ll reach out as soon as
              there&apos;s a spot for you.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-10">
            <WaitlistForm />
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-6 text-center text-ink-faint">
              We&apos;ll only email you about Pathways. No spam, unsubscribe
              anytime.
            </p>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
