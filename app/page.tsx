import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Closing } from "@/components/sections/Closing";
import { DataBand } from "@/components/sections/DataBand";
import { Manifesto } from "@/components/sections/Manifesto";
import { Specimens } from "@/components/sections/Specimens";
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
        <DataBand summary={summary} />
        <Specimens />
        <Manifesto />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
