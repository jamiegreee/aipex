import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "./policy.css";
import "./membership.css";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";
import { themeScript } from "@/lib/theme";

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
    "The online community for AI policy professionals across the public and private sectors. Compare notes, share what's working and shape AI policy together.",
  openGraph: {
    title: "AIPEX — AI Policy Exchange",
    description:
      "The online community for AI policy professionals across the public and private sectors. Compare notes and shape AI policy together.",
    type: "website",
    locale: "en_GB",
  },
  // Name and status bar for the iOS home screen app.
  appleWebApp: {
    capable: true,
    title: "AIPEX",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#10140f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Suspense fallback={null}><Analytics /></Suspense>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
