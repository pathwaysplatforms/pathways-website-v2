import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Urbanist } from "next/font/google";
import { GridOverlay } from "@/components/ui/GridOverlay";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

/** Labels, data, captions, footer. Exactly the two weights the contract allows. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pathways.xx"),
  title: {
    default: "Pathways — Canadian immigration, mapped to your file",
    template: "%s — Pathways",
  },
  description:
    "Pathways maps 107 Canadian immigration pathways against one profile and tracks every Express Entry draw since 2015.",
  openGraph: {
    type: "website",
    siteName: "Pathways",
    title: "Pathways — Canadian immigration, mapped to your file",
    description:
      "Pathways maps 107 Canadian immigration pathways against one profile and tracks every Express Entry draw since 2015.",
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
    <html
      lang="en"
      className={`${urbanist.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* The grid is visible. It paints over section backgrounds and under
            every piece of content — see the z-index pair below. */}
        <GridOverlay />
        <div className="relative z-[2]">{children}</div>
      </body>
    </html>
  );
}
