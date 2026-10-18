import type { SourceId } from "./policy-sources";
import type { ToolSlug } from "@/lib/policy-workspace";
export type PolicyCase = {
  slug: string;
  title: string;
  kind: "Documented case";
  topic: string;
  jurisdiction: string;
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
];
export const findCase = (slug: string) =>
  policyCases.find((c) => c.slug === slug);
