import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SITE } from "@/lib/fixtures";

/**
 * A floating frosted bar rather than a full-width rail: it sits inside the
 * shell with the page visibly passing underneath it, which is the only thing
 * that makes a blur read as glass.
 *
 * This is the one backdrop-filter on the site. A page full of them stutters.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 pt-3 md:pt-4">
      <div className="nx-shell">
        <div className="nx-frost flex h-[62px] items-center justify-between gap-4 !rounded-full pr-2 pl-5 md:pl-6">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="text-[19px] font-semibold tracking-[-0.03em] text-nx-ink">
              {SITE.name}
            </span>
            <span className="hidden sm:block">
              <MonoLabel>For Canada</MonoLabel>
            </span>
          </Link>

          <Button
            href={SITE.appUrl}
            variant="primary"
            size="md"
            trailing={<ArrowRight size={15} strokeWidth={2.25} />}
          >
            Try it out
          </Button>
        </div>
      </div>
    </header>
  );
}
