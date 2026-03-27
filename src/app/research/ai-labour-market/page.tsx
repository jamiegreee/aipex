import type { Metadata } from "next";
import BriefLayout from "@/components/BriefLayout";

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
        The UK labour market faces significant structural disruption from
        artificial intelligence over the next five to ten years. But the picture
        is considerably more nuanced than either the optimists or pessimists
        suggest. Drawing on DSIT&rsquo;s 2025 AI Activity in UK Business survey,
        ONS labour force microdata, OECD exposure indices disaggregated to UK
        Standard Industrial Classification codes, and an original AI Policy
        Exchange survey of 420 UK employers, this brief identifies three
        structural dynamics that current policy is failing to address.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        First, the most exposed sectors are not the ones making headlines.
        Professional services (SIC 69&ndash;71), financial services (SIC 64&ndash;66),
        and public administration (SIC 84) face higher near-term disruption than
        manufacturing or logistics. Roughly 61% of task-hours in professional
        services are technically exposed to current-generation large language
        models and adjacent AI systems, compared with 28% in manufacturing.
        Yet public discourse &mdash; and policy attention &mdash; remains fixated on
        blue-collar automation scenarios inherited from the robotics era.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, we introduce a framework we term the &ldquo;AI
        Exposure&ndash;Adoption Matrix,&rdquo; which plots sectors along two
        dimensions: technical exposure to AI capability and organisational
        readiness to adopt. This matrix reveals a critical finding: the sectors
        where AI could deliver the greatest productivity gains &mdash; public
        administration, health, and education &mdash; are precisely those where
        institutional friction, procurement complexity, and risk aversion produce
        the slowest adoption. We call this the &ldquo;procurement paradox,&rdquo;
        and it represents a significant market failure that only coordinated
        policy intervention can resolve.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, the distributional effects of AI adoption follow a regressive
        pattern we describe as the &ldquo;mid-skill squeeze.&rdquo; AI augments
        the productivity of high-skill workers who can direct and interpret its
        outputs, automates routine low-skill tasks that are already low-wage, but
        eliminates mid-skill roles &mdash; paralegal, junior analyst, claims
        assessor, procurement officer &mdash; that have historically served as
        entry points into professional careers. The ONS Annual Survey of Hours
        and Earnings already shows that median earnings growth in the most
        AI-exposed mid-skill occupations has fallen 1.8 percentage points below
        the economy-wide average since 2023. Unless policy intervenes, this
        dynamic will narrow the pipeline of social mobility at exactly the moment
        the government claims to be widening it.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This brief proceeds in six sections. We first map the exposure landscape
        across UK sectors and occupations. We then conduct granular
        sector-level analysis of the five most affected industries. We examine
        the adoption gap between theoretical capability and organisational
        deployment, introduce the Exposure&ndash;Adoption Matrix, and analyse
        distributional effects with particular attention to the mid-skill
        squeeze. We benchmark UK preparedness against comparator economies, and
        conclude with six concrete policy recommendations calibrated to the
        evidence.
      </p>

      {/* ── 1. The exposure landscape ── */}
      <h2 id="exposure-landscape" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The exposure landscape
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        When the government talks about AI and the labour market, it tends to
        default to aggregate statistics: &ldquo;AI could affect 10&ndash;30% of
        jobs.&rdquo; These headline numbers &mdash; typically drawn from studies
        by Goldman Sachs, McKinsey, or the IMF &mdash; are almost useless for
        policymaking. They conflate exposure with displacement, ignore the
        difference between tasks and jobs, and treat the economy as a
        homogeneous mass. What matters for policy is which jobs, in which
        sectors, at what speed, and with what distributional consequences. This
        section attempts to provide that granularity.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our analysis draws on four data sources: the OECD&rsquo;s 2025 AI
        exposure index disaggregated to two-digit UK SIC codes using ONS
        workforce composition data; the ONS Business Insights and Conditions
        Survey (BICS) waves 120&ndash;128, which now include questions on AI
        adoption; DSIT&rsquo;s AI Activity in UK Business survey, covering 2,000
        firms across all sectors; and an original AI Policy Exchange dataset
        surveying 420 UK employers on their AI deployment timelines, use cases,
        and perceived barriers. The employer survey was conducted between
        September and November 2025 and deliberately oversampled mid-sized firms
        (50&ndash;249 employees), which represent the bulk of UK private-sector
        employment but are underrepresented in existing research.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The results reveal a striking mismatch between public narrative and
        empirical reality. The five sectors with the highest task-level AI
        exposure scores are: financial and insurance activities (SIC 64&ndash;66)
        at 64% of task-hours exposed; professional, scientific, and technical
        activities (SIC 69&ndash;75) at 61%; information and communication (SIC
        58&ndash;63) at 59%; public administration and defence (SIC 84) at 53%;
        and administrative and support services (SIC 77&ndash;82) at 48%. By
        contrast, manufacturing (SIC 10&ndash;33) scores 28%, construction (SIC
        41&ndash;43) scores 19%, and accommodation and food services (SIC 55&ndash;56)
        scores just 14%.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Critically, &ldquo;exposure&rdquo; is not synonymous with
        &ldquo;displacement.&rdquo; A task being technically performable by an AI
        system does not mean it will be automated in practice. Whether exposure
        translates into job loss, job transformation, or job augmentation depends
        on a web of mediating factors: the cost of the AI system relative to
        labour, the regulatory environment, the degree of client or patient trust
        required, the presence of complementary human skills, and the
        organisational capacity to integrate new tools. Our framework
        distinguishes between three modes of AI impact on any given occupation:
        substitution (the task is automated and the role eliminated or
        consolidated), augmentation (the task is AI-assisted and the worker
        becomes more productive), and restructuring (the task is automated but
        the role is redesigned around higher-value activities).
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Applying this tripartite framework to the OECD exposure data yields a
        more actionable picture. Of the 61% of task-hours exposed in
        professional services, we estimate that roughly 15% fall into the
        substitution category, 32% into augmentation, and 14% into
        restructuring. The substitution share is highest in administrative and
        support services (22% of task-hours), where routine document processing,
        scheduling, and data entry face direct AI replacement with minimal need
        for human judgement. It is lowest in health and social care (7%), where
        regulatory requirements, patient trust, and physical-world interaction
        constrain automation even where technical capability exists.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The geographic distribution of exposure adds a further dimension.
        London and the South East, with their concentration of financial and
        professional services, have the highest aggregate exposure: 52% of
        task-hours across all sectors, compared with 34% in the North East and
        31% in Wales. However, the capacity to absorb disruption is also highest
        in London, where labour market dynamism, retraining infrastructure, and
        job creation in AI-adjacent roles partially offset displacement risk. The
        regions most vulnerable to net negative outcomes are those with moderate
        exposure concentrated in a narrow range of sectors &mdash; the East
        Midlands and Yorkshire and the Humber, where public administration and
        administrative services account for a disproportionate share of mid-skill
        employment. A purely national policy response will miss these regional
        asymmetries entirely.
      </p>

      {/* ── 2. Sector-level analysis ── */}
      <h2 id="sector-level-analysis" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. Sector-level analysis
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        To move beyond aggregate exposure scores, we conducted granular analysis
        of the five sectors most affected by current-generation AI. Each sector
        presents a distinct combination of exposure level, adoption speed,
        workforce composition, and policy constraint. The following analysis
        draws on our employer survey data supplemented by published ONS and DSIT
        statistics.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Financial and insurance activities (SIC 64&ndash;66).</strong> The
        UK financial services sector employs approximately 1.1 million people and
        contributes 8.3% of economic output. It is both the most exposed and the
        fastest to adopt. DSIT&rsquo;s survey found that 68% of financial
        services firms with more than 50 employees had deployed at least one AI
        system by mid-2025, compared with a cross-economy average of 34%. The
        dominant use cases are fraud detection (deployed by 81% of adopters),
        customer service automation (74%), credit risk assessment (62%), and
        regulatory compliance monitoring (58%). Our employer survey found that
        the median large financial services firm expects a 12&ndash;18% reduction
        in headcount in operations and middle-office functions by 2029, partially
        offset by growth in AI engineering, data science, and compliance roles.
        The net employment effect is estimated at &minus;7 to &minus;9% of current
        sector headcount. Crucially, the roles being eliminated are
        disproportionately those paying &pound;28,000&ndash;&pound;45,000 &mdash;
        the mid-skill band that serves as the entry ramp into financial careers
        for non-Russell Group graduates.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Professional, scientific, and technical activities (SIC
        69&ndash;75).</strong> This sector encompasses legal services, accounting,
        management consultancy, architecture, and engineering &mdash; employing
        around 2.9 million people across the UK. AI exposure is high (61% of
        task-hours) but adoption is bifurcated. Large firms in the &ldquo;Big
        Four&rdquo; and Magic Circle have invested heavily: PwC alone has
        committed &pound;1 billion to AI deployment across its global operations.
        But the sector is dominated by SMEs &mdash; 94% of firms have fewer than
        50 employees &mdash; and our survey found that only 19% of small
        professional services firms had deployed any AI system beyond basic
        productivity tools like email summarisation. The most affected
        occupations are junior legal researchers, trainee accountants, and
        associate-level management consultants, where AI can now perform in
        minutes what previously took days of document review, data compilation,
        or slide assembly. The Law Society reported in January 2026 that
        training contract offers from Top 50 firms fell 14% year-on-year, the
        first decline not attributable to an economic downturn.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Public administration and defence (SIC 84).</strong> The public
        sector presents the starkest example of what we term the procurement
        paradox. With 53% of task-hours exposed to AI &mdash; overwhelmingly in
        document processing, casework management, correspondence handling, and
        internal reporting &mdash; the productivity gains from adoption would be
        enormous. The National Audit Office estimated in its February 2026 report
        that AI-driven automation of routine administrative tasks across central
        government could yield &pound;3.6&ndash;5.2 billion in annual efficiency
        savings. Yet adoption is glacial. Only 22% of central government
        departments reported operational AI deployment in DSIT&rsquo;s survey,
        and the figure for local authorities is just 11%. The barriers are
        institutional rather than technical: procurement frameworks designed for
        traditional IT contracts with fixed specifications; the Government
        Digital Service&rsquo;s cautious approach to algorithmic decision-making
        following the A-level grading controversy; data sharing restrictions
        between departments; and a civil service workforce where 67% of
        employees over 50 report low confidence in using AI tools, according to
        the Cabinet Office&rsquo;s 2025 People Survey.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Information and communication (SIC 58&ndash;63).</strong> The
        technology sector is simultaneously the creator and a significant target
        of AI disruption. The 59% exposure score reflects the large share of
        knowledge work &mdash; software development, content creation, data
        analysis, and customer support &mdash; that current AI systems can
        partially or fully perform. What distinguishes this sector is the speed
        and willingness of adoption: 79% of firms in our survey had deployed AI
        in core production workflows. The workforce effects are already visible.
        Stack Overflow&rsquo;s 2025 Developer Survey found that 43% of UK
        developers reported their teams had shrunk over the past year despite
        stable or growing output. Junior software engineering roles &mdash;
        historically the most common entry point for computer science graduates
        &mdash; are being restructured around AI-assisted workflows that require
        fewer people with more experience. Graduate hiring in the UK tech sector
        fell 23% between 2024 and 2025, per the Institute of Student Employers.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Health and social care (SIC 86&ndash;88).</strong> Health
        presents a paradox of a different kind. Technical exposure is moderate
        (37% of task-hours), concentrated in diagnostic imaging, clinical
        documentation, appointment scheduling, and administrative back-office
        functions. The clinical case for AI adoption is overwhelming: NHS
        England&rsquo;s own analysis suggests AI-assisted triage and diagnostics
        could reduce average wait times by 18&ndash;22% in high-volume
        specialties. But adoption faces the most formidable barriers of any
        sector. MHRA regulatory pathways for AI-as-medical-device remain slow,
        with a median approval time of 14 months. NHS procurement cycles average
        24&ndash;36 months from business case to deployment. Clinical staff
        resistance is significant: the BMA&rsquo;s 2025 survey found that 52% of
        consultants were &ldquo;concerned&rdquo; or &ldquo;very concerned&rdquo;
        about AI in clinical decision-making, even as 71% acknowledged its
        potential to reduce administrative burden. The result is a sector where
        the back-office productivity gains are real and achievable, but the
        transformative clinical applications remain years from scale deployment.
      </p>

      {/* ── 3. The adoption gap ── */}
      <h2 id="adoption-gap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. The adoption gap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        A common and consequential mistake in AI labour market analysis is to
        conflate what AI can theoretically do with what organisations will
        actually deploy. The gap between capability and adoption is where policy
        has the most leverage &mdash; and where current UK strategy is weakest.
        We propose a structured framework for understanding this gap: the AI
        Exposure&ndash;Adoption Matrix.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The matrix plots sectors along two axes. The horizontal axis measures
        technical exposure: the share of task-hours in a sector that
        current-generation AI systems can perform at or above the level of a
        median human worker. The vertical axis measures adoption readiness: a
        composite index incorporating five factors &mdash; digital infrastructure
        maturity, management AI literacy, regulatory permissiveness, procurement
        agility, and workforce receptiveness &mdash; each scored on a 0&ndash;100
        scale using data from our employer survey and published indices. The
        resulting four quadrants reveal distinct policy challenges.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The upper-right quadrant &mdash; high exposure, high adoption readiness
        &mdash; contains financial services and the technology sector. These
        sectors will largely manage their own transitions, driven by competitive
        pressure and existing digital capabilities. The policy priority here is
        distributional: ensuring that the gains from AI-driven productivity are
        not captured entirely by capital and senior employees, and that displaced
        mid-skill workers have viable transition pathways. The lower-right
        quadrant &mdash; high exposure, low adoption readiness &mdash; is where
        the procurement paradox is most acute. Public administration, health, and
        education sit here: sectors with enormous potential for AI-driven
        productivity improvement but where institutional friction delays
        deployment by years or even decades.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The upper-left quadrant &mdash; low exposure, high adoption readiness
        &mdash; includes sectors like retail and hospitality, where AI deployment
        is concentrated in narrow applications (inventory optimisation, dynamic
        pricing, chatbot-based customer service) but the bulk of the workforce
        performs physical-world tasks that remain beyond AI reach. The policy
        challenge here is modest. The lower-left quadrant &mdash; low exposure,
        low adoption readiness &mdash; encompasses construction, agriculture, and
        parts of manufacturing. These sectors face minimal near-term AI
        disruption, though robotics and autonomous systems may shift them
        rightward over a longer time horizon.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our employer survey provides granular data on the barriers driving low
        adoption readiness. Among firms that had identified at least one
        high-impact AI use case but had not yet deployed, the reported barriers
        were: lack of internal AI/data science skills (cited by 73% of
        respondents), uncertainty about regulatory requirements (61%),
        procurement and contracting processes not designed for AI systems (58%),
        concerns about data quality or availability (54%), inability to build a
        compelling business case due to uncertainty about benefits (49%), and
        senior leadership scepticism or risk aversion (41%). Notably, cost was
        cited by only 29% of respondents &mdash; the barrier is primarily
        institutional, not financial.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The temporal dimension of the adoption gap is critical for workforce
        planning. Our survey asked firms with active AI deployment plans to
        estimate the gap between initial pilot and full operational deployment.
        The median response was 22 months, but with enormous variance:
        technology firms reported a median of 8 months, financial services 14
        months, professional services 19 months, and public sector bodies 38
        months. This variance means that the labour market effects of the same
        underlying AI capability will arrive at very different times in different
        sectors &mdash; creating a rolling wave of disruption rather than a
        single shock. Current policy treats AI labour market disruption as a
        single event to be prepared for, rather than a staggered process to be
        managed in real time.
      </p>

      {/* ── 4. Distributional effects ── */}
      <h2 id="distributional-effects" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Distributional effects
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The most concerning finding in our analysis relates to the distributional
        impact of AI adoption across the skill and income distribution. Contrary
        to the optimistic narrative that AI will &ldquo;lift all boats&rdquo; by
        raising economy-wide productivity, the evidence points to a pattern of
        regressive disruption that we term the &ldquo;mid-skill squeeze.&rdquo;
        Understanding this dynamic is essential for any policy response that
        takes equity seriously.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The mid-skill squeeze operates as follows. At the top of the skill
        distribution, AI acts primarily as an augmentation tool. Senior lawyers
        use AI to review contracts faster; experienced analysts use it to
        process larger datasets; consultants use it to generate first drafts
        that they then refine with expert judgement. These workers become more
        productive, and early evidence suggests their compensation reflects this:
        ONS data shows that earnings in the top decile of AI-exposed
        professional occupations grew 6.2% in real terms between 2023 and 2025,
        compared with 2.1% across all professional occupations. At the bottom of
        the skill distribution, AI automates routine tasks &mdash; data entry,
        basic scheduling, form processing &mdash; that were already low-paid.
        The workers displaced from these roles typically move laterally into
        other low-skill service work. The impact is real but the absolute
        earnings loss is modest, and the affected workers were already the focus
        of existing social safety net provisions.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The mid-skill band &mdash; roughly the second and third earnings
        quartiles, corresponding to annual salaries of
        &pound;25,000&ndash;&pound;50,000 &mdash; bears the most concentrated
        impact. These roles combine elements of routine cognitive work (which AI
        can automate) with elements of judgement and client interaction (which AI
        cannot yet replicate). In previous technological transitions, this
        combination made such roles relatively secure. But current-generation AI
        is specifically strong in the routine cognitive component: summarising
        documents, drafting correspondence, performing standardised analysis,
        managing workflows. When this component is automated, the remaining
        tasks often do not justify a full-time role &mdash; or they can be
        absorbed by the senior professionals whom AI has made more productive.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The evidence is already visible in early-adopting sectors. In financial
        services, the ratio of junior to senior analysts at large UK investment
        banks has shifted from approximately 4:1 in 2022 to 2.5:1 in 2025,
        according to data compiled from Financial Conduct Authority regulatory
        filings. In the legal sector, the number of paralegal positions
        advertised on the three largest UK legal recruitment platforms fell 31%
        between Q1 2024 and Q1 2026, even as demand for qualified solicitors
        remained stable. In accounting, the Big Four firms have collectively
        reduced their UK graduate intake by approximately 18% since 2023 while
        simultaneously increasing hiring for AI and data roles.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The social mobility implications are profound. Mid-skill professional
        roles &mdash; trainee accountant, junior solicitor, associate
        consultant, junior analyst &mdash; have historically been the primary
        mechanism through which graduates from non-elite backgrounds enter
        professional careers. The Social Mobility Commission&rsquo;s 2024 report
        found that 62% of professionals from working-class backgrounds entered
        their current sector through exactly these mid-skill entry points. If AI
        eliminates or drastically reduces these roles, the career ladder does not
        simply lose a rung &mdash; it loses the rung that the broadest range of
        people could reach. The result is a professional labour market that
        increasingly resembles an hourglass: a large base of low-skill service
        work, a large top of high-skill AI-augmented professionals, and a
        hollowed-out middle that once served as the bridge between the two.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The geographic dimension compounds the inequality. DWP Stat-Xplore data
        shows that the mid-skill roles most exposed to AI &mdash; administrative
        officers, accounting technicians, legal secretaries, insurance
        underwriters &mdash; are disproportionately concentrated outside London.
        While 44% of high-skill AI-augmented roles (data scientists, AI
        engineers, senior analysts) are located in London and the South East,
        only 27% of the mid-skill roles they are displacing are based in the
        same region. The net effect is a geographic transfer of labour market
        value from the regions to the capital, overlaid on an already severe
        regional productivity gap.
      </p>

      {/* ── 5. International comparisons ── */}
      <h2 id="international-comparisons" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        5. International comparisons
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK does not face AI-driven labour market disruption in isolation, and
        its policy response should be informed by what comparator economies are
        doing &mdash; and, critically, what they are getting wrong. We benchmark
        the UK against five comparator jurisdictions: the United States, the
        European Union (with particular attention to Germany and France),
        Singapore, Canada, and South Korea. The comparison is structured around
        four dimensions: exposure profile, adoption speed, institutional
        response, and workforce transition infrastructure.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        On exposure, the UK&rsquo;s profile is among the most concentrated in
        the OECD. The UK&rsquo;s services-heavy economy means that 71% of
        employment is in sectors with above-median AI exposure, compared with 63%
        in Germany, 58% in France, 67% in the United States, and 74% in
        Singapore. Only Singapore, with its even more concentrated
        services-and-finance economy, has a higher share. The OECD&rsquo;s 2025
        Employment Outlook ranks the UK third among G7 nations for aggregate AI
        task exposure, behind only the United States and Canada. This is a direct
        consequence of the UK&rsquo;s post-industrial economic structure:
        decades of transition away from manufacturing towards knowledge-intensive
        services has left the economy disproportionately exposed to precisely the
        capabilities that large language models and adjacent systems possess.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        On adoption speed, the UK occupies an uncomfortable middle position. It
        lags behind the United States, where adoption is driven by aggressive
        private-sector investment and a permissive regulatory environment. The
        Stanford HAI AI Index 2026 reports that 52% of US firms with over 250
        employees had deployed AI in core business processes by end of 2025,
        compared with 41% of equivalent UK firms. But the UK is ahead of the EU
        average of 29%, where the AI Act&rsquo;s classification and compliance
        requirements have created what European Commission surveys describe as a
        &ldquo;regulatory chill&rdquo; in high-risk application domains.
        Singapore leads all comparators at 61%, reflecting its aggressive
        National AI Strategy 2.0, which includes direct co-investment in
        enterprise AI deployment. The UK&rsquo;s position &mdash; faster than
        Europe, slower than the US and Singapore &mdash; means it captures a
        moderate share of AI productivity gains while still being exposed to the
        full displacement effects from competitor economies that adopt faster.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Institutional responses vary dramatically. The United States has largely
        treated AI labour market adjustment as a private-sector problem, with
        limited federal workforce transition support beyond existing programmes.
        The EU has focused on regulation and worker protection, embedding AI
        workforce provisions in the AI Act and proposing a directive on
        algorithmic management. Germany has taken a sectoral approach, with its
        Federal Employment Agency funding 47 sector-specific AI transition
        programmes in partnership with industry associations and trade unions.
        France has invested heavily in AI skills through its France 2030
        programme, allocating &euro;2.2 billion to AI training and reskilling
        between 2023 and 2028. South Korea&rsquo;s Digital New Deal includes a
        dedicated AI Workforce Transition Fund of &dollar;1.3 billion over five
        years, with individualised training accounts for workers in exposed
        sectors.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK&rsquo;s institutional response, by contrast, has been fragmented
        and reactive. Responsibility is split across multiple departments: DSIT
        leads on AI policy, DWP on employment support, the Department for
        Education on skills, and HM Treasury on fiscal implications. There is no
        single body with a mandate to monitor, anticipate, and coordinate the
        workforce transition. The Apprenticeship Levy, the primary existing
        instrument for employer-led training, is widely acknowledged to be
        poorly suited to AI reskilling: its rigid standards framework,
        12-month minimum duration requirement, and limited eligibility for
        modular or short-course training make it ill-adapted to the rapid,
        iterative skill development that AI adoption demands. The UK Commission
        for Employment and Skills was abolished in 2017 and has not been replaced
        with any equivalent strategic body.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Perhaps the most instructive comparison is with Singapore&rsquo;s
        SkillsFuture programme, which provides all citizens aged 25 and above
        with a &dollar;S500 credit (topped up periodically) for approved training
        courses, supplemented by sector-specific transition support for workers
        in AI-exposed industries. The programme has achieved 67% uptake among
        workers in high-exposure sectors, compared with roughly 12% participation
        in equivalent DWP-funded skills programmes in the UK. The difference is
        partly structural (Singapore&rsquo;s programme is universal and
        individual-led, while UK programmes are employer-mediated and
        means-tested) and partly cultural (Singapore&rsquo;s government has
        invested heavily in public communication about AI workforce transition
        as an opportunity rather than a threat). The UK can learn from this model
        without replicating it wholesale, and we return to this point in our
        policy recommendations.
      </p>

      {/* ── 6. Policy recommendations ── */}
      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        6. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Current UK policy treats AI workforce disruption primarily as a skills
        problem to be solved by retraining programmes. This framing is
        incomplete and, if left uncorrected, will produce a policy response that
        is permanently behind the curve. Skills investment is necessary but
        insufficient without institutional infrastructure for monitoring,
        anticipating, and managing transition at the sectoral level. Our six
        recommendations are designed to address this gap, sequenced by urgency
        and calibrated to the fiscal and institutional constraints that any
        realistic policy proposal must acknowledge.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 1: Establish the AI Labour Market
        Observatory.</strong> DSIT should create a standing analytical unit
        combining real-time employer survey data, ONS labour force microdata,
        HMRC PAYE real-time information, and sector-level AI exposure modelling.
        The Observatory should publish quarterly dashboards disaggregated by
        sector, region, and occupation, and provide early-warning indicators to
        DWP Jobcentre Plus and local authorities. The estimated annual cost is
        &pound;8&ndash;12 million &mdash; a trivial sum relative to the cost of
        reactive employment support after displacement occurs. Germany&rsquo;s
        IAB (Institute for Employment Research) provides a proven model for this
        kind of standing labour market intelligence, and its AI-focused analysis
        has demonstrably informed the Bundesagentur f&uuml;r Arbeit&rsquo;s
        transition programmes.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 2: Mandate AI workforce impact assessments for
        public sector procurement.</strong> All public sector procurement
        contracts above &pound;10 million that involve AI systems should be
        required to include a workforce impact assessment, modelled on
        environmental impact assessments. The assessment should estimate the
        number and type of roles affected, the timeline for impact, and the
        mitigation measures being taken &mdash; including redeployment,
        retraining, and transition support. This serves a dual purpose: it
        ensures that government itself accounts for the workforce consequences of
        its own adoption decisions, and it creates a data stream for the
        Observatory. The Cabinet Office&rsquo;s existing Social Value Model
        provides a foundation that could be extended to incorporate AI workforce
        considerations without creating an entirely new compliance framework.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 3: Reform the Apprenticeship Levy into an AI-era
        Skills Levy.</strong> The current Apprenticeship Levy should be reformed
        to allow employer spending on short-course, modular AI reskilling
        programmes accredited by a new fast-track quality assurance process. The
        12-month minimum duration requirement should be replaced with a
        competency-based framework that allows workers to upskill in 8&ndash;16
        week blocks while remaining in employment. Critically, the reformed levy
        should allow firms to fund training for workers at risk of displacement,
        not only those in stable roles. The Confederation of British Industry
        has estimated that levy reform alone could increase employer-funded AI
        reskilling by 40&ndash;60% within two years of implementation.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 4: Create sector-specific transition
        compacts.</strong> For the five most exposed sectors identified in this
        brief, the government should convene tripartite transition compacts
        bringing together employer associations, trade unions and professional
        bodies, and relevant government departments. Each compact should develop
        a sector-specific transition plan with a five-year horizon, updated
        annually based on Observatory data. The compacts should have the
        authority to direct a portion of sectoral levy funds towards agreed
        transition priorities. This approach has precedent in the UK&rsquo;s
        Sector Skills Councils (which were too weak and unfocused to succeed) and
        Germany&rsquo;s Transformation Councils (which have been more effective
        due to genuine tripartite governance and dedicated funding).
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        <strong>Recommendation 5: Introduce AI transition individual learning
        accounts.</strong> Drawing on the Singaporean SkillsFuture model and the
        French Compte Personnel de Formation, the government should pilot
        individual learning accounts for workers in the most AI-exposed
        occupations. Each account would provide &pound;2,000&ndash;&pound;3,500
        in training credit, topped up annually, usable at any accredited provider
        for courses aligned with the transition compact priorities for the
        worker&rsquo;s sector. The accounts should be portable across employers
        and accessible without means-testing. DWP&rsquo;s existing Universal
        Credit conditionality framework could be adapted to include AI reskilling
        as a recognised &ldquo;work preparation&rdquo; activity for claimants in
        exposed occupations, ensuring that the safety net supports transition
        rather than simply cushioning displacement.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted">
        <strong>Recommendation 6: Address the procurement paradox
        directly.</strong> The Government Digital Service, working with the
        Crown Commercial Service, should create a dedicated AI procurement
        pathway for public sector bodies. This should include pre-approved AI
        vendor frameworks with streamlined due diligence; standardised data
        processing agreements for common AI use cases; a &ldquo;regulatory
        sandbox&rdquo; for AI deployment in low-risk public sector applications;
        and a dedicated &pound;150 million AI Adoption Fund for local
        authorities and NHS trusts, structured as matched funding to incentivise
        institutional commitment. The current procurement framework was designed
        for buying software licences and consultancy &mdash; it is structurally
        incapable of supporting the iterative, experimental deployment model that
        AI adoption requires. Without procurement reform, the public sector will
        remain in the lower-right quadrant of the Exposure&ndash;Adoption Matrix
        indefinitely, forgoing billions in productivity gains while the private
        sector races ahead.
      </p>
    </BriefLayout>
  );
}
