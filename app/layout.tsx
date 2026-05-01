import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Atelier — Landing",
  description:
    "From zeros and ones to a human gaze. We invest not in projects but in relationships.",
  openGraph: {
    title: "Atelier — Landing",
    description:
      "From zeros and ones to a human gaze. We invest not in projects but in relationships.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier — Landing",
    description:
      "From zeros and ones to a human gaze. We invest not in projects but in relationships.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
