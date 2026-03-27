import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fellowship — AI Policy Exchange",
  description: "A structured, cohort-based programme for emerging policy practitioners. 12 weeks. Part-time.",
};

const stats = [
  { value: "12", label: "weeks, part-time" },
  { value: "15", label: "fellows per cohort" },
  { value: "5", label: "curriculum modules" },
  { value: "1", label: "published policy brief" },
];

const modules = [
  {
    number: "01",
    title: "The AI Technology Landscape",
    description: "What policymakers actually need to understand about how AI systems work, their capabilities, and their limitations. No CS degree required — but no hand-waving either.",
  },
  {
    number: "02",
    title: "Governance Frameworks",
    description: "Comparative analysis of how different jurisdictions govern AI. EU AI Act, US executive orders, UK pro-innovation approach, China's framework. What works, what doesn't, and why.",
  },
  {
    number: "03",
    title: "Political Economy of AI",
    description: "Labour market impacts, competition dynamics, industrial policy, and distributional consequences. The economics of the AI transition and who wins and loses.",
  },
  {
    number: "04",
    title: "AI and National Security",
    description: "Dual-use considerations, compute geopolitics, allied coordination, and defence applications. The strategic dimension of AI governance.",
  },
  {
    number: "05",
    title: "Policy Writing & Capstone",
    description: "Practical workshop on writing effective policy briefs and consultation responses. Fellows produce a capstone brief published by the Exchange. Real output, real audience.",
  },
];

const audiences = [
  {
    title: "Policy professionals",
    description: "Working in or transitioning into government, think tanks, or regulators. You understand policy but want deeper AI fluency.",
  },
  {
    title: "Technologists",
    description: "Engineers, product managers, or researchers who want to engage with the governance side. You build technology and want to shape how it's governed.",
  },
  {
    title: "Cross-sector leaders",
    description: "From journalism, law, civil society, international affairs, or academia. You bring a unique perspective and want to develop AI governance expertise.",
  },
];

const outcomes = [
  {
    number: "1",
    title: "A published policy brief",
    description: "Your capstone brief is published by the Exchange — a real portfolio piece for your career.",
  },
  {
    number: "2",
    title: "A cross-sector network",
    description: "15 peers from tech, policy, civil service, and academia — the people who'll shape AI governance alongside you.",
  },
  {
    number: "3",
    title: "Fluency to lead",
    description: "The technical literacy, governance knowledge, and policy communication skills to lead on AI governance in any context.",
  },
  {
    number: "4",
    title: "Alumni status",
    description: "Lifetime access to the Exchange community, events, and the growing fellowship alumni network.",
  },
];

export default function Fellowship() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Hero */}
      <section className="flex flex-col gap-8 w-full px-6 sm:px-10 lg:px-16 pt-14 md:pt-[100px] pb-12 md:pb-[80px] border-b border-border">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
            AI Governance Fellowship
          </p>
        </div>
        <h1 className="text-[30px] md:text-[48px] font-light leading-[40px] md:leading-[72px] tracking-[-0.03em] max-w-[900px]">
          Become one of the people who shape how AI is governed
        </h1>
        <p className="text-[16px] font-light leading-[28px] text-muted max-w-[640px]">
          A structured, cohort-based programme for emerging policy practitioners.
          12 weeks. Part-time. You leave with published work, a powerful network,
          and the knowledge to lead.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Link
            href="/community"
            className="flex items-center px-7 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            Apply for Cohort 1
          </Link>
          <span className="text-[14px] text-muted">
            Applications open Autumn 2027
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:flex w-full border-b border-border">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-3 flex-1 py-8 md:py-16 px-6 md:px-8 ${
              i < stats.length - 1 ? "md:border-r border-border" : ""
            }`}
          >
            <span className="text-[36px] md:text-[48px] font-light leading-[58px] tracking-[-0.03em]">
              {stat.value}
            </span>
            <span className="text-[14px] text-muted">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Curriculum */}
      <section className="w-full px-6 sm:px-10 lg:px-16 pt-12 md:pt-16 pb-8">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-3">
          Curriculum
        </p>
        <h2 className="text-[28px] md:text-[40px] font-light leading-[52px] mb-10">
          What you&apos;ll learn
        </h2>
        {modules.map((mod) => (
          <div
            key={mod.number}
            className="flex gap-4 md:gap-8 py-8 md:py-10 border-t border-border"
          >
            <span className="text-[32px] md:text-[48px] font-extralight leading-[58px] text-muted w-[40px] md:w-[60px] shrink-0">
              {mod.number}
            </span>
            <div className="flex-1">
              <h3 className="text-[20px] font-normal leading-[30px] mb-2">
                {mod.title}
              </h3>
              <p className="text-[14px] font-light leading-[24px] text-muted">
                {mod.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Who Should Apply */}
      <section className="w-full px-6 sm:px-10 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16 border-t border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-3">
          Who should apply
        </p>
        <h2 className="text-[28px] md:text-[40px] font-light leading-[52px] mb-10">
          Is this for you?
        </h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8">
          {audiences.map((audience) => (
            <div key={audience.title} className="flex-1 border border-border p-8">
              <h3 className="text-[18px] font-medium leading-[28px] mb-3">
                {audience.title}
              </h3>
              <p className="text-[13px] font-light leading-[22px] text-muted">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[14px] text-muted text-center">
          2&ndash;10 years experience. UK-based or UK-focused. Deliberately cross-sector.
        </p>
      </section>

      {/* What You Get */}
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 w-full px-6 sm:px-10 lg:px-16 py-12 md:py-20 bg-dark">
        <div className="max-w-[600px]">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-3">
            What you leave with
          </p>
          <h2 className="text-[40px] font-light leading-[52px] text-light">
            Not just knowledge. Evidence.
          </h2>
        </div>
        <div className="flex flex-col gap-8 flex-1">
          {outcomes.map((outcome) => (
            <div key={outcome.number} className="flex gap-5">
              <span className="text-[28px] font-light text-muted w-8 shrink-0">
                {outcome.number}
              </span>
              <div>
                <h3 className="text-[16px] font-medium leading-[20px] text-light mb-2">
                  {outcome.title}
                </h3>
                <p className="text-[13px] font-light leading-[22px] text-muted">
                  {outcome.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Apply CTA */}
      <section className="flex flex-col items-center w-full px-6 sm:px-10 lg:px-16 py-12 md:py-20 gap-6 border-b border-border">
        <h2 className="text-[26px] md:text-[36px] font-light leading-[52px] text-center max-w-[620px]">
          Ready to shape the future of AI governance?
        </h2>
        <p className="text-[14px] text-muted text-center">
          Cohort 1 applications open Autumn 2027. Register your interest now and
          we&apos;ll notify you when applications go live.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link
            href="/community"
            className="flex items-center px-7 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            Register interest
          </Link>
          <Link
            href="/community"
            className="flex items-center px-7 py-3 border border-border text-[13px] hover:border-ink transition-colors"
          >
            Join the community first
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
