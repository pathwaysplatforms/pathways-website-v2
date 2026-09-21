import { Hero } from "@/components/hero/Hero";
import { ProofBar } from "@/components/hero/ProofBar";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Honesty } from "@/components/sections/Honesty";
import { TourSection } from "@/components/tour/TourSection";
import { TOUR_VISUALS } from "@/components/tour/tourVisuals";
import { getDrawSummary } from "@/lib/draws";

/** Six hours. The draw summary is the only live data on this page. */
export const revalidate = 21600;

export default async function Home() {
  // Never throws: falls back to the staged figures when the view is absent.
  const summary = await getDrawSummary();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofBar summary={summary} />
        <TourSection visuals={TOUR_VISUALS} />
        <Honesty />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
