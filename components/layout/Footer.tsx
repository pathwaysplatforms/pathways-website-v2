import Link from "next/link";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import {
  DATA_SOURCE_NOTE,
  DISCLAIMER,
  DRAW_SUMMARY_FALLBACK,
  PRIVACY_POSTURE,
  SITE,
} from "@/lib/fixtures";

/**
 * Both computed once at module scope, on the server. Nothing here is derived
 * during render, so there is no clock to disagree about and no hydration
 * mismatch. The formatter is pinned to a locale and to UTC for the same
 * reason — the machine's timezone must not change the printed date.
 */
const YEAR = new Date().getFullYear();

const LAST_UPDATED = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
}).format(new Date(DRAW_SUMMARY_FALLBACK.lastUpdatedIso));

const LEGAL_LINKS: readonly { href: string; label: string }[] = [
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/privacy", label: "Privacy" },
];

/**
 * The colophon.
 *
 * White, one 2px ink rule along the top, and every word of it in JetBrains
 * Mono at 12px on the 12-column grid: the regulatory boundary on the left,
 * where the numbers come from in the middle, the legal routes on the right.
 *
 *   cols  1–6  DISCLAIMER, verbatim from lib/fixtures — never paraphrased
 *   cols  7–9  DATA_SOURCE_NOTE and the date of the last draw ingest
 *   cols 10–12 legal links, the privacy posture, copyright
 *
 * Below 768px the grid drops to 4 columns, every block spans all four, and
 * they stack in that same reading order.
 */
export function Footer() {
  return (
    <Section
      as="footer"
      topRule
      grid
      innerClassName="gap-y-12"
      aria-label="Site colophon"
    >
      {/* cols 1–6 — the regulatory boundary, word for word. */}
      <div className="col-span-4 md:col-span-6">
        <MonoLabel as="p" className="leading-relaxed">
          {DISCLAIMER}
        </MonoLabel>
      </div>

      {/* cols 7–9 — provenance. */}
      <div className="col-span-4 flex flex-col gap-4 md:col-span-3">
        <MonoLabel as="p" tone="dim" className="leading-relaxed">
          {DATA_SOURCE_NOTE}
        </MonoLabel>
        <MonoLabel as="p" className="leading-relaxed">
          Draw data last updated {LAST_UPDATED}
        </MonoLabel>
      </div>

      {/* cols 10–12 — routes out, then the small print. */}
      <div className="col-span-4 flex flex-col gap-4 md:col-span-3">
        <nav aria-label="Legal">
          <ul className="flex flex-col gap-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="pw-mono pw-mech text-pw-ink hover:text-pw-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MonoLabel as="p" tone="dim" className="leading-relaxed">
          {PRIVACY_POSTURE}
        </MonoLabel>
        <MonoLabel as="p" tone="dim">
          © {YEAR} {SITE.name}
        </MonoLabel>
      </div>
    </Section>
  );
}
