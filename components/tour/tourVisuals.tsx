import type { ReactNode } from "react";

import { DrawChart } from "@/components/product/DrawChart";
import { LeverRow } from "@/components/product/LeverRow";
import { MissionControlCard } from "@/components/product/MissionControlCard";
import { PathwayFunnel } from "@/components/product/PathwayFunnel";
import { VoiceWaveform } from "@/components/product/VoiceWaveform";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MISSION_CONTROL_LEVERS, type TourStepId } from "@/lib/fixtures";

/**
 * Phase 2 wiring: which product mock belongs to which tour step.
 *
 * TourSection deliberately knows nothing about components/product — it takes
 * this map as a prop. Keeping the map here means the client boundary stays
 * where it is: every mock below is a Server Component, rendered on the server
 * and handed to the client TourSection as an already-built element.
 *
 * Each visual is centred inside the frame, which gives its children a definite
 * height on desktop (the frame is a fixed 4:3 box) and collapses to intrinsic
 * height in the stacked mobile layout.
 */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
}

/**
 * Step 4's visual: the levers on their own, lifted out of the mission control
 * card. Same data, different altitude — this is the "what should I do next"
 * screen rather than the "where do I stand" screen.
 */
function NextActionPanel() {
  return (
    <div className="w-full">
      <Eyebrow>Next best actions</Eyebrow>
      <div className="mt-5 [&>*:last-child]:border-b-0">
        {MISSION_CONTROL_LEVERS.map((lever) => (
          <LeverRow key={lever.id} lever={lever} />
        ))}
      </div>
    </div>
  );
}

export const TOUR_VISUALS: Record<TourStepId, ReactNode> = {
  voice: (
    <Frame>
      <VoiceWaveform />
    </Frame>
  ),
  matching: (
    <Frame>
      <PathwayFunnel />
    </Frame>
  ),
  "mission-control": (
    <Frame>
      <MissionControlCard />
    </Frame>
  ),
  "next-action": (
    <Frame>
      <NextActionPanel />
    </Frame>
  ),
  draws: (
    <Frame>
      <DrawChart />
    </Frame>
  ),
};
