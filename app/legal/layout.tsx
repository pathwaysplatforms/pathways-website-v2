import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";

/**
 * Chrome for the legal routes. The home page composes Nav and Footer
 * itself, so this layout covers /legal/* only — without it these pages
 * render with no way back to the site.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
