import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/fixtures";

/**
 * The whole navigation: a wordmark, one mono qualifier, one button.
 *
 * There is no menu and no secondary link — the page is a single sequence, so
 * a nav that offers destinations would be lying about the structure. The bar
 * is not sticky; it is a masthead, and it scrolls away like one.
 *
 * The 2px ink bottom border is the first structural rule on the page. Padding
 * comes from Section (pad="flush" + a fixed bar height), never from here.
 */
export function Nav() {
  return (
    <Section
      as="header"
      pad="flush"
      className="border-b-2 border-pw-ink"
      aria-label="Masthead"
    >
      <div className="flex h-20 items-center justify-between gap-4">
        {/* Wraps instead of clipping on very narrow viewports: the qualifier
            drops under the wordmark rather than colliding with the button. */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            href="/"
            className="text-[20px] font-black uppercase tracking-[-0.02em] text-pw-ink md:text-[22px]"
          >
            {SITE.name}
          </Link>
          <MonoLabel tone="dim">For Canada</MonoLabel>
        </div>

        <Button href={SITE.appUrl} variant="primary" size="md">
          {SITE.ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
