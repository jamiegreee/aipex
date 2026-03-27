import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Research — AI Policy Exchange",
  description: "Policy briefs and analysis on the AI transition.",
};

const briefs = [
  {
    tag: "Economy & Labour",
    date: "March 2026",
    readTime: "25 min read",
    title: "What the AI transition means for the UK labour market — beyond the headlines",
    summary: "The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows about near-term labour market disruption.",
    href: "/research/ai-labour-market",
  },
  {
    tag: "Governance",
    date: "March 2026",
    readTime: "22 min read",
    title: 'Why "AI regulation" is the wrong frame — and what to do instead',
    summary: "AI governance is not about constraining a static technology \u2014 it\u2019s about building institutional capacity to manage a transition already underway.",
    href: "/research/ai-regulation-wrong-frame",
  },
  {
    tag: "State Capacity",
    date: "April 2026",
    readTime: "24 min read",
    title: "State capacity for AI: is Whitehall ready?",
    summary: 'Government talks about being "pro-innovation" on AI. But does the British state have the technical capacity and institutional knowledge to actually deliver?',
    href: "/research/state-capacity-ai",
  },
];

export default function Research() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Hero */}
      <section className="flex flex-col gap-6 w-full px-6 sm:px-10 lg:px-16 pt-14 md:pt-[100px] pb-12 md:pb-[80px] border-b border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Publications
        </p>
        <h1 className="text-[30px] md:text-[48px] font-light leading-[40px] md:leading-[64px] tracking-[-0.03em] max-w-[800px]">
          Research &amp; policy briefs
        </h1>
        <p className="text-[15px] font-light leading-[26px] text-muted max-w-[580px]">
          Rigorous, accessible analysis on the AI transition. Written by
          practitioners, not just academics. Every brief includes concrete policy
          recommendations.
        </p>
      </section>

      {/* Brief Rows */}
      {briefs.map((brief) => (
        <Link
          key={brief.href}
          href={brief.href}
          className="group flex flex-col md:flex-row items-start gap-4 md:gap-12 w-full px-6 sm:px-10 lg:px-16 py-8 md:py-10 border-b border-border hover:bg-cream-dark transition-colors"
        >
          <div className="w-full md:w-[160px] shrink-0">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-accent">
              {brief.tag}
            </p>
            <p className="text-[11px] text-muted mt-1">{brief.date}</p>
            <p className="text-[11px] text-muted">{brief.readTime}</p>
          </div>
          <div className="flex-1">
            <h2 className="text-[24px] font-normal leading-[34px] group-hover:text-accent transition-colors">
              {brief.title}
            </h2>
            <p className="text-[14px] font-light leading-[24px] text-muted mt-3">
              {brief.summary}
            </p>
          </div>
          <span className="text-[15px] text-accent shrink-0 mt-0 md:mt-2">
            Read &rarr;
          </span>
        </Link>
      ))}

      {/* More coming */}
      <section className="flex flex-col items-center w-full px-6 sm:px-10 lg:px-16 py-12 md:py-20">
        <p className="text-[14px] text-muted">More briefs coming soon.</p>
      </section>

      <Footer />
    </div>
  );
}
