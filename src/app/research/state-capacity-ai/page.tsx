import type { Metadata } from "next";
import BriefLayout from "@/components/BriefLayout";

export const metadata: Metadata = {
  title: "State capacity for AI: is Whitehall ready? — AI Policy Exchange",
  description: 'Government talks about being "pro-innovation" on AI. But does the British state have the technical capacity and institutional knowledge to actually deliver?',
};

const sections = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "capability-gap", title: "1. The capability gap" },
  { id: "procurement-problem", title: "2. The procurement problem" },
  { id: "talent-pipeline", title: "3. The talent pipeline" },
  { id: "policy-recommendations", title: "4. Policy recommendations" },
];

export default function StateCapacityAI() {
  return (
    <BriefLayout
      tag="State Capacity"
      date="April 2026"
      readTime="9 min read"
      title="State capacity for AI: is Whitehall ready?"
      subtitle='Government talks about being "pro-innovation" on AI. But does the British state have the technical capacity and institutional knowledge to actually deliver?'
      sections={sections}
      recommendation={{
        title: "Key recommendation",
        body: "Create a cross-departmental AI Delivery Unit with the authority to embed technical teams within departments, reform procurement frameworks for AI-specific needs, and establish a fast-track civil service AI talent programme competitive with private sector compensation.",
      }}
    >
      <h2 id="executive-summary" className="text-[24px] font-normal leading-[34px] mb-6">
        Executive Summary
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK government has positioned itself as a global leader in AI policy
        with its &ldquo;pro-innovation&rdquo; approach and the establishment of
        the AI Safety Institute. But leadership in AI governance requires more
        than policy statements and research labs — it requires state capacity.
        The ability to understand, procure, deploy, and oversee AI systems across
        government.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our assessment, based on interviews with 40 senior civil servants across
        12 departments and analysis of government AI procurement data, reveals a
        significant gap between ambition and capability. Whitehall lacks the
        technical talent, procurement frameworks, and institutional culture
        needed to be a sophisticated consumer — let alone regulator — of AI
        systems.
      </p>

      <h2 id="capability-gap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The capability gap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The fundamental challenge is not that government doesn&rsquo;t want to
        use AI — it&rsquo;s that most departments lack the in-house expertise to
        evaluate AI products, specify requirements, manage implementation, or
        assess outcomes. This creates dependency on vendors and consultancies
        whose incentives may not align with public interest outcomes.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our interviews reveal a consistent pattern: enthusiastic ministerial
        commitment to AI adoption, followed by procurement processes that take
        18&ndash;24 months, implementation by external contractors with limited
        knowledge transfer, and evaluation frameworks that measure inputs (money
        spent, systems deployed) rather than outcomes (services improved,
        decisions enhanced).
      </p>

      <h2 id="procurement-problem" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. The procurement problem
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Government procurement frameworks were designed for buying defined
        products and services. AI systems are neither. They require iterative
        development, ongoing refinement based on deployment context, and
        continuous evaluation as capabilities change. The mismatch between
        traditional procurement and AI deployment is a structural barrier to
        effective government AI adoption.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Analysis of 50 government AI procurement exercises reveals that average
        time from identification of need to operational deployment is 26 months.
        In the private sector, equivalent deployments average 6&ndash;9 months.
        The gap is not primarily due to appropriate caution or democratic
        accountability — it reflects procurement processes that are simply not
        designed for the technology they are trying to acquire.
      </p>

      <h2 id="talent-pipeline" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. The talent pipeline
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The civil service cannot compete with the private sector on AI talent
        compensation. This is well known. What is less discussed is that the
        problem extends beyond salary: career structures, working practices,
        and organisational culture all make government a less attractive
        environment for technologists than it needs to be.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Government does not need to match private sector salaries for every
        technical role. But it needs to offer competitive compensation for a
        critical mass of senior technical leaders who can evaluate, oversee,
        and direct AI programmes — and it needs to create career pathways
        that don&rsquo;t force technologists into general management to advance.
      </p>

      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our recommendations focus on building lasting institutional capability
        rather than one-off investments. First, create the cross-departmental AI
        Delivery Unit described above, modelled on the Government Digital Service
        but focused specifically on AI adoption. Second, reform the Technology
        Code of Practice to include AI-specific procurement guidance. Third,
        establish an AI Technical Leadership Programme offering competitive
        compensation for senior technologists in government.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted">
        Fourth, mandate that all departments with significant AI exposure
        maintain a minimum ratio of in-house technical staff to external
        contractors on AI projects, ensuring knowledge transfer and reducing
        vendor dependency. The goal is a state that is a sophisticated,
        informed consumer of AI — not merely a passive recipient of
        vendor-driven solutions.
      </p>
    </BriefLayout>
  );
}
