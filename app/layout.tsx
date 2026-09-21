import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import { PathLine } from "@/components/layout/PathLine";
import { TOUR_STEPS } from "@/lib/fixtures";
import "./globals.css";

/** The tour anchors PathLine tracks. Mounted once, for the whole scroll. */
const TOUR_ANCHORS = TOUR_STEPS.map((step) => step.anchor);

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pathways.xx"),
  title: {
    default: "Pathways — Canadian immigration, run like a project",
    template: "%s — Pathways",
  },
  description:
    "Pathways maps Canadian immigration pathways, tracks every Express Entry draw since 2015, and shows you where your file actually stands.",
  openGraph: {
    type: "website",
    siteName: "Pathways",
    title: "Pathways — Canadian immigration, run like a project",
    description:
      "Pathways maps Canadian immigration pathways, tracks every Express Entry draw since 2015, and shows you where your file actually stands.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Matches --pw-bg. Kept as a keyword so no hex lives outside globals.css.
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body>
        <PathLine sections={TOUR_ANCHORS} />
        {children}
      </body>
    </html>
  );
}
