import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/** Everything. Tight neo-grotesque at display sizes is the modern voice; a
 *  serif would pull the whole page back toward the engraved, retro look. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Instrument readouts: every figure on a dial, plate or panel. */
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
  themeColor: "#EDF0F7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* body::before lays the ambient light at z-0; content sits above it. */}
        <div className="relative z-[1]">{children}</div>
      </body>
    </html>
  );
}
