import type { Metadata } from "next";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { DISCLAIMER, PRIVACY_POSTURE, SITE } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Pathways stores, how documents are handled, and how to have them deleted.",
};

const LAST_UPDATED = "20 September 2026";

export default function PrivacyPage() {
  return (
    <main>
      <Section width="prose" aria-labelledby="privacy-title">
        <div className="flex flex-col gap-5">
          <Eyebrow>LEGAL</Eyebrow>
          <h1 id="privacy-title" className="pw-heading">
            Privacy
          </h1>
          <p className="pw-body text-[15px]">Last updated {LAST_UPDATED}</p>
        </div>

        {/* PLACEHOLDER — legal review required */}
        <div className="mt-12 flex flex-col gap-10">
          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              Our posture
            </h2>
            <p className="pw-body">{PRIVACY_POSTURE}</p>
            <p className="pw-body">
              {SITE.name} asks for the details it needs to show you relevant
              information, and nothing beyond that. You can see what we hold
              about you, correct it, and have it removed.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              What we hold
            </h2>
            <p className="pw-body">
              The profile you enter — education, work history, language results,
              family situation — and any documents you choose to upload. We also
              keep the account details needed to sign you in and the records
              required to operate the service.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              Documents
            </h2>
            <p className="pw-body">
              Documents are encrypted in storage and in transit. They are used
              to populate and check your own profile, not for anything else. You
              can ask us to delete them at any time, and we will.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              Deletion
            </h2>
            <p className="pw-body">
              Ask us to delete your documents or your account, and we remove
              them from our systems. Backups roll off on their own schedule,
              which the reviewed version of this page will state precisely.
            </p>
          </section>

          {/* PLACEHOLDER — legal review required */}
          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              Provisional terms
            </h2>
            <p className="pw-body">
              This page is provisional and has not yet been reviewed by counsel.
              The reviewed version will name our processors, the retention
              periods that apply, the legal basis for each use, and the route
              for exercising your rights under the applicable privacy
              legislation. Nothing on this page should be read as a binding
              commitment until that review is complete.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              Scope
            </h2>
            <p className="pw-body">{DISCLAIMER}</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
              Contact
            </h2>
            {/* PLACEHOLDER — legal review required */}
            <p className="pw-body">
              A contact route for privacy questions and deletion requests will
              be published here alongside the reviewed version.
            </p>
          </section>
        </div>
      </Section>
    </main>
  );
}
