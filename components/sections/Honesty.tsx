import { Fragment } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Hairline } from "@/components/ui/Hairline";
import { Section } from "@/components/ui/Section";
import { HONESTY_CLAIMS } from "@/lib/fixtures";

/**
 * The accuracy stance. Three claims, hairline-separated, straight from
 * HONESTY_CLAIMS. This section states how the product behaves when the
 * underlying information is incomplete — it is not a feature list.
 */
export function Honesty() {
  return (
    <Section id="honesty" width="content" aria-labelledby="honesty-eyebrow">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <Eyebrow id="honesty-eyebrow">HOW WE HANDLE ACCURACY</Eyebrow>
          <h2 className="pw-heading">
            We would rather show you nothing than show you something we cannot
            source.
          </h2>
          <p className="pw-body">
            Pathways is built on published rules and published draw records.
            Where the record is clear, we show it to you with its origin
            attached. Where it is not, we say so and leave the gap visible
            rather than filling it.
          </p>
        </div>

        <ul className="flex flex-col">
          {HONESTY_CLAIMS.map((claim, index) => (
            <Fragment key={claim.id}>
              {index > 0 ? <Hairline /> : null}
              <li className="flex flex-col gap-3 py-8 first:pt-0 last:pb-0">
                <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-pw-text">
                  {claim.title}
                </h3>
                <p className="pw-body">{claim.body}</p>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </Section>
  );
}
