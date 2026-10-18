import type { ToolSlug } from "@/lib/policy-workspace";
import type { SourceId } from "./policy-sources";
export type ToolField = {
  id: string;
  label: string;
  prompt: string;
  example: string;
  sources: SourceId[];
};
export type PolicyTool = {
  slug: ToolSlug;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  output: string;
  time: string;
  scope: string;
  fields: ToolField[];
  sources: SourceId[];
  course: string;
  lesson: string;
};
export const policyTools: PolicyTool[] = [
  {
    slug: "assess-evidence",
    number: "01",
    title: "Assess an AI evidence claim",
    shortTitle: "Assess the evidence",
    description:
      "Separate a headline claim from what the evidence actually establishes. Identify the questions that could change your decision.",
    output:
      "An evidence assessment and a prioritised request for further evidence",
    time: "20–30 minutes",
    scope:
      "For a specific claim about an AI system or intervention. Record the study and version you reviewed. A technical performance result alone does not establish effectiveness, fairness or suitability in your service.",
    course: "ai-policy-in-practice",
    lesson: "audit-an-evidence-claim",
    sources: ["magenta", "evaluation", "cards"],
    fields: [
      {
        id: "claim",
        label: "The claim and the decision",
        prompt:
          "Quote or paraphrase the exact claim. Who made it, about which system/version, and what decision would it support? Record the source URL or document and date.",
        example:
          "Vendor report, 1 October 2026: ‘96% accurate screening’. Decide whether to investigate a supervised recruitment pilot; no automated rejection is authorised.",
        sources: ["cards"],
      },
      {
        id: "population",
        label: "The population and outcome",
        prompt:
          "Who or what was tested, how were they selected, and what outcome was labelled? Include sample size, dates, missing records and whether the label is a defensible proxy for the outcome you care about.",
        example:
          "1,000 historical applications; labels mean meets interview threshold, not future job performance. Sampling and independent label review have not been supplied.",
        sources: ["cards"],
      },
      {
        id: "comparison",
        label: "The comparison",
        prompt:
          "Compared with what: current practice, an alternative system or no intervention? Were cases, time periods and resources comparable? For causal claims, describe how the evaluation addresses what would have happened otherwise.",
        example:
          "No trained manual-screening comparator. A reject-everyone baseline would be 92% accurate. A before/after change would not isolate the tool’s effect if recruitment rules also changed.",
        sources: ["magenta"],
      },
      {
        id: "results",
        label: "What the results show",
        prompt:
          "Record numerator, denominator and metric. Include uncertainty, missing data and subgroup results where justified. Use the optional calculator below for a binary classification result. Keep technical metrics separate from service outcomes.",
        example:
          "60 true positives, 20 false positives, 20 false negatives and 900 true negatives. Accuracy 96%; recall and precision 75%. Sixteen of 40 qualified applicants in group A are missed, compared with four of 40 in B; these are small samples.",
        sources: ["cards", "evaluation"],
      },
      {
        id: "transfer",
        label: "What may change in your setting",
        prompt:
          "Compare the test with your population, workflow, staff, incentives and system version. What happens to time savings when review, appeals, training and errors are included? Name groups or situations the evidence does not cover.",
        example:
          "A supplier test does not include our assisted-application route, reviewer workload or applicant appeals. Local language mix and selection criteria may differ.",
        sources: ["evaluation"],
      },
      {
        id: "request",
        label: "The next evidence to request",
        prompt:
          "Prioritise three requests that could change the decision. For each, state who will provide it, what it tests and when it is needed. Distinguish a decision-blocking gap from a useful later improvement.",
        example:
          "Before pilot approval: supplier provides sampling/labels and manual comparator; service owner tests assisted applications; independent reviewer examines missed candidates and review workload. Evidence lead checks all three before the approval meeting.",
        sources: ["evaluation", "cards"],
      },
      {
        id: "judgement",
        label: "Your bounded conclusion",
        prompt:
          "Write what is supported, what is not established and the next justified action. What evidence would change your view? Name the decision owner and review date. Do not turn a metric into a general safety or fairness verdict.",
        example:
          "The reported matrix supports 96% classification accuracy on this sample, with material missed-candidate rates. It does not establish fair or effective local screening. Defer a live pilot until sampling, comparator and review safeguards are checked; revisit at the next evidence meeting.",
        sources: ["magenta", "evaluation"],
      },
    ],
  },
  {
    slug: "compare-options",
    number: "02",
    title: "Compare policy options",
    shortTitle: "Compare the options",
    description:
      "Develop a defensible recommendation by comparing mechanisms, distributional effects, delivery constraints and uncertainty.",
    output:
      "An options brief with a baseline, trade-offs and explicit decision conditions",
    time: "30–45 minutes",
    scope:
      "An early-stage qualitative appraisal, informed by the Green Book. Use a proportionate economic appraisal and your organisation’s approval process where required. The tool records reasoning; it does not calculate a preferred policy.",
    course: "ai-policy-in-practice",
    lesson: "build-a-real-options-set",
    sources: ["green", "magenta"],
    fields: [
      {
        id: "problem",
        label: "The problem, scope and decision owner",
        prompt:
          "Describe the harm or opportunity, the affected population, the evidence and the decision you can actually take. Identify the actor’s authority and any boundary you cannot change.",
        example:
          "Applicants to three funded employment services cannot readily challenge screening decisions. Six accounts and an incomplete review log justify investigation, not a prevalence estimate. The regional funder can explore service conditions, subject to its agreements; it cannot regulate all hiring.",
        sources: ["green"],
      },
      {
        id: "objectives",
        label: "Outcomes and success measures",
        prompt:
          "Specify the change you want, for whom and by when. Explain the causal steps and what would count as failure. Record how people affected helped define success.",
        example:
          "Within six months of an agreed pilot, applicants can understand and use a review route, and reviewers can inspect and correct decisions. Test understanding and meaningful reconsideration with applicants; timely replies alone are insufficient.",
        sources: ["green", "magenta"],
      },
      {
        id: "conditions",
        label: "Conditions every viable option must meet",
        prompt:
          "List essential conditions such as lawful authority, affordability, delivery capacity and access. State the evidence needed to judge each. In the option cards, mark whether all are met, unresolved or not met.",
        example:
          "Authority under funding agreements confirmed; named reviewer with access and correction powers; staffed non-digital route; affordable within the agreed envelope. A strong benefit cannot offset failure of an essential condition.",
        sources: ["green"],
      },
      {
        id: "evidence",
        label: "Evidence and uncertainties across options",
        prompt:
          "Record the sources and assumptions behind your comparison. What is unknown about costs, take-up, behaviour and outcomes? Identify the most decision-sensitive assumption and how you would test it.",
        example:
          "Review demand is unknown because phone contacts are absent from the log. Run a short recording exercise and estimate workload under low and high take-up. Record staff cost, applicant time and appeals, not just software fees.",
        sources: ["green", "magenta"],
      },
      {
        id: "recommendation",
        label: "Recommendation and trade-offs",
        prompt:
          "Select a preferred option in your own words, explain what it sacrifices and why it is justified against the baseline. If a condition is unresolved, make the recommendation conditional and specify who resolves it.",
        example:
          "Prefer a time-limited review-service pilot if authority and staffing are confirmed. It costs more than guidance alone but directly tests access and correction. Keep non-digital access and a stop point if review demand exceeds safe capacity.",
        sources: ["green"],
      },
      {
        id: "evaluation",
        label: "Implementation, evaluation and reconsideration",
        prompt:
          "Who acts next, by when, and with what resources? How will you assess additional effects and distribution? State a review date, a stop/change condition and the evidence that could favour another option.",
        example:
          "Service lead checks agreements and staffing before approval. Compare process and applicant experience with baseline services, document concurrent changes and review after eight weeks. Change or pause if a backlog prevents timely meaningful review.",
        sources: ["magenta", "green"],
      },
    ],
  },
  {
    slug: "plan-oversight",
    number: "03",
    title: "Plan oversight of an AI deployment",
    shortTitle: "Plan meaningful oversight",
    description:
      "Turn ‘human oversight’ into named responsibilities, practical controls, monitoring and a route to pause or stop.",
    output:
      "A deployment oversight plan with owners, escalation and review conditions",
    time: "30–45 minutes",
    scope:
      "For one bounded deployment and lifecycle stage. An oversight plan supports governance discussions; it does not authorise deployment or determine legal compliance. Record the approvals your organisation needs separately.",
    course: "governing-ai-in-public-services",
    lesson: "human-review-that-works",
    sources: ["nist", "playbook", "evaluation"],
    fields: [
      {
        id: "service",
        label: "Service, system and boundaries",
        prompt:
          "Identify the service, people affected, system/vendor/version and workflow. What is permitted, prohibited and out of scope? Include the route for people who cannot or do not want to use the AI channel.",
        example:
          "Eastmere housing team tests a draft-only caseworker assistant on anonymised historic cases. No eligibility decisions, resident-facing advice or automatic record updates. Existing telephone and officer routes remain available.",
        sources: ["nist", "playbook"],
      },
      {
        id: "authority",
        label: "Accountability and decision rights",
        prompt:
          "Name the accountable service owner, operational lead, reviewer, technical owner and independent challenge function. Who approves, who can override or pause, and which legal, information-governance and organisational decisions remain outstanding?",
        example:
          "Head of housing owns the decision. Team supervisor can pause use immediately; IT disables access. Information governance, security and equalities leads review the proposal before any use of live personal data. Unresolved approvals block that next phase.",
        sources: ["nist", "playbook"],
      },
      {
        id: "review",
        label: "What a reviewer actually does",
        prompt:
          "Specify what reviewers see, the checks they perform, their training, time and correction authority. What evidence would show they can detect and correct plausible errors under realistic workload?",
        example:
          "Officer checks every factual statement against the source record and rewrites unsupported text. Reviewers see sources, can discard the draft and receive protected review time. Test seeded omissions and misleading summaries before any live phase; record corrections and time taken.",
        sources: ["playbook"],
      },
      {
        id: "monitoring",
        label: "Measures, owners and cadence",
        prompt:
          "For each important risk or benefit, record a measure, denominator, data source, owner and review frequency. Examine serious errors and affected groups as well as averages. Define limits and explain who chose them and why.",
        example:
          "Supervisor reviews unsupported statements per sampled draft weekly, including severity and topic. Service analyst tracks end-to-end staff time against the current workflow. Thresholds for this exercise must be agreed locally; no universal ‘safe error rate’ is assumed.",
        sources: ["evaluation", "nist"],
      },
      {
        id: "challenge",
        label: "Challenge, incidents and escalation",
        prompt:
          "How can staff and affected people report errors or challenge outcomes? Who responds, within what service standard, and with what ability to correct records or remedy harm? Where are incidents and decisions recorded?",
        example:
          "Staff flag a draft in the incident log and notify the supervisor. Any later live phase must give residents an accessible route to an officer with correction authority. Logs record impact, remedial action and closure; the supplier is not the sole route for complaints.",
        sources: ["playbook", "nist"],
      },
      {
        id: "pause",
        label: "Pause conditions and working fallback",
        prompt:
          "Specify events that require stopping, who can trigger it, who disables the system and how service continues. Include supplier outages, changed models and a failed control. Test the fallback and any backlog it creates.",
        example:
          "Pause on an unapproved model change, data exposure or a serious undetected factual error. Supervisor notifies IT and reverts to manual drafting. Confirm staffing can absorb the work, then test restoring access only after a documented review.",
        sources: ["nist"],
      },
      {
        id: "reviewDate",
        label: "Review, change and exit",
        prompt:
          "Set a review date and owners for risk acceptance and renewal. What evidence is required before expanding scope, changing model or restarting? Describe record retention, supplier exit and how you will inform affected people of material changes.",
        example:
          "At the four-week review, the service owner examines error patterns, review effectiveness and total workload with staff representatives. Expansion needs a fresh decision and outstanding approvals. Keep versioned decisions and exportable records; do not automatically renew the pilot.",
        sources: ["nist", "playbook"],
      },
    ],
  },
];
export const findTool = (slug: string) =>
  policyTools.find((t) => t.slug === slug);
