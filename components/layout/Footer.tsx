import Link from "next/link";

import { Section } from "@/components/ui/Section";
import {
  DATA_SOURCE_NOTE,
  DISCLAIMER,
  PRIVACY_POSTURE,
  SITE,
} from "@/lib/fixtures";

/** Computed once at module scope on the server — no hydration mismatch. */
const YEAR = new Date().getFullYear();

const LEGAL_LINKS: readonly { href: string; label: string }[] = [
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/privacy", label: "Privacy" },
];

/**
 * Regulatory boundary, in writing. The disclaimer wording is exact and
 * comes from lib/fixtures — do not paraphrase it here.
 */
export function Footer() {
  return (
    <Section
      as="footer"
      pad="default"
      topRule
      className=""
      aria-label="Site footer"
    >
      <div className="flex flex-col gap-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <p className="pw-body pw-measure">{DISCLAIMER}</p>
          <div className="flex flex-col gap-4">
            <p className="pw-body">{DATA_SOURCE_NOTE}</p>
            <p className="pw-body">{PRIVACY_POSTURE}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="pw-body text-[15px]">
            © {YEAR} {SITE.name}
          </p>
          <nav aria-label="Legal">
            <ul className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="pw-body text-[15px] transition-colors duration-200 ease-pw hover:text-pw-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </Section>
  );
}
