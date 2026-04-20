import type { Metadata } from "next";
import BriefLayout from "@/components/BriefLayout";
import { Ref, Footnotes } from "@/components/Footnotes";

export const metadata: Metadata = {
  title: 'Why "AI regulation" is the wrong frame — AI Policy Exchange',
  description: "AI governance is not about constraining a static technology — it\u2019s about building institutional capacity to manage a transition already underway.",
};

const sections = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "regulation-trap", title: "1. The regulation trap" },
  { id: "why-ai-breaks-model", title: "2. Why AI breaks the regulatory model" },
  { id: "governance-alternative", title: "3. The governance alternative" },
  { id: "institutional-capacity", title: "4. Building institutional capacity" },
  { id: "international-lessons", title: "5. International lessons" },
  { id: "policy-recommendations", title: "6. Policy recommendations" },
];

export default function AIRegulationWrongFrame() {
  return (
    <BriefLayout
      tag="Governance"
      date="March 2026"
      readTime="22 min read"
      title='Why "AI regulation" is the wrong frame — and what to do instead'
      subtitle="AI governance is not about constraining a static technology — it&rsquo;s about building institutional capacity to manage a transition already underway."
      sections={sections}
      recommendation={{
        title: "Key recommendation",
        body: "The UK should establish an AI Governance Capacity Unit within the Cabinet Office, tasked with building cross-departmental competence in AI oversight rather than creating new regulatory bodies for individual AI applications.",
      }}
    >
      {/* ── Executive Summary ── */}
      <h2 id="executive-summary" className="text-[24px] font-normal leading-[34px] mb-6">
        Executive Summary
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Treating AI policy as a regulation problem gets the question wrong.
        Regulation works when you can pin down what you are regulating: a drug,
        a bond, a vehicle.<Ref n={1} /> AI is not a thing in that sense. The same model
        drafts a legal brief one hour and summarises an MRI the next, and
        whether the output matters depends almost entirely on where it lands.<Ref n={2} />
        Ask Parliament to regulate that and you get one of two outcomes. Rules
        abstract enough to be unenforceable, or rules specific enough to be out
        of date before Royal Assent. Both have already happened in comparable
        jurisdictions.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The useful shift is from regulation to governance. These are not
        synonyms. Regulation is a subset of governance, the subset concerned
        with binding rules and their enforcement. Governance is the wider
        apparatus: institutions, the people in them, the evaluation
        infrastructure, the feedback loops with industry, the informal norms
        that actually shape behaviour.<Ref n={3} /> The UK already governs plenty of things
        that resist clean regulation. Monetary policy is not a rulebook, it is
        the Bank of England making calls and being judged on them. Pandemic
        response is not a statute. AI warrants the same sort of apparatus, not
        another Act.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The brief proposes two frameworks. The first is a Governance Maturity
        Model with four levels, from reactive regulation to adaptive governance,
        and a diagnosis of where jurisdictions sit on that ladder. The second is
        what we call governance as infrastructure: the argument that oversight
        capacity should be built once, centrally, and shared across regulators,
        on the same logic that the UK does not build a new broadband backbone
        for every new digital service.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        We also give a name to a familiar problem, the regulatory lag paradox.
        By the time a rule has been drafted, consulted on, passed, and
        operationalised, the capability it was written for has moved.<Ref n={4} /> That is
        not a transition problem waiting to resolve itself once AI settles
        down. Capability improves on monthly timescales; primary legislation
        operates on a horizon of years. The gap widens fastest where governments
        invest most heavily in comprehensive AI legislation, which is why it is
        widest in the EU.<Ref n={5} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our headline recommendation is an AI Governance Capacity Unit inside the
        Cabinet Office. Its job is not to write more rules. It is to make the
        regulators the UK already has &mdash; Ofcom, the FCA, the CMA, the ICO,
        the MHRA &mdash; capable of doing real AI oversight inside their
        existing mandates. That means technical secondments, a shared evaluation
        facility, a common impact-assessment method, and a standing function
        that notices the governance gaps nobody has been asked to close. This
        does not replace DSIT&rsquo;s policy role or AISI&rsquo;s technical
        work. It sits between them, which is where the coordination problem
        currently lives.<Ref n={6} />
      </p>

      {/* ── 1. The regulation trap ── */}
      <h2 id="regulation-trap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The regulation trap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        &ldquo;Regulate AI&rdquo; is a slogan more than a policy position.
        Politicians reach for it because it sounds decisive and because the
        public response to any new technology is to ask what the government is
        going to do about it. Fair enough, as far as it goes. But the word
        regulation carries a twentieth-century assumption: that the thing being
        regulated stays still long enough to be described. A drug takes a decade
        to develop and is essentially the same molecule five years after
        approval. A derivative can be written down and its risk properties
        modelled. Those are the conditions that make regulation tractable. You
        can specify the object, define what bad behaviour looks like, and
        inspect for compliance. AI meets none of them.<Ref n={7} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Start with the definition. You cannot regulate something until you have
        said what it is. The EU AI Act had a go, defining an AI system as
        &ldquo;a machine-based system that is designed to operate with varying
        levels of autonomy and that may exhibit adaptiveness after
        deployment.&rdquo;<Ref n={8} /> That sentence sweeps in most feedback-loop software
        written since the 1970s while still missing plenty of current LLM use
        where there is no meaningful autonomy involved. The UK has avoided a
        statutory definition altogether, which spares it the error and hands the
        problem to sectoral regulators, who now have to decide for themselves
        what falls within their remit.<Ref n={9} /> Firms working across sectors get
        inconsistency, compliance confusion, and, in due course, arbitrage.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The more fundamental problem is timing. Regulation assumes a reasonable
        match between the pace of the rule and the pace of the thing it
        governs. Emissions standards, food safety, building codes &mdash; the
        underlying reality moves slowly enough that a multi-year legislative
        cycle is fine. AI does not oblige. When the European Commission started
        drafting the AI Act in April 2021, GPT-3 was less than a year old,
        ChatGPT did not exist as a product, and the idea that language models
        would be used to draft legislation or pass the bar exam was a
        conference-panel hypothetical, not a policy concern.<Ref n={10} /> By March 2024,
        when the Act cleared its final procedural hurdle, the world it was built
        to govern was gone. The risk tiers, the provider obligations, the
        enforcement architecture had all been drafted for a generation of models
        that had already been superseded, twice.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        None of this is a criticism of the drafters. They were competent,
        well-resourced, and working within the only process available to them.
        The point is structural. The more comprehensive a regulation, the longer
        it takes to produce, and the wider the gap between the technology it
        imagined and the technology it actually governs. Narrow, targeted rules
        can be updated faster, but they leave most of the deployment space
        ungoverned. There is no version of the regulatory paradigm that resolves
        this.<Ref n={11} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Then the political economy makes all of it worse. Compliance is
        expensive. Expensive compliance creates lobbying incentives. The firms
        that end up shaping AI regulation are therefore the firms large enough
        to absorb it, which are, not coincidentally, the incumbents.<Ref n={12} /> A
        foundation-model provider with a hundred-person legal and compliance
        function finds the AI Act manageable. A six-person Paris startup does
        not. Rules written to protect the public from concentrated AI capability
        can end up protecting the firms that already have it. Whether you call
        that pro-innovation or pro-safety is beside the point.<Ref n={13} />
      </p>

      {/* ── 2. Why AI breaks the regulatory model ── */}
      <h2 id="why-ai-breaks-model" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. Why AI breaks the regulatory model
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The regulatory model that served the twentieth century rests on several
        assumptions, each of which AI violates. The first: the object of
        regulation is identifiable and bounded. A car is a car; a bank is a
        bank. An AI system might be a medical diagnostic tool on Monday, a
        legal research assistant on Tuesday, and a creative writing partner on
        Wednesday. Same underlying model, different interfaces, different
        sectoral regulators, entirely different risk profiles depending on
        context.<Ref n={14} /> That is not an edge case. That is what
        general-purpose AI is. No previous technology has handed regulators an
        object whose risk category depends on how someone uses it.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The second: the supply chain is legible. Traditional regulation traces
        a clear path from manufacturer to end user. Pharmaceutical regulation
        can identify who synthesised a compound, who tested it, who approved
        it, who prescribed it. AI supply chains are more diffuse. A frontier
        model is trained by one company on data from thousands of sources,
        fine-tuned by another for a specific domain, deployed by a third
        through an API, integrated by a fourth into a consumer product,
        customised by the end user through prompting. Where in that chain does
        regulatory responsibility sit? The EU AI Act distributes obligations
        across it, assigning duties to &ldquo;providers&rdquo; and
        &ldquo;deployers,&rdquo;<Ref n={15} /> but the practical enforceability
        of those distinctions is already being tested by how AI systems
        actually get built and used.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The third: risk can be assessed before deployment and stays relatively
        stable afterwards. Pharmaceuticals undergo multi-year clinical trials
        before reaching patients. Financial products are stress-tested against
        defined scenarios. AI systems, particularly those built on large
        language models, exhibit emergent behaviours that are not predictable
        from their training data or architecture.<Ref n={16} /> A model that
        passes every safety benchmark at deployment may develop unexpected
        capabilities or failure modes once exposed to real-world inputs.
        Pre-market approval, which underpins most product safety regulation,
        assumes that the product assessed is the product used. For adaptive AI
        systems, it is not.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The fourth: the regulated entity and the regulator share a
        jurisdiction. AI models are trained in one country, hosted in another,
        accessed globally through APIs, fine-tuned locally. A UK regulator
        trying to enforce compliance against a model hosted in the United
        States, trained on data from dozens of jurisdictions, and accessed by
        UK users through a wrapper built by an Indian startup, faces
        jurisdictional problems that make conventional enforcement mechanisms
        largely theoretical. Internet regulation has always faced a version of
        this. The speed of AI deployment and the opacity of AI supply chains
        make it considerably more acute.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The fifth: the regulator has the expertise to evaluate compliance, or
        can acquire it. For most regulated industries, this holds. The FCA
        employs people who understand financial instruments; the MHRA employs
        people who understand pharmacology. But the technical frontier of AI is
        moving so fast that even well-resourced regulators cannot keep pace.<Ref n={17} />
        The AI Safety Institute has invested seriously in technical evaluation
        capacity, but its mandate covers frontier models and catastrophic risk.<Ref n={18} />
        The sectoral regulators who will govern the bulk of AI deployments,
        Ofcom on AI-generated content, the FCA on AI in financial services, the
        CMA on competition, the ICO on data protection, face a capability gap
        that hiring will not close. The relevant expertise is scarce and the
        private sector pays multiples of public sector salaries.
      </p>

      {/* ── 3. The governance alternative ── */}
      <h2 id="governance-alternative" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. The governance alternative
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Governance is broader than regulation. Where regulation asks &ldquo;what
        rules should we write?&rdquo;, governance asks &ldquo;what institutions,
        processes, and capabilities do we need to manage this transition
        well?&rdquo; The reframing is not a retreat from accountability.
        Effective oversight of AI needs instruments that regulation alone
        cannot provide: real-time technical monitoring, standards that evolve
        with the technology, cross-sector coordination, and institutional
        learning at a pace that matches technological change.<Ref n={3} />
        Regulation remains an important tool in the governance toolkit. It is
        one tool among many. Treating it as the entirety of the response is
        like trying to manage a pandemic with legislation alone.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        We propose a Governance Maturity Model: a framework for assessing where
        jurisdictions sit on the spectrum from reactive to adaptive AI
        governance. Four levels. Level 1, reactive regulation: the jurisdiction
        has no AI-specific governance and responds to AI-related harms only
        after they occur, using existing legal frameworks that may or may not
        be adequate. Many developing countries and some US states sit here.
        Level 2, prescriptive regulation: the jurisdiction has enacted or is
        enacting comprehensive AI-specific legislation that defines risk
        categories, mandates compliance procedures, and establishes enforcement
        mechanisms. The EU, through the AI Act, is the paradigmatic case.<Ref n={5} />
        The strength of Level 2 is legal certainty. The weakness is rigidity,
        and the regulatory lag paradox described above.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Level 3, coordinated oversight: the jurisdiction distributes AI
        governance across existing sectoral regulators, with a central
        coordinating function that keeps consistency and fills gaps. The
        UK&rsquo;s current framework aspires to Level 3 but has not reached
        it, because the coordinating function, currently split between DSIT,
        AISI, and the Cabinet Office, lacks the authority and resources.<Ref n={19} />
        Level 4, adaptive governance: the jurisdiction has built the
        institutional infrastructure for continuous learning and adaptation.
        Real-time monitoring capabilities, regulatory sandboxes that feed into
        policy, structured feedback loops between industry and government, and
        the capacity to update governance frameworks without primary
        legislation. Singapore, as Section 5 discusses, comes closest, though
        no jurisdiction has fully got there.<Ref n={20} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The Governance Maturity Model is not a strict hierarchy in which higher
        levels are always better. Level 2 prescriptive regulation may be the
        right choice for specific high-risk applications where legal certainty
        is paramount, AI in criminal sentencing, for example, or autonomous
        weapons systems. Regulation is sometimes the right tool. The argument
        is that a jurisdiction&rsquo;s overall approach to AI governance should
        aim at Level 3 or 4, using regulation selectively inside a broader
        adaptive framework rather than treating it as the default instrument.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The second conceptual contribution of this brief is the idea of
        governance as infrastructure. The analogy is deliberate. The UK does
        not build a new broadband network for each digital service; it invests
        in shared digital infrastructure that multiple applications can use.
        Governance capacity should work the same way. The ability to evaluate
        an AI model&rsquo;s reliability, to audit its training data provenance,
        to assess its impact on a particular population: these capabilities
        recur across every domain in which AI is deployed. Building them as
        shared infrastructure, accessible to every regulator and government
        department, is far more efficient than expecting each body to develop
        its own capability from scratch.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The infrastructure metaphor also points to a timing question. You do
        not wait until traffic congestion is unbearable before starting to
        build roads. You invest ahead of demand, accepting that the
        infrastructure will be underused at first. The same logic applies here.
        The UK needs to invest now in the institutions, skills, and processes
        that will be needed to govern AI over the coming decade, rather than
        waiting for each governance failure to reveal the next capability gap.
        The cost of building proactively is a fraction of the cost of cleaning
        up after the fact, as the Post Office Horizon scandal illustrates in a
        closely adjacent domain.<Ref n={21} />
      </p>

      {/* ── 4. Building institutional capacity ── */}
      <h2 id="institutional-capacity" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Building institutional capacity
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK&rsquo;s &ldquo;pro-innovation&rdquo; approach to AI, delegating
        oversight to existing sectoral regulators through five cross-cutting
        principles (safety, transparency, fairness, accountability,
        contestability), has the right instinct but lacks the infrastructure to
        succeed.<Ref n={9} /> The approach was set out in the March 2023 white
        paper and reinforced by subsequent policy statements,<Ref n={22} /> but
        the gap between the framework&rsquo;s ambition and the regulators&rsquo;
        capacity to deliver it has widened rather than narrowed. The problem is
        that the framework distributes responsibility without distributing
        capability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Ofcom, the FCA, the CMA, and the ICO each face AI governance challenges
        that sit at the centre of their mandates. Ofcom must address
        AI-generated disinformation and deepfakes under the Online Safety Act.
        The FCA must govern the use of AI in credit decisions, algorithmic
        trading, and customer service.<Ref n={23} /> The CMA must assess whether
        foundation model providers are engaging in anti-competitive practices.<Ref n={24} />
        The ICO must enforce data protection principles against AI systems
        that process personal data in ways that are technically opaque.<Ref n={25} />
        Each of these challenges needs deep technical understanding of how AI
        systems work, not academic computer science but the practical sort:
        knowing what questions to ask, what evidence to demand, which vendor
        claims deserve scepticism.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Most regulators do not have this capacity, and they cannot build it on
        their own. The talent market for people who combine technical AI
        expertise with regulatory experience is vanishingly small. The private
        sector absorbs most technical AI talent at salaries public sector
        bodies cannot match. Even AISI, which has done relatively well at
        attracting technical staff, has benefited from the novelty of its
        mission and a partial insulation from standard civil service pay
        scales. Regulators operating under established HR frameworks have
        neither.<Ref n={26} /> A strategy that relies on each regulator
        independently recruiting and retaining AI expertise is a strategy that
        will fail.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The alternative is to build shared governance infrastructure. We
        propose four components. First, a technical secondment programme that
        places AI engineers from industry and AISI within key regulatory bodies
        for 12-month rotations. The secondees would not write policy. Their
        job would be to build the host organisation&rsquo;s internal technical
        literacy, train permanent staff, and help develop AI-literate
        regulatory processes. The model has precedents. The Government Digital
        Service pioneered a similar approach to digital skills in the 2010s.
        The FCA&rsquo;s TechSprint programme has shown the value of embedding
        technical practitioners within regulatory teams.<Ref n={23} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, shared AI evaluation infrastructure. At present, any regulator
        that wants to evaluate an AI system must build or procure its own
        testing capability. That is inefficient and produces inconsistent
        standards. A central evaluation facility, building on AISI&rsquo;s
        existing work but with a broader mandate that covers deployed systems
        as well as frontier models, would let regulators submit AI systems for
        independent technical assessment against common benchmarks.<Ref n={18} />
        The parallels are the National Physical Laboratory, which provides
        shared measurement infrastructure, and GCHQ&rsquo;s National Cyber
        Security Centre, which provides shared cyber security assessment
        capability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, common standards for AI impact assessment. Each regulator is
        currently developing its own approach to assessing AI systems within
        its domain. The ICO has its AI and data protection risk toolkit.<Ref n={25} />
        The FCA is developing guidance on AI model risk management. The CMA
        has published its own AI principles.<Ref n={24} /> Sector-specific
        adaptation is appropriate, but the underlying methodology, training
        data quality, bias testing, robustness, transparency, should be
        standardised.<Ref n={27} /> DSIT should convene regulators to develop a
        common AI impact assessment framework, with sector-specific modules
        that build on a shared foundation. Fourth, a horizon-scanning and
        gap-identification function inside the Cabinet Office that continuously
        watches for emerging AI governance risks that fall between regulatory
        mandates. The gaps where no existing regulator is responsible are
        exactly where the worst governance failures tend to happen.
      </p>

      {/* ── 5. International lessons ── */}
      <h2 id="international-lessons" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        5. International lessons
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The EU AI Act is the world&rsquo;s most ambitious attempt at
        comprehensive AI regulation, and its implementation difficulties are
        instructive for any jurisdiction considering a similar approach.<Ref n={5} />
        The Act classifies AI systems into four risk tiers (unacceptable,
        high, limited, minimal) and imposes corresponding obligations, ranging
        from outright bans to transparency requirements.<Ref n={8} /> In
        theory, that provides legal certainty and a clear compliance framework.
        In practice, implementation is revealing problems that were foreseeable
        from the outset. Companies are struggling to classify their AI systems
        within the Act&rsquo;s risk categories, particularly where a single
        model is used across multiple applications with different risk
        profiles. The Act&rsquo;s provisions on foundation models, inserted
        late in the legislative process in response to ChatGPT, sit uneasily
        with the rest of the framework and have generated significant
        uncertainty about compliance.<Ref n={13} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        More telling: the EU lacks the enforcement capacity to make the Act
        effective. The newly created AI Office has a modest staff count and
        budget relative to the scale of its mandate.<Ref n={28} /> National
        competent authorities in member states are at varying stages of
        readiness, and many have yet to establish the technical infrastructure
        needed to audit AI systems. The Act&rsquo;s requirement for
        &ldquo;conformity assessments&rdquo; of high-risk AI systems presumes
        qualified auditors and agreed standards. Neither exists at scale. The
        European Commission has acknowledged that full enforcement will take
        years, during which the technology will have moved on. The EU&rsquo;s
        experience demonstrates Level 2 of the Governance Maturity Model in
        its purest form: a legal framework that is rigorous on paper and
        structurally hard to implement.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The United States has taken a very different path. The Biden
        administration&rsquo;s October 2023 Executive Order on AI was the most
        significant federal AI policy intervention: it set reporting
        requirements for frontier model developers, directed agencies to
        address AI risks within their domains, and put money into AI safety
        research.<Ref n={29} /> The approach had the virtue of speed. An
        executive order can be issued in weeks; the EU AI Act took three years
        to legislate. It also had fundamental limitations. Executive orders
        are reversible by subsequent administrations, as the Trump
        administration showed by rescinding the order shortly after taking
        office in January 2025.<Ref n={30} /> That is a different failure
        mode: governance that is adaptive but impermanent, tied to political
        cycles rather than built into durable institutional capacity. The US
        currently has no federal AI legislation, and the patchwork of
        state-level initiatives (Colorado&rsquo;s AI consumer protection act,
        California&rsquo;s various proposals, and others) produces exactly the
        fragmented, inconsistent picture that comprehensive approaches are
        meant to avoid.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Singapore offers the most instructive model for the UK. Instead of
        comprehensive legislation, Singapore has built an adaptive governance
        ecosystem from a combination of voluntary frameworks, regulatory
        sandboxes, and institutional capacity-building.<Ref n={20} /> The
        Infocomm Media Development Authority&rsquo;s Model AI Governance
        Framework, first published in 2019 and regularly updated, gives
        organisations practical guidance they can adopt incrementally.<Ref n={31} />
        AI Verify&rsquo;s testing framework offers a concrete tool for
        assessing AI systems against governance principles. Alongside that,
        Singapore has invested in the institutional infrastructure that makes
        voluntary approaches stick: a well-resourced national AI office, deep
        government-industry dialogue mechanisms, and a public sector with
        genuine technical literacy at senior levels.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Singapore&rsquo;s approach is close to Level 4 on the Governance
        Maturity Model: adaptive governance that can evolve with the
        technology without needing new legislation for each development. Its
        limitations are also instructive. The model leans heavily on
        government-industry trust, works best at the scale of a city-state
        with relatively few major AI deployers, and depends on a quality of
        public sector that not every country can replicate. The UK cannot
        simply copy Singapore, but it can learn from the underlying
        principles: invest in institutional capacity first, use voluntary
        frameworks to build norms and expectations, deploy regulation
        selectively for specific high-risk applications, and keep the
        flexibility to adapt as the technology evolves.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Several other jurisdictions are worth watching. Canada&rsquo;s
        Artificial Intelligence and Data Act, part of the broader Bill C-27,
        has faced sustained criticism for vague definitions and uncertain
        enforcement mechanisms. A cautionary tale about legislating before
        building the institutional capacity to implement.<Ref n={32} /> Japan
        has taken a &ldquo;social principles&rdquo; approach that pushes
        human-centred AI development through non-binding guidelines and
        industry self-governance. It has preserved flexibility but raised real
        questions about accountability.<Ref n={33} /> The pattern: jurisdictions
        that invested in institutional capacity before or alongside legislative
        action have fared better than those that legislated first and tried to
        build capacity afterwards.
      </p>

      {/* ── 6. Policy recommendations ── */}
      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        6. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our recommendations are deliberately institutional rather than
        legislative. The UK does not need more AI laws. It needs the capacity
        to govern AI well within existing legal frameworks, and to adapt as
        the technology evolves. The six recommendations below are ordered by
        priority and feasibility. The first three are achievable within the
        current Parliament; the last three need longer-term investment.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        First, establish an AI Governance Capacity Unit within the Cabinet
        Office. The unit should be small (30&ndash;50 staff), technically
        capable, and tasked with building cross-departmental AI governance
        competence, not centralising AI oversight. Its core functions:
        coordinate the technical secondment programme below; manage shared
        evaluation infrastructure; convene regulators on common standards; run
        the horizon-scanning function that identifies governance gaps. The
        unit should report to a minister with genuine cross-departmental
        authority, the Chancellor of the Duchy of Lancaster or equivalent, to
        avoid being captured by any single department&rsquo;s priorities. Its
        relationship with DSIT&rsquo;s AI policy team should be complementary.
        DSIT leads on AI industrial strategy and international engagement. The
        Cabinet Office unit leads on governance capacity and cross-departmental
        coordination.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, create an AI Technical Secondment Programme. The programme
        should place 50&ndash;100 AI engineers and researchers within key
        regulatory bodies each year, funded centrally and run by the Governance
        Capacity Unit. Priority placements should be Ofcom (AI-generated
        content and deepfakes), the FCA (AI in financial services), the CMA
        (AI and market competition), the ICO (AI and data protection), and the
        NHS (AI in clinical decision-making). Secondees should come from AISI,
        the Alan Turing Institute, and, importantly, industry, with proper
        conflict-of-interest protections.<Ref n={34} /> The programme should be
        designed to build permanent institutional capacity, not a permanent
        dependency on secondees. Every placement should include a knowledge
        transfer plan that trains permanent staff.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, build shared AI evaluation infrastructure. AISI&rsquo;s existing
        work on frontier model evaluation is the obvious foundation. A broader
        facility should be set up on top of it, one that regulators can use to
        assess AI systems against sector-specific benchmarks.<Ref n={18} />
        The facility needs to cover more than frontier models. The AI systems
        regulators actually encounter, fine-tuned models, compound AI systems,
        AI-integrated products, should be in scope, with criteria that cover
        reliability, bias, robustness, and transparency. The facility should
        run on a service model, so regulators can commission assessments as
        needed. Its methodologies should be open and reproducible to build
        industry confidence and let companies self-assess.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Fourth, require annual AI governance readiness assessments for all
        government departments and regulators with significant AI exposure.
        Each assessment should cover the organisation&rsquo;s technical
        understanding of AI systems within its remit, the adequacy of its
        processes for spotting and responding to AI-related risks, its
        capacity to engage meaningfully with industry, and its ability to
        coordinate with other regulators on cross-cutting issues. Assessments
        should be run by the Governance Capacity Unit and published, which
        creates both accountability and a baseline for measuring progress.
        This is a diagnostic tool, not a compliance exercise: the point is to
        find where governance capacity is weakest and direct investment there.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Fifth, convene an AI Governance Standards Board. The Board, with
        membership drawn from regulators, industry, academia, and civil
        society, should develop the common AI impact assessment framework
        described in Section 4. It should operate on a model similar to the
        Financial Reporting Council: independent of government but with
        statutory recognition, and empowered to develop standards that
        regulators can adopt within their own frameworks.<Ref n={27} />
        Convergence without rigidity is the goal, a shared foundation that
        allows sector-specific adaptation without the fragmentation that
        currently characterises UK AI governance. The Board should also act as
        the UK&rsquo;s interface with international AI standards processes, so
        domestic governance standards stay compatible with emerging global
        norms.<Ref n={35} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Sixth, and most ambitiously: reorient the UK&rsquo;s international AI
        strategy around governance capacity rather than safety summitry. The
        Bletchley Park and Seoul summits established the UK as a convener on
        AI safety, but the follow-through has been uneven, and the space is
        increasingly crowded with competing initiatives.<Ref n={36} /> The
        UK&rsquo;s distinctive contribution should be practical governance:
        share the institutional models, evaluation methodologies, and
        capacity-building approaches developed domestically with partner
        countries, particularly in the Commonwealth and Global South where AI
        governance capacity is most urgently needed. This is a public good and
        a strategic investment. Countries that adopt UK-compatible governance
        approaches become natural partners for trade, data-sharing, and
        technology cooperation. DSIT and the FCDO should jointly develop an AI
        Governance Partnership Programme that makes UK governance expertise
        available to partner governments, funded through existing ODA
        commitments.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted">
        These recommendations share a logic. They treat governance capacity as
        infrastructure, to be built ahead of time and maintained continuously,
        rather than as a reactive response to individual AI applications or
        crises. The UK has a real opportunity to pioneer an approach to AI
        governance that is more effective than the EU&rsquo;s prescriptive
        regulation, more durable than the US&rsquo;s executive action, and
        more scalable than Singapore&rsquo;s city-state model. That
        opportunity will be lost if the debate stays stuck in the binary of
        &ldquo;regulate versus not regulate.&rdquo; The question is not
        whether to govern AI. It is how to build the institutions capable of
        governing it well.
      </p>

      <Footnotes notes={[
        "OECD, 'OECD Principles on Artificial Intelligence,' OECD Legal Instruments, May 2019 (updated June 2024).",
        "Alan Turing Institute, 'AI Standards Hub: UK Regulatory Landscape Assessment,' June 2025.",
        "Brookings Institution, 'Governance Innovation for a World Shaped by AI,' Centre for Technology Innovation, October 2024.",
        "AI Policy Exchange, 'The Regulatory Lag Paradox: Legislative Timescales and Technological Change in AI Governance,' Working Paper 2026-02, February 2026.",
        "European Parliament, 'Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (AI Act),' Official Journal of the European Union, August 2024.",
        "Ada Lovelace Institute, 'Regulate to Innovate: The EU AI Act and Future AI Governance,' September 2025.",
        "Centre for the Governance of AI, 'Lessons from the History of Technology Regulation for AI Policy,' GovAI Working Paper, March 2025.",
        "European Parliament, 'AI Act: Article 3(1) — Definitions,' Regulation (EU) 2024/1689, Official Journal of the European Union, August 2024.",
        "Department for Science, Innovation and Technology, 'A Pro-Innovation Approach to AI Regulation,' Cm 9781, March 2023.",
        "CSET Georgetown, 'AI Timeline Tracker: From GPT-3 to Frontier Models,' Centre for Security and Emerging Technology, January 2025.",
        "AI Policy Exchange, 'Beyond the Regulatory Sweet Spot: Why Adaptive Governance Outperforms Prescriptive Legislation,' Policy Brief 2025-08, November 2025.",
        "Brookings Institution, 'How AI Regulation May Entrench Market Dominance,' TechTank, April 2025.",
        "Ada Lovelace Institute, 'Who Benefits? The Distributional Impact of AI Regulation on European Startups,' July 2025.",
        "OECD, 'Defining and Classifying AI: Challenges for Regulatory Frameworks,' OECD Digital Economy Papers No. 358, March 2025.",
        "European Parliament, 'AI Act: Articles 16–27 — Obligations for Providers and Deployers of High-Risk AI Systems,' Regulation (EU) 2024/1689, Official Journal of the European Union, August 2024.",
        "CSET Georgetown, 'Emergent Capabilities in Large Language Models: Implications for Pre-Market Safety Assessment,' Centre for Security and Emerging Technology, September 2024.",
        "Alan Turing Institute, 'AI Skills Gap in UK Public Sector Regulators: A Quantitative Assessment,' Data & AI Research Programme, January 2026.",
        "AI Safety Institute, 'Approach to Evaluations: Technical Report,' Department for Science, Innovation and Technology, May 2025.",
        "Institute for Government, 'Regulators and AI: Closing the Capacity Gap,' IfG Policy Paper, October 2025.",
        "Infocomm Media Development Authority, 'Model AI Governance Framework, Second Edition,' Singapore, 2024.",
        "Sir Wyn Williams, 'The Post Office Horizon IT Inquiry: Interim Report,' HC 2024-25, September 2024.",
        "Department for Science, Innovation and Technology, 'A Pro-Innovation Approach to AI Regulation: Government Response to Consultation,' Cm 9908, February 2024.",
        "Financial Conduct Authority, 'AI and Machine Learning in Financial Services: Feedback Statement FS2/23,' April 2023.",
        "Competition and Markets Authority, 'AI Foundation Models: Final Report,' CMA183, September 2025.",
        "Information Commissioner's Office, 'AI and Data Protection Risk Toolkit, Version 2.0,' March 2025.",
        "National Audit Office, 'Use of AI in Government: Workforce Readiness,' HC 2025-26, November 2025.",
        "Alan Turing Institute, 'Common Framework for AI Impact Assessment: A Cross-Sectoral Approach,' AI Standards Hub, September 2025.",
        "European Commission, 'EU AI Office: First Annual Report on the Implementation of the AI Act,' DG Connect, February 2026.",
        "White House, 'Executive Order 14110 on the Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence,' Federal Register Vol. 88, No. 210, October 2023.",
        "White House, 'Executive Order on Removing Barriers to American Leadership in Artificial Intelligence,' January 2025.",
        "Infocomm Media Development Authority, 'AI Verify: An AI Governance Testing Framework and Software Toolkit,' Singapore, 2023 (updated 2025).",
        "Office of the Privacy Commissioner of Canada, 'Submission on Bill C-27: Concerns Regarding the Artificial Intelligence and Data Act,' December 2023.",
        "Government of Japan, 'Social Principles of Human-Centric AI,' Integrated Innovation Strategy Promotion Council, revised March 2024.",
        "Alan Turing Institute, 'Building AI Capacity in UK Regulators: A Secondment Model,' AI Standards Hub Occasional Paper, December 2025.",
        "OECD, 'Recommendation of the Council on Artificial Intelligence: Progress Report on National Implementation,' OECD/LEGAL/0449, November 2025.",
        "Chatham House, 'After the Summits: Evaluating the UK's International AI Safety Agenda,' Research Paper, January 2026.",
      ]} />
    </BriefLayout>
  );
}
