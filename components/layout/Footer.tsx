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
 * The colophon. Deliberately on paper, not ink: the closing block above it is
 * the only dark band on the site, and a dark footer directly beneath it would
 * merge the two into one slab and cost the closing its weight.
 */
export function Footer() {
  return (
    <Section
      as="footer"
      pad="default"
      grid
      innerClassName="gap-y-10"
      aria-label="Site footer"
    >
      <div className="col-span-4 md:col-span-5">
        <span className="font-display text-[23px] leading-none tracking-[-0.01em] text-ed-ink">
          {SITE.name}
        </span>
        <p className="mt-5 max-w-[46ch] text-[13.5px] leading-relaxed text-ed-muted">
          {DISCLAIMER}
        </p>
      </div>

      <div className="col-span-4 md:col-span-3 md:col-start-7">
        <MonoLabel className="block border-t border-ed-ink pt-3">
          Sources
        </MonoLabel>
        <p className="mt-4 text-[13.5px] leading-relaxed text-ed-muted">
          {DATA_SOURCE_NOTE}
        </p>
        <p className="ed-num mt-4 text-[12px] text-ed-ink">
          Updated {LAST_UPDATED}
        </p>
      </div>

      <div className="col-span-4 md:col-span-3 md:col-start-10">
        <MonoLabel className="block border-t border-ed-ink pt-3">
          Legal
        </MonoLabel>
        <nav aria-label="Legal" className="mt-4">
          <ul className="flex flex-col gap-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13.5px] text-ed-ink transition-colors duration-150 hover:text-ed-signal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 max-w-[32ch] text-[13.5px] leading-relaxed text-ed-muted">
          {PRIVACY_POSTURE}
        </p>
        <p className="ed-num mt-5 text-[12px] text-ed-faint">
          © {YEAR} {SITE.name}
        </p>
      </div>
    </Section>
  );
}
