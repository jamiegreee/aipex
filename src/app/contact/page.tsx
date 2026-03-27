import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — AI Policy Exchange",
  description: "Get in touch with the AI Policy Exchange.",
};

export default function Contact() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      <section className="flex flex-col gap-8 w-full px-16 pt-[100px] pb-[80px] border-b border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Get in touch
        </p>
        <h1 className="text-[48px] font-light leading-[64px] tracking-[-0.03em] max-w-[800px]">
          Contact
        </h1>
        <p className="text-[15px] font-light leading-[26px] text-muted max-w-[580px]">
          Whether you&apos;re interested in our research, the fellowship, joining
          the community, or just want to say hello — we&apos;d like to hear from
          you.
        </p>
      </section>

      <section className="w-full px-16 py-16">
        <div className="flex gap-16 max-w-[900px]">
          <div className="flex-1">
            <h2 className="text-[20px] font-normal leading-[30px] mb-4">General enquiries</h2>
            <p className="text-[14px] font-light leading-[24px] text-muted mb-2">
              For questions about the Exchange, our research, or partnership
              opportunities.
            </p>
            <a href="mailto:hello@theaipex.org" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
              hello@theaipex.org
            </a>
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] font-normal leading-[30px] mb-4">Fellowship</h2>
            <p className="text-[14px] font-light leading-[24px] text-muted mb-2">
              For questions about the AI Governance Fellowship programme or
              expressing interest in future cohorts.
            </p>
            <a href="mailto:fellowship@theaipex.org" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
              fellowship@theaipex.org
            </a>
          </div>
        </div>
      </section>

      <section className="w-full px-16 py-16 border-t border-border">
        <h2 className="text-[20px] font-normal leading-[30px] mb-4">Find us elsewhere</h2>
        <div className="flex gap-8">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
            X / Twitter &rarr;
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
            LinkedIn &rarr;
          </a>
        </div>
      </section>

      <section className="flex items-center justify-between w-full px-16 py-12 border-t border-border">
        <div className="max-w-[600px]">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
            // Join the community
          </p>
          <h2 className="text-[24px] font-normal leading-[34px] mt-3">
            Want to stay in the loop?
          </h2>
          <p className="text-[13px] text-muted mt-2">
            Join our newsletter and Slack community for weekly AI policy analysis.
          </p>
        </div>
        <Link
          href="/community"
          className="flex items-center px-7 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          Join the Exchange &rarr;
        </Link>
      </section>

      <Footer />
    </div>
  );
}
