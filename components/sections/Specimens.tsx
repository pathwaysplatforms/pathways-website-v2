import type { ReactNode } from "react";

import { DrawChart } from "@/components/product/DrawChart";
import { LeverList } from "@/components/product/LeverRow";
import { MissionControlCard } from "@/components/product/MissionControlCard";
import { PathwayFunnel } from "@/components/product/PathwayFunnel";
import { VoiceWaveform } from "@/components/product/VoiceWaveform";
import { Specimen } from "@/components/sections/Specimen";
import type { SpecimenId } from "@/lib/fixtures";
import { SPECIMENS } from "@/lib/fixtures";

/**
 * One mock per specimen. Keyed by SpecimenId so adding a specimen to
 * lib/fixtures.ts without giving it a mock is a type error, not a blank
 * column at runtime.
 */
const MOCKS: Record<SpecimenId, ReactNode> = {
  voice: <VoiceWaveform />,
  match: <PathwayFunnel />,
  standing: <MissionControlCard />,
  next: <LeverList />,
  draws: <DrawChart />,
};

/**
 * The run of five product specimens.
 *
 * The bands share one continuous canvas — the ambient light behind the page
 * is what separates them, not alternating fills. The column split alternates
 * instead: it is set per specimen in lib/fixtures.ts and is never the same
 * twice in a row.
 */
export function Specimens() {
  return (
    <>
      {SPECIMENS.map((specimen, index) => (
        <Specimen
          key={specimen.id}
          specimen={specimen}
          mock={MOCKS[specimen.id]}
          lit={index === 0}
        />
      ))}
    </>
  );
}
