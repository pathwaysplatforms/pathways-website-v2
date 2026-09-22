import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { getDrawSummary } from "@/lib/draws";

/** Six hours. The draw summary is the only live data on this page. */
export const revalidate = 21600;

/** PLACEHOLDER — Phase 3 assembles the full sequence. */
export default async function Home() {
  // Never throws: falls back to the staged figures when the view is absent.
  await getDrawSummary();

  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
