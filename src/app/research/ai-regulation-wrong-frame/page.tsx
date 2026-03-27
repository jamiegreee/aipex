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
        The dominant framing of AI policy as a question of &ldquo;regulation&rdquo;
        is actively unhelpful. It implies that the primary task is to constrain a
        defined technology within legal boundaries &ndash; an approach that worked
        tolerably for previous technologies but fails fundamentally for AI.<Ref n={1} /> The
        framing invites legislators to reach for familiar tools &ndash; product
        safety rules, licensing regimes, sector-specific compliance requirements
        &ndash; and in doing so obscures what is genuinely novel about the
        challenge. AI is not a product category. It is a general-purpose
        capability that is simultaneously transforming financial services,
        healthcare, education, defence, public administration, and creative
        industries.<Ref n={2} /> No single regulatory instrument can meaningfully govern
        something that pervasive, and the attempt to build one produces either
        legislation so abstract it is unenforceable, or so specific it is
        obsolete before the ink dries.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This brief argues that the United Kingdom needs to reframe the
        conversation from regulation to governance. The distinction is not
        semantic. Regulation is a subset of governance: it concerns binding
        rules and their enforcement. Governance is the broader system of
        institutions, norms, processes, and capabilities through which a society
        steers complex transitions.<Ref n={3} /> The UK already governs many domains that
        resist simple regulation &ndash; monetary policy, public health
        emergencies, cyber security &ndash; through adaptive institutional
        arrangements rather than static rulebooks. AI demands the same approach.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        We introduce two original frameworks. First, the &ldquo;Governance
        Maturity Model&rdquo; &ndash; a four-level schema that maps where
        different countries sit on the spectrum from reactive regulation to
        adaptive governance, and identifies the institutional investments needed
        to progress. Second, the concept of &ldquo;governance as
        infrastructure&rdquo; &ndash; the argument that governance capacity
        should be built and maintained like digital infrastructure, as a shared
        platform capability rather than something assembled ad hoc in response to
        each new AI application.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        We also identify what we call the &ldquo;regulatory lag paradox&rdquo;:
        the observation that by the time a regulation is drafted, consulted upon,
        legislated, and enforced, the technology it targets has already evolved
        beyond the regulation&rsquo;s assumptions.<Ref n={4} /> This is not a temporary
        problem that will resolve once AI &ldquo;matures.&rdquo; It is a
        structural feature of a technology whose capabilities shift on a
        timescale of months while legislative processes operate on a timescale of
        years. The paradox is sharpest in jurisdictions that have invested most
        heavily in comprehensive AI legislation &ndash; the EU being the most
        prominent example.<Ref n={5} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our central recommendation is the creation of an AI Governance Capacity
        Unit within the Cabinet Office, charged not with writing new rules but
        with building the institutional competence that UK regulators and
        government departments need to govern AI within their existing mandates.
        This unit would coordinate technical secondments, develop shared
        evaluation infrastructure, establish common standards for AI impact
        assessment, and identify governance gaps before they become crises. The
        goal is not to replace DSIT&rsquo;s policy function or the AI Safety
        Institute&rsquo;s technical work, but to solve the coordination and
        capacity problems that currently prevent the UK&rsquo;s sectoral
        regulators from exercising effective oversight.<Ref n={6} />
      </p>

      {/* ── 1. The regulation trap ── */}
      <h2 id="regulation-trap" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        1. The regulation trap
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The instinct to &ldquo;regulate AI&rdquo; is politically irresistible
        but analytically confused. It assumes AI is a product category like
        pharmaceuticals or financial instruments &ndash; something that can be
        tested, approved, and monitored within a defined framework. This
        assumption reflects a mental model of technology governance forged in the
        twentieth century, when the objects of regulation were comparatively
        stable. A new drug takes a decade to develop and then remains
        substantially the same product for years. A financial instrument can be
        formally described and its risk properties modelled. These
        characteristics make traditional regulation viable: you can specify what
        is being regulated, define acceptable behaviour, and enforce compliance
        through inspection. AI shares none of these properties.<Ref n={7} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Consider the definitional problem alone. Any regulation requires a
        clear definition of its object. But what counts as &ldquo;AI&rdquo;?
        The EU AI Act defines it as a &ldquo;machine-based system that is
        designed to operate with varying levels of autonomy and that may exhibit
        adaptiveness after deployment.&rdquo;<Ref n={8} /> This is broad enough to capture
        almost any software with a feedback loop and narrow enough to miss
        important uses of large language models that operate without traditional
        autonomy. The UK&rsquo;s approach has wisely avoided a statutory
        definition, but this creates its own problems: without a definition,
        sectoral regulators must each decide what falls within their remit, and
        the inevitable inconsistencies create arbitrage opportunities and
        compliance confusion for firms operating across sectors.<Ref n={9} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The deeper issue is what we term the &ldquo;regulatory lag
        paradox.&rdquo; Traditional regulation assumes a relatively stable
        relationship between the rule and its object. Environmental emissions
        standards, building codes, food safety requirements &ndash; these all
        regulate phenomena that change slowly relative to the legislative cycle.
        AI capabilities, by contrast, shift on a timescale of months. When the
        EU began drafting the AI Act in April 2021, GPT-3 had been released for
        less than a year, ChatGPT did not exist, and the idea that AI systems
        would be capable of writing legislation, generating photorealistic
        imagery, or conducting scientific research was confined to speculative
        futurism.<Ref n={10} /> By the time the Act received final approval in March 2024,
        the technological landscape had transformed beyond recognition. The
        Act&rsquo;s risk categories, compliance requirements, and enforcement
        mechanisms were designed for a world that no longer existed.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This is not a criticism of the EU&rsquo;s drafters, who were competent
        and well-intentioned. It is a structural observation about the
        mismatch between legislative timescales and technological change.
        The paradox is self-reinforcing: the more comprehensive the regulation,
        the longer it takes to draft and pass, and therefore the greater the gap
        between the technology it was designed for and the technology it actually
        governs. Narrow, targeted rules can be updated more quickly, but they
        inevitably leave large areas of AI deployment ungoverned. There is no
        sweet spot within the regulatory paradigm that resolves this tension.<Ref n={11} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The political economy of AI regulation compounds these problems.
        Regulation creates compliance costs, and compliance costs create
        lobbying incentives. The result is that AI regulation tends to be shaped
        by the firms large enough to absorb compliance overhead &ndash; which
        are, not coincidentally, the firms that already dominate the AI market.<Ref n={12} />
        The EU AI Act&rsquo;s requirements for foundation model providers, for
        instance, are substantially more manageable for a company with a
        dedicated compliance team of hundreds than for a European startup
        attempting to compete. Regulation intended to protect citizens can
        inadvertently consolidate market power, an outcome that is neither
        pro-innovation nor pro-safety.<Ref n={13} />
      </p>

      {/* ── 2. Why AI breaks the regulatory model ── */}
      <h2 id="why-ai-breaks-model" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        2. Why AI breaks the regulatory model
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The regulatory model that served the twentieth century rests on several
        assumptions, each of which AI violates. The first is that the object
        of regulation is identifiable and bounded. A car is a car; a bank is a
        bank. But an AI system might be a medical diagnostic tool on Monday, a
        legal research assistant on Tuesday, and a creative writing partner on
        Wednesday &ndash; the same underlying model, accessed through different
        interfaces, governed by different sectoral regulators, with entirely
        different risk profiles depending on context of use.<Ref n={14} /> This is not an edge
        case; it is the defining characteristic of general-purpose AI. No
        previous technology has presented regulators with an object that shifts
        its risk category depending on how it is deployed.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The second violated assumption is that the supply chain is legible.
        Traditional regulation traces a clear path from manufacturer to end
        user. Pharmaceutical regulation can identify who synthesised a compound,
        who tested it, who approved it, and who prescribed it. AI supply chains
        are far more diffuse. A frontier model is trained by one company on data
        from thousands of sources, fine-tuned by another company for a specific
        domain, deployed by a third through an API, integrated by a fourth into
        a consumer-facing product, and customised by the end user through
        prompting. Where in this chain does regulatory responsibility sit? The
        EU AI Act attempts to distribute obligations across the chain, assigning
        duties to &ldquo;providers&rdquo; and &ldquo;deployers,&rdquo;<Ref n={15} /> but the
        practical enforceability of these distinctions is already being tested
        by the reality of how AI systems are built, modified, and used.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The third assumption is that risk can be assessed prior to deployment
        and remains relatively stable thereafter. Pharmaceuticals undergo
        multi-year clinical trials before reaching patients. Financial products
        are stress-tested against defined scenarios. AI systems, particularly
        those based on large language models, exhibit emergent behaviours that
        are not predictable from their training data or architecture.<Ref n={16} /> A model
        that passes every safety benchmark at the time of deployment may
        develop unexpected capabilities or failure modes as it is exposed to
        real-world inputs. The concept of pre-market approval, which underpins
        most product safety regulation, assumes that the product that is
        assessed is the product that is used. For adaptive AI systems, this
        assumption does not hold.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The fourth assumption is that the regulated entity and the regulator
        operate within a shared jurisdiction. AI models are trained in one
        country, hosted in another, accessed globally through APIs, and fine-
        tuned locally. A UK regulator attempting to enforce compliance against a
        model hosted in the United States, trained on data from dozens of
        jurisdictions, and accessed by UK users through a wrapper built by an
        Indian startup, faces jurisdictional challenges that make conventional
        enforcement mechanisms largely theoretical. This is not a new problem
        &ndash; internet regulation faces similar difficulties &ndash; but the
        speed of AI deployment and the opacity of AI supply chains make it
        considerably more acute.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Finally, regulation assumes that the regulator possesses &ndash; or can
        acquire &ndash; sufficient expertise to evaluate compliance. For most
        regulated industries, this is achievable: the FCA employs people who
        understand financial instruments, the MHRA employs people who understand
        pharmacology. But the technical frontier of AI is advancing so rapidly
        that even well-resourced regulators struggle to maintain relevant
        expertise.<Ref n={17} /> The AI Safety Institute has made significant investments in
        technical evaluation capacity, but its mandate is focused on frontier
        models and catastrophic risk.<Ref n={18} /> The sectoral regulators who must govern
        the vast majority of AI deployments &ndash; Ofcom dealing with
        AI-generated content, the FCA with AI in financial services, the CMA
        with AI and competition, the ICO with AI and data protection &ndash;
        face a persistent capability gap that cannot be closed by hiring alone,
        because the relevant expertise is scarce and the private sector pays
        multiples of public sector salaries.
      </p>

      {/* ── 3. The governance alternative ── */}
      <h2 id="governance-alternative" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        3. The governance alternative
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Governance is broader than regulation. Where regulation asks &ldquo;what
        rules should we write?&rdquo;, governance asks &ldquo;what institutions,
        processes, and capabilities do we need to manage this transition
        well?&rdquo; This reframing is not a retreat from accountability or
        oversight. It is a recognition that effective oversight of AI requires
        instruments that regulation alone cannot provide: real-time technical
        monitoring, adaptive standards that evolve with the technology,
        cross-sector coordination, and institutional learning at a pace that
        matches technological change.<Ref n={3} /> Regulation remains an important tool
        within the governance toolkit, but it is one tool among many, and
        treating it as the entirety of the response is like trying to manage a
        pandemic with legislation alone.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        We propose what we call the &ldquo;Governance Maturity Model&rdquo;
        &ndash; a framework for assessing where jurisdictions sit on the
        spectrum from reactive to adaptive AI governance. The model has four
        levels. Level 1 is &ldquo;reactive regulation&rdquo;: the jurisdiction
        has no AI-specific governance and responds to AI-related harms only
        after they occur, using existing legal frameworks that may or may not be
        adequate. Many developing countries and some US states sit here. Level 2
        is &ldquo;prescriptive regulation&rdquo;: the jurisdiction has enacted
        or is enacting comprehensive AI-specific legislation that defines risk
        categories, mandates compliance procedures, and establishes enforcement
        mechanisms. The EU, following the AI Act, is the paradigmatic example.<Ref n={5} />
        The strength of this level is legal certainty; the weakness is rigidity
        and the regulatory lag paradox described above.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Level 3 is &ldquo;coordinated oversight&rdquo;: the jurisdiction
        distributes AI governance across existing sectoral regulators, with a
        central coordinating function that ensures consistency and fills gaps.
        The UK&rsquo;s current framework aspires to this level but has not yet
        achieved it, because the coordinating function (currently split between
        DSIT, AISI, and the Cabinet Office) lacks the authority and resources to
        be effective.<Ref n={19} /> Level 4 is &ldquo;adaptive governance&rdquo;: the
        jurisdiction has built the institutional infrastructure for continuous
        learning and adaptation &ndash; real-time monitoring capabilities,
        regulatory sandboxes that feed into policy, structured feedback loops
        between industry and government, and the capacity to update governance
        frameworks without primary legislation. Singapore, as we discuss in
        Section 5, comes closest to this level, though no jurisdiction has fully
        achieved it.<Ref n={20} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The Governance Maturity Model is not a simple hierarchy in which higher
        levels are always better. Level 2 prescriptive regulation may be
        appropriate for specific high-risk applications where legal certainty is
        paramount &ndash; AI in criminal sentencing, for example, or autonomous
        weapons systems. The argument is not that regulation is never the right
        tool, but that a jurisdiction&rsquo;s overall approach to AI governance
        should aspire to Level 3 or 4, deploying regulation selectively within
        a broader adaptive framework rather than treating it as the default
        instrument.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The second conceptual contribution of this brief is the idea of
        &ldquo;governance as infrastructure.&rdquo; The analogy is deliberate.
        The UK does not build a new broadband network for each digital service;
        it invests in shared digital infrastructure that multiple applications
        can use. Similarly, governance capacity should not be built from scratch
        for each AI application or sector. The ability to evaluate an AI
        model&rsquo;s reliability, to audit its training data provenance, to
        assess its impact on a particular population &ndash; these are
        capabilities that recur across every domain in which AI is deployed.
        Building them as shared infrastructure, accessible to every regulator
        and government department, is vastly more efficient than expecting each
        body to develop its own capability independently.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        This infrastructure metaphor also illuminates a critical timing
        question. You do not wait until traffic congestion is unbearable to
        start building roads. You invest ahead of demand, accepting that the
        infrastructure will be underutilised initially. The same logic applies
        to governance capacity. The UK needs to invest now in the institutions,
        skills, and processes that will be needed to govern AI over the coming
        decade, rather than waiting for each governance failure to reveal the
        next capability gap. The cost of building this infrastructure
        proactively is a fraction of the cost of responding reactively to
        governance failures &ndash; as the Post Office Horizon scandal
        illustrates in a closely adjacent domain.<Ref n={21} />
      </p>

      {/* ── 4. Building institutional capacity ── */}
      <h2 id="institutional-capacity" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        4. Building institutional capacity
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The UK&rsquo;s &ldquo;pro-innovation&rdquo; approach to AI &ndash;
        delegating oversight to existing sectoral regulators through five
        cross-cutting principles (safety, transparency, fairness,
        accountability, and contestability) &ndash; has the right instinct but
        lacks the infrastructure to succeed.<Ref n={9} /> The approach was set out in the
        March 2023 white paper and reinforced by subsequent policy statements,<Ref n={22} />
        but the gap between the framework&rsquo;s ambition and the
        regulators&rsquo; capacity to deliver it has widened rather than
        narrowed. The fundamental problem is that the framework distributes
        responsibility without distributing capability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Ofcom, the FCA, the CMA, and the ICO each face AI governance challenges
        that are central to their mandates. Ofcom must address AI-generated
        disinformation and deepfakes under its Online Safety Act responsibilities.
        The FCA must govern the use of AI in credit decisions, algorithmic
        trading, and customer service.<Ref n={23} /> The CMA must assess whether foundation
        model providers are engaging in anti-competitive practices.<Ref n={24} /> The ICO must
        enforce data protection principles against AI systems that process
        personal data in ways that are technically opaque.<Ref n={25} /> Each of these
        challenges requires deep technical understanding of how AI systems work
        &ndash; not at the level of academic computer science, but at the
        practical level of knowing what questions to ask, what evidence to
        demand, and what claims to be sceptical of.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Most regulators do not currently have this capacity, and they cannot
        build it independently. The talent market for people who combine
        technical AI expertise with regulatory experience is vanishingly small.
        The private sector absorbs the vast majority of technical AI talent at
        salaries that public sector bodies cannot match. Even AISI, which has
        been relatively successful at attracting technical staff, has benefited
        from the novelty of its mission and its partial insulation from standard
        civil service pay scales &ndash; advantages that are not available to
        regulators operating under established HR frameworks.<Ref n={26} /> A strategy that
        relies on each regulator independently recruiting and retaining AI
        expertise is a strategy that will fail.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The alternative is to build shared governance infrastructure. We propose
        four components. First, a technical secondment programme that places AI
        engineers from industry and AISI within key regulatory bodies for 12-
        month rotations. These secondees would not write policy; they would
        build the internal technical literacy of the host organisation, training
        permanent staff and helping to develop AI-literate regulatory processes.
        The model has precedents: the Government Digital Service pioneered a
        similar approach to digital skills in the 2010s, and the FCA&rsquo;s
        TechSprint programme has demonstrated the value of embedding technical
        practitioners within regulatory teams.<Ref n={23} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, shared AI evaluation infrastructure. Currently, any regulator
        that wants to evaluate an AI system must build or procure its own
        testing capability. This is inefficient and leads to inconsistent
        standards. A central evaluation facility &ndash; building on AISI&rsquo;s
        existing work but with a broader mandate covering deployed systems, not
        just frontier models &ndash; would allow regulators to submit AI
        systems for independent technical assessment against common benchmarks.<Ref n={18} />
        This is analogous to how the National Physical Laboratory provides
        shared measurement infrastructure, or how GCHQ&rsquo;s National Cyber
        Security Centre provides shared cyber security assessment capability.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, common standards for AI impact assessment. Each regulator is
        currently developing its own approach to assessing the impact of AI
        systems within its domain. The ICO has its AI and data protection risk
        toolkit;<Ref n={25} /> the FCA is developing guidance on AI model risk management; the
        CMA has published its own AI principles.<Ref n={24} /> While sector-specific
        adaptation is appropriate, the underlying methodology for assessing AI
        systems &ndash; evaluating training data quality, testing for bias,
        assessing robustness, examining transparency &ndash; should be
        standardised.<Ref n={27} /> DSIT should convene regulators to develop a common AI
        impact assessment framework, with sector-specific modules that build on
        a shared foundation. Fourth, a horizon-scanning and gap-identification
        function within the Cabinet Office that continuously monitors the AI
        governance landscape for emerging risks that fall between regulatory
        mandates &ndash; the gaps that no existing regulator is responsible for,
        which are precisely where the most dangerous governance failures tend to
        occur.
      </p>

      {/* ── 5. International lessons ── */}
      <h2 id="international-lessons" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        5. International lessons
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The EU AI Act is the world&rsquo;s most ambitious attempt at
        comprehensive AI regulation, and its implementation difficulties are
        instructive for any jurisdiction considering a similar approach.<Ref n={5} /> The
        Act classifies AI systems into risk tiers &ndash; unacceptable, high,
        limited, and minimal &ndash; and imposes corresponding obligations
        ranging from outright bans to transparency requirements.<Ref n={8} /> In theory,
        this provides legal certainty and a clear compliance framework. In
        practice, the implementation is revealing problems that were foreseeable
        from the outset. Companies are struggling to classify their AI systems
        within the Act&rsquo;s risk categories, particularly where a single
        model is used across multiple applications with different risk profiles.
        The Act&rsquo;s provisions on foundation models, inserted late in the
        legislative process in response to the emergence of ChatGPT, sit
        uneasily with the rest of the framework and have generated significant
        uncertainty about compliance requirements.<Ref n={13} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        More fundamentally, the EU is discovering that it lacks the enforcement
        capacity to make the Act effective. The newly created AI Office has a
        modest staff count and budget relative to the scale of its mandate.<Ref n={28} />
        National competent authorities in member states are at varying stages of
        readiness, with many yet to establish the technical infrastructure
        needed to audit AI systems. The Act&rsquo;s requirement for
        &ldquo;conformity assessments&rdquo; of high-risk AI systems presumes
        the existence of qualified auditors and agreed standards &ndash;
        neither of which currently exist at scale. The European Commission has
        acknowledged that full enforcement will take years, during which the
        technology will have continued to evolve. The EU&rsquo;s experience
        demonstrates Level 2 of the Governance Maturity Model in its purest
        form: a comprehensive legal framework that is rigorous on paper but
        faces structural challenges in implementation.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        The United States has taken a markedly different path. The Biden
        administration&rsquo;s October 2023 Executive Order on AI was the most
        significant federal AI policy intervention, establishing reporting
        requirements for frontier model developers, directing agencies to
        address AI risks within their domains, and investing in AI safety
        research.<Ref n={29} /> The approach had the virtue of speed &ndash; an executive
        order can be issued in weeks, whereas the EU AI Act took three years to
        legislate &ndash; but also fundamental limitations. Executive orders are
        reversible by subsequent administrations, as demonstrated when the Trump
        administration rescinded the order shortly after taking office in
        January 2025.<Ref n={30} /> This illustrates a different failure mode: governance that
        is adaptive but impermanent, subject to political cycles rather than
        building durable institutional capacity. The US currently lacks any
        federal AI legislation, and the patchwork of state-level initiatives
        &ndash; from Colorado&rsquo;s AI consumer protection act to
        California&rsquo;s various proposals &ndash; creates precisely the kind
        of fragmented, inconsistent governance landscape that comprehensive
        approaches are intended to avoid.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Singapore offers the most instructive model for the UK. Rather than
        pursuing comprehensive legislation, Singapore has built an adaptive
        governance ecosystem through a combination of voluntary frameworks,
        regulatory sandboxes, and institutional capacity-building.<Ref n={20} /> The
        Infocomm Media Development Authority&rsquo;s Model AI Governance
        Framework, first published in 2019 and regularly updated, provides
        practical guidance that organisations can adopt incrementally.<Ref n={31} /> The
        AI Verify foundation&rsquo;s testing framework offers a concrete tool
        for assessing AI systems against governance principles. Crucially,
        Singapore has invested in the institutional infrastructure that makes
        these voluntary approaches effective: a well-resourced national AI
        office, deep government-industry dialogue mechanisms, and a public
        sector with genuine technical literacy at senior levels.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Singapore&rsquo;s approach represents something close to Level 4 on
        the Governance Maturity Model &ndash; adaptive governance that can
        evolve with the technology without requiring new legislation for each
        development. Its limitations are also instructive: the model relies
        heavily on government-industry trust, works best at the scale of a
        city-state with a relatively small number of major AI deployers, and
        depends on a quality of public sector that not every country can
        replicate. The UK cannot simply copy Singapore&rsquo;s approach, but it
        can learn from the underlying principles: invest in institutional
        capacity first, use voluntary frameworks to build norms and
        expectations, deploy regulation selectively for specific high-risk
        applications, and maintain the flexibility to adapt as the technology
        evolves.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Several other jurisdictions offer relevant lessons. Canada&rsquo;s
        Artificial Intelligence and Data Act, part of the broader Bill C-27,
        has faced sustained criticism for vague definitions and uncertain
        enforcement mechanisms &ndash; a cautionary tale about legislating
        without first building the institutional capacity to implement.<Ref n={32} /> Japan
        has pursued a &ldquo;social principles&rdquo; approach, emphasising
        human-centric AI development through non-binding guidelines and
        industry self-governance, which has maintained flexibility but
        raised questions about accountability.<Ref n={33} /> The common thread is that
        jurisdictions which invested in institutional capacity before or
        alongside legislative action have fared better than those which
        legislated first and attempted to build capacity afterwards.
      </p>

      {/* ── 6. Policy recommendations ── */}
      <h2 id="policy-recommendations" className="text-[24px] font-normal leading-[34px] mt-12 mb-6">
        6. Policy recommendations
      </h2>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Our recommendations are deliberately institutional rather than
        legislative. The UK does not need more AI laws &ndash; it needs the
        capacity to govern AI well within existing legal frameworks, adapting
        as the technology evolves. The following six recommendations are ordered
        by priority and feasibility, with the first three achievable within the
        current Parliament and the latter three requiring longer-term investment.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        First, establish the AI Governance Capacity Unit within the Cabinet
        Office. This unit should be small (30&ndash;50 staff), technically
        capable, and explicitly tasked with building cross-departmental AI
        governance competence rather than centralising AI oversight. Its core
        functions would include: coordinating the technical secondment programme
        described below; managing shared evaluation infrastructure; convening
        regulators to develop common standards; and conducting the horizon-
        scanning function that identifies governance gaps. The unit should report
        to a minister with genuine cross-departmental authority &ndash; the
        Chancellor of the Duchy of Lancaster or equivalent &ndash; to avoid
        being captured by any single department&rsquo;s priorities. Its
        relationship with DSIT&rsquo;s AI policy team should be complementary:
        DSIT leads on AI industrial strategy and international engagement; the
        Cabinet Office unit leads on governance capacity and cross-departmental
        coordination.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Second, create the AI Technical Secondment Programme. This programme
        should place 50&ndash;100 AI engineers and researchers within key
        regulatory bodies annually, funded centrally and administered by the
        Governance Capacity Unit. Priority placements should be Ofcom (AI-
        generated content and deepfakes), the FCA (AI in financial services),
        the CMA (AI and market competition), the ICO (AI and data protection),
        and the NHS (AI in clinical decision-making). Secondees should be drawn
        from AISI, the Alan Turing Institute, and &ndash; critically &ndash;
        industry, with appropriate conflict-of-interest protections.<Ref n={34} /> The
        programme should be designed to build permanent institutional capacity,
        not to create a permanent dependency on secondees: each placement should
        include a knowledge transfer plan that trains permanent staff.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Third, develop shared AI evaluation infrastructure. Building on
        AISI&rsquo;s existing work on frontier model evaluation, create a
        broader facility that regulators can access to assess AI systems against
        sector-specific benchmarks.<Ref n={18} /> This facility should have the capacity to
        evaluate not just frontier models but the deployed AI systems that
        regulators actually encounter &ndash; fine-tuned models, compound AI
        systems, AI-integrated products &ndash; against criteria that include
        reliability, bias, robustness, and transparency. The facility should
        operate on a service model, with regulators able to commission
        assessments as needed, and its methodologies should be open and
        reproducible to build industry confidence and enable self-assessment.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Fourth, mandate annual AI governance readiness assessments for all
        government departments and regulators with significant AI exposure. These
        assessments should evaluate: the organisation&rsquo;s technical
        understanding of AI systems within its remit; the adequacy of its
        processes for identifying and responding to AI-related risks; its
        capacity to engage meaningfully with industry on AI governance questions;
        and its ability to coordinate with other regulators on cross-cutting
        issues. The assessments should be conducted by the Governance Capacity
        Unit and published, creating both accountability and a benchmark for
        measuring progress. This is not an exercise in bureaucratic compliance
        &ndash; it is a diagnostic tool for identifying where governance
        capacity is weakest and directing investment accordingly.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Fifth, convene the AI Governance Standards Board. This body, drawing
        membership from regulators, industry, academia, and civil society,
        should develop the common AI impact assessment framework described in
        Section 4. The Board should operate on a model similar to the Financial
        Reporting Council &ndash; independent of government but with statutory
        recognition &ndash; and should be empowered to develop standards that
        regulators can adopt within their own frameworks.<Ref n={27} /> The goal is
        convergence without rigidity: a shared foundation that allows sector-
        specific adaptation while preventing the fragmentation that currently
        characterises UK AI governance. The Board should also serve as the
        UK&rsquo;s interface with international AI standards processes,
        ensuring that domestic governance standards are compatible with emerging
        global norms.<Ref n={35} />
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted mb-6">
        Sixth, and most ambitiously, reorient the UK&rsquo;s international AI
        strategy around governance capacity rather than safety summitry. The
        Bletchley Park and Seoul summits established the UK as a convener on
        AI safety, but the follow-through has been uneven, and the space is
        increasingly crowded with competing initiatives.<Ref n={36} /> The UK&rsquo;s
        distinctive contribution should be in practical governance &ndash;
        sharing the institutional models, evaluation methodologies, and
        capacity-building approaches developed domestically with partner
        countries, particularly in the Commonwealth and Global South where
        AI governance capacity is most urgently needed. This is both a public
        good and a strategic investment: countries that adopt UK-compatible
        governance approaches become natural partners for trade, data-sharing,
        and technology cooperation. DSIT and the FCDO should jointly develop
        an AI Governance Partnership Programme that makes UK governance
        expertise available to partner governments, funded through existing
        ODA commitments.
      </p>
      <p className="text-[14px] font-light leading-[26px] text-muted">
        These recommendations share a common logic: they treat governance
        capacity as infrastructure, to be built proactively and maintained
        continuously, rather than as a reactive response to individual AI
        applications or crises. The UK has a genuine opportunity to pioneer an
        approach to AI governance that is more effective than the EU&rsquo;s
        prescriptive regulation, more durable than the US&rsquo;s executive
        action, and more scalable than Singapore&rsquo;s city-state model. But
        that opportunity will be lost if the debate remains trapped in the
        binary of &ldquo;regulate versus not regulate.&rdquo; The question is
        not whether to govern AI &ndash; it is how to build the institutions
        capable of governing it well.
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
