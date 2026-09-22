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

/** Computed at module scope on the server — no hydration mismatch. */
const YEAR = new Date().getFullYear();

/** Pinned to UTC so the printed day cannot shift with the server's zone. */
const LAST_UPDATED = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(DRAW_SUMMARY_FALLBACK.lastUpdatedIso));

const LEGAL_LINKS: readonly { href: string; label: string }[] = [
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/privacy", label: "Privacy" },
];

/**
 * The colophon, set on slate. Text embosses out of the metal here — light
 * type with the shadow above it — because the light source has not moved
 * just because the material got darker.
 */
export function Footer() {
  return (
    <Section
      as="footer"
      bg="slate"
      pad="default"
      grid
      innerClassName="gap-y-10"
      aria-label="Site footer"
    >
      <div className="col-span-4 md:col-span-6">
        <span className="font-display text-[20px] font-semibold tracking-[-0.02em] text-white/90 [text-shadow:0_-1px_0_rgba(0,0,0,0.6)]">
          {SITE.name}
        </span>
        <p className="mt-4 max-w-[52ch] text-[13.5px] leading-relaxed text-white/55 [text-shadow:0_-1px_0_rgba(0,0,0,0.55)]">
          {DISCLAIMER}
        </p>
      </div>

      <div className="col-span-4 md:col-span-3">
        <MonoLabel tone="dark">Sources</MonoLabel>
        <p className="mt-3 text-[13.5px] leading-relaxed text-white/55 [text-shadow:0_-1px_0_rgba(0,0,0,0.55)]">
          {DATA_SOURCE_NOTE}
        </p>
        <p className="sk-readout mt-4 text-[12px] text-white/70">
          Draw data last updated {LAST_UPDATED}
        </p>
      </div>

      <div className="col-span-4 md:col-span-3">
        <MonoLabel tone="dark">Legal</MonoLabel>
        <nav aria-label="Legal" className="mt-3">
          <ul className="flex flex-col gap-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13.5px] text-white/70 transition-colors duration-150 hover:text-white [text-shadow:0_-1px_0_rgba(0,0,0,0.55)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-white/55 [text-shadow:0_-1px_0_rgba(0,0,0,0.55)]">
          {PRIVACY_POSTURE}
        </p>
        <p className="sk-readout mt-4 text-[12px] text-white/45">
          © {YEAR} {SITE.name}
        </p>
      </div>
    </Section>
  );
}
