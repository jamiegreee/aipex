import type { Metadata } from "next";
import { DM_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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
    "Bringing the policy community together to understand the changing AI landscape and shape how we respond. Starting with informal gatherings in London.",
  openGraph: {
    title: "AIPEX — AI Policy Exchange",
    description:
      "Big questions. Better conversations. A new community for people interested in AI and public policy, starting in London.",
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
      </body>
    </html>
  );
}
