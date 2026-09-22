import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SITE } from "@/lib/fixtures";

/**
 * A frosted glass rail that floats over the page stock. It is sticky, so the
 * blur has something to do: content passing underneath is what makes the
 * material read as glass rather than as a pale rectangle.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50">
      <div className="sk-glass relative">
        <div className="sk-shell flex h-[68px] items-center justify-between gap-4">
          <Link href="/" className="flex items-baseline gap-3">
            <span className="font-display text-[22px] font-semibold tracking-[-0.02em] text-pw-ink [text-shadow:0_1px_0_rgba(255,255,255,0.9)]">
              {SITE.name}
            </span>
            <span className="hidden sm:block">
              <MonoLabel tone="dim">For Canada</MonoLabel>
            </span>
          </Link>

          <Button
            href={SITE.appUrl}
            variant="primary"
            size="md"
            trailing={<ArrowRight size={15} strokeWidth={2.5} />}
          >
            Try it out
          </Button>
        </div>
        <div aria-hidden="true" className="sk-groove absolute inset-x-0 bottom-0" />
      </div>
    </header>
  );
}
