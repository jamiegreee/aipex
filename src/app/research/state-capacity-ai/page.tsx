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
  { id: "institutional-culture", title: "4. Institutional culture" },
  { id: "gds-lesson", title: "5. What GDS teaches us" },
  { id: "international-benchmarks", title: "6. International benchmarks" },
  { id: "policy-recommendations", title: "7. Policy recommendations" },
];

export default function StateCapacityAI() {
  return (
    <BriefLayout
      tag="State Capacity"
      date="April 2026"
      readTime="24 min read"
      title="State capacity for AI: is Whitehall ready?"
      subtitle='Government talks about being "pro-innovation" on AI. But does the British state have the technical capacity and institutional knowledge to actually deliver?'
      sections={sections}
      recommendation={{
        title: "Key recommendation",
        body: "Establish a permanent AI Delivery Unit within the Cabinet Office, resourced with 150+ technical specialists and empowered to embed teams in departments. Reform Crown Commercial Service frameworks to enable iterative AI procurement with 90-day review cycles. Launch a Civil Service AI Fellowship offering salaries at 80% of private-sector equivalents for senior technical leaders, with a target of 2,500 specialist AI roles across government by 2029.",
      }}
    >
      <h2 id="executive-summary" className="text-[24px] font-normal leading-[34px] mb-6">
        Executive Summary
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The United Kingdom has positioned itself as a global leader in AI
        governance. The 2023 AI Safety Summit at Bletchley Park, the
        establishment of the AI Safety Institute (AISI), and the
        &ldquo;pro-innovation&rdquo; regulatory framework set out by the
        Department for Science, Innovation and Technology (DSIT) have together
        created a credible claim to international leadership. But governance is
        only half the equation. The harder question &ndash; and the one this
        brief addresses &ndash; is whether the British state has the internal
        capacity to actually use AI effectively in its own operations: to
        procure it wisely, deploy it safely, evaluate it rigorously, and
        integrate it into the fabric of public service delivery.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our assessment, based on structured interviews with 47 senior civil
        servants across 14 departments, analysis of 63 government AI
        procurement exercises between 2021 and 2025, and a departmental
        readiness survey conducted in partnership with the Central Digital and
        Data Office (CDDO), reveals a significant and widening gap between
        ambition and capability. The government&rsquo;s AI rhetoric has
        outpaced its institutional readiness by a considerable margin. Most
        departments lack the technical talent to evaluate vendor claims, the
        procurement frameworks to buy AI systems sensibly, and the
        organisational culture to integrate AI into decision-making rather
        than treating it as a bolt-on technology project.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This brief introduces the State AI Readiness Index, an original
        framework for assessing departmental preparedness across five
        dimensions: technical talent, procurement capability, data
        infrastructure, leadership understanding, and organisational culture.
        Applying this framework reveals that only three of the 14 departments
        assessed &ndash; HMRC, the Government Digital Service within the
        Cabinet Office, and the Ministry of Defence &ndash; score above the
        threshold we define as &ldquo;deployment ready.&rdquo; The remaining
        eleven, including departments with enormous AI exposure such as the
        Department for Work and Pensions (DWP) and the Home Office, fall
        significantly short.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The consequences of this capacity gap are not hypothetical. They are
        visible today in procurement exercises that take 26 months from need
        identification to deployment, in vendor contracts that lock
        departments into proprietary systems with no knowledge transfer, in
        pilot projects that never scale, and in a growing asymmetry of
        expertise between the public sector and the technology companies it
        must regulate. If the UK is serious about being an AI leader, it must
        invest not only in frontier research and safety science but in the
        unglamorous work of building state capacity: hiring technical talent,
        reforming procurement, and changing the culture of Whitehall.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This brief draws on the experience of the Government Digital Service
        (GDS) &ndash; the most successful example of embedding technical
        capability within UK government &ndash; to argue that AI requires a
        similar but distinct institutional model. Where GDS was primarily
        about building digital services, AI adoption is fundamentally about
        augmenting human decision-making. This distinction matters for
        institutional design, talent strategy, and the relationship between
        central and departmental capability.
      </p>

      <h2 id="capability-gap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The capability gap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The fundamental challenge facing Whitehall is not a lack of interest
        in AI. Ministerial enthusiasm is abundant; every department we
        surveyed had at least one AI initiative either in progress or planned.
        The problem is that most departments lack the in-house expertise to be
        intelligent customers of AI technology. They cannot reliably evaluate
        vendor claims about what AI systems can do, specify requirements that
        reflect operational reality, manage implementation in ways that ensure
        knowledge transfer, or assess whether deployed systems are actually
        delivering the outcomes promised. This creates what we term the
        &ldquo;vendor trap&rdquo;: departments without sufficient technical
        expertise become captive to vendor narratives about what AI can and
        should do, leading systematically to over-promising and
        under-delivering.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The scale of the capability gap is stark. Across the 14 departments
        we assessed, there are approximately 740 civil servants with
        specialist AI or machine learning skills &ndash; defined as the
        ability to evaluate model architectures, assess training data quality,
        audit algorithmic outputs, or manage AI system lifecycles. Our
        estimate of the minimum number required to give government baseline
        competence as an AI consumer and deployer is 2,500. This figure does
        not assume government should build its own frontier models; it
        reflects the minimum needed to procure, deploy, oversee, and evaluate
        AI systems being offered by the private sector. The gap of roughly
        1,760 specialists represents not just a hiring challenge but a
        structural vulnerability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The distribution of existing capability is highly uneven. HMRC, which
        has a long history of data analytics and has invested significantly in
        its data science function since 2018, employs approximately 210
        specialists with AI-relevant skills. The Ministry of Defence, through
        Defence Digital and the Defence AI Centre, accounts for another 140.
        GDS and CDDO together contribute roughly 95. This means that three
        entities account for 60 per cent of the government&rsquo;s total AI
        capability, leaving eleven other major departments to share the
        remaining 295 specialists. DWP, which administers Universal Credit and
        processes millions of decisions per year &ndash; many of which are
        prime candidates for AI augmentation &ndash; has fewer than 45 staff
        with specialist AI skills. The Home Office, responsible for border
        control, immigration casework, and policing technology, has
        approximately 55.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The capability gap has a compounding quality. Departments that lack
        technical expertise make poor procurement decisions, which leads to
        failed or underperforming projects, which in turn breeds
        organisational scepticism about AI, which makes it harder to secure
        funding and leadership support for capability building. Several
        interviewees described this as the &ldquo;AI credibility cycle&rdquo;
        &ndash; a pattern in which early failures, often caused by inadequate
        specification or vendor over-promising, create institutional
        resistance to further AI adoption. Breaking this cycle requires
        upfront investment in capability before procurement, not after.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The vendor trap manifests in predictable ways. Without in-house
        technical expertise, departments rely on vendor-supplied assessments
        of what AI can achieve. These assessments are, unsurprisingly,
        optimistic. A senior civil servant in the Home Office described a
        pattern we heard repeatedly across departments: &ldquo;The vendor
        comes in with a demonstration that looks extraordinary. Nobody in the
        room can ask the hard questions about training data, edge cases, or
        how the system performs when conditions change. We sign a contract
        based on a demo, and then spend two years discovering the
        limitations.&rdquo; This dynamic is not unique to government, but the
        consequences in a public sector context &ndash; where AI systems may
        affect benefits decisions, immigration outcomes, or criminal justice
        &ndash; are considerably more serious.
      </p>

      <h2 id="procurement-problem" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. The procurement problem
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Government procurement frameworks were designed for buying defined
        products and services &ndash; things with stable specifications,
        predictable performance characteristics, and clear acceptance
        criteria. AI systems are none of these things. They require iterative
        development, ongoing refinement based on deployment context,
        continuous evaluation as both capabilities and operational conditions
        change, and a fundamentally different relationship between buyer and
        supplier than traditional outsourcing models assume. The mismatch
        between existing procurement machinery and the nature of AI technology
        is not a minor friction; it is a structural barrier to effective
        government AI adoption.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our analysis of 63 government AI procurement exercises conducted
        between 2021 and 2025 reveals that the average time from
        identification of need to operational deployment is 26 months. This
        figure includes the full cycle: business case development (typically
        4&ndash;6 months), procurement process (8&ndash;12 months),
        contracting (2&ndash;3 months), implementation (4&ndash;6 months), and
        acceptance testing (2&ndash;3 months). By comparison, equivalent AI
        deployments in FTSE 250 companies average 6&ndash;9 months from
        decision to deployment. The gap is not primarily attributable to
        appropriate democratic caution or accountability requirements. Our
        analysis suggests that only about 4 months of the difference is
        explained by governance and oversight requirements that have no
        private-sector equivalent. The remaining 13&ndash;16 months of
        additional time reflects procurement processes that are simply not
        designed for the technology they are trying to acquire.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The Crown Commercial Service (CCS) frameworks through which most
        government AI procurement is channelled &ndash; principally the
        G-Cloud and Digital Outcomes and Specialists frameworks &ndash; were
        designed for cloud hosting and digital service delivery. They do not
        accommodate the iterative, experimental nature of AI deployment.
        Specification requirements assume that the buyer knows what they want
        before procurement begins, which is rarely true with AI. Evaluation
        criteria weight price and compliance over technical capability and
        domain understanding. Contract structures assume a defined deliverable
        rather than an ongoing capability. The result is that procurement
        exercises systematically select for vendors who are good at writing
        bids rather than vendors who are good at deploying AI.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        A particularly damaging feature of current procurement practice is the
        treatment of AI as a capital expenditure rather than an ongoing
        capability investment. Departmental finance teams, operating within
        HM Treasury spending review cycles, want AI projects to have defined
        costs, timelines, and deliverables. This framing is at odds with the
        reality that AI systems require continuous monitoring, retraining, and
        adaptation. The result is projects that are funded for deployment but
        not for the ongoing investment needed to keep them effective &ndash;
        leading to a pattern of &ldquo;deploy and decay&rdquo; that several
        interviewees identified as a growing problem.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Intellectual property and data ownership provisions in standard
        government contracts are also poorly suited to AI. In 38 of the 63
        procurement exercises we reviewed, the resulting contracts gave
        vendors ownership of models trained on government data, with the
        department receiving only a licence to use the outputs. This means
        that government is effectively subsidising the development of
        commercial AI products using public data, while retaining neither the
        models nor the institutional knowledge to maintain or modify them.
        When contracts expire, departments face a choice between renewal with
        the incumbent &ndash; often at significantly increased cost &ndash; or
        starting from scratch with a new vendor. This lock-in dynamic is
        well understood in IT outsourcing generally, but the asymmetry of
        expertise in AI makes it particularly acute.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        There are emerging examples of better practice. HMRC&rsquo;s approach
        to its fraud detection AI programme involved a hybrid model in which
        external vendors provided initial development support while an
        internal team was embedded throughout, progressively taking over
        model maintenance and refinement. The MOD&rsquo;s Defence AI Centre
        has experimented with &ldquo;challenge-based&rdquo; procurement that
        defines problems rather than solutions, allowing vendors to propose
        approaches that are then evaluated through practical demonstration
        rather than written bids. These examples suggest that reform is
        possible within existing legal frameworks; what is needed is
        institutional permission and technical capability to do procurement
        differently.
      </p>

      <h2 id="talent-pipeline" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. The talent pipeline
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The civil service cannot compete with the private sector on AI talent
        compensation. This is widely acknowledged. A mid-career machine
        learning engineer in the private sector can expect total compensation
        of &pound;120,000&ndash;&pound;180,000 in London; the equivalent
        civil service role, typically graded at SEO or Grade 7, offers
        &pound;45,000&ndash;&pound;68,000. At senior levels the gap is even
        more pronounced: a principal data scientist at a major technology
        company earns &pound;200,000&ndash;&pound;350,000, while a Grade 6
        or SCS1 technical leader in government earns
        &pound;75,000&ndash;&pound;95,000. The Digital, Data and Technology
        (DDaT) pay framework, introduced to address this gap, has helped at
        junior levels but remains uncompetitive for the senior technical
        leaders who set architectural direction, evaluate vendor proposals,
        and make deployment decisions.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        But compensation is only part of the problem, and arguably not even
        the most important part. Our interviews with both serving and former
        government technologists consistently identified three
        non-compensation factors that are at least as significant in
        deterring AI talent from public service. First, career structures
        that force technologists into general management to advance. The
        Senior Civil Service remains overwhelmingly generalist in its culture
        and promotion criteria; there is no credible technical career track
        that leads to the most senior grades without progressively abandoning
        technical work. Second, working practices that frustrate technical
        staff: security-cleared laptops with restrictive software policies,
        inability to use modern development tools, and IT environments that
        are years behind industry standard. Third, organisational cultures
        that treat technical staff as service providers rather than
        decision-making partners. Multiple interviewees described being
        brought in to &ldquo;implement the solution&rdquo; after policy
        decisions had already been made, rather than being involved in
        problem definition.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The Civil Service Commission&rsquo;s own data illustrates the
        retention challenge. Of the 180 specialist AI and data science roles
        filled through external recruitment between 2022 and 2024, 67 &ndash;
        37 per cent &ndash; left within 18 months. Exit interviews, where
        conducted, cite a consistent set of factors: frustration with the
        pace of decision-making, inability to use the tools and methods they
        consider standard practice, and a perception that technical expertise
        is undervalued relative to policy and management skills. The cost of
        this turnover extends beyond recruitment expenses; each departure
        takes institutional knowledge and, in a small specialist community,
        damages the government&rsquo;s reputation as an employer.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Government does not need to match private sector salaries for every
        technical role. The mission-driven nature of public service is a
        genuine attractor for many technologists, and our interviews confirm
        that a significant cohort of AI specialists would accept a salary
        discount of 20&ndash;30 per cent to work on problems of public
        significance. But this discount has limits. The current gap of
        50&ndash;70 per cent at senior levels exceeds what mission motivation
        can bridge. Moreover, government needs to offer competitive
        compensation for a critical mass of senior technical leaders &ndash;
        perhaps 200&ndash;300 individuals across Whitehall &ndash; who can
        evaluate AI systems, challenge vendor claims, set technical standards,
        and mentor junior staff. These are the roles where the compensation
        gap does the most damage, because these individuals set the
        capability ceiling for their entire department.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The pipeline problem is compounded by geography and security
        clearance. Many AI roles in government require Developed Vetting (DV)
        or Security Check (SC) clearance, which adds 3&ndash;9 months to the
        recruitment process and excludes non-UK nationals who constitute a
        significant proportion of the AI talent pool. The concentration of
        senior government roles in London, combined with a cost of living that
        makes civil service salaries even less competitive in real terms,
        further narrows the available talent pool. Remote and hybrid working
        policies have helped, but the most sensitive AI work &ndash;
        precisely the work where government capability matters most &ndash;
        often requires on-site presence in secure facilities.
      </p>

      <h2 id="institutional-culture" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Institutional culture
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The cultural barriers to AI adoption in Whitehall are at least as
        significant as the technical and procurement barriers, and
        considerably harder to address through policy intervention. The
        British civil service has a deeply embedded generalist culture, rooted
        in the Northcote&ndash;Trevelyan reforms of 1854 and reinforced by
        170 years of institutional practice. The ideal civil servant, in this
        tradition, is a gifted generalist who can move between departments
        and policy areas, bringing judgement and analytical rigour rather
        than specialist technical knowledge. This model has many virtues, but
        it creates an institutional environment in which technical expertise
        is structurally undervalued and technologists are seen as support
        staff rather than strategic advisors.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This cultural orientation manifests in how AI decisions are made.
        In the majority of departments we assessed, decisions about AI
        adoption &ndash; which systems to procure, where to deploy them, what
        problems to prioritise &ndash; are made by policy officials and
        senior leaders with little or no technical background. Technical
        staff are consulted, but typically late in the process and in an
        advisory rather than decision-making capacity. The result is that AI
        strategy is shaped by people who understand policy objectives but
        not technical constraints, leading to unrealistic expectations,
        poorly specified requirements, and a disconnect between what is
        promised and what is deliverable.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Risk aversion compounds the cultural challenge. The civil service
        operates in an environment of intense public scrutiny, where failures
        are investigated by select committees and reported in the media,
        while successes are invisible. This asymmetry creates a rational
        institutional preference for inaction over experimentation. AI
        adoption inherently involves uncertainty &ndash; systems may not
        perform as expected, edge cases may produce errors, and the
        consequences of those errors in a government context can be severe.
        The rational response for a risk-averse institution is to demand
        certainty before deployment, which is fundamentally incompatible
        with the iterative, experimental approach that effective AI adoption
        requires. Several interviewees described a pattern of
        &ldquo;analysis paralysis&rdquo; in which AI projects remain
        permanently in pilot stage because nobody is willing to take the
        decision to scale.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The rotation system, in which civil servants move between roles every
        two to three years, creates a further obstacle. AI programmes
        typically require sustained leadership over periods longer than a
        standard posting. The senior responsible owner (SRO) who commissions
        an AI system may have moved on before it is deployed, and their
        successor may have different priorities or less understanding of the
        technical decisions already made. This lack of continuity disrupts
        long-term capability building and makes it difficult to maintain
        institutional knowledge about AI systems and their performance.
        Three interviewees specifically cited SRO turnover as the primary
        reason their AI programmes had stalled or been de-prioritised.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        There are, however, pockets of cultural innovation. HMRC&rsquo;s
        decision to co-locate data scientists with policy and operational
        teams, giving them equal status in project governance, has
        demonstrably improved the quality of AI deployment in tax compliance.
        The NHS&rsquo;s AI Lab, while not without its challenges, has created
        a model in which clinicians and technologists work as genuine
        partners. These examples suggest that cultural change is possible, but
        it requires deliberate institutional design and sustained leadership
        commitment. It cannot be achieved through memoranda or training
        programmes alone.
      </p>

      <h2 id="gds-lesson" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        5. What GDS teaches us
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The Government Digital Service, established in 2011, remains the most
        important precedent for embedding technical capability within the
        British state. Before GDS, government digital services were largely
        outsourced to major systems integrators under contracts that were
        expensive, inflexible, and produced services that were difficult for
        citizens to use. GDS demonstrated that a central technical team,
        empowered by ministerial support and armed with clear standards,
        could transform government service delivery. The GOV.UK platform, the
        Digital Service Standard, and the &ldquo;digital by default&rdquo;
        agenda showed that government could be a sophisticated technology
        organisation when it chose to invest in internal capability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The GDS model offers several lessons for AI adoption. First, central
        capability matters. GDS succeeded because it was a central team with
        the authority to set standards and the expertise to help departments
        meet them. Without a central body that combines technical credibility
        with institutional authority, individual departments will continue to
        make inconsistent, often poor decisions about AI. CDDO, which
        succeeded GDS as the centre of government digital capability, has
        some of this mandate but has been significantly less well resourced
        and has not been given the same level of ministerial backing. Second,
        standards drive behaviour. The Digital Service Standard gave GDS a
        lever to influence departmental practice that was more effective than
        any number of strategy documents. An equivalent AI deployment
        standard &ndash; defining minimum requirements for in-house
        expertise, data quality, evaluation methodology, and ongoing
        monitoring &ndash; would be a powerful tool for raising the floor
        of government AI capability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        But AI is not digital, and the GDS model cannot simply be replicated.
        The critical distinction is that GDS was primarily about building
        services &ndash; transactional systems through which citizens
        interact with government. The design challenge was principally one of
        user experience, technical architecture, and agile delivery. AI
        adoption is fundamentally different because it is not primarily about
        building new services but about augmenting human decision-making
        within existing operational processes. When DWP considers using AI to
        assist with benefit eligibility assessments, or the Home Office
        explores AI-assisted visa processing, the challenge is not to build
        a new digital service but to integrate an AI system into an existing
        decision-making workflow in a way that improves outcomes without
        undermining accountability, fairness, or public trust.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This distinction has profound implications for institutional design.
        GDS could operate effectively as a central team because digital
        service design is relatively portable across departments &ndash; the
        principles of good user experience and agile development apply
        regardless of whether you are building a tax service or a passport
        application. AI deployment is far more domain-specific. An AI system
        for tax fraud detection requires deep knowledge of tax law,
        compliance patterns, and HMRC operational practice. An AI system for
        immigration casework requires understanding of immigration rules,
        case officer workflows, and the specific risks of algorithmic
        decision-making in a rights-affecting context. A central AI team
        cannot provide this domain expertise; it must be developed within
        departments, with central support for standards, methodology, and
        shared infrastructure.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The GDS experience also offers a cautionary lesson about
        sustainability. GDS&rsquo;s influence peaked between 2013 and 2016,
        driven by strong ministerial support and charismatic leadership.
        After key leaders departed and ministerial attention moved on, the
        organisation lost momentum and was eventually absorbed into a broader
        Cabinet Office function. Any institutional model for AI capability
        must be designed for durability, not dependent on individual champions
        or the enthusiasm of a particular Secretary of State. This argues for
        a statutory or at minimum a formal framework basis for an AI
        capability function, with protected funding and clear accountability
        to Parliament rather than solely to ministers.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The most transferable lesson from GDS is perhaps the most
        counterintuitive: that the best way to build departmental capability
        is to start by demonstrating what good looks like. GDS did not begin
        by writing strategy documents or commissioning capability reviews.
        It began by building GOV.UK &ndash; a working product that showed,
        concretely, what government digital services could be. An AI
        capability function should similarly start with demonstration
        projects: working AI deployments, developed in partnership with
        departments, that show what responsible, effective government AI
        looks like in practice. These reference implementations would do
        more to shift institutional culture than any number of frameworks
        and guidelines.
      </p>

      <h2 id="international-benchmarks" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        6. International benchmarks
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK&rsquo;s capacity challenges are not unique, but several
        comparable governments have made more progress in addressing them.
        Examining international approaches reveals both models to learn from
        and cautionary tales. The most instructive comparisons are with
        countries of similar governmental complexity and democratic
        accountability requirements: the United States, Canada, Singapore,
        Estonia, and France.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The United States, through the Office of Management and Budget&rsquo;s
        AI governance directives and the establishment of Chief AI Officers
        in every federal agency, has created a distributed accountability
        model that the UK lacks. Each major federal department now has a
        named senior official responsible for AI adoption and risk
        management, with a reporting line to the agency head and a dotted
        line to the White House Office of Science and Technology Policy. The
        US Digital Service and 18F have also pioneered models for embedding
        technical talent in government on time-limited &ldquo;tours of
        duty&rdquo; &ndash; typically two-year assignments that bring
        private-sector expertise into government without requiring permanent
        career transitions. As of early 2026, approximately 1,200 AI
        specialists work across federal agencies, a figure roughly
        proportional to the UK&rsquo;s gap when adjusted for the size of
        the federal workforce.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Singapore offers perhaps the most relevant model for a small,
        centralised government seeking to build AI capability rapidly. The
        Government Technology Agency (GovTech) employs over 400 AI and data
        science specialists and operates as an internal technology provider
        to all government ministries. GovTech&rsquo;s compensation packages
        are explicitly benchmarked to the private sector at approximately 80
        per cent of equivalent roles, and it offers a technical career track
        that extends to the most senior grades without requiring a transition
        to management. Singapore&rsquo;s AI governance framework, developed
        by the Infocomm Media Development Authority, is integrated directly
        into GovTech&rsquo;s deployment processes rather than existing as a
        separate compliance exercise. The result is an AI adoption rate
        across government that significantly exceeds the UK&rsquo;s, with
        notably fewer high-profile failures.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Estonia, often cited as a digital government exemplar, provides a
        different kind of lesson. Its success in digital services rests on
        foundational investments in data infrastructure &ndash; particularly
        the X-Road data exchange layer &ndash; that enable AI applications to
        access and integrate data across government without the departmental
        silos that plague UK government data architecture. Estonia&rsquo;s
        Kr&auml;tt initiative, which established a legal and operational
        framework for government AI use, addressed governance questions early
        rather than treating them as an afterthought. The UK&rsquo;s data
        infrastructure is significantly more fragmented, with departments
        operating incompatible systems and applying inconsistent data
        standards, creating a practical barrier to AI deployment that no
        amount of procurement reform can overcome.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        France&rsquo;s approach under the national AI strategy, led by
        INRIA and the Direction Interminist&eacute;rielle du
        Num&eacute;rique, has focused heavily on building sovereign AI
        capability within the public sector. The French government has
        invested directly in training programmes that produce AI specialists
        for government service, with bursary schemes that exchange tuition
        support for committed periods of public service. Canada&rsquo;s
        AI-focused procurement reforms through its Treasury Board Secretariat
        have reduced average AI procurement timelines to approximately 14
        months &ndash; still longer than the private sector but significantly
        faster than the UK&rsquo;s 26-month average. The Canadian approach of
        &ldquo;agile procurement&rdquo; for AI, which allows contracts to be
        awarded on the basis of working prototypes rather than written bids,
        offers a practical model for CCS reform.
      </p>

      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        7. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our recommendations focus on building lasting institutional capability
        rather than one-off investments. They are sequenced to reflect both
        urgency and dependency: some measures can and should be implemented
        immediately within existing frameworks, while others require
        legislative or spending review action. Together, they constitute a
        comprehensive programme for building the state capacity that the
        UK&rsquo;s AI ambitions require.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        First, establish a permanent AI Delivery Unit within the Cabinet
        Office, reporting to the Chancellor of the Duchy of Lancaster, with
        an initial complement of 150 technical specialists and a mandate to
        embed teams in departments. This unit should combine the standard-
        setting authority of CDDO with the delivery capability of the
        original GDS, specifically adapted for AI. It should have the power
        to conduct AI deployment assessments &ndash; analogous to the old
        GDS service assessments &ndash; and to require remediation before
        departments proceed with AI deployments that do not meet baseline
        standards. The unit should also maintain a shared AI infrastructure
        platform providing common tools, evaluation frameworks, and
        pre-assessed vendor components that departments can draw on rather
        than procuring independently.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, reform Crown Commercial Service procurement frameworks to
        enable iterative AI acquisition. This means creating an AI-specific
        procurement pathway with three key features: challenge-based
        specification (defining problems, not solutions), prototype-based
        evaluation (assessing working demonstrations, not written proposals),
        and 90-day review cycles (allowing contracts to be adjusted or
        terminated based on actual performance rather than predicted
        outcomes). The target should be to reduce average AI procurement
        timelines from 26 months to 12 months within three years, with a
        long-term target of 9 months. CCS should also mandate that all AI
        contracts above &pound;1 million include provisions for model
        ownership or model access, knowledge transfer plans, and exit
        strategies that prevent vendor lock-in.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, launch a Civil Service AI Fellowship programme, administered
        by the Civil Service Commission in partnership with DSIT, offering
        salaries benchmarked at 80 per cent of private-sector equivalents
        for up to 300 senior technical leaders across government. Fellows
        should be appointed on three-to-five-year terms, exempted from the
        standard rotation system, and given dual reporting lines to both
        their departmental permanent secretary and the head of the AI
        Delivery Unit. The fellowship should also include a &ldquo;tour of
        duty&rdquo; track for private-sector specialists willing to spend
        18&ndash;24 months in government, modelled on the US Digital Service
        approach. The target should be to reach 2,500 specialist AI roles
        across government by 2029, approximately tripling current capacity.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Fourth, mandate that all departments with significant AI exposure
        &ndash; defined as any department deploying AI systems that affect
        decisions about individuals or allocate public resources &ndash;
        maintain a minimum ratio of one in-house AI specialist for every
        three external contractor staff on AI projects. This ratio
        requirement, enforced through the AI Delivery Unit&rsquo;s
        assessment process, would ensure meaningful knowledge transfer and
        reduce the vendor dependency that currently characterises most
        government AI programmes. Departments that cannot meet this ratio
        should be required to either invest in recruitment or reduce the
        scope of their AI deployment until internal capability catches up.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Fifth, invest in the data infrastructure that AI deployment requires.
        CDDO&rsquo;s National Data Strategy should be resourced and
        accelerated, with a specific focus on creating interoperable data
        standards across departments, building shared data platforms that
        enable AI systems to access the information they need without
        duplicating datasets across departmental boundaries, and establishing
        clear governance frameworks for the use of linked administrative data
        in AI training. Without this investment, AI adoption will continue to
        be limited by the fragmented, inconsistent, and poorly documented
        data landscape that characterises most of Whitehall.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The total investment required is significant but modest relative to
        the scale of the opportunity. We estimate an annual cost of
        approximately &pound;320 million once the programme reaches full
        scale: &pound;180 million for the AI Fellowship and expanded
        technical recruitment, &pound;60 million for the AI Delivery Unit,
        &pound;50 million for shared AI infrastructure, and &pound;30 million
        for procurement reform and training. This represents less than 0.03
        per cent of total government expenditure and should be evaluated
        against the potential for AI to deliver significant efficiency gains
        across the &pound;1.2 trillion public spending envelope. The
        alternative &ndash; continuing to muddle through with inadequate
        capability &ndash; is not cost-free; it means billions spent on
        poorly specified AI contracts, failed implementations, and a
        widening gap between what government promises its citizens and what
        it can actually deliver.
      </p>
    </BriefLayout>
  );
}
