import type { SourceId } from "./policy-sources";
import type { ToolSlug } from "@/lib/policy-workspace";
export type PolicyCase = {
  slug: string;
  title: string;
  kind: "Documented case";
  topic: string;
  jurisdiction: string;
  country: string;
  period: string;
  minutes: number;
  summary: string;
  context: string;
  decisionContext: string;
  tasks: string[];
  evidence: {
    title: string;
    text: string;
    source?: SourceId;
    location?: string;
  }[];
  limits: string;
  question: string;
  approach: string[];
  sources: SourceId[];
  tool: ToolSlug;
  seed: Record<string, string>;
};
export const policyCases: PolicyCase[] = [
  {
    slug: "govuk-chat",
    title: "GOV.UK Chat: usefulness and accuracy",
    kind: "Documented case",
    topic: "Evidence & evaluation",
    jurisdiction: "United Kingdom",
    country: "United Kingdom",
    period: "2024–2026 reports",
    minutes: 15,
    summary:
      "Separate satisfaction, answer quality and the evidence needed for expansion.",
    context:
      "Compare two dated GDS accounts of GOV.UK Chat. They are first-party reports, not an independent audit or a statement of present service performance.",
    decisionContext:
      "A retrospective evidence review, not a decision on the current GOV.UK service. Use the reports to decide what they can justify and what would require another evaluation.",
    tasks: [
      "Make a claim ledger: reported result, population/denominator, assessment method and the claim it can support. Do not merge survey usefulness with answer accuracy.",
      "Specify a same-question comparison with the existing information route: successful task completion, serious wrong advice and total user/staff time. Identify exclusions and unanswered questions.",
      "Write a bounded next step. Name the evidence needed before expanding to a different service, and who would have to approve it.",
    ],
    evidence: [
      {
        title: "18 January 2024",
        text: "Nearly 70% of 157 survey respondents found answers useful. Expert assessment nevertheless found answers fell short of the accuracy demanded for GOV.UK. Some users placed undue confidence in the government brand.",
        source: "chat2024",
        location:
          "Our early findings; survey n=157 and separate expert assessment",
      },
      {
        title: "16 March 2026",
        text: "GDS reported accuracy scores increasing from an early 76% benchmark to 90%, assessed through subject experts and automated evaluation. It noted that an inaccurate answer might address only part of a question.",
        source: "chat2026",
        location: "Headline finding 2: answer accuracy and assessment rules",
      },
      {
        title: "AIPEX reading question",
        text: "Usefulness, completeness and accuracy are distinct. Before interpreting change over time, check evaluation questions, assessment rules and system versions.",
      },
    ],
    limits:
      "Survey respondents are a subset of users, not the full invited population. The 2026 post does not provide the evaluation-set denominator behind its headline accuracy in the text. Neither report supplies a confusion matrix: do not put these percentages into the binary calculator. Evaluation-set or scoring changes could affect comparisons over time; causal service benefits and rare serious failures need separate evidence.",
    question:
      "What would you request before using these findings to justify a different public-service chatbot?",
    approach: [
      "Keep a separate row for each dated claim. A usefulness survey does not validate accuracy. Ask for the evaluated question set, scoring rubric, assessor agreement, exclusions and severity breakdown; the published percentages alone do not supply these.",
      "Request a comparison against the existing route on the same tasks, including incorrect actions and unanswered questions. Do not manufacture a trend by subtracting percentages from different measures or evaluation sets.",
      "Use the accounts as evidence for questions to test, rather than approval for another chatbot. Require a locally relevant evaluation and a recorded decision on acceptable consequences, support and fallback before expanding scope.",
    ],
    sources: ["chat2024", "chat2026", "evaluation"],
    tool: "assess-evidence",
    seed: {
      claim:
        "Review GDS’s January 2024 and March 2026 GOV.UK Chat accounts before considering a different public-service assistant.",
      population:
        "2024 usefulness survey: n=157. The 2026 accuracy measure uses expert and automated assessment; inspect the evaluation set and rules.",
      results:
        "Usefulness and accuracy are distinct measures. Check version, denominator and assessment method for each dated result.",
    },
  },
  {
    slug: "recruitment-audits",
    title: "Recruitment tools under scrutiny",
    kind: "Documented case",
    topic: "Oversight & deployment",
    jurisdiction: "United Kingdom",
    country: "United Kingdom",
    period: "2023–2024 audits",
    minutes: 15,
    summary:
      "Ask better supplier questions using the ICO’s selected recruitment audits.",
    context:
      "The ICO’s November 2024 report summarises consensual audits of AI recruitment developers and providers conducted August 2023–May 2024.",
    decisionContext:
      "A retrospective supplier-assurance exercise based on selected audits. Organisation A is the regulator’s anonymised label; it is not an invented AIPEX company or an identifiable current supplier.",
    tasks: [
      "Turn each finding into an evidence request: the artefact required, the use/version it covers and the person who will examine it.",
      "Define an inadequate answer. A random split or a bias-free assurance statement alone does not demonstrate independence, population coverage or an effective response to failures.",
      "Assign a control owner, response to a failed check and a route for candidate challenge. Mark anything the public report does not establish as unresolved.",
    ],
    evidence: [
      {
        title: "Scope",
        text: "The audits covered sourcing, screening and selection tools. Generative AI and biometric-processing tools were excluded.",
        source: "recruitment",
        location: "Report pp. 5 and 9–10: scope and methodology",
      },
      {
        title: "Organisation A: test-data separation",
        text: "The ICO could not establish how Organisation A kept training, testing and validation data separate in practice, or that the datasets represented relevant populations.",
        source: "recruitment",
        location: "Report p. 20: Organisation A case study",
      },
      {
        title: "Organisation A: monitoring and use",
        text: "Organisation A relied on external adverse-impact tests using artificial data. It also inferred demographic characteristics and offered recruiters demographic filters. The ICO challenged the fairness and basis of that processing.",
        source: "recruitment",
        location: "Report pp. 24–25: Organisation A case study",
      },
      {
        title: "AIPEX reading question",
        text: "A local decision still needs evidence about the particular product, version, role criteria, candidate population and review workflow.",
      },
    ],
    limits:
      "Selected consensual audits do not estimate market-wide prevalence. Historical findings do not state current law or establish whether a new supplier is suitable.",
    question:
      "Prepare three supplier requests. Who checks each answer, and what makes a response inadequate?",
    approach: [
      "Request a versioned data-split and evaluation record, with provenance, duplicate/leakage checks and population coverage. An analyst must examine how separation works, rather than accept the existence of three dataset names.",
      "Request test results, denominators and the action log after failures; explain what artificial-data tests cover and leave unknown. The ICO report supports these questions, not a new local performance estimate or a universal acceptable gap.",
      "Record who can investigate and correct an outcome, who can suspend use and how candidates reach them. Keep data-protection and equalities decisions with the responsible specialists; the historical report is not current legal clearance.",
    ],
    sources: ["recruitment", "cards", "playbook"],
    tool: "plan-oversight",
    seed: {
      service:
        "Proposed recruitment screening deployment. Use the ICO’s 2024 report to frame questions, not as evidence that this supplier passed or failed.",
      authority:
        "Identify the accountable recruiter and required data protection, equalities, procurement and operational reviews.",
      monitoring:
        "Request local validation, denominators and group coverage; assign a reviewer and follow-up action to each response.",
    },
  },
  {
    slug: "grades-2020",
    title: "England’s 2020 grades: the unit of judgement",
    kind: "Documented case",
    topic: "Policy design",
    jurisdiction: "England",
    country: "United Kingdom",
    period: "2020–2021 reports",
    minutes: 15,
    summary:
      "Examine aggregate consistency, individual outcomes and the choices between grading policies.",
    context:
      "After exams were cancelled, England used teacher-supplied centre assessment grades and student rankings in a statistical standardisation process. This is a historical automated-decision case, not generative AI.",
    decisionContext:
      "A retrospective comparison of approaches described in the official record, after the 17 August 2020 reversal. Do not pretend the later analysis was available to the original decision makers. The calculated-grade policy is the historical comparator, not today’s business as usual.",
    tasks: [
      "Compare the calculated-grade approach, centre assessment grades and the higher-of-the-two policy. Separate what each was intended to achieve from its observed effects.",
      "Examine who bears which uncertainty: individual candidates, small subject cohorts, centres and the admissions system. Do not infer an individual’s true result from a difference between estimates.",
      "State what evidence could change the comparison and what cannot be recovered because exams did not occur. Include timing, challenge and implementation constraints.",
    ],
    evidence: [
      {
        title: "Rationale and reversal",
        text: "Ofqual described standardisation as addressing inconsistency and likely optimism in centre assessments while maintaining national outcomes. After calculated grades failed to command public confidence, students received the higher of their centre assessment or calculated grade.",
        source: "gradesAnalysis",
        location:
          "Introduction: grading method and 13–17 August 2020 chronology",
      },
      {
        title: "Retrospective analysis",
        text: "Ofqual analysed differences between centre assessment and calculated grades. Centre assessments are estimates; there are no observed outcomes from the cancelled exams against which to measure true individual performance.",
        source: "gradesAnalysis",
        location:
          "Executive summary and Introduction: meaning and limits of grading gaps",
      },
      {
        title: "AIPEX reading question",
        text: "Which distributions and errors matter? How should exceptional circumstances and timely challenges be handled? These are institutional choices as well as modelling questions.",
      },
    ],
    limits:
      "Differences between estimates do not reveal each student’s true exam result. This case establishes neither a universally fair grading policy nor equivalence with every automated decision.",
    question:
      "Compare policies when national consistency and individual treatment pull in different directions. What essential conditions and evidence would each need?",
    approach: [
      "State competing objectives explicitly. Aggregate alignment cannot settle the acceptability of an individual outcome; examine distribution and exceptional cases.",
      "Compare the three documented approaches against the same objectives and historical time constraints. A higher grade is not proof of greater accuracy; the higher-of-the-two policy also changes the national distribution. Keep estimates, observed grade changes and unknowable exam results separate.",
      "Include a timely, usable route to challenge and correction. Name who can change the approach and what signals trigger reconsideration.",
    ],
    sources: ["grades", "gradesAnalysis", "green"],
    tool: "compare-options",
    seed: {
      problem:
        "England’s historical 2020 grading policy: cancelled examinations, uncertain estimates, national consistency objectives and individual consequences.",
      objectives:
        "Make competing objectives explicit: credible outcomes, individual treatment, understandable decisions and timely challenge.",
      evidence:
        "Ofqual’s 2020 outliers report and later grading-gap analysis. Cancelled examinations provide no observed ground truth.",
    },
  },
  {
    slug: "robodebt",
    title: "Robodebt: oversight beyond the model",
    country: "Australia",
    kind: "Documented case",
    topic: "Policy design",
    jurisdiction: "Australia",
    period: "2023 inquiry recommendations",
    minutes: 20,
    summary:
      "Compare transparency, review rights and independent scrutiny after a welfare-debt inquiry.",
    context:
      "Australia’s Royal Commission into the Robodebt Scheme reported on 7 July 2023. This case examines its proposed institutional safeguards for automated public administration; it is not a generative-AI deployment case.",
    decisionContext:
      "A retrospective policy-design exercise using the inquiry’s recommendations. The options you develop are AIPEX analysis, not a reconstruction of Cabinet deliberations or evidence that recommended reforms were implemented.",
    evidence: [
      {
        title: "Lawful implementation and evidence for assumptions",
        text: "Recommendation 15.1 distinguishes legislative change needed to implement a proposal lawfully from authorising expenditure. Recommendation 15.5 calls for documenting the assumptions and data behind compliance budget measures.",
        source: "robodebt",
        location: "Recommendations 15.1 and 15.5",
      },
      {
        title: "Transparency and challenge",
        text: "Recommendation 17.1 proposes a consistent framework for government automation, routes to review, understandable public explanations and access to rules and algorithms for independent scrutiny.",
        source: "robodebt",
        location: "Recommendation 17.1",
      },
      {
        title: "Independent monitoring",
        text: "Recommendation 17.2 proposes a new or expanded body able to monitor and audit automated decision-making, including fairness and usability.",
        source: "robodebt",
        location: "Recommendation 17.2",
      },
    ],
    limits:
      "Recommendations identify reforms the inquiry considered necessary; they do not demonstrate implementation or quantify each reform’s costs and benefits. The record used here does not establish current Australian legal requirements.",
    question:
      "Which combination of review, transparency and independent scrutiny would address distinct failure mechanisms, and what powers would each require?",
    tasks: [
      "Establish the documented baseline before comparing reforms. Mark missing information about existing capacity and powers as unknown; do not invent a baseline that makes a preferred reform win.",
      "Compare an accessible challenge route, independent technical scrutiny and an audit institution as separate or combined interventions. Specify what each can detect, prevent and remedy.",
      "Identify authority, staffing, access to records and enforcement powers as conditions. Explain whose burden increases and what evidence could reverse your preference.",
    ],
    approach: [
      "Separate the failure mechanisms: a technically reproducible rule can still lack lawful authority, and a published rule can still be difficult for a person to challenge. Match the proposed intervention to the mechanism.",
      "Compare costs and access on the same time horizon. Ask who can require a response or correction; an advisory panel without that power is different from a review body able to change an outcome.",
      "Recommend a conditional package only where powers and delivery are evidenced. Define how people’s experience and correction of errors will be evaluated, rather than counting publications or audits alone.",
    ],
    sources: ["robodebt", "green", "magenta"],
    tool: "compare-options",
    seed: {
      problem:
        "Retrospective Robodebt inquiry exercise: compare the institutional safeguards proposed in the 2023 report. Establish the historical baseline before appraising reforms.",
      objectives:
        "Separate lawful implementation, understandable explanations, usable challenge and independent scrutiny. Identify the outcome each reform is meant to change.",
      evidence:
        "Royal Commission recommendations 15.1, 15.5, 17.1 and 17.2. Recommendations are not evidence of implementation; costs and local delivery capacity remain unknown.",
    },
  },
  {
    slug: "syri",
    title: "SyRI: fraud detection and the right to privacy",
    country: "Netherlands",
    kind: "Documented case",
    topic: "Policy design",
    jurisdiction: "Netherlands",
    period: "5 February 2020 court account",
    minutes: 20,
    summary:
      "Examine why a legitimate policy aim does not settle whether a data-driven intervention is justified.",
    context:
      "SyRI was a Dutch statutory instrument for detecting risks of fraud involving welfare, allowances and taxes. The Hague District Court’s February 2020 account explains why the legislation failed its privacy-rights assessment.",
    decisionContext:
      "A retrospective analysis of a particular judgment, using the court’s Dutch-language summary paraphrased in English. This is an automated risk-indication case; no claim about a particular machine-learning architecture is needed.",
    evidence: [
      {
        title: "The court’s test",
        text: "The court assessed the legislation under Article 8(2) of the European Convention on Human Rights: the balance between its public purpose and interference with private life.",
        source: "syri",
        location:
          "Toets and Bijzondere verantwoordelijkheid bij nieuwe technologieën",
      },
      {
        title: "The court’s conclusion",
        text: "The court found the SyRI legislation insufficiently transparent and verifiable, and held that it did not achieve the required fair balance.",
        source: "syri",
        location: "Inzet SyRI onvoldoende inzichtelijk en controleerbaar",
      },
      {
        title: "The policy purpose remains a separate question",
        text: "The account identifies fraud prevention as the public purpose; it does not treat that purpose as sufficient justification for the particular intrusion.",
        source: "syri",
        location:
          "Opening account and Inzet SyRI onvoldoende inzichtelijk en controleerbaar",
      },
    ],
    limits:
      "The summary is not the full judgment, an assessment of every fraud-detection system, or a statement of current law in another country. It does not supply accuracy, cost or fraud-recovery estimates for comparing alternative designs.",
    question:
      "What would a defensible options appraisal need beyond a claim that the system could detect more fraud?",
    tasks: [
      "Define the fraud problem and evidence of need separately from the choice to link data or generate risk indications. Identify whose privacy and access to services are affected.",
      "Compare proportionate investigative and administrative alternatives. For each, specify data needed, safeguards, ability to challenge and the evidence required to justify intrusion.",
      "Identify essential rights and authority conditions before weighing benefits. Record which facts the court summary leaves unknown and which require the full judgment or specialist advice.",
    ],
    approach: [
      "Do not turn a legitimate objective into automatic approval for the mechanism. Describe the proposed data use and the people exposed, including those for whom no wrongdoing is established.",
      "Keep essential conditions distinct from a weighted benefits score. More detections cannot by themselves establish lawful, proportionate treatment or adequate avenues of challenge.",
      "Present an evidence request and alternatives, rather than declare a replacement system lawful from this summary. A comparison needs effectiveness and distributional evidence as well as scrutiny of safeguards.",
    ],
    sources: ["syri", "green"],
    tool: "compare-options",
    seed: {
      problem:
        "Retrospective SyRI review: separate the fraud-prevention objective from the particular data-use and risk-indication mechanism examined by the court.",
      conditions:
        "Identify privacy, authority, transparency and challenge conditions. Do not treat a claimed effectiveness benefit as satisfying these conditions.",
      evidence:
        "The Hague District Court’s 5 February 2020 summary. It describes a specific rights assessment, not comparative accuracy or cost estimates.",
    },
  },
  {
    slug: "rite-aid-facial-recognition",
    title: "Rite Aid: when a match alert becomes an accusation",
    country: "United States",
    kind: "Documented case",
    topic: "Oversight & deployment",
    jurisdiction: "United States",
    period: "2023 complaint; 2024 settlement order",
    minutes: 20,
    summary:
      "Trace the controls needed between a facial-recognition alert and action against a person.",
    context:
      "The US Federal Trade Commission brought a complaint about Rite Aid’s facial-recognition practices in December 2023. Read the regulator’s allegations alongside the modified settlement order, which contains a neither-admit-nor-deny provision.",
    decisionContext:
      "A historical enforcement case about image quality, testing and operational reliance. Allegations in the complaint are not presented as findings after a contested trial, and settlement terms are not evidence of later compliance.",
    evidence: [
      {
        title: "Regulator allegations: input quality and testing",
        text: "The FTC alleged use of poor-quality enrolment images and a failure to assess accuracy before deployment, including during a pilot.",
        source: "riteComplaint",
        location: "Paragraph 22 and paragraphs 50–55",
      },
      {
        title: "Regulator allegation: uneven errors",
        text: "The FTC alleged a failure to assess or monitor whether accuracy varied by the subject’s race or gender.",
        source: "riteComplaint",
        location: "Paragraph 43",
      },
      {
        title: "Settlement terms",
        text: "The modified order specifies a five-year facial-recognition prohibition, deletion requirements and a monitoring programme for covered biometric systems. It states that the respondents neither admit nor deny the allegations, subject to its stated exceptions.",
        source: "riteOrder",
        location: "Introductory findings; sections I–III",
      },
    ],
    limits:
      "A complaint records allegations; a settlement imposes terms without establishing every allegation through a trial. These materials do not provide a general deployment threshold, a current compliance assessment or a calculation of the prohibition’s remaining duration.",
    question:
      "What controls are needed before staff may act on an alert, and what should happen when a control fails?",
    tasks: [
      "Map capture, watchlist enrolment, matching, staff interpretation and action as separate stages. Identify where a person could be wrongly accused and what evidence would reveal it.",
      "Specify input-quality checks, deployment-like testing and trained review with correction authority. Include group coverage, denominators, complaints and records of remedial action.",
      "Define who can stop reliance, remove an unreliable enrolment and investigate an incident. Distinguish a proposed local control from a remedy actually specified in the order.",
    ],
    approach: [
      "Treat the alert as a claim requiring investigation, rather than an established identity or wrongdoing. The policy problem includes staff behaviour and the enrolment process, not only the model.",
      "Require evidence that controls detect errors under actual capture conditions. A supplier disclaimer or nominal human reviewer does not demonstrate effective checks.",
      "Give an operational owner authority to suspend reliance and remedy errors. Use the settlement as a concrete control-design reference, while checking the rules applicable to any different organisation or jurisdiction.",
    ],
    sources: ["riteComplaint", "riteOrder", "nist"],
    tool: "plan-oversight",
    seed: {
      service:
        "Historical Rite Aid facial-recognition case. Map enrolment, image capture, matching and staff action separately; FTC complaint statements remain allegations.",
      review:
        "Design checks between an alert and action against a person, including evidence access and correction authority. Do not infer an actual current control from the settlement.",
      monitoring:
        "Request deployment-like test results, group denominators and incident/remedial-action logs. Separate complaint allegations from the order’s specified terms.",
    },
  },
  {
    slug: "canada-visa-analytics",
    title: "Canada’s visa analytics: which decision is automated?",
    country: "Canada",
    kind: "Documented case",
    topic: "Oversight & deployment",
    jurisdiction: "Canada",
    period: "2022 briefing; later published inventory",
    minutes: 20,
    summary:
      "Distinguish automated eligibility, triage and a human’s final decision in a multi-stage service.",
    context:
      "IRCC’s May 2022 briefing describes advanced analytics for temporary resident visa applications from China and India. Its department-maintained technology inventory provides a further account of declared functions and links to algorithmic impact assessments.",
    decisionContext:
      "A review of a published departmental workflow and its declared safeguards, not independent verification. The detailed claims below are dated to the 2022 briefing. This advanced-analytics workflow is distinct from the Excel-based Chinook processing aid.",
    evidence: [
      {
        title: "An automated intermediate determination",
        text: "IRCC described the system positively determining eligibility for routine applications before an officer assessed admissibility and made the final visa decision. It said the system did not refuse or recommend refusing applications.",
        source: "ircc2022",
        location:
          "Key Messages; Supplementary Messages: use of advanced data analytics",
      },
      {
        title: "Declared checks",
        text: "The briefing describes review of rules and redirecting a proportion of positively determined applications for full human review. These are departmental descriptions, not control-effectiveness results.",
        source: "ircc2022",
        location: "Supplementary Messages: review of rules and feedback loop",
      },
      {
        title: "Public documentation",
        text: "The inventory identifies overseas visitor-visa eligibility automation, retains the officer’s admissibility/final-decision role and links to an algorithmic impact assessment.",
        source: "irccInventory",
        location:
          "Automated decision making: Visitor visa for overseas applications row",
      },
    ],
    limits:
      "A published impact assessment or declared human decision point is not proof of fairness, effective challenge or reduced end-to-end waiting times. Do not assume every intermediate decision is manual, or that the 2022 workflow describes every current visa system.",
    question:
      "Where must oversight operate when an officer makes the final decision but earlier processing stages are automated?",
    tasks: [
      "Draw the stages: triage, positive eligibility determination, admissibility and final decision. Specify which decision the human makes and which assumptions they receive from earlier stages.",
      "Request evidence behind sampled human review: coverage, reasons for disagreement, corrections and action after failure. Examine applicants routed to different processing paths.",
      "Design change control, challenge and monitoring around the whole workflow. Separate declared governance from evidence that it changes outcomes.",
    ],
    approach: [
      "Avoid a binary automated-versus-human label for the whole service. Locate the intermediate determinations that can affect subsequent attention, delay or scrutiny.",
      "Treat the published workflow as a starting point for targeted questions. Ask whether review sampling can detect important errors and whether reviewers can change the relevant determination.",
      "Compare end-to-end experience and distributions across processing paths. Assign owners to the evidence gaps before concluding that a final human decision provides sufficient oversight.",
    ],
    sources: ["ircc2022", "irccInventory", "nist"],
    tool: "plan-oversight",
    seed: {
      service:
        "IRCC’s documented 2022 temporary-resident-visa analytics workflow: triage and positive eligibility determination precede officer admissibility review and final decision.",
      authority:
        "Separate authority for intermediate eligibility determinations from responsibility for admissibility and the final visa decision. The source is a departmental account.",
      monitoring:
        "Request evidence behind the declared human-review feedback loop, including sampling coverage, disagreements, corrections and the response to failures.",
    },
  },
  {
    slug: "singapore-retinal-screening",
    title: "Singapore’s retinal AI: accuracy is not a health outcome",
    country: "Singapore",
    kind: "Documented case",
    topic: "Evidence & evaluation",
    jurisdiction: "Singapore · with external validation cohorts",
    period: "2017 diagnostic-validation study",
    minutes: 20,
    summary:
      "Read a strong diagnostic result carefully before claiming benefits for a screening service.",
    context:
      "Ting and colleagues’ 2017 JAMA study evaluated a deep-learning system using retinal photographs from Singapore and external cohorts. It provides a documented diagnostic-validation case, rather than a claim that every later product version improves patient outcomes.",
    decisionContext:
      "Assess the published study at its stated endpoint and threshold. Any proposed service expansion, staffing arrangement or follow-up evaluation is AIPEX analysis, not a deployment reported by this paper.",
    evidence: [
      {
        title: "Keep the denominator straight",
        text: "The primary validation dataset contained 71,896 images from 14,880 patients. Images, eyes and patients are different units; the study also examined external datasets.",
        source: "retina",
        location: "Abstract; Table 1: primary validation dataset",
      },
      {
        title: "Threshold and trade-off",
        text: "For referable diabetic retinopathy, the primary validation reported sensitivity of 90.5% (95% CI 87.3–93.0) and specificity of 91.6% (91.0–92.2). Trained graders had specificity of 99.3%.",
        source: "retina",
        location: "Table 4: referable diabetic retinopathy",
      },
      {
        title: "The authors’ boundary",
        text: "The authors called for further research on healthcare applicability and improved vision outcomes. Reference standards varied across external datasets; several authors disclosed a related patent interest.",
        source: "retina",
        location: "Limitations; Conclusions; Conflict of Interest Disclosures",
      },
    ],
    limits:
      "Diagnostic validation is not a trial showing improved vision or a general clinical recommendation. Referral workload depends on prevalence, threshold and downstream capacity. Do not reverse-engineer exact classifier counts from rounded percentages or treat images as independent patients.",
    question:
      "What additional evidence would justify moving from diagnostic performance to a claim of improved screening outcomes?",
    tasks: [
      "Record target condition, operating threshold, reference standard, unit of analysis and uncertainty. Compare sensitivity and specificity, rather than summarising both as accuracy.",
      "Assess implications for missed cases and extra referrals in the intended population. Request actual counts and patient-level workflow data; do not fabricate a matrix from rounded results.",
      "Specify a comparison of the full screening pathway: timely referral, attendance, clinical outcomes, workload and access. Identify what the validation study supports and what remains to test.",
    ],
    approach: [
      "Preserve the evidence for diagnostic performance while respecting its endpoint. A useful classifier can still have uncertain benefits once referral and treatment capacity are considered.",
      "Compare errors at an appropriate threshold and prevalence. Similar sensitivity alongside lower specificity can change the burden on later assessment; the final service design matters.",
      "Recommend an evaluation of the intended pathway with clinical and operational expertise. Record patient-level outcomes and who is excluded, rather than translate a laboratory metric directly into a rollout decision.",
    ],
    sources: ["retina", "cards", "evaluation"],
    tool: "assess-evidence",
    seed: {
      claim:
        "Assess the 2017 Singapore-led retinal-image validation study before making claims about screening-service benefits. Diagnostic performance and improved vision are different endpoints.",
      population:
        "Primary validation: 71,896 images from 14,880 patients. Keep images, eyes and patients separate; examine reference standards and external cohorts.",
      results:
        "Referable diabetic retinopathy: sensitivity 90.5% (95% CI 87.3–93.0), specificity 91.6% (91.0–92.2). Request exact counts; leave the optional binary calculator blank.",
    },
  },
  {
    slug: "brazil-victor",
    title: "Brazil’s Victor: faster classification, faster justice?",
    country: "Brazil",
    kind: "Documented case",
    topic: "Evidence & evaluation",
    jurisdiction: "Brazil",
    period: "19 August 2026 court account",
    minutes: 15,
    summary:
      "Separate a dramatic task-time claim from the outcomes of a judicial service.",
    context:
      "Brazil’s Supremo Tribunal Federal describes Victor as a classifier supporting the handling of appeals and their possible correspondence with general-repercussion themes. The source is the court’s own Portuguese-language account, paraphrased here in English.",
    decisionContext:
      "An appraisal of a dated institutional claim, not an independent benchmark or a claim that AI decides appeals. Victor is distinct from the court’s similarly named VitorIA tool.",
    evidence: [
      {
        title: "The reported task-time claim",
        text: "The court’s August 2026 article attributes to a World Bank report a reduction from 40 minutes to five seconds for linking appeals to general-repercussion themes.",
        source: "victor",
        location:
          "Opening paragraphs: attributed 40-minute/five-second comparison",
      },
      {
        title: "What the system does",
        text: "The article describes Victor as analysing an appeal and indicating a possible correspondence with themes; it does not decide the case’s classification. Other stages still require human work.",
        source: "victor",
        location:
          "Como funciona and the paragraph on the initial analysis stage",
      },
      {
        title: "AIPEX reading question",
        text: "A reduction in one processing task leaves questions about checking, rework, queueing and the eventual experience of people seeking justice.",
      },
    ],
    limits:
      "The cited article does not provide a reproducible timing protocol, sample distribution or a causal estimate of total case duration. Its attributed benchmark has not been independently reproduced by AIPEX. It does not establish judicial quality, fairness or present performance across all appeals.",
    question:
      "What would make a task-time comparison meaningful evidence for a wider court-service decision?",
    tasks: [
      "Define the task boundary and comparator: staff activity, machine processing, checking and rework. Ask whether the timing covers comparable cases and resources.",
      "Request classification errors, difficult or novel themes and effects on downstream staff decisions. Identify when an incorrect label can be detected and corrected.",
      "Propose measures of end-to-end delay, workload and treatment of different case types. Keep the reported efficiency claim distinct from a claim about access to justice.",
    ],
    approach: [
      "Quote the timing as an attributed institutional claim about a bounded task. Do not divide the two numbers and present the ratio as a measured improvement in court efficiency.",
      "Ask for the timing protocol and an error/rework analysis before accepting a net saving. Organisation-wide benefits depend on whether that task is a real bottleneck.",
      "Use a bounded comparison of the actual workflow, with correction and escalation for novel cases. Preserve human legal responsibility while examining whether early labels influence later judgement.",
    ],
    sources: ["victor", "evaluation", "magenta"],
    tool: "assess-evidence",
    seed: {
      claim:
        "STF’s 19 August 2026 article attributes a 40-minute-to-five-second task comparison to a World Bank report. Assess the boundary of that claim, not a fabricated end-to-end benchmark.",
      comparison:
        "Request the timing protocol, comparable cases/resources and whether checking, rework and queueing were counted.",
      transfer:
        "Victor supports classification; judicial judgement remains human. Ask about novel themes, incorrect labels and effects on the rest of the workflow.",
    },
  },
];
export const findCase = (slug: string) =>
  policyCases.find((c) => c.slug === slug);
