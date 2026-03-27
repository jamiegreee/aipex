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
    title:
      "What the AI transition means for the UK labour market — beyond the headlines",
    summary:
      "The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows about near-term labour market disruption.",
  },
  {
    tag: "Governance",
    date: "2026.03.26",
    title:
      'Why "AI regulation" is the wrong frame — and what to do instead',
    summary:
      "AI governance is not about constraining a static technology — it\u2019s about building institutional capacity to manage a transition already underway.",
  },
  {
    tag: "State",
    date: "2026.04.09",
    title: "State capacity for AI: is Whitehall ready?",
    summary:
      'Government talks about being "pro-innovation" on AI. But does the British state have the technical capacity and institutional knowledge to actually deliver?',
  },
];

const communityBenefits = [
  "Weekly newsletter with curated AI policy analysis",
  "Slack community for discussion and networking",
  "Events, seminars, and roundtables",
  "Opportunities to contribute to policy briefs",
];

export default function Home() {
  return (
    <div className="flex flex-col w-full font-mono">
      {/* Navigation */}
      <nav className="flex items-center justify-between w-full px-16 py-6 border-b border-border">
        <span className="text-[15px] font-medium tracking-tight">
          AI Policy Exchange
        </span>
        <div className="flex items-center gap-8">
          <a href="#research" className="text-[13px] hover:text-accent transition-colors">Research</a>
          <a href="#about" className="text-[13px] hover:text-accent transition-colors">About</a>
          <a href="#fellowship" className="text-[13px] hover:text-accent transition-colors">Fellowship</a>
          <a href="#community" className="text-[13px] hover:text-accent transition-colors">Community</a>
          <a
            href="#join"
            className="text-[13px] font-medium text-cream bg-accent px-5 py-2 hover:opacity-90 transition-opacity"
          >
            Join &rarr;
          </a>
        </div>
      </nav>

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
            <a
              href="#research"
              className="flex items-center px-7 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              Read latest
            </a>
            <a
              href="#community"
              className="flex items-center px-7 py-3 border border-[#C4BEB2] text-[13px] hover:border-ink transition-colors"
            >
              Join community
            </a>
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
      <section
        id="research"
        className="flex items-center justify-between w-full px-16 pt-12 pb-8"
      >
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Latest Research
        </p>
        <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">
          View all &rarr;
        </a>
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
          <a href="#" className="text-[15px] text-accent shrink-0 hover:opacity-80 transition-opacity">
            Read &rarr;
          </a>
        </article>
      ))}

      {/* Position Statement */}
      <section className="flex flex-col items-center w-full px-16 py-[100px] gap-9 bg-dark">
        <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent">
          // Our Position
        </p>
        <div className="max-w-[900px]">
          <p className="text-[18px] font-light leading-[34px] tracking-[-0.01em] text-center text-light">
            &ldquo;Neither safetyist nor accelerationist. We believe AI is a
            strategic opportunity that requires thoughtful governance — and
            that capability and responsibility are complementary, not in
            tension.&rdquo;
          </p>
        </div>
      </section>

      {/* Fellowship Banner */}
      <section
        id="fellowship"
        className="flex items-center justify-between w-full px-16 py-12 border-b border-border"
      >
        <div className="max-w-[600px]">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
            // Fellowship
          </p>
          <h2 className="text-[28px] font-normal leading-[34px] mt-3">
            Developing the next generation of AI governance leaders
          </h2>
          <p className="text-[13px] text-muted mt-3">
            12-week cohort programme — Applications open Autumn 2027
          </p>
        </div>
        <a
          href="#"
          className="flex items-center px-7 py-3 border border-border text-[13px] hover:border-ink transition-colors"
        >
          Learn more &rarr;
        </a>
      </section>

      {/* Community CTA */}
      <section
        id="community"
        className="flex w-full px-16 py-20 gap-20 border-b border-border"
      >
        <div className="max-w-[616px]">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
            // Join the Exchange
          </p>
          <h2 className="text-[32px] font-normal leading-[40px] mt-4">
            A community for the next generation of AI governance
          </h2>
        </div>
        <div className="flex flex-col gap-5 max-w-[616px]">
          {communityBenefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-4">
              <span className="text-accent text-[13px]">&rarr;</span>
              <span className="text-[15px] font-light leading-[20px]">
                {benefit}
              </span>
            </div>
          ))}
          <a
            href="#join"
            className="mt-4 flex items-center justify-center w-fit px-8 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            Join the Exchange &rarr;
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between w-full px-16 py-8 bg-cream-dark">
        <span className="text-[11px] text-muted">
          &copy; 2026 AI Policy Exchange
        </span>
        <span className="text-[11px] text-muted">
          hello@aipolicyexchange.org
        </span>
        <div className="flex gap-6">
          <a href="#" className="text-[11px] text-muted hover:text-ink transition-colors">X</a>
          <a href="#" className="text-[11px] text-muted hover:text-ink transition-colors">LinkedIn</a>
          <a href="#" className="text-[11px] text-muted hover:text-ink transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
