import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Pathways — AI guidance for your immigration journey",
  description:
    "Pathways uses AI and live IRCC data to show you which immigration routes are open to you, and what to do next.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={urbanist.variable}>
      <head>
        {/* Entrance animations start from opacity 0, which is rendered into the
            SSR HTML. If JS never runs, that would leave the page blank — so
            without JS the reveals are simply on. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {/* Wayfinding: a way out of the chrome on the first Tab (skill §16) */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-2.5 focus:text-on-accent"
        >
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
