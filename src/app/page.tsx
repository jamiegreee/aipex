import Link from "next/link";
import Navigation from "@/components/Navigation";

const pillars = [
  { number: "01", label: "Economy & Labour" },
  { number: "02", label: "State Capacity" },
  { number: "03", label: "Geopolitics" },
  { number: "04", label: "Democratic Governance" },
];

const briefs = [
  {
    tag: "Economy",
    date: "2026.03.19",
    title: "What the AI transition means for the UK labour market — beyond the headlines",
    summary: "The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows about near-term labour market disruption.",
    href: "/research/ai-labour-market",
  },
  {
    tag: "Governance",
    date: "2026.03.26",
    title: 'Why "AI regulation" is the wrong frame — and what to do instead',
    summary: "AI governance is not about constraining a static technology \u2014 it\u2019s about building institutional capacity to manage a transition already underway.",
    href: "/research/ai-regulation-wrong-frame",
  },
  {
    tag: "State",
    date: "2026.04.09",
    title: "State capacity for AI: is Whitehall ready?",
    summary: 'Government talks about being "pro-innovation" on AI. But does the British state have the technical capacity and institutional knowledge to actually deliver?',
    href: "/research/state-capacity-ai",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Hero */}
      <section className="flex flex-col gap-12 w-full px-16 pt-[120px] pb-[140px] border-b border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Independent Policy Institute
        </p>
        <h1 className="text-[72px] font-extralight leading-[82px] tracking-[-0.04em] max-w-[900px]">
          Navigating the AI transition
        </h1>
        <div className="flex flex-col gap-8">
          <p className="text-[15px] font-light leading-[26px] text-muted max-w-[580px]">
            How states, institutions, and economies adapt as AI capabilities
            rapidly scale. We bring operational experience to governance
            questions that matter.
          </p>
          <div className="flex gap-4">
            <Link
              href="/research"
              className="flex items-center px-7 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              Read latest
            </Link>
            <Link
              href="/community"
              className="flex items-center px-7 py-3 border border-[#C4BEB2] text-[13px] hover:border-ink transition-colors"
            >
              Join community
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Strip */}
      <section className="flex w-full border-b border-border">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.number}
            className={`flex flex-col gap-2 flex-1 py-7 px-8 ${
              i < pillars.length - 1 ? "border-r border-border" : ""
            }`}
          >
            <span className="text-[11px] font-medium text-accent">
              {pillar.number}
            </span>
            <span className="text-[15px]">{pillar.label}</span>
          </div>
        ))}
      </section>

      {/* Latest Research Header */}
      <section className="flex items-center justify-between w-full px-16 pt-12 pb-8">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Latest Research
        </p>
        <Link href="/research" className="text-[13px] text-muted hover:text-ink transition-colors">
          View all &rarr;
        </Link>
      </section>

      {/* Brief Rows */}
      {briefs.map((brief, i) => (
        <article
          key={i}
          className={`flex items-start gap-12 w-full px-16 py-8 border-t border-border ${
            i === briefs.length - 1 ? "border-b" : ""
          }`}
        >
          <div className="w-[140px] shrink-0">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-accent">
              {brief.tag}
            </p>
            <p className="text-[11px] text-muted mt-0.5">{brief.date}</p>
          </div>
          <div className="flex-1 max-w-[1029px]">
            <h3 className="text-[20px] font-normal leading-[32px]">
              {brief.title}
            </h3>
            <p className="text-[13px] font-light leading-[22px] text-muted mt-2">
              {brief.summary}
            </p>
          </div>
          <Link href={brief.href} className="text-[15px] text-accent shrink-0 hover:opacity-80 transition-opacity">
            Read &rarr;
          </Link>
        </article>
      ))}

      {/* Founding Charter / Position Statement */}
      <section className="flex flex-col w-full px-16 py-24 gap-8 bg-dark">
        <p className="text-[11px] font-medium tracking-[3px] uppercase text-accent">
          // Our Position
        </p>
        <h2 className="text-[36px] font-extralight leading-[1.3] text-light max-w-[1000px]">
          AI governance cannot wait for perfect information. We believe in
          learning by doing — iteratively.
        </h2>
        <p className="text-[14px] font-light leading-[1.6] text-muted max-w-[800px]">
          The pace of AI development demands that policy frameworks evolve in
          real time. We bring together the people who build these systems and the
          people who govern them — because neither can succeed alone.
        </p>
        <Link
          href="/about"
          className="flex items-center w-fit px-7 py-3.5 border border-[#C4BEB2] text-light text-[12px] hover:border-light transition-colors mt-2"
        >
          Read Our Founding Charter &rarr;
        </Link>
      </section>

      {/* Get Involved CTA */}
      <section className="flex flex-col w-full px-16 py-24 gap-8 border-b border-border">
        <p className="text-[11px] font-medium tracking-[3px] uppercase text-accent">
          // Get Involved
        </p>
        <h2 className="text-[48px] font-extralight leading-[1.15] max-w-[900px]">
          The future of AI governance is being written now. Help us get it
          right.
        </h2>
        <p className="text-[14px] font-light leading-[1.6] text-muted max-w-[680px]">
          Join policymakers, researchers, and technologists shaping responsible
          AI governance worldwide.
        </p>
        <div className="flex gap-4">
          <Link
            href="/community"
            className="flex items-center px-7 py-3.5 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            Join the Exchange &rarr;
          </Link>
          <Link
            href="/community"
            className="flex items-center px-7 py-3.5 border border-[#C4BEB2] text-[13px] hover:border-ink transition-colors"
          >
            Subscribe to Updates &rarr;
          </Link>
        </div>
        <p className="text-[11px] font-light text-[#A8A098]">
          Free to join &middot; No spam &middot; Unsubscribe anytime
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-10 w-full px-16 py-12 bg-cream-dark">
        <div className="flex justify-between">
          <div className="max-w-[340px]">
            <Link href="/" className="text-[16px] font-medium block mb-4 hover:text-accent transition-colors">
              AI Policy Exchange
            </Link>
            <p className="text-[12px] font-light leading-[1.5] text-muted">
              Bridging the gap between AI innovation and responsible governance
              through research, dialogue, and actionable frameworks.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-3.5">
              <p className="text-[10px] font-medium tracking-[2px] uppercase text-[#A8A098]">
                // Research
              </p>
              <Link href="/research" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Policy Briefs</Link>
              <Link href="/research" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Working Papers</Link>
              <Link href="/research" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Annual Report</Link>
            </div>
            <div className="flex flex-col gap-3.5">
              <p className="text-[10px] font-medium tracking-[2px] uppercase text-[#A8A098]">
                // Programs
              </p>
              <Link href="/community" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Roundtables</Link>
              <Link href="/fellowship" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Fellowship</Link>
              <Link href="/community" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Events Calendar</Link>
            </div>
            <div className="flex flex-col gap-3.5">
              <p className="text-[10px] font-medium tracking-[2px] uppercase text-[#A8A098]">
                // Organisation
              </p>
              <Link href="/about" className="text-[12px] font-light text-muted hover:text-ink transition-colors">About Us</Link>
              <Link href="/about" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Team</Link>
              <Link href="/contact" className="text-[12px] font-light text-muted hover:text-ink transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-light text-[#A8A098]">
            &copy; 2026 AI Policy Exchange. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[11px] font-light text-[#A8A098] hover:text-ink transition-colors">Privacy Policy</Link>
            <Link href="/privacy" className="text-[11px] font-light text-[#A8A098] hover:text-ink transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="text-[11px] font-light text-[#A8A098] hover:text-ink transition-colors">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
