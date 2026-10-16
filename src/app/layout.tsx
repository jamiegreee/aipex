import type { Metadata } from "next";
import { DM_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
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
    "Free, self-paced courses to understand, develop and deliver effective AI policy. Build practical skills with cases, exercises and worked examples.",
  openGraph: {
    title: "AIPEX — AI Policy Exchange",
    description:
      "Free, self-paced AI policy courses. Understand the landscape, practise your judgement and build the capacity to act.",
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
