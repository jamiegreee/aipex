import type { Metadata } from "next";
import BriefLayout from "@/components/BriefLayout";

export const metadata: Metadata = {
  title: "What the AI transition means for the UK labour market — AI Policy Exchange",
  description: "The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows.",
};

const sections = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "exposure-landscape", title: "1. The exposure landscape" },
  { id: "adoption-speed", title: "2. Adoption speed vs capability" },
  { id: "distributional-effects", title: "3. Distributional effects" },
  { id: "policy-recommendations", title: "4. Policy recommendations" },
];

export default function AILabourMarket() {
  return (
    <BriefLayout
      tag="Economy & Labour"
      date="March 2026"
      readTime="12 min read"
      title="What the AI transition means for the UK labour market — beyond the headlines"
      subtitle="The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows."
      sections={sections}
      recommendation={{
        title: "Key recommendation",
        body: "The government should establish a standing AI Labour Market Observatory within DSIT, combining real-time employer survey data with sector-level AI exposure modelling to inform workforce policy before disruption materialises.",
      }}
    >
      <h2 id="executive-summary" className="text-[24px] font-normal leading-[34px] mb-6">
        Executive Summary
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK labour market faces significant disruption from AI adoption over
        the next five to ten years. But the picture is more nuanced than either
        the optimists or pessimists suggest. Our analysis of sector-level
        exposure data, employer surveys, and international comparisons points to
        three key findings.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        First, the most exposed sectors are not the ones making headlines.
        Professional services, financial services, and public administration face
        higher near-term disruption than manufacturing or logistics. Second, the
        speed of adoption matters more than the theoretical capability of AI
        systems. Institutional inertia, regulation, and procurement friction will
        slow deployment in exactly the sectors that need it most. Third, the
        distributional effects are regressive: AI is more likely to augment
        high-skill work and replace mid-skill work, widening inequality unless
        policy intervenes.
      </p>

      <h2 id="exposure-landscape" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The exposure landscape
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        When the government talks about AI and the labour market, it tends to
        default to aggregate statistics: &ldquo;AI will affect X% of jobs.&rdquo;
        These numbers are almost useless for policymaking. What matters is which
        jobs, in which sectors, at what speed, and with what distributional
        consequences.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our analysis draws on three data sources: the OECD&rsquo;s AI exposure
        index disaggregated to UK SIC codes, the ONS Business Insights and
        Conditions Survey data on AI adoption, and a new dataset from the AI
        Policy Exchange surveying 200 UK employers on their AI deployment
        timelines.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The results reveal a striking mismatch between public narrative and
        empirical reality. While media coverage focuses overwhelmingly on
        blue-collar automation, the data shows that white-collar professional
        services face the most immediate disruption. Legal services, accounting,
        financial analysis, and administrative functions within the public sector
        show the highest exposure scores when combining capability assessment
        with adoption readiness indicators.
      </p>

      <h2 id="adoption-speed" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. Adoption speed vs capability
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        A common mistake in AI labour market analysis is to conflate what AI can
        theoretically do with what organisations will actually deploy. The gap
        between capability and adoption is where policy has the most leverage —
        and where current UK strategy is weakest.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our employer survey reveals that even among firms that have identified
        high-impact AI use cases, average deployment timelines extend 18&ndash;36
        months beyond initial expectations. The primary barriers are not
        technical but institutional: procurement processes designed for software
        licences not AI systems, risk-averse management cultures, skills gaps in
        middle management, and regulatory uncertainty.
      </p>

      <h2 id="distributional-effects" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. Distributional effects
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The most concerning finding in our analysis relates to distributional
        impact. Contrary to the optimistic narrative that AI will &ldquo;lift all
        boats,&rdquo; the evidence points to a pattern of regressive disruption.
        High-skill workers in exposed sectors are more likely to see their
        productivity augmented, while mid-skill workers face displacement without
        clear pathways to equivalent employment.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This pattern is already visible in early-adopting sectors. In financial
        services, senior analysts are using AI tools to increase output, while
        junior analyst roles are being consolidated. The net effect is fewer
        entry points into professional careers, with implications for social
        mobility that extend well beyond the immediate labour market.
      </p>

      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Current UK policy treats AI workforce disruption as a skills problem to
        be solved by retraining programmes. This framing is incomplete. While
        skills investment is necessary, it is insufficient without institutional
        infrastructure for monitoring, anticipating, and managing transition at
        the sectoral level.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted">
        We recommend four interventions: establishing the AI Labour Market
        Observatory described above; mandating AI impact assessments for public
        sector procurement above a threshold value; creating sector-specific
        transition frameworks developed jointly by industry, unions, and
        government; and reforming the Apprenticeship Levy to support AI-adjacent
        reskilling within firms experiencing rapid adoption.
      </p>
    </BriefLayout>
  );
}
