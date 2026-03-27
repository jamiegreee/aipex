import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — AI Policy Exchange",
  description: "An independent voice on the governance challenges that matter most.",
};

const activities = [
  {
    label: "Publish",
    title: "Policy briefs that take a position",
    description:
      "Rigorous, accessible analysis on the AI transition. Written by practitioners, not just academics. Every brief includes concrete policy recommendations.",
  },
  {
    label: "Convene",
    title: "A community of next-gen practitioners",
    description:
      "Online community, regular events, and working groups bringing together people across technology, policy, civil service, and academia who want to shape AI governance.",
  },
  {
    label: "Develop",
    title: "The next generation of AI governance leaders",
    description:
      "Our fellowship programme equips emerging policy practitioners with the knowledge, network, and published work to lead on AI governance in their careers.",
  },
];

export default function About() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Hero */}
      <section className="flex flex-col gap-6 w-full px-6 sm:px-10 lg:px-16 pt-14 md:pt-[100px] pb-12 md:pb-[80px]">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          About the Exchange
        </p>
        <h1 className="text-[30px] md:text-[48px] font-light leading-[40px] md:leading-[64px] tracking-[-0.03em] max-w-[800px]">
          An independent voice on the governance challenges that matter most
        </h1>
      </section>

      {/* Mission Content */}
      <section className="flex flex-col md:flex-row gap-10 w-full px-6 sm:px-10 lg:px-16 py-10 md:py-16 border-t border-border">
        <div className="flex-1 max-w-[600px]">
          <h2 className="text-[24px] font-normal leading-[36px] mb-6">The problem</h2>
          <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
            AI is transforming how economies function, how governments operate, and how
            power is distributed globally. The conversation about how to govern this
            transition is dominated by two camps: those who see AI primarily as an
            existential risk to be contained, and those who want to move fast with minimal
            oversight.
          </p>
          <p className="text-[14px] font-light leading-[26px] text-muted">
            Neither position serves policymakers who need practical, evidence-based
            guidance on the near-term challenges they face right now.
          </p>
        </div>
        <div className="flex-1 max-w-[600px]">
          <h2 className="text-[24px] font-normal leading-[36px] mb-6">Our approach</h2>
          <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
            The AI Policy Exchange brings operational experience to governance questions.
            Our work is grounded in the reality of building and deploying technology — in
            startups, international institutions, and government — not just theorising
            about it.
          </p>
          <p className="text-[14px] font-light leading-[26px] text-muted">
            We believe Britain and its allies should lead in AI capability and governance,
            and that these are complementary. We publish rigorous policy analysis, build a
            community of practitioners, and develop the next generation of AI governance
            leaders.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="w-full px-6 sm:px-10 lg:px-16 pt-12 md:pt-16 pb-14 md:pb-20 bg-dark">
        <h2 className="text-[28px] md:text-[40px] font-light leading-[52px] text-light mb-12">
          What we do
        </h2>
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          {activities.map((activity) => (
            <div key={activity.label} className="flex-1">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-3">
                {activity.label}
              </p>
              <h3 className="text-[18px] font-normal leading-[30px] text-light mb-3">
                {activity.title}
              </h3>
              <p className="text-[13px] font-light leading-[22px] text-muted">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="flex flex-col md:flex-row gap-10 md:gap-16 w-full px-6 sm:px-10 lg:px-16 py-12 md:py-20 border-b border-border">
        <div className="w-full md:w-[280px] shrink-0">
          <Image src="/jamie-green.png" alt="Jamie Green" width={280} height={340} className="object-cover w-full md:w-[280px] h-[240px] md:h-[340px]" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-2">
            Founder
          </p>
          <h2 className="text-[32px] font-normal leading-[44px] mb-6">
            Jamie Green
          </h2>
          <p className="text-[14px] font-light leading-[26px] text-muted mb-4">
            Jamie founded the AI Policy Exchange to bring operational experience to the AI
            governance conversation. His career spans technology, international
            development, and entrepreneurship — building digital systems at the
            intersection of policy and practice.
          </p>
          <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
            Previously, Jamie served as an early employee at the UNDP Chief Digital
            Office, built blockchain payment systems for 100,000+ refugees at the WFP
            Innovation Accelerator, co-founded a YC-backed education company, and
            directed a $50M startup accelerator. He holds an MPP (Merit) from the
            University of Oxford.
          </p>
          <div className="flex gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
              LinkedIn &rarr;
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
              X / Twitter &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="w-full px-6 sm:px-10 lg:px-16 py-12 md:py-20">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-3">
          Advisory Board
        </p>
        <h2 className="text-[32px] font-normal leading-[44px] mb-4">Coming soon</h2>
        <p className="text-[14px] font-light leading-[26px] text-muted max-w-[600px] mb-4">
          We are assembling an advisory board of leading practitioners, technologists,
          and policymakers. Interested in joining? Get in touch.
        </p>
        <Link href="/contact" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
          Contact us &rarr;
        </Link>
      </section>

      <Footer />
    </div>
  );
}
