import type { Course, Lesson } from "@/lib/courses";
import { resources as r } from "./resources";

// Reading selections and AIPEX application questions reviewed 13 October 2026.
// The fictional cases and worked answers remain AIPEX's original teaching.
type Resource = (typeof r)[keyof typeof r];
type SourceNote = {
  connection: string;
  readings: (Resource & { guidance: string })[];
};
const read = (resource: Resource, guidance: string) => ({
  ...resource,
  guidance,
});

const notes: Record<string, SourceNote> = {
  "a-policy-problem-not-a-technology": {
    connection:
      "Use the Green Book's objectives-led appraisal alongside the Service Standard's user-needs perspective. Before proposing a recruitment tool, ask what would improve applicants' experience and what Northbridge can actually decide.",
    readings: [
      read(
        r.green,
        "Read the rationale and objectives discussion. Rewrite Northbridge's assignment without assuming an AI solution.",
      ),
      read(
        r.service,
        "Read points 1 and 2 on user needs and whole problems. Identify an applicant need missing from the supplier's framing.",
      ),
    ],
  },
  "objectives-and-theory-of-change": {
    connection:
      "The Magenta Book supplies the theory-of-change method; the OECD principles supply a different lens on desirable AI outcomes. A causal chain and a statement of values do different jobs. Test whether your proposed mechanism supports the outcome you chose.",
    readings: [
      read(
        r.magenta,
        "Read section 2.2.1, Understanding the intervention. Mark a weak causal link and an assumption in your Northbridge theory of change.",
      ),
      read(
        r.oecd,
        "Read the values-based principles. Choose a relevant outcome and explain how you would observe it; these principles are not a substitute for domestic law.",
      ),
    ],
  },
  "audit-an-evidence-claim": {
    connection:
      "Model Cards proposes structured reporting of intended uses and evaluation. NIST's MEASURE function asks how risk is assessed in context. Use both to interrogate a supplier's accuracy claim rather than treating a headline score as a deployment decision.",
    readings: [
      read(
        r.modelCards,
        "Read the model-card reporting framework, especially intended use and evaluation. List three disclosures missing from Northbridge's supplier claim.",
      ),
      read(
        r.nist,
        "Read MEASURE 2.1, 2.3 and 2.5. Ask whether the test population and conditions support the proposed recruitment use.",
      ),
    ],
  },
  "research-under-uncertainty": {
    connection:
      "Compare evaluation planning in the Magenta Book with the range of assurance techniques in DSIT's introduction. A study should answer a decision-relevant question; an audit or impact assessment may answer a different one. Explain what uncertainty your chosen approach would leave unresolved.",
    readings: [
      read(
        r.magenta,
        "Read the discussion of evaluation purpose and questions in section 2.2.2. Rank Northbridge's uncertainties by whether resolving them could change the recommendation.",
      ),
      read(
        r.assurance,
        "Read AI assurance mechanisms in section 4.2. Choose an evidence-gathering technique and explain why its result would be useful within six weeks.",
      ),
    ],
  },
  "institutions-and-authority": {
    connection:
      "The DRCF is a voluntary cooperation forum, not a regulator with its own statutory remit. Compare that institutional description with OECD accountability principles. Distinguish coordination, responsibility and legal authority when drawing Northbridge's decision map.",
    readings: [
      read(
        r.regulators,
        "Read Who we are, Members and How we work. Separate each member regulator's role from the forum's coordination function; follow remit links before making a real legal claim.",
      ),
      read(
        r.oecd,
        "Read Accountability. Assign a responsible actor to each Northbridge decision, then identify the separate evidence needed to establish that actor's authority.",
      ),
    ],
  },
  "stakeholders-and-legitimacy": {
    connection:
      "Cabinet Office consultation guidance addresses who can participate and when input is useful. Ada, AI Now and OGP's comparative research offers an independent account of public-sector accountability mechanisms. Ask how affected applicants could change the policy, rather than only comment on a finished proposal.",
    readings: [
      read(
        r.consultation,
        "Read principles 2, 4, 6 and 7. Design an accessible way to hear from applicants before Northbridge has settled on an option.",
      ),
      read(
        r.accountability,
        "Read the report's policy examples and lessons. Choose an accountability mechanism and explain what would need adapting to Northbridge; this is historical comparative research, not a map of current law.",
      ),
    ],
  },
  "build-a-real-options-set": {
    connection:
      "Use Green Book options appraisal to compare mechanisms, then use the independent accountability research to widen the set of governance responses. A transparency record, a review route and a procurement condition are different interventions. Do not assume any of them solves the problem on its own.",
    readings: [
      read(
        r.green,
        "Read the longlist and shortlist appraisal material. Construct alternatives that differ in how they address the barrier to review, including a credible non-AI option.",
      ),
      read(
        r.accountability,
        "Compare two accountability-policy examples in the report. Identify their intended mechanism and one condition that could prevent it working in Northbridge.",
      ),
    ],
  },
  "appraisal-and-distribution": {
    connection:
      "The Green Book explicitly includes distributional effects in appraisal; the Data and AI Ethics Framework adds a fairness lens. Keep aggregate service benefits separate from who experiences errors, delay or exclusion. Explain how this changes your preferred option.",
    readings: [
      read(
        r.green,
        "Read chapter 7 on distributional analysis. Describe which applicants, employers and service teams bear the costs and benefits of each option.",
      ),
      read(
        r.ethics,
        "Read Fairness and Trade-offs. Identify an impact that an average performance measure would conceal, and propose evidence to investigate it.",
      ),
    ],
  },
  "delivery-and-accountability": {
    connection:
      "The AI Playbook addresses operating an AI-enabled service; NIST GOVERN addresses organisational responsibility. Translate both into named owners, resources and escalation routes. A control that nobody has time or authority to exercise is not a workable delivery plan.",
    readings: [
      read(
        r.playbook,
        "Read the material on AI governance and organisational capability. Identify a staffing or implementation dependency in Northbridge's recommendation.",
      ),
      read(
        r.nist,
        "Read GOVERN, focusing on responsibilities and risk-management processes. Assign owners for review, escalation and changes to the service.",
      ),
    ],
  },
  "evaluation-and-adaptation": {
    connection:
      "Use the Magenta Book to distinguish learning about an intervention from simply reporting activity. Pair this with Service Standard point 10 on success measures. Explain how Northbridge would know whether review access improved, and what evidence would trigger a change.",
    readings: [
      read(
        r.magenta,
        "Read the evaluation-design and interpretation material. Propose an outcome measure, a comparator and a limitation on the conclusion you could draw.",
      ),
      read(
        r.service,
        "Read point 10 on defining success and publishing performance data. Decide which Northbridge measures should be shared and what context they need.",
      ),
    ],
  },
  "write-a-decision-brief": {
    connection:
      "Use Green Book appraisal reporting to organise a recommendation, and DSIT's assurance guidance to distinguish an evidence claim from a promise. A decision-maker should be able to see the comparator, uncertainty and conditions behind your advice without reading every technical annex.",
    readings: [
      read(
        r.green,
        "Read the balanced judgement on value for money and presentation of appraisal results. Identify a material trade-off your briefing must disclose.",
      ),
      read(
        r.assurance,
        "Read the Communicate activity and assurance mechanisms. Separate established evidence, proposed tests and residual uncertainty in your brief.",
      ),
    ],
  },
  "capstone-policy-recommendation": {
    connection:
      "Bring appraisal, evaluation and independent accountability research together. Use a source to support a particular analytical choice, not as a badge of authority for the entire recommendation. Record where the source's setting or assumptions differ from Northbridge.",
    readings: [
      read(
        r.green,
        "Use the objectives, options and appraisal material to check the recommendation against its strongest alternative.",
      ),
      read(
        r.magenta,
        "Use the theory-of-change and evaluation material to test your delivery and learning plan.",
      ),
      read(
        r.accountability,
        "Use one comparative example to challenge a proposed accountability mechanism. Explain its relevance and a limit on transfer to Northbridge.",
      ),
    ],
  },
  "start-with-the-service": {
    connection:
      "The Service Standard starts with user needs and whole-service problems; the AI Playbook considers whether AI is an appropriate tool. Apply these perspectives to Eastmere's entire housing-enquiry journey before choosing a summarisation or routing system.",
    readings: [
      read(
        r.service,
        "Read points 1, 2 and 3. Add a resident journey or contact channel missing from your service map.",
      ),
      read(
        r.playbook,
        "Read the guidance on choosing an AI use case and assessing suitability. Identify a credible improvement Eastmere could make without this tool.",
      ),
    ],
  },
  "purpose-and-system-boundaries": {
    connection:
      "NIST MAP treats context and intended use as part of risk assessment. Model Cards adds a documentation perspective on intended uses and limitations. Compare the boundary of the model with the wider boundary of Eastmere's service; they are not interchangeable.",
    readings: [
      read(
        r.nist,
        "Read MAP 1 and 2. List users, affected residents, permitted uses and a context change that would require reassessment.",
      ),
      read(
        r.modelCards,
        "Read intended uses and caveats in the proposed model-card framework. Draft a limitation that staff could act on in the housing-enquiry workflow.",
      ),
    ],
  },
  "risk-and-affected-people": {
    connection:
      "Compare NIST's contextual risk mapping with the Ethics Framework's fairness and societal-impact questions. Use the two lenses to trace a service failure to its consequences for residents, including people whose needs are poorly represented in the available data.",
    readings: [
      read(
        r.nist,
        "Read MAP 5 on impacts. Trace one omitted housing-enquiry detail through the workflow to a possible resident harm.",
      ),
      read(
        r.ethics,
        "Read Fairness and Societal impact. Identify an affected group and specify what evidence or participation is missing from the assessment.",
      ),
    ],
  },
  "evaluate-supplier-evidence": {
    connection:
      "Model Cards and Datasheets propose different documentation artefacts: one concerns a model, the other its data. Use them together to request evidence that can be examined. Neither document, on its own, proves suitability for Eastmere or certifies a deployment as safe.",
    readings: [
      read(
        r.modelCards,
        "Read the reporting framework's evaluation material. Request results relevant to housing enquiries, including limitations and differences between groups.",
      ),
      read(
        r.datasheets,
        "Read the questions on dataset composition, collection and recommended uses. Identify a data mismatch that could undermine the supplier's result.",
      ),
    ],
  },
  "procurement-and-contracts": {
    connection:
      "Use the DDaT Playbook's sourcing and exit-planning guidance with DSIT's assurance mechanisms. Turn a proposed control into an evidence requirement, a supplier obligation and a means of enforcement. Ask what Eastmere would do if the supplier could not meet it.",
    readings: [
      read(
        r.procurement,
        "Read the testing, contract-management and exit-planning material. Specify an evidence obligation and an exit requirement for Eastmere's contract.",
      ),
      read(
        r.assurance,
        "Read section 4.2 on assurance mechanisms. Choose how a supplier claim should be tested and identify who can examine the result.",
      ),
    ],
  },
  "data-and-access": {
    connection:
      "ICO guidance addresses data-protection impact assessment; Datasheets provides structured questions about the dataset itself. Use both to inspect Eastmere's data flows. A well-documented dataset does not establish permission to process or share personal information.",
    readings: [
      read(
        r.dpia,
        "Read what a DPIA assesses and how to carry one out. Map a resident-data flow and a question for Eastmere's data-protection lead; check current ICO update notices and applicable law.",
      ),
      read(
        r.datasheets,
        "Read collection, processing, distribution and maintenance questions. Record retention, access and a change that would need review.",
      ),
    ],
  },
  "human-review-that-works": {
    connection:
      "The AI Playbook discusses meaningful human input; NIST GOVERN adds organisational processes and responsibility. Test these against a busy housing-advice team. A reviewer needs access to evidence, time and authority to disagree with a suggested route.",
    readings: [
      read(
        r.playbook,
        "Read the operational Human oversight discussion. Design a review step that can detect an omitted urgent detail. Use current ICO guidance for legal requirements rather than relying on this playbook's older legal wording.",
      ),
      read(
        r.nist,
        "Read GOVERN 2 and 3 on responsibilities and workforce practices. Specify training, escalation and the authority to override or pause a suggestion.",
      ),
    ],
  },
  "transparency-and-challenge": {
    connection:
      "The ATRS provides a public-recording approach; independent accountability research asks how such mechanisms work in practice. Compare a published description with a usable route to question an individual service outcome. Eastmere needs to think about both.",
    readings: [
      read(
        r.transparency,
        "Use the hub's recording guidance and scope policy. Draft a plain-language tool description and check whether the standard is mandatory or voluntary for the organisation in a real case.",
      ),
      read(
        r.accountability,
        "Compare transparency and accountability-policy examples. Explain what a resident could do with Eastmere's disclosure and what challenge route is still needed.",
      ),
    ],
  },
  "pilot-and-launch-gates": {
    connection:
      "The Magenta Book helps frame a pilot as an evaluation; NIST MEASURE and MANAGE connect evidence to a risk response. Decide beforehand what result would justify continuing, changing or stopping Eastmere's bounded trial.",
    readings: [
      read(
        r.magenta,
        "Read evaluation design and the purpose of evaluation questions. Specify the comparator, outcomes and limits on what Eastmere's pilot can establish.",
      ),
      read(
        r.nist,
        "Read MEASURE 2 and MANAGE 1. Define a launch condition, an unacceptable failure and the decision owner for each.",
      ),
    ],
  },
  "monitor-incidents-and-change": {
    connection:
      "NIST MANAGE covers responses to risk over time; the DDaT Playbook addresses continuity and exit. Combine them in an operating plan that survives a supplier change or a failed model update, rather than monitoring only an average accuracy score.",
    readings: [
      read(
        r.nist,
        "Read MANAGE and MEASURE 3 on tracking risks. Identify a signal, escalation route and reassessment trigger for Eastmere.",
      ),
      read(
        r.procurement,
        "Read continuity and exit planning. Describe how Eastmere would maintain service, recover information and switch to its fallback if the supplier failed.",
      ),
    ],
  },
  "assurance-pack-and-decision": {
    connection:
      "DSIT's assurance introduction distinguishes several ways of examining a system. NIST's core organises governance, context, measurement and risk response. Use these to show why each item in Eastmere's assurance pack matters to a deployment decision.",
    readings: [
      read(
        r.assurance,
        "Read assurance mechanisms and key actions for organisations. Link each proposed assurance claim to evidence, an assessor and a limitation.",
      ),
      read(
        r.nist,
        "Review GOVERN, MAP, MEASURE and MANAGE. Find a missing part of Eastmere's pack; the framework is a risk-management tool, not an approval certificate.",
      ),
    ],
  },
  "capstone-deployment-decision": {
    connection:
      "Combine technical-risk management, public accountability and data-protection assessment in the final decision. Explain how the external material influenced a concrete condition or a refusal to launch. Name the unresolved questions that a fictional course case cannot settle.",
    readings: [
      read(
        r.nist,
        "Use the four core functions to check the evidence and conditions behind Eastmere's launch, revise or stop decision.",
      ),
      read(
        r.accountability,
        "Use one report example to challenge whether the proposed disclosure and review process would give residents meaningful influence.",
      ),
      read(
        r.dpia,
        "Use the assessment questions to identify a data-protection issue requiring specialist review before a real deployment. Check the latest regulator guidance.",
      ),
    ],
  },
};

export function withSourceNotes(course: Course): Course {
  return {
    ...course,
    modules: course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson): Lesson => {
        const note = notes[lesson.slug];
        if (!note) throw new Error(`Missing source notes for ${lesson.slug}`);
        const links = note.readings
          .map((source) => `[${source.title}](${source.url})`)
          .join("; ");
        return {
          ...lesson,
          body: `${lesson.body}\n\n## Connect the reading to your practice\n\n${note.connection}\n\nSources for this comparison: ${links}. The application to this fictional case is AIPEX's teaching synthesis; it is not an endorsement by the source authors.`,
          resources: note.readings,
        };
      }),
    })),
  };
}
