import type { Metadata } from "next";

import { MonoLabel } from "@/components/ui/MonoLabel";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { DISCLAIMER, PRIVACY_POSTURE, SITE } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Pathways stores, how documents are handled, and how to have them deleted.",
};

const LAST_UPDATED = "20 September 2026";

/**
 * Same shape as the disclaimer: an 8-column text measure, 2px ink rules
 * between sections, and a single 1px hairline holding the document metadata.
 */
export default function PrivacyPage() {
  return (
    <main>
      <Section grid aria-labelledby="privacy-title">
        <div className="col-span-4 md:col-span-8">
          <header className="flex flex-col gap-8">
            <h1 id="privacy-title" className="nx-display">
              Privacy
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-[rgba(18,26,56,0.1)] pt-4">
              <MonoLabel tone="dim">Last updated</MonoLabel>
              <MonoLabel>{LAST_UPDATED}</MonoLabel>
            </div>
          </header>

          {/* PLACEHOLDER — legal review required */}
          <div className="mt-12 flex flex-col md:mt-16">
            <section className="flex flex-col gap-4 pb-10 md:pb-12">
              <h2 className="nx-heading">Our posture</h2>
              <p className="nx-body">{PRIVACY_POSTURE}</p>
              <p className="nx-body">
                {SITE.name} asks for the details it needs to show you relevant
                information, and nothing beyond that. You can see what we hold
                about you, correct it, and have it removed.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="nx-heading">What we hold</h2>
              <p className="nx-body">
                The profile you enter — education, work history, language
                results, family situation — and any documents you choose to
                upload. We also keep the account details needed to sign you in
                and the records required to operate the service.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="nx-heading">Documents</h2>
              <p className="nx-body">
                Documents are encrypted in storage and in transit. They are used
                to populate and check your own profile, not for anything else.
                You can ask us to delete them at any time, and we will.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="nx-heading">Deletion</h2>
              <p className="nx-body">
                Ask us to delete your documents or your account, and we remove
                them from our systems. Backups roll off on their own schedule,
                which the reviewed version of this page will state precisely.
              </p>
            </section>

            <Rule />

            {/* PLACEHOLDER — legal review required */}
            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="nx-heading">Provisional terms</h2>
              <p className="nx-body">
                This page is provisional and has not yet been reviewed by
                counsel. The reviewed version will name our processors, the
                retention periods that apply, the legal basis for each use, and
                the route for exercising your rights under the applicable
                privacy legislation. Nothing on this page should be read as a
                binding commitment until that review is complete.
              </p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 py-10 md:py-12">
              <h2 className="nx-heading">Scope</h2>
              <p className="nx-body">{DISCLAIMER}</p>
            </section>

            <Rule />

            <section className="flex flex-col gap-4 pt-10 md:pt-12">
              <h2 className="nx-heading">Contact</h2>
              {/* PLACEHOLDER — legal review required */}
              <p className="nx-body">
                A contact route for privacy questions and deletion requests will
                be published here alongside the reviewed version.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}
