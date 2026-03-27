import type { Metadata } from "next";
import BriefLayout from "@/components/BriefLayout";

export const metadata: Metadata = {
  title: 'Why "AI regulation" is the wrong frame — AI Policy Exchange',
  description: "AI governance is not about constraining a static technology — it\u2019s about building institutional capacity to manage a transition already underway.",
};

const sections = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "regulation-trap", title: "1. The regulation trap" },
  { id: "governance-alternative", title: "2. The governance alternative" },
  { id: "institutional-capacity", title: "3. Building institutional capacity" },
  { id: "policy-recommendations", title: "4. Policy recommendations" },
];

export default function AIRegulationWrongFrame() {
  return (
    <BriefLayout
      tag="Governance"
      date="March 2026"
      readTime="10 min read"
      title='Why "AI regulation" is the wrong frame — and what to do instead'
      subtitle="AI governance is not about constraining a static technology — it&rsquo;s about building institutional capacity to manage a transition already underway."
      sections={sections}
      recommendation={{
        title: "Key recommendation",
        body: "The UK should establish an AI Governance Capacity Unit within the Cabinet Office, tasked with building cross-departmental competence in AI oversight rather than creating new regulatory bodies for individual AI applications.",
      }}
    >
      <h2 id="executive-summary" className="text-[24px] font-normal leading-[34px] mb-6">
        Executive Summary
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The dominant framing of AI policy as a question of &ldquo;regulation&rdquo;
        is actively unhelpful. It implies that the primary task is to constrain a
        defined technology within legal boundaries — an approach that worked
        tolerably for previous technologies but fails fundamentally for AI.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        AI is not a single technology to be regulated but a general-purpose
        capability transforming every sector simultaneously. The challenge is not
        writing rules for AI but building the institutional capacity to govern a
        transition. This brief argues for reframing the conversation from
        regulation to governance, and sets out what that means in practice.
      </p>

      <h2 id="regulation-trap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The regulation trap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The instinct to &ldquo;regulate AI&rdquo; is understandable but
        misguided. It assumes AI is a product category like pharmaceuticals or
        financial instruments — something that can be tested, approved, and
        monitored within a defined framework. But AI capabilities are evolving
        faster than any regulatory process can respond, deploying across sectors
        with entirely different risk profiles, and often embedded within existing
        products in ways that make &ldquo;AI-specific&rdquo; rules difficult to
        define or enforce.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The EU AI Act illustrates the limitations of the regulatory approach.
        While comprehensive in ambition, it faces fundamental challenges in
        implementation: risk categories defined at the time of drafting are
        already obsolete, compliance requirements presume a model deployment
        pipeline that doesn&rsquo;t match how AI systems are actually built and
        iterated, and enforcement mechanisms lack the technical capacity to audit
        complex AI systems at scale.
      </p>

      <h2 id="governance-alternative" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. The governance alternative
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Governance is broader than regulation. Where regulation asks &ldquo;what
        rules should we write?&rdquo;, governance asks &ldquo;what institutions,
        processes, and capabilities do we need to manage this transition
        well?&rdquo; This reframing opens up a much more productive set of policy
        options.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Effective AI governance requires capability across three dimensions:
        technical literacy sufficient to understand what AI systems actually do;
        institutional processes flexible enough to respond to rapidly changing
        capabilities; and cross-sector coordination mechanisms that prevent
        fragmented, contradictory approaches across government departments.
      </p>

      <h2 id="institutional-capacity" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. Building institutional capacity
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK&rsquo;s &ldquo;pro-innovation&rdquo; approach to AI — delegating
        oversight to existing sectoral regulators — has the right instinct but
        lacks the infrastructure to succeed. Most regulators do not have the
        technical staff, the procurement budgets, or the organisational culture to
        absorb AI oversight into their existing mandates.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        What is needed is not a new AI regulator but a central capacity-building
        function that equips existing institutions to govern AI within their
        domains. This means technical secondments, shared evaluation
        infrastructure, common standards for AI impact assessment, and a
        coordinating body that identifies governance gaps before they become
        crises.
      </p>

      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        We propose four immediate actions: first, establish the AI Governance
        Capacity Unit within the Cabinet Office; second, create a technical
        secondment programme placing AI engineers within key regulatory bodies for
        12-month rotations; third, develop shared AI evaluation infrastructure
        that regulators can access without each building their own; and fourth,
        mandate annual AI governance readiness assessments for all departments
        with significant AI exposure.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted">
        These interventions are deliberately institutional rather than
        legislative. The UK does not need more AI laws — it needs the capacity to
        govern AI well within existing legal frameworks, adapting as the
        technology evolves.
      </p>
    </BriefLayout>
  );
}
