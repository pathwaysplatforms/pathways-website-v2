import type { Metadata, Viewport } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

/**
 * Display. One weight, high contrast — the reason it reads as a publication
 * rather than as an interface.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

/** Interface and body. */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

/** Labels, captions, datelines and every figure in a plate. */
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
  themeColor: "#FBFAF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
