import type { Metadata } from "next";
import { DM_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "./policy.css";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";

const sans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});
const serif = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
const mono = IBM_Plex_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theaipex.org"),
  title: { default: "AIPEX — AI Policy Exchange", template: "%s — AIPEX" },
  description:
    "Practical tools, source-backed cases and free courses to understand, develop and deliver effective AI policy.",
  openGraph: {
    title: "AIPEX — AI Policy Exchange",
    description:
      "Practical tools, cases and free AI policy courses. Build the judgement and capacity to act.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Suspense fallback={null}><Analytics /></Suspense>
      </body>
    </html>
  );
}
