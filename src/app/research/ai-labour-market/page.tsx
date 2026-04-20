import type { Metadata } from "next";
import BriefLayout from "@/components/BriefLayout";
import { Ref, Footnotes } from "@/components/Footnotes";

export const metadata: Metadata = {
  title: "What the AI transition means for the UK labour market — AI Policy Exchange",
  description: "The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows.",
};

const sections = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "exposure-landscape", title: "1. The exposure landscape" },
  { id: "sector-level-analysis", title: "2. Sector-level analysis" },
  { id: "adoption-gap", title: "3. The adoption gap" },
  { id: "distributional-effects", title: "4. Distributional effects" },
  { id: "international-comparisons", title: "5. International comparisons" },
  { id: "policy-recommendations", title: "6. Policy recommendations" },
];

export default function AILabourMarket() {
  return (
    <BriefLayout
      tag="Economy & Labour"
      date="March 2026"
      readTime="25 min read"
      title="What the AI transition means for the UK labour market — beyond the headlines"
      subtitle="The debate about AI and jobs oscillates between utopian and apocalyptic. Neither is useful. This brief examines what the evidence actually shows — sector by sector, occupation by occupation — and proposes a framework for policy that matches the complexity of the challenge."
      sections={sections}
      recommendation={{
        title: "Key recommendation",
        body: "The government should establish a standing AI Labour Market Observatory within DSIT, combining real-time employer survey data with sector-level AI exposure modelling, and mandate AI workforce impact assessments for all public sector procurement contracts above £10 million. Without institutional infrastructure for monitoring and anticipating disruption, policy will remain permanently reactive.",
      }}
    >
      {/* ── Executive Summary ── */}
      <h2 id="executive-summary" className="text-[24px] font-normal leading-[34px] mb-6">
        Executive Summary
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK labour market faces significant structural disruption from AI
        over the next five to ten years. The picture is more nuanced than
        either the optimists or pessimists suggest. Drawing on DSIT&rsquo;s
        2025 AI Activity in UK Business survey,<Ref n={1} /> ONS labour force
        microdata,<Ref n={2} /> OECD exposure indices disaggregated to UK
        Standard Industrial Classification codes,<Ref n={3} /> and an original
        AI Policy Exchange survey of 420 UK employers,<Ref n={4} /> this brief
        identifies three structural dynamics that current policy is failing to
        address.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        First, the most exposed sectors are not the ones making headlines.
        Professional services (SIC 69&ndash;71), financial services (SIC
        64&ndash;66), and public administration (SIC 84) face higher near-term
        disruption than manufacturing or logistics. Roughly 61% of task-hours
        in professional services are technically exposed to current-generation
        large language models and adjacent AI systems, compared with 28% in
        manufacturing.<Ref n={3} /> Public discourse, and policy attention,
        remains fixated on blue-collar automation scenarios inherited from the
        robotics era.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, we introduce an AI Exposure&ndash;Adoption Matrix, which plots
        sectors along two dimensions: technical exposure to AI capability and
        organisational readiness to adopt. The matrix shows something
        important. The sectors where AI could deliver the greatest
        productivity gains, public administration, health, and education, are
        precisely those where institutional friction, procurement complexity,
        and risk aversion produce the slowest adoption. We call it the
        &ldquo;procurement paradox.&rdquo; It is a market failure only
        coordinated policy intervention can fix.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, the distributional effects of AI adoption follow a regressive
        pattern we describe as the &ldquo;mid-skill squeeze.&rdquo; AI augments
        the productivity of high-skill workers who can direct and interpret
        its outputs. It automates routine low-skill tasks that were already
        low-wage. It eliminates mid-skill roles (paralegal, junior analyst,
        claims assessor, procurement officer) that have historically been
        entry points into professional careers. The ONS Annual Survey of Hours
        and Earnings already shows that median earnings growth in the most
        AI-exposed mid-skill occupations has fallen 1.8 percentage points
        below the economy-wide average since 2023.<Ref n={5} /> Unless policy
        intervenes, the dynamic will narrow the pipeline of social mobility at
        exactly the moment the government claims to be widening it.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This brief runs in six sections. Section 1 maps the exposure landscape
        across UK sectors and occupations. Section 2 runs granular
        sector-level analysis of the five most affected industries. Section 3
        examines the adoption gap between theoretical capability and
        organisational deployment, and introduces the Exposure&ndash;Adoption
        Matrix. Section 4 analyses distributional effects, with particular
        attention to the mid-skill squeeze. Section 5 benchmarks UK
        preparedness against comparator economies. Section 6 closes with six
        policy recommendations calibrated to the evidence.
      </p>

      {/* ── 1. The exposure landscape ── */}
      <h2 id="exposure-landscape" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The exposure landscape
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        When the government talks about AI and the labour market, it tends to
        default to aggregate statistics: &ldquo;AI could affect 10&ndash;30%
        of jobs.&rdquo; These headline numbers, typically drawn from studies
        by Goldman Sachs, McKinsey, or the IMF,<Ref n={6} /> are almost
        useless for policymaking. They conflate exposure with displacement,
        ignore the gap between tasks and jobs, and treat the economy as a
        homogeneous mass. Policy needs to know which jobs, in which sectors,
        at what speed, and with what distributional consequences. This section
        tries to provide that granularity.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our analysis draws on four data sources: the OECD&rsquo;s 2025 AI
        exposure index disaggregated to two-digit UK SIC codes using ONS
        workforce composition data;<Ref n={3} /> the ONS Business Insights and
        Conditions Survey (BICS) waves 120&ndash;128, which now include
        questions on AI adoption;<Ref n={7} /> DSIT&rsquo;s AI Activity in UK
        Business survey, covering 2,000 firms across all sectors;<Ref n={1} />
        and an original AI Policy Exchange dataset surveying 420 UK employers
        on their AI deployment timelines, use cases, and perceived barriers.<Ref n={4} />
        The employer survey was conducted between September and November 2025
        and deliberately oversampled mid-sized firms (50&ndash;249 employees),
        which make up the bulk of UK private-sector employment but are
        underrepresented in existing research.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The results show a sharp mismatch between public narrative and
        empirical reality. The five sectors with the highest task-level AI
        exposure scores: financial and insurance activities (SIC 64&ndash;66)
        at 64% of task-hours exposed; professional, scientific, and technical
        activities (SIC 69&ndash;75) at 61%; information and communication
        (SIC 58&ndash;63) at 59%; public administration and defence (SIC 84)
        at 53%; administrative and support services (SIC 77&ndash;82) at 48%.<Ref n={3} />
        By contrast, manufacturing (SIC 10&ndash;33) scores 28%, construction
        (SIC 41&ndash;43) scores 19%, and accommodation and food services (SIC
        55&ndash;56) scores just 14%.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        &ldquo;Exposure&rdquo; is not the same as &ldquo;displacement.&rdquo;
        A task being technically performable by an AI system does not mean it
        will be automated in practice. Whether exposure translates into job
        loss, transformation, or augmentation depends on a web of factors:
        the cost of the AI system relative to labour, the regulatory
        environment, the degree of client or patient trust required, the
        presence of complementary human skills, and the organisation&rsquo;s
        capacity to integrate new tools. Our framework distinguishes three
        modes of AI impact on any given occupation: substitution (the task is
        automated and the role eliminated or consolidated), augmentation (the
        task is AI-assisted and the worker becomes more productive), and
        restructuring (the task is automated but the role is redesigned
        around higher-value activities).
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Apply that three-way framework to the OECD exposure data and the
        picture gets more actionable. Of the 61% of task-hours exposed in
        professional services, we estimate that roughly 15% fall into
        substitution, 32% into augmentation, and 14% into restructuring.<Ref n={8} />
        The substitution share is highest in administrative and support
        services (22% of task-hours), where routine document processing,
        scheduling, and data entry face direct AI replacement with little
        need for human judgement. It is lowest in health and social care
        (7%), where regulatory requirements, patient trust, and physical-world
        interaction constrain automation even where the technical capability
        exists.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The geographic distribution of exposure adds a further dimension.
        London and the South East, with their concentration of financial and
        professional services, have the highest aggregate exposure: 52% of
        task-hours across all sectors, compared with 34% in the North East and
        31% in Wales.<Ref n={9} /> The capacity to absorb disruption is also
        highest in London, where labour market dynamism, retraining
        infrastructure, and job creation in AI-adjacent roles partially offset
        displacement risk. The regions most at risk of net negative outcomes
        are those with moderate exposure concentrated in a narrow range of
        sectors: the East Midlands, and Yorkshire and the Humber, where public
        administration and administrative services account for a
        disproportionate share of mid-skill employment. A purely national
        policy response will miss these regional asymmetries entirely.
      </p>

      {/* ── 2. Sector-level analysis ── */}
      <h2 id="sector-level-analysis" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. Sector-level analysis
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        To get beyond aggregate exposure scores, we ran detailed analysis on the
        five sectors most affected by current AI systems. Each one combines
        exposure, adoption speed, workforce composition, and policy constraint
        differently. The analysis below draws on our employer survey data
        alongside published ONS and DSIT statistics.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Financial and insurance activities (SIC 64&ndash;66).</strong> UK
        financial services employs roughly 1.1 million people and contributes
        8.3% of economic output.<Ref n={10} /> It is the most exposed sector, and
        it is adopting fastest. DSIT&rsquo;s survey found that 68% of financial
        services firms with more than 50 employees had deployed at least one AI
        system by mid-2025, against a cross-economy average of 34%.<Ref n={1} />
        The dominant use cases are fraud detection (used by 81% of adopters),
        customer service automation (74%), credit risk assessment (62%), and
        regulatory compliance monitoring (58%). Our employer survey found the
        median large financial services firm expects a 12&ndash;18% headcount
        reduction in operations and middle-office functions by 2029, partly
        offset by growth in AI engineering, data science, and compliance.<Ref n={4} />
        The net employment effect is estimated at &minus;7 to &minus;9% of
        current sector headcount. The roles being cut are disproportionately in
        the &pound;28,000&ndash;&pound;45,000 mid-skill band that acts as the
        entry ramp into financial careers for graduates outside the Russell
        Group.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Professional, scientific, and technical activities (SIC
        69&ndash;75).</strong> This sector covers legal services, accounting,
        management consultancy, architecture, and engineering, and employs around
        2.9 million people across the UK. AI exposure is high (61% of
        task-hours) but adoption is bifurcated. Large firms in the &ldquo;Big
        Four&rdquo; and Magic Circle have invested heavily. PwC alone has
        committed &pound;1 billion to AI deployment across its global operations.<Ref n={11} />
        The sector is dominated by SMEs, though. 94% of firms have fewer than 50
        employees, and our survey found that only 19% of small professional
        services firms had deployed any AI system beyond basic productivity
        tools like email summarisation.<Ref n={4} /> The most affected
        occupations are junior legal researchers, trainee accountants, and
        associate-level management consultants, where AI can now do in minutes
        what used to take days of document review, data compilation, or slide
        assembly. The Law Society reported in January 2026 that training
        contract offers from Top 50 firms fell 14% year-on-year, the first
        decline not attributable to an economic downturn.<Ref n={12} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Public administration and defence (SIC 84).</strong> The public
        sector is the starkest example of what we call the procurement paradox.
        53% of task-hours are exposed to AI, overwhelmingly in document
        processing, casework management, correspondence handling, and internal
        reporting. The productivity gains from adoption would be enormous: the
        National Audit Office estimated in its February 2026 report that
        AI-driven automation of routine admin tasks across central government
        could yield &pound;3.6&ndash;5.2 billion in annual efficiency savings.<Ref n={13} />
        And yet adoption is glacial. Only 22% of central government departments
        reported operational AI deployment in DSIT&rsquo;s survey, and for local
        authorities the figure is just 11%.<Ref n={1} /> The barriers are
        institutional rather than technical: procurement frameworks designed for
        traditional IT contracts with fixed specifications, the Government
        Digital Service&rsquo;s cautious approach to algorithmic decision-making
        after the A-level grading controversy, data sharing restrictions between
        departments, and a civil service workforce where 67% of employees over
        50 report low confidence in using AI tools, according to the Cabinet
        Office&rsquo;s 2025 People Survey.<Ref n={14} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Information and communication (SIC 58&ndash;63).</strong> The
        technology sector is both the creator and a significant target of AI
        disruption. The 59% exposure score reflects how much of the work
        (software development, content creation, data analysis, customer
        support) current AI systems can do partially or fully. What sets this
        sector apart is the speed of adoption: 79% of firms in our survey had
        deployed AI in core production workflows.<Ref n={4} /> The workforce
        effects are already visible. Stack Overflow&rsquo;s 2025 Developer
        Survey found that 43% of UK developers reported their teams had shrunk
        over the past year despite stable or growing output.<Ref n={15} /> Junior
        software engineering roles, historically the most common entry point for
        computer science graduates, are being restructured around AI-assisted
        workflows that need fewer people with more experience. Graduate hiring
        in the UK tech sector fell 23% between 2024 and 2025, per the Institute
        of Student Employers.<Ref n={16} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Health and social care (SIC 86&ndash;88).</strong> Health is a
        paradox of a different kind. Technical exposure is moderate (37% of
        task-hours), concentrated in diagnostic imaging, clinical documentation,
        appointment scheduling, and back-office admin. The clinical case for AI
        adoption is overwhelming. NHS England&rsquo;s own analysis suggests
        AI-assisted triage and diagnostics could cut average wait times by
        18&ndash;22% in high-volume specialties.<Ref n={17} /> But adoption faces
        the most formidable barriers of any sector. MHRA regulatory pathways for
        AI-as-medical-device remain slow, with a median approval time of 14
        months. NHS procurement cycles average 24&ndash;36 months from business
        case to deployment. Clinical staff resistance is significant: the
        BMA&rsquo;s 2025 survey found that 52% of consultants were
        &ldquo;concerned&rdquo; or &ldquo;very concerned&rdquo; about AI in
        clinical decision-making, even while 71% acknowledged its potential to
        reduce administrative burden.<Ref n={18} /> The result is a sector where
        the back-office productivity gains are real and achievable, but the
        transformative clinical applications remain years from deployment at
        scale.
      </p>

      {/* ── 3. The adoption gap ── */}
      <h2 id="adoption-gap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. The adoption gap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        A common and consequential mistake in AI labour market analysis is to
        conflate what AI can theoretically do with what organisations will
        actually deploy. The gap between capability and adoption is where policy
        has the most leverage, and where current UK strategy is weakest. We
        propose a structured framework for thinking about that gap: the AI
        Exposure&ndash;Adoption Matrix.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The matrix plots sectors along two axes. The horizontal axis measures
        technical exposure: the share of task-hours in a sector that current AI
        systems can perform at or above the level of a median human worker. The
        vertical axis measures adoption readiness, a composite index combining
        five factors (digital infrastructure maturity, management AI literacy,
        regulatory permissiveness, procurement agility, and workforce
        receptiveness) each scored on a 0&ndash;100 scale using data from our
        employer survey and published indices.<Ref n={4} /> The four quadrants
        that fall out of this each pose a different policy challenge.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The upper-right quadrant (high exposure, high adoption readiness)
        contains financial services and the technology sector. These sectors
        will largely manage their own transitions, driven by competitive
        pressure and existing digital capabilities. The policy priority here is
        distributional: making sure the gains from AI-driven productivity are
        not captured entirely by capital and senior employees, and that
        displaced mid-skill workers have viable transition pathways. The
        lower-right quadrant (high exposure, low adoption readiness) is where
        the procurement paradox is most acute. Public administration, health,
        and education sit here, with enormous potential for AI-driven
        productivity improvement but institutional friction that delays
        deployment by years or even decades.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The upper-left quadrant (low exposure, high adoption readiness) includes
        sectors like retail and hospitality, where AI deployment is concentrated
        in narrow applications (inventory optimisation, dynamic pricing,
        chatbot-based customer service) but most of the workforce performs
        physical-world tasks that remain out of AI reach. The policy challenge
        here is modest. The lower-left quadrant (low exposure, low adoption
        readiness) contains construction, agriculture, and parts of
        manufacturing. These sectors face minimal near-term AI disruption,
        though robotics and autonomous systems may shift them rightward over a
        longer time horizon.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our employer survey gives granular data on the barriers driving low
        adoption readiness. Among firms that had identified at least one
        high-impact AI use case but had not yet deployed, the reported barriers
        were: lack of internal AI/data science skills (73% of respondents),
        uncertainty about regulatory requirements (61%), procurement and
        contracting processes not designed for AI systems (58%), concerns about
        data quality or availability (54%), inability to build a compelling
        business case given uncertainty about benefits (49%), and senior
        leadership scepticism or risk aversion (41%). Cost was cited by only 29%
        of respondents. The barrier is institutional, not financial.<Ref n={4} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The temporal dimension of the adoption gap is critical for workforce
        planning. Our survey asked firms with active AI deployment plans to
        estimate the gap between initial pilot and full operational deployment.
        The median response was 22 months, but the variance was enormous:
        technology firms reported a median of 8 months, financial services 14
        months, professional services 19 months, and public sector bodies 38
        months.<Ref n={4} /> Which means the labour market effects of the same
        underlying AI capability will land in different sectors at very
        different times. It is a rolling wave of disruption, not a single
        shock. Current policy treats AI labour market disruption as one event
        to prepare for, rather than a staggered process to manage in real time.
      </p>

      {/* ── 4. Distributional effects ── */}
      <h2 id="distributional-effects" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Distributional effects
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The most concerning finding in our analysis is about the distributional
        impact of AI adoption across the skill and income distribution. The
        optimistic story says AI will &ldquo;lift all boats&rdquo; by raising
        economy-wide productivity. The evidence points the other way, to a
        pattern of regressive disruption that we call the &ldquo;mid-skill
        squeeze.&rdquo;<Ref n={19} /> Any policy response that takes equity
        seriously needs to start here.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Here is how the mid-skill squeeze works. At the top of the skill
        distribution, AI acts mainly as an augmentation tool. Senior lawyers use
        AI to review contracts faster. Experienced analysts use it to process
        larger datasets. Consultants use it to generate first drafts that they
        then refine with expert judgement. These workers become more
        productive, and early evidence suggests their compensation reflects
        this. ONS data shows that earnings in the top decile of AI-exposed
        professional occupations grew 6.2% in real terms between 2023 and 2025,
        against 2.1% across all professional occupations.<Ref n={5} /> At the
        bottom of the skill distribution, AI automates routine tasks (data
        entry, basic scheduling, form processing) that were already low-paid.
        The workers displaced from these roles usually move laterally into
        other low-skill service work. The impact is real, but the absolute
        earnings loss is modest, and the workers affected were already covered
        by the existing social safety net.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The mid-skill band, roughly the second and third earnings quartiles
        (annual salaries of &pound;25,000&ndash;&pound;50,000), bears the
        concentrated impact. These roles combine routine cognitive work, which
        AI can automate, with judgement and client interaction, which AI
        cannot yet replicate. In previous technological transitions that
        combination made such roles relatively secure. But current AI systems
        are specifically good at the routine cognitive component: summarising
        documents, drafting correspondence, doing standardised analysis,
        managing workflows. Once that component is automated, the remaining
        tasks often do not justify a full-time role. Or they get absorbed by
        the senior professionals whom AI has made more productive.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        You can already see this in early-adopting sectors. In financial
        services, the ratio of junior to senior analysts at large UK investment
        banks has shifted from roughly 4:1 in 2022 to 2.5:1 in 2025, according
        to data compiled from Financial Conduct Authority regulatory
        filings.<Ref n={20} /> In the legal sector, the number of paralegal
        positions advertised on the three largest UK legal recruitment
        platforms fell 31% between Q1 2024 and Q1 2026, even as demand for
        qualified solicitors remained stable.<Ref n={12} /> The Big Four
        accounting firms have collectively cut their UK graduate intake by
        about 18% since 2023, while hiring more for AI and data roles.<Ref n={21} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The social mobility implications are serious. Mid-skill professional
        roles (trainee accountant, junior solicitor, associate consultant,
        junior analyst) have historically been the main way graduates from
        non-elite backgrounds enter professional careers. The Social Mobility
        Commission&rsquo;s 2024 report found that 62% of professionals from
        working-class backgrounds entered their current sector through exactly
        these mid-skill entry points.<Ref n={22} /> If AI eliminates or
        drastically reduces these roles, the career ladder does not just lose a
        rung. It loses the rung that the broadest range of people could reach.
        The professional labour market that results looks more like an
        hourglass: a large base of low-skill service work, a large top of
        high-skill AI-augmented professionals, and a hollowed-out middle that
        used to be the bridge between the two.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The geographic dimension makes the inequality worse. DWP Stat-Xplore
        data shows that the mid-skill roles most exposed to AI (administrative
        officers, accounting technicians, legal secretaries, insurance
        underwriters) are disproportionately concentrated outside London.<Ref n={23} />
        44% of high-skill AI-augmented roles (data scientists, AI engineers,
        senior analysts) are located in London and the South East, but only
        27% of the mid-skill roles they are displacing are based in the same
        region. The net effect is a geographic transfer of labour market value
        from the regions to the capital, layered on top of an already severe
        regional productivity gap.
      </p>

      {/* ── 5. International comparisons ── */}
      <h2 id="international-comparisons" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        5. International comparisons
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK is not dealing with AI-driven labour market disruption in
        isolation. Its policy response should be informed by what comparator
        economies are doing, and also by what they are getting wrong. We
        benchmark the UK against five comparator jurisdictions: the United
        States, the European Union (with particular attention to Germany and
        France), Singapore, Canada, and South Korea. The comparison runs across
        four dimensions: exposure profile, adoption speed, institutional
        response, and workforce transition infrastructure.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        On exposure, the UK&rsquo;s profile is among the most concentrated in
        the OECD. Its services-heavy economy means 71% of employment is in
        sectors with above-median AI exposure, against 63% in Germany, 58% in
        France, 67% in the United States, and 74% in Singapore.<Ref n={24} />
        Only Singapore, with its even more concentrated services-and-finance
        economy, has a higher share. The OECD&rsquo;s 2025 Employment Outlook
        ranks the UK third among G7 nations for aggregate AI task exposure,
        behind only the United States and Canada.<Ref n={24} /> This is a direct
        consequence of the UK&rsquo;s post-industrial economic structure.
        Decades of shifting away from manufacturing towards knowledge-intensive
        services has left the economy disproportionately exposed to exactly the
        capabilities that large language models and adjacent systems now have.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        On adoption speed, the UK sits in an uncomfortable middle position. It
        lags behind the United States, where adoption is driven by aggressive
        private-sector investment and a permissive regulatory environment. The
        Stanford HAI AI Index 2026 reports that 52% of US firms with over 250
        employees had deployed AI in core business processes by the end of
        2025, against 41% of equivalent UK firms.<Ref n={25} /> But the UK is
        ahead of the EU average of 29%, where the AI Act&rsquo;s classification
        and compliance requirements have created what European Commission
        surveys describe as a &ldquo;regulatory chill&rdquo; in high-risk
        application domains. Singapore leads all comparators at 61%, reflecting
        its aggressive National AI Strategy 2.0, which includes direct
        co-investment in enterprise AI deployment.<Ref n={26} /> The UK&rsquo;s
        position (faster than Europe, slower than the US and Singapore) means
        it captures a moderate share of AI productivity gains while still
        copping the full displacement effects from competitor economies that
        adopt faster.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Institutional responses vary dramatically. The United States has
        largely treated AI labour market adjustment as a private-sector
        problem, with limited federal workforce transition support beyond
        existing programmes. The EU has focused on regulation and worker
        protection, embedding AI workforce provisions in the AI Act and
        proposing a directive on algorithmic management. Germany has taken a
        sectoral approach. Its Federal Employment Agency funds 47
        sector-specific AI transition programmes in partnership with industry
        associations and trade unions.<Ref n={27} /> France has invested heavily
        in AI skills through its France 2030 programme, allocating &euro;2.2
        billion to AI training and reskilling between 2023 and 2028.<Ref n={28} />
        South Korea&rsquo;s Digital New Deal includes a dedicated AI Workforce
        Transition Fund of &dollar;1.3 billion over five years, with
        individual training accounts for workers in exposed sectors.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK&rsquo;s institutional response, by contrast, has been fragmented
        and reactive. Responsibility is split across multiple departments: DSIT
        leads on AI policy, DWP on employment support, the Department for
        Education on skills, and HM Treasury on fiscal implications. No single
        body has a mandate to monitor, anticipate, and coordinate the workforce
        transition. The Apprenticeship Levy, the main existing instrument for
        employer-led training, is widely acknowledged to be poorly suited to AI
        reskilling. Its rigid standards framework, 12-month minimum duration
        requirement, and limited eligibility for modular or short-course
        training make it ill-adapted to the rapid, iterative skill development
        that AI adoption demands.<Ref n={29} /> The UK Commission for Employment
        and Skills was abolished in 2017 and has not been replaced with any
        equivalent strategic body.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The most instructive comparison is probably Singapore&rsquo;s
        SkillsFuture programme, which gives all citizens aged 25 and above a
        &dollar;S500 credit (topped up periodically) for approved training
        courses, with sector-specific transition support for workers in
        AI-exposed industries on top. The programme has achieved 67% uptake
        among workers in high-exposure sectors, against roughly 12%
        participation in equivalent DWP-funded skills programmes in the UK.<Ref n={30} />
        The gap is partly structural. Singapore&rsquo;s programme is universal
        and individual-led, while UK programmes are employer-mediated and
        means-tested. It is also partly cultural: Singapore&rsquo;s government
        has invested heavily in public communication that frames AI workforce
        transition as an opportunity rather than a threat. The UK can learn
        from this model without copying it wholesale, and we come back to this
        point in our policy recommendations.
      </p>

      {/* ── 6. Policy recommendations ── */}
      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        6. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Current UK policy treats AI workforce disruption mainly as a skills
        problem, to be solved by retraining programmes. That framing is
        incomplete. Left uncorrected, it will produce a policy response that is
        permanently behind the curve. Skills investment is necessary, but it is
        not enough without institutional infrastructure for monitoring,
        anticipating, and managing transition at sector level. Our six
        recommendations are designed to fill that gap. They are sequenced by
        urgency and calibrated to the fiscal and institutional constraints any
        realistic policy proposal has to acknowledge.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 1: Establish the AI Labour Market
        Observatory.</strong> DSIT should create a standing analytical unit
        combining real-time employer survey data, ONS labour force microdata,
        HMRC PAYE real-time information, and sector-level AI exposure modelling.
        The Observatory should publish quarterly dashboards disaggregated by
        sector, region, and occupation, and feed early-warning indicators to DWP
        Jobcentre Plus and local authorities. Estimated annual cost:
        &pound;8&ndash;12 million. That is trivial compared with the cost of
        reactive employment support after displacement has already happened.
        Germany&rsquo;s IAB (Institute for Employment Research) is a proven
        model for this kind of standing labour market intelligence, and its
        AI-focused analysis has demonstrably shaped the Bundesagentur f&uuml;r
        Arbeit&rsquo;s transition programmes.<Ref n={27} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 2: Mandate AI workforce impact assessments for
        public sector procurement.</strong> All public sector procurement
        contracts above &pound;10 million that involve AI systems should be
        required to include a workforce impact assessment, modelled on
        environmental impact assessments. The assessment should estimate the
        number and type of roles affected, the timeline for impact, and the
        mitigation measures being taken: redeployment, retraining, and
        transition support. This does two things at once. It makes sure
        government itself accounts for the workforce consequences of its own
        adoption decisions, and it creates a data stream for the Observatory.
        The Cabinet Office&rsquo;s existing Social Value Model is a foundation
        that could be extended to cover AI workforce considerations without
        building an entirely new compliance framework.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 3: Reform the Apprenticeship Levy into an AI-era
        Skills Levy.</strong> The current Apprenticeship Levy should be reformed
        to let employers spend on short-course, modular AI reskilling programmes
        accredited by a new fast-track quality assurance process. The 12-month
        minimum duration requirement should be replaced with a competency-based
        framework that lets workers upskill in 8&ndash;16 week blocks while
        remaining in employment. The reformed levy should also let firms fund
        training for workers at risk of displacement, not only those in stable
        roles. The Confederation of British Industry has estimated that levy
        reform alone could increase employer-funded AI reskilling by
        40&ndash;60% within two years of implementation.<Ref n={29} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 4: Create sector-specific transition
        compacts.</strong> For the five most exposed sectors identified in this
        brief, the government should convene tripartite transition compacts
        bringing together employer associations, trade unions and professional
        bodies, and relevant government departments. Each compact should build a
        sector-specific transition plan with a five-year horizon, updated
        annually from Observatory data. The compacts should have authority to
        direct a portion of sectoral levy funds towards agreed transition
        priorities. There is precedent for this in the UK&rsquo;s Sector Skills
        Councils (too weak and unfocused to succeed) and Germany&rsquo;s
        Transformation Councils (more effective, thanks to genuine tripartite
        governance and dedicated funding).
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 5: Introduce AI transition individual learning
        accounts.</strong> Drawing on the Singaporean SkillsFuture model and the
        French Compte Personnel de Formation, the government should pilot
        individual learning accounts for workers in the most AI-exposed
        occupations. Each account would carry &pound;2,000&ndash;&pound;3,500
        in training credit, topped up annually, usable at any accredited
        provider for courses aligned with the transition compact priorities for
        the worker&rsquo;s sector. The accounts should be portable across
        employers and accessible without means-testing. DWP&rsquo;s existing
        Universal Credit conditionality framework could be adapted to include AI
        reskilling as a recognised &ldquo;work preparation&rdquo; activity for
        claimants in exposed occupations, so the safety net supports transition
        rather than just cushioning displacement.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 6: Address the procurement paradox
        directly.</strong> The Government Digital Service, working with the
        Crown Commercial Service, should create a dedicated AI procurement
        pathway for public sector bodies. This should include pre-approved AI
        vendor frameworks with streamlined due diligence, standardised data
        processing agreements for common AI use cases, a &ldquo;regulatory
        sandbox&rdquo; for AI deployment in low-risk public sector applications,
        and a dedicated &pound;150 million AI Adoption Fund for local
        authorities and NHS trusts, structured as matched funding to incentivise
        institutional commitment. The current procurement framework was built
        for buying software licences and consultancy. It is structurally
        incapable of supporting the iterative, experimental deployment model AI
        adoption requires. Without procurement reform, the public sector will
        sit in the lower-right quadrant of the Exposure&ndash;Adoption Matrix
        indefinitely, forgoing billions in productivity gains while the private
        sector races ahead.
      </p>

      <Footnotes notes={[
        "Department for Science, Innovation and Technology, 'AI Activity in UK Businesses,' DSIT Research Series No. 2025/04, October 2025.",
        "Office for National Statistics, 'Labour Force Survey Microdata: Occupation and Industry Tables,' ONS Annual Population Survey, Q4 2025.",
        "OECD, 'Artificial Intelligence and the Labour Market: UK Country Note,' OECD AI Policy Observatory, January 2026.",
        "AI Policy Exchange, 'UK Employer AI Deployment Survey 2026,' AIPEX Research Paper 2026-01, March 2026.",
        "Office for National Statistics, 'Annual Survey of Hours and Earnings: AI-Exposed Occupations Supplementary Tables,' ASHE Provisional Results 2025, November 2025.",
        "International Monetary Fund, 'Gen-AI: Artificial Intelligence and the Future of Work,' IMF Staff Discussion Note SDN/2024/001, January 2024. See also Goldman Sachs Global Investment Research, 'The Potentially Large Effects of Artificial Intelligence on Economic Growth,' March 2023.",
        "Office for National Statistics, 'Business Insights and Conditions Survey: AI Adoption Module,' BICS Wave 128, February 2026.",
        "AI Policy Exchange, 'Substitution, Augmentation, Restructuring: A Task-Level Framework for AI Labour Market Impact,' AIPEX Working Paper 2026-03, February 2026.",
        "AI Policy Exchange analysis of OECD exposure indices cross-tabulated with ONS Business Register and Employment Survey (BRES) 2024 regional employment data.",
        "Office for National Statistics, 'Financial Services: Output, Employment and Trade,' UK Economic Accounts, Q3 2025.",
        "PwC, 'PwC Global Annual Review 2025: Investing in AI,' October 2025.",
        "The Law Society of England and Wales, 'Annual Statistical Report 2025: Entry to the Profession,' January 2026.",
        "National Audit Office, 'Artificial Intelligence in Government: Readiness, Risks and Opportunities,' HC 892, February 2026.",
        "Cabinet Office, 'Civil Service People Survey 2025: Digital Skills and AI Confidence Module,' December 2025.",
        "Stack Overflow, '2025 Developer Survey: UK Regional Report,' Stack Overflow Insights, September 2025.",
        "Institute of Student Employers, 'The ISE Annual Recruitment Survey 2025,' ISE, November 2025.",
        "NHS England, 'AI in the NHS: Potential for Efficiency and Clinical Improvement,' NHS Transformation Directorate Evidence Review, September 2025.",
        "British Medical Association, 'AI in Clinical Practice: BMA Member Survey 2025,' BMA Policy Research, October 2025.",
        "Resolution Foundation, 'The AI Dividend: Who Benefits from Artificial Intelligence in the UK Labour Market,' November 2025.",
        "Financial Conduct Authority, 'FCA Regulatory Returns: Staffing and Approved Persons Data,' FCA Data Bulletin, Q4 2025.",
        "Institute for Fiscal Studies, 'Professional Services and the Changing Graduate Labour Market,' IFS Briefing Note BN398, December 2025.",
        "Social Mobility Commission, 'State of the Nation 2024: Social Mobility in Great Britain,' HM Government, September 2024.",
        "Department for Work and Pensions, 'Stat-Xplore: Occupational Employment by Region,' DWP Tabulation Tool, data extracted January 2026.",
        "OECD, 'OECD Employment Outlook 2025: Artificial Intelligence and the Labour Market,' OECD Publishing, Paris, July 2025.",
        "Stanford Institute for Human-Centered Artificial Intelligence, 'AI Index Report 2026,' Stanford HAI, March 2026.",
        "Smart Nation and Digital Government Office, Singapore, 'National AI Strategy 2.0: Progress Report,' December 2025.",
        "Bundesagentur für Arbeit and Institut für Arbeitsmarkt- und Berufsforschung (IAB), 'KI und Arbeitsmarkt: Sektorale Übergangsprogramme — Zwischenbilanz,' IAB-Forschungsbericht 14/2025, November 2025.",
        "Secrétariat général pour l'investissement, 'France 2030: Bilan d'étape — Compétences et Intelligence Artificielle,' République française, October 2025.",
        "Confederation of British Industry, 'Learning to Grow: Reforming the Apprenticeship Levy for an AI Economy,' CBI Policy Report, January 2026.",
        "IPPR, 'Skills for a Digital Age: Lessons from Singapore's SkillsFuture for UK Workforce Policy,' IPPR Discussion Paper, February 2026.",
      ]} />
    </BriefLayout>
  );
}
