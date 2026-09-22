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
 * Backgrounds alternate white / paper down the run, and each block draws its
 * own 2px ink top rule, so the bands read as a stack of separate documents
 * rather than a card grid. The column split alternates too — it is set per
 * specimen in lib/fixtures.ts and is never the same twice in a row.
 */
export function Specimens() {
  return (
    <>
      {SPECIMENS.map((specimen, index) => (
        <Specimen
          key={specimen.id}
          specimen={specimen}
          mock={MOCKS[specimen.id]}
          bg={index % 2 === 0 ? "bg" : "paper"}
        />
      ))}
    </>
  );
}
