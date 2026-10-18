import type { SourceId } from "./policy-sources";
import type { ToolSlug } from "@/lib/policy-workspace";
export type PolicyCase = {
  slug: string;
  title: string;
  kind: "Practice case" | "Documented case";
  topic: string;
  jurisdiction: string;
  period: string;
  minutes: number;
  summary: string;
  context: string;
  evidence: { title: string; text: string; source?: SourceId }[];
  limits: string;
  question: string;
  approach: string[];
  sources: SourceId[];
  tool: ToolSlug;
  seed: Record<string, string>;
};
export const policyCases: PolicyCase[] = [
  {
    slug: "screening-accuracy",
    title: "The 96% accuracy claim",
    kind: "Practice case",
    topic: "Evidence & evaluation",
    jurisdiction: "UK · fictional",
    period: "Teaching scenario",
    minutes: 15,
    summary:
      "A recruitment supplier reports impressive accuracy. What would you request before a pilot?",
    context:
      "Northbridge funds three employment services. A supplier offers an AI screening system and a one-page evaluation. All names, documents and numbers here are fictional AIPEX teaching material.",
    evidence: [
      {
        title: "The claim",
        text: "‘96% accurate on 1,000 historical applications.’ Sampling, label review and the trained manual-screening comparator are unspecified.",
      },
      {
        title: "The matrix",
        text: "The label means meets interview threshold, not later job performance. The system advances 60 qualifying and 20 non-qualifying applicants; it rejects 20 qualifying and 900 non-qualifying applicants.",
      },
      {
        title: "Missing from the headline",
        text: "Group A has 16 misses among 40 qualifying applicants; group B has four among 40. Local assisted applications, reviewer workload and appeals were not tested.",
      },
    ],
    limits:
      "The group samples are small and the labels require scrutiny. These assumptions establish neither legal discrimination nor a universal acceptance threshold.",
    question:
      "Should the owner approve a live pilot? Write a bounded conclusion and three evidence requests that could change it.",
    approach: [
      "Accuracy is 96%; recall and precision are both 75%. Rejecting everyone would score 92% accuracy while finding no qualifying applicants.",
      "False-negative rates are 40% and 10% in the two groups. Investigate sampling, labels, uncertainty and mechanisms before interpreting the gap.",
      "Defer a live pilot pending comparator, sampling/label and local workflow evidence. An appropriately approved offline test could help. Assign each evidence request an owner and deadline.",
    ],
    sources: ["cards", "evaluation"],
    tool: "assess-evidence",
    seed: {
      claim:
        "Fictional Northbridge supplier: ‘96% accurate screening’ on 1,000 historical applications. Decision: whether to approve a pilot.",
      population:
        "Label: meets interview threshold, not job performance. Sampling and independent label checks unspecified.",
      results:
        "TP 60; FP 20; FN 20; TN 900. Group A misses 16/40 qualifying applicants; group B misses 4/40. Local review workload and appeals not tested.",
    },
  },
  {
    slug: "a-route-to-review",
    title: "A right to review that people can use",
    kind: "Practice case",
    topic: "Policy design",
    jurisdiction: "UK · fictional",
    period: "Teaching scenario",
    minutes: 20,
    summary:
      "Compare clearer notices, a staffed review service and business as usual.",
    context:
      "Northbridge’s chair wants fairer screening within funded employment services. Six applicants describe opaque rejections. The log records 18 review requests among 600 applications but excludes phone contacts. These fictional observations are not a representative baseline.",
    evidence: [
      {
        title: "Authority",
        text: "The funder can investigate its funded services. Changes to funding conditions depend on the governing agreements; it cannot regulate recruitment generally.",
      },
      {
        title: "A process test",
        text: "All 40 sampled notices mention review; 12 applicants can explain the route. Six request review and receive timely replies, but reviewers cannot inspect inputs or correct outcomes.",
      },
      {
        title: "Delivery",
        text: "Managers can update notices quickly. A staffed route requires protected time, record access and correction authority. Demand and workload costs remain unknown.",
      },
    ],
    limits:
      "Neither the prevalence of unmet need nor AI’s causal contribution is established. The same access problem may exist in manual screening.",
    question:
      "Which outcome does each option plausibly improve, and what must be true for it to work?",
    approach: [
      "Keep business as usual as a comparison, including its existing costs and harms. Clearer notices may improve understanding but do not give reviewers correction powers.",
      "A staffed pilot addresses another part of the mechanism. Check authority, affordability, access and capacity as essential conditions.",
      "Recommend conditionally and test demand. Evaluate understanding, meaningful reconsideration and workload: six timely replies are not six successful outcomes.",
    ],
    sources: ["green", "magenta"],
    tool: "compare-options",
    seed: {
      problem:
        "Fictional Northbridge: six accounts of opaque rejection; 18 reviews among 600 applications, with phone contacts absent. Scope: funded services and governing agreements.",
      objectives:
        "Applicants can understand and use a meaningful review route. Reviewers can inspect and correct material errors.",
      conditions:
        "Authority under agreements; reviewer record access and correction powers; protected staff time; non-digital access; affordability.",
    },
  },
  {
    slug: "caseworker-copilot",
    title: "The caseworker copilot and the busy reviewer",
    kind: "Practice case",
    topic: "Oversight & deployment",
    jurisdiction: "UK · fictional",
    period: "Teaching scenario",
    minutes: 20,
    summary:
      "Turn ‘an officer checks every answer’ into a control that can be tested.",
    context:
      "Eastmere’s housing team wants an assistant to draft case summaries. A manager proposes that officers check drafts alongside their normal workload. All facts are teaching assumptions; no live deployment is shown to be ready.",
    evidence: [
      {
        title: "Boundary",
        text: "The first test uses anonymised historic cases. No eligibility decisions, resident-facing advice or automatic record updates are proposed.",
      },
      {
        title: "The review promise",
        text: "The demo does not put source records beside summaries. No allocated review time, training, error log or seeded-error test is planned.",
      },
      {
        title: "Dependency",
        text: "The supplier can update the model. Change notification, pause arrangements and staffing for manual fallback are not agreed.",
      },
    ],
    limits:
      "No local error rate, time saving, legal approval or safe threshold is established. An officer’s presence alone does not demonstrate effective oversight.",
    question:
      "What must be established before moving beyond an offline test? Specify reviewer duties, monitoring and pause/fallback arrangements.",
    approach: [
      "Keep the test bounded and identify outstanding approvals. Give reviewers source access, correction rights and protected time; test their ability to catch plausible omissions.",
      "Measure meaningful correction and end-to-end workload. Assign risk measures a denominator, owner and review cadence, separating serious failures from averages.",
      "Define a pause for unapproved changes or serious missed errors, a named operator and a tested manual route. Expansion requires a new, recorded decision.",
    ],
    sources: ["playbook", "nist", "evaluation"],
    tool: "plan-oversight",
    seed: {
      service:
        "Fictional Eastmere housing summary assistant. Offline test on anonymised historic cases only. No decisions, record updates or resident-facing advice.",
      review:
        "Officers check drafts, but source access, training, review time and correction tests are unspecified.",
      pause:
        "Supplier model changes and manual fallback arrangements are not yet agreed.",
    },
  },
  {
    slug: "govuk-chat",
    title: "GOV.UK Chat: usefulness and accuracy",
    kind: "Documented case",
    topic: "Evidence & evaluation",
    jurisdiction: "United Kingdom",
    period: "2024–2026 reports",
    minutes: 15,
    summary:
      "Separate satisfaction, answer quality and the evidence needed for expansion.",
    context:
      "Compare two dated GDS accounts of GOV.UK Chat. They are first-party reports, not an independent audit or a statement of present service performance.",
    evidence: [
      {
        title: "18 January 2024",
        text: "Nearly 70% of 157 survey respondents found answers useful. Expert assessment nevertheless found answers fell short of the accuracy demanded for GOV.UK. Some users placed undue confidence in the government brand.",
        source: "chat2024",
      },
      {
        title: "16 March 2026",
        text: "GDS reported accuracy scores increasing from an early 76% benchmark to 90%, assessed through subject experts and automated evaluation. It noted that an inaccurate answer might address only part of a question.",
        source: "chat2026",
      },
      {
        title: "AIPEX reading question",
        text: "Usefulness, completeness and accuracy are distinct. Before interpreting change over time, check evaluation questions, assessment rules and system versions.",
      },
    ],
    limits:
      "Survey responses are not expert accuracy judgements. Different evaluation sets may not allow a like-for-like trend. These accounts do not alone establish causal service benefits or absence of rare serious failures.",
    question:
      "What would you request before using these findings to justify a different public-service chatbot?",
    approach: [
      "Identify each metric’s population, denominator, assessment method and missing questions. Ask about severity, uncertainty and unanswered queries.",
      "Assess transfer to the proposed service: consequences of wrong advice, user circumstances and human support may differ. Read the early findings as historical, alongside the later report.",
      "Recommend locally relevant tests and a bounded next step. Record which claims about quality, experience or outcomes remain unresolved.",
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
    period: "2023–2024 audits",
    minutes: 15,
    summary:
      "Ask better supplier questions using the ICO’s selected recruitment audits.",
    context:
      "The ICO’s November 2024 report summarises consensual audits of AI recruitment developers and providers conducted August 2023–May 2024.",
    evidence: [
      {
        title: "Scope",
        text: "The audits covered sourcing, screening and selection tools. Generative AI and biometric-processing tools were excluded.",
        source: "recruitment",
      },
      {
        title: "Findings",
        text: "The report identified room for improvement in accuracy, fairness, transparency and data minimisation, alongside good practice.",
        source: "recruitment",
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
      "Ask how criteria and labels were validated for the role and who was missing from the evaluation population.",
      "Request evidence behind performance and group comparisons, including data provenance, denominators and limits of the tested use. An assurance slogan cannot replace that evidence.",
      "Specify how applicants obtain information and challenge errors. Assign review and correction rights, recording outstanding specialist decisions.",
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
    period: "2020–2021 reports",
    minutes: 15,
    summary:
      "Examine aggregate consistency, individual outcomes and the choices between grading policies.",
    context:
      "After exams were cancelled, England used teacher-supplied centre assessment grades and student rankings in a statistical standardisation process. This is a historical automated-decision case, not generative AI.",
    evidence: [
      {
        title: "Rationale and reversal",
        text: "Ofqual described standardisation as addressing inconsistency and likely optimism in centre assessments while maintaining national outcomes. After calculated grades failed to command public confidence, students received the higher of their centre assessment or calculated grade.",
        source: "grades",
      },
      {
        title: "Retrospective analysis",
        text: "Ofqual analysed differences between centre assessment and calculated grades. Centre assessments are estimates; there are no observed outcomes from the cancelled exams against which to measure true individual performance.",
        source: "gradesAnalysis",
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
      "Compare a realistic baseline and alternatives, acknowledging uncertainty. Distinguish what retrospective evidence establishes from what remains unknowable.",
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
];
export const findCase = (slug: string) =>
  policyCases.find((c) => c.slug === slug);
