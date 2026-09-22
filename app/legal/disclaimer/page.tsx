import type { Metadata } from "next";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { DATA_SOURCE_NOTE, DISCLAIMER, SITE } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "What Pathways is, what it is not, and where to turn for help with your own situation.",
};

const LAST_UPDATED = "20 September 2026";

/**
 * The text column runs 8 of the 12 columns and collapses to all 4 below
 * 768px. Structure between sections is the 2px ink rule; the only 1px
 * hairline on the page divides the document metadata from the title, which
 * is data about the document rather than structure around it.
 */
export default function DisclaimerPage() {
  return (
    <main>
      <Section grid aria-labelledby="disclaimer-title">
        <div className="col-span-4 md:col-span-8">
          <header className="flex flex-col gap-8">
            <h1 id="disclaimer-title" className="ed-display">
              Disclaimer
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-ed-rule pt-4">
              <MonoLabel tone="faint">Last updated</MonoLabel>
              <MonoLabel>{LAST_UPDATED}</MonoLabel>
            </div>
          </header>

          {/* PLACEHOLDER — legal review required */}
          <div className="mt-12 flex flex-col md:mt-16">
            <section className="flex flex-col gap-4 pb-10 md:pb-12">
              <h2 className="ed-heading">What {SITE.name} is</h2>
              <p className="ed-body">{DISCLAIMER}</p>
              <p className="ed-body">
                {SITE.name} is a set of tools for tracking published immigration
                rules and draw results, and for understanding how your own
                recorded details line up against them. Everything it shows you
                is information, presented with its source attached.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="ed-heading">What {SITE.name} is not</h2>
              <p className="ed-body">
                {SITE.name} does not assess your case, does not recommend a
                course of action, and does not stand in for a regulated
                professional. Using it does not create a solicitor-client or
                consultant-client relationship. Decisions about your immigration
                file remain yours, and you are responsible for verifying
                anything you rely on.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="ed-heading">Where the information comes from</h2>
              <p className="ed-body">{DATA_SOURCE_NOTE}</p>
              <p className="ed-body">
                Published rules change, sometimes without notice, and our
                reading of a source can lag behind the source itself. Where our
                data has not refreshed, we mark it as stale rather than
                presenting it as current. The original government publication
                always governs.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="ed-heading">
                Speaking to a regulated professional
              </h2>
              <p className="ed-body">
                Consult a lawyer or an RCIC regulated by the CICC. A regulated
                professional can review the particulars of your case in a way
                that a tool cannot, and is accountable to a regulator for doing
                so.
              </p>
            </section>

            <Rule />

            {/* PLACEHOLDER — legal review required */}
            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="ed-heading">Provisional terms</h2>
              <p className="ed-body">
                This page is provisional and has not yet been reviewed by
                counsel. The final version will set out the terms that govern
                use of {SITE.name}, including limitations of liability and the
                governing jurisdiction. Nothing on this page should be read as a
                binding commitment until that review is complete.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 pt-10 md:pt-12">
              <h2 className="ed-heading">Contact</h2>
              {/* PLACEHOLDER — legal review required */}
              <p className="ed-body">
                A contact route for questions about this page will be published
                here alongside the reviewed version.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}
