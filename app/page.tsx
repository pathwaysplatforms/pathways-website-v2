import { DataScale } from "@/components/sections/DataScale";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { NewPathway } from "@/components/sections/NewPathway";
import { Problem } from "@/components/sections/Problem";
import { Qualify } from "@/components/sections/Qualify";
import { StartCta } from "@/components/sections/StartCta";

/**
 * SKELETON — section order mirrors the structure sketch. Every section below
 * is scaffolding with placeholder content, to be built out one at a time.
 */
export default function Page() {
  return (
    <main id="main">
      <Hero />
      <Problem />
      <Features />
      <NewPathway />
      <DataScale />
      <StartCta />
      <Qualify />
    </main>
  );
}
