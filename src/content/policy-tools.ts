import type { PolicyOption, ToolSlug } from "@/lib/policy-workspace";
import type { SourceId } from "./policy-sources";
export type ToolField = {
  id: string;
  label: string;
  prompt: string;
  example: string;
  reading: string;
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
  exampleCase: string;
  exampleTitle: string;
  exampleNote: string;
  exampleOptions?: PolicyOption[];
  reviewChecks: string[];
  sources: SourceId[];
  course: string;
  lesson: string;
};
// An AIPEX comparison of documented grading approaches, not an official appraisal.
export const gradingExampleOptions: PolicyOption[] = [
  {
    id: "baseline",
    name: "Calculated grades — historical comparator",
    mechanism:
      "Apply the standardisation approach to centre rankings using the documented cohort rules.",
    benefits:
      "Designed to support consistency of national standards. Aggregate consistency does not establish individual accuracy.",
    costs:
      "Analysis, administration, challenge and candidate/progression burdens. Comparable cost estimates are not supplied here.",
    distribution:
      "Examine centre/subject cohort sizes and individual exceptions. The method treated very small subject cohorts differently.",
    delivery:
      "Historical implementation is documented. That does not demonstrate a workable challenge route or every appraisal condition.",
    uncertainty:
      "Cancelled exams supply no realised exam outcome to validate individual estimates. Inspect assumptions about cohorts and rankings.",
    gate: "unknown",
  },
  {
    id: "option-1",
    name: "Centre assessment grades",
    mechanism:
      "Use teachers’ submitted estimates, rather than the calculated grade where these differ.",
    benefits:
      "Uses educators’ assessment of individual students. These are estimates, not observed exam results.",
    costs:
      "Submission, moderation, challenge and admissions effects need comparison on the same basis. No invented monetary estimates.",
    distribution:
      "Assess differences between centres and subjects; do not assume either impartiality or bias from teacher involvement alone.",
    delivery:
      "Centre estimates had been submitted. That alone does not resolve authority, timing or downstream capacity.",
    uncertainty:
      "The original rationale raised concern about optimism and inconsistency; disagreement with the model cannot identify the true grade.",
    gate: "unknown",
  },
  {
    id: "option-2",
    name: "Higher of centre assessment or calculated grade",
    mechanism: "Award the higher estimate, as announced on 17 August 2020.",
    benefits:
      "Prevents a final grade below either of the two estimates. This is a design property, not evidence of individual accuracy.",
    costs:
      "Reissuing grades and downstream progression/admissions effects require examination; the sources here are not a full cost appraisal.",
    distribution:
      "Who gains depends on differences between the two estimates. Consider cohort and centre effects, not only the aggregate increase.",
    delivery:
      "This became the historical final-grade policy. A retrospective account is not proof that every delivery condition was satisfied.",
    uncertainty:
      "Changes the aggregate grade distribution. The trade-off between individual protection and national comparability needs an explicit value judgement.",
    gate: "unknown",
  },
];

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
    sources: ["magenta", "evaluation", "cards", "recruitment"],
    exampleCase: "govuk-chat",
    exampleTitle: "GOV.UK Chat evidence review",
    exampleNote:
      "AIPEX analysis of GDS’s dated reports. Suggested tests and requests are our proposals, not reported GDS commitments.",
    reviewChecks: [
      "Can a reviewer trace every material claim to a dated source, population, system version and assessment method?",
      "Have you separated technical performance, user opinion and service impact, with a credible comparator for any causal claim?",
      "Have you recorded missing evidence, uncertainty, serious failures and who or what the test excludes, including overlap with training/tuning data?",
      "Does the conclusion stay within those limits, with a named next action and evidence that could change it?",
    ],
    fields: [
      {
        id: "claim",
        label: "The claim and the decision",
        prompt:
          "Quote or paraphrase the exact claim. Who made it, about which system/version, and what decision would it support? Record the source URL or document and date.",
        example:
          "GOV.UK Chat: assess the dated claims in GDS’s January 2024 and March 2026 accounts. AIPEX question: what do these reports establish about usefulness, answer quality and transfer to another service?",
        reading:
          "Model Cards §§4.1–4.2: model identity, intended users and out-of-scope uses.",
        sources: ["cards"],
      },
      {
        id: "population",
        label: "The population and outcome",
        prompt:
          "Who or what was tested, how were they selected, and what outcome was labelled? Include sample size, dates, missing records and whether the label measures the outcome you care about. Was evaluation independent of training/tuning, including repeat users, near-duplicate records and a reused benchmark?",
        example:
          "The 2024 usefulness survey has 157 respondents. Keep this population separate from expert-assessed answers. Request recruitment, non-response, query/topic coverage and the evaluated system version; missing details stay unresolved.",
        reading:
          "Model Cards §§4.5–4.6: evaluation/training data and coverage. ICO recruitment report p. 20: separation of training/testing/validation data.",
        sources: ["cards", "recruitment"],
      },
      {
        id: "comparison",
        label: "The comparison",
        prompt:
          "Compared with what: current practice, an alternative system or no intervention? Were cases, time periods and resources comparable? For causal claims, describe how the evaluation addresses what would have happened otherwise.",
        example:
          "The reports are not a controlled comparison of the same users doing the same tasks through Chat and the existing information route. A comparison would need task success, wrong actions, and total user/support time, with concurrent service changes recorded.",
        reading:
          "Magenta Book chapters 2–3: attribution and credible counterfactual designs; use theory-based approaches where appropriate.",
        sources: ["magenta"],
      },
      {
        id: "results",
        label: "What the results show",
        prompt:
          "Record numerator, denominator and metric. Include uncertainty, missing data and subgroup results where justified. Use the optional calculator below for a binary classification result. Keep technical metrics separate from service outcomes.",
        example:
          "GDS reports nearly 70% usefulness among the 2024 survey respondents, and a 2026 accuracy score of 90%. These are different measures. Request the accuracy denominator, rubric and serious-error breakdown. No binary confusion matrix is supplied; leave the calculator blank.",
        reading:
          "Model Cards §§4.4 and 4.7: metrics, uncertainty and subgroup analyses. AI evaluation guidance: distinguish system performance from intervention impact.",
        sources: ["cards", "evaluation"],
      },
      {
        id: "transfer",
        label: "What may change in your setting",
        prompt:
          "Compare the test with your population, workflow, staff, incentives and system version. What happens to time savings when review, appeals, training and errors are included? Name groups or situations the evidence does not cover.",
        example:
          "For a different service, check consequences of wrong advice, unsupported topics, accessibility and human support. A result on GOV.UK content cannot by itself validate another information source, model version or user population.",
        reading:
          "AI evaluation guidance, challenges for evaluation: changing systems, context and heterogeneous impacts.",
        sources: ["evaluation"],
      },
      {
        id: "request",
        label: "The next evidence to request",
        prompt:
          "Prioritise three requests that could change the decision. For each, state who will provide it, what it tests and when it is needed. Distinguish a decision-blocking gap from a useful later improvement.",
        example:
          "AIPEX proposed requests, not GDS commitments: evaluation lead supplies question-set/rubric/version records; service analyst specifies a same-task comparator; service owner reviews serious-error and support evidence. Assign actual names and deadlines before a decision. Missing records remain blockers to the claims they would test.",
        reading:
          "AI evaluation guidance: plan collection around the decision and intervention design. Model Cards identifies the missing reporting artefacts.",
        sources: ["evaluation", "cards"],
      },
      {
        id: "judgement",
        label: "Your bounded conclusion",
        prompt:
          "Write what is supported, what is not established and the next justified action. What evidence would change your view? Name the decision owner and review date. Do not turn a metric into a general safety or fairness verdict.",
        example:
          "The accounts document user-research and answer-evaluation findings, with important missing detail for independent appraisal. They do not establish the net benefit of a different chatbot. Next step: obtain the underlying evaluation design and specify a local comparison before making an expansion recommendation. Owner and review date remain to be assigned.",
        reading:
          "Magenta Book: communicate limitations of causal inference. AI evaluation guidance: fit conclusions to the intervention and available evidence.",
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
    exampleOptions: gradingExampleOptions,
    exampleCase: "grades-2020",
    exampleTitle: "England 2020 grading: retrospective options review",
    exampleNote:
      "AIPEX retrospective analysis of documented approaches. Proposed objectives and trade-offs are explicit analytical choices, not a reconstruction of Ofqual’s internal appraisal.",
    reviewChecks: [
      "Are the baseline and alternatives genuinely different ways to achieve the same objectives, drawn from a wider options search?",
      "Have costs, benefits and burdens been compared over the same period, including affected groups and effects outside the budget holder?",
      "Is every essential-condition judgement supported by evidence, and does the recommendation explain unresolved or failed conditions?",
      "Which assumption could reverse the preference? State the switching point if estimable; otherwise explain what evidence would resolve it.",
    ],
    fields: [
      {
        id: "problem",
        label: "The problem, scope and decision owner",
        prompt:
          "Describe the harm or opportunity, the affected population, the evidence and the decision you can actually take. Identify the actor’s authority and any boundary you cannot change.",
        example:
          "Retrospective England 2020 grading comparison: examinations were cancelled. Compare documented grading approaches under uncertainty. Ofqual’s later analysis is evidence for this review, not information available at the original decision point. The calculated-grade approach is the historical comparator.",
        reading:
          "Green Book chapter 4: rationale, theory of change and the business-as-usual counterfactual.",
        sources: ["green"],
      },
      {
        id: "objectives",
        label: "Outcomes and success measures",
        prompt:
          "Specify the change you want, for whom and by when. Explain the causal steps and what would count as failure. Record how people affected helped define success. Start with a wider longlist before choosing alternatives; include changing the workflow or using no AI where relevant.",
        example:
          "AIPEX analytical objectives: credible qualification standards, defensible individual treatment and timely progression. These may conflict. A narrower national grade distribution does not establish individual accuracy; fewer grades below teacher estimates does not establish accuracy either.",
        reading:
          "Green Book chapter 4: objectives and causal mechanisms. Magenta Book: test the theory of change rather than only measuring activity.",
        sources: ["green", "magenta"],
      },
      {
        id: "conditions",
        label: "Conditions every viable option must meet",
        prompt:
          "List essential conditions such as lawful authority, affordability, delivery capacity and access. State the evidence needed to judge each. In the option cards, mark whether all are met, unresolved or not met.",
        example:
          "AIPEX proposed appraisal conditions: usable candidate records; a deliverable timetable; authority to implement; and a workable challenge process before progression decisions. The cited record does not establish that every condition was met for every option: mark unresolved rather than infer a pass.",
        reading:
          "Green Book chapter 5: objectives and critical success factors screen the longlist; retain business as usual as a benchmark.",
        sources: ["green"],
      },
      {
        id: "evidence",
        label: "Evidence and uncertainties across options",
        prompt:
          "Record the sources and assumptions behind your comparison. Use the same time horizon and price basis across options; distinguish budget spending from wider social costs and avoid counting the same benefit twice. What is unknown about costs, take-up, behaviour and outcomes? Which change in an assumption would reverse your preference, and how would you test it?",
        example:
          "Use Ofqual’s account of calculated grades, centre assessments and the final higher-of-the-two policy. The later analysis compares estimates, not achieved exam results. Test how assumptions about teacher optimism, cohort sizes and individual exceptions change the ranking. Staff, appeal and admissions costs are not quantified here.",
        reading:
          "Green Book chapter 6, “Sensitivity analysis and switching values”: identify the assumption that could reverse the preference. Magenta Book informs new evidence collection.",
        sources: ["green", "magenta"],
      },
      {
        id: "recommendation",
        label: "Recommendation and trade-offs",
        prompt:
          "Select a preferred option in your own words, explain what it sacrifices and why it is justified against the baseline. If a condition is unresolved, make the recommendation conditional and specify who resolves it.",
        example:
          "A single preferred policy is not justified by grade differences alone. Present the trade-off: the higher-of-the-two approach avoids a final grade below either estimate, but changes aggregate outcomes and does not reveal true exam performance. Ask the decision maker to state the priority between competing objectives; leave unresolved feasibility conditions explicit.",
        reading:
          "Green Book chapter 6: a balanced value-for-money judgement includes unmonetisable effects, distribution, costs and uncertainty.",
        sources: ["green"],
      },
      {
        id: "evaluation",
        label: "Implementation, evaluation and reconsideration",
        prompt:
          "Who acts next, by when, and with what resources? How will you assess additional effects and distribution? State a review date, a stop/change condition and the evidence that could favour another option.",
        example:
          "Separate retrospective learning from an implementable historical plan. Examine grade changes, challenges and progression, without claiming a causal effect from the grade-gap comparison. A future cancellation policy would need early evidence collection, an accountable owner, a timetable and a pre-agreed reconsideration process.",
        reading:
          "Green Book chapter 10 and Magenta Book: plan monitoring/evaluation early, including the baseline and unintended effects.",
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
    exampleCase: "recruitment-audits",
    exampleTitle: "Recruitment audits: oversight analysis",
    exampleNote:
      "AIPEX proposed controls informed by the ICO’s historical findings. This is not the ICO’s operating plan or evidence of a current supplier’s arrangements.",
    reviewChecks: [
      "For each material failure, is there a control, responsible owner, test of effectiveness and evidence location?",
      "Can a reviewer detect and correct a plausible error under realistic workload, with source access, time and authority?",
      "Does monitoring specify a denominator, cadence, justified action trigger and response, including serious incidents and supplier changes?",
      "Has the pause-to-fallback route been rehearsed, with restart authority, outstanding approvals and a usable route for affected people to challenge?",
    ],
    fields: [
      {
        id: "service",
        label: "Service, system and boundaries",
        prompt:
          "Identify the service, people affected, system/vendor/version and workflow. What is permitted, prohibited and out of scope? Include the route for people who cannot or do not want to use the AI channel.",
        example:
          "Retrospective oversight analysis of recruitment screening using the ICO’s 2024 audit report. Organisation A is the report’s anonymised label. Product version, local recruiter, candidate population and intended deployment stage are not established for a new use: record them before adapting the plan.",
        reading:
          "NIST MAP 1–2: context, use and system boundaries. Playbook: lifecycle and use-case selection.",
        sources: ["nist", "playbook"],
      },
      {
        id: "authority",
        label: "Accountability and decision rights",
        prompt:
          "Name the accountable service owner, operational lead, reviewer, technical owner and independent challenge function. Who approves, who can override or pause, and which legal, information-governance and organisational decisions remain outstanding?",
        example:
          "AIPEX proposed allocation: recruiter’s accountable owner accepts residual risks; an analyst examines validation; operational staff can suspend use; relevant specialists decide data-protection and equalities questions. These are roles to assign, not named arrangements reported by the ICO. An unresolved approval blocks the stage that requires it.",
        reading:
          "NIST GOVERN 2 and 3.2: accountable leadership, assigned responsibilities and human–AI roles. Playbook: accountability.",
        sources: ["nist", "playbook"],
      },
      {
        id: "review",
        label: "What a reviewer actually does",
        prompt:
          "Specify what reviewers see, the checks they perform, their training, time and correction authority. What evidence would show they can detect and correct plausible errors under realistic workload?",
        example:
          "Proposed control: give a trained reviewer the relevant application, role criteria and reasons behind the output, plus time and authority to change the outcome. Test whether errors are caught before reliance. The public report does not establish that this control operates in a particular current service.",
        reading:
          "Playbook, “Human oversight”: design and assess meaningful review. NIST MAP 2.2 and MEASURE 2.3: human interpretation and deployment-like evaluation.",
        sources: ["playbook", "nist"],
      },
      {
        id: "monitoring",
        label: "Measures, owners and cadence",
        prompt:
          "For each important risk or benefit, record the failure or outcome, control, measure, denominator, data source, owner and review frequency. State how you tested the control and where the evidence can be inspected. Examine serious errors and affected groups as well as averages. Set a trigger and the action it causes; explain who chose it and why. Separate continuous incident reporting from periodic sampling.",
        example:
          "Request versioned test results, group denominators and corrective-action records. Check that training/test separation works in practice; artificial-data bias tests leave questions about real use. Assign an owner, cadence, action threshold and evidence location for each measure. Do not invent values to fill gaps.",
        reading:
          "NIST MEASURE 2.3–2.6 and MANAGE 4.1: deployment context and monitoring. AI evaluation guidance: end-to-end effects and variation between groups.",
        sources: ["evaluation", "nist"],
      },
      {
        id: "challenge",
        label: "Challenge, incidents and escalation",
        prompt:
          "How can staff and affected people report errors or challenge outcomes? Who responds, within what service standard, and with what ability to correct records or remedy harm? Where are incidents and decisions recorded?",
        example:
          "Proposed route: candidates and recruiting staff can reach a human investigator with correction authority. Record contact method, response standard, decision and remedy. Confirm how complaints reach the accountable recruiter rather than ending at a supplier inbox. These operating details require local agreement.",
        reading:
          "NIST GOVERN 5 and MANAGE 4.1–4.3: external feedback, incident response and documented remedies. Playbook: user feedback and human review.",
        sources: ["playbook", "nist"],
      },
      {
        id: "pause",
        label: "Pause conditions and working fallback",
        prompt:
          "Specify events that require stopping, who can trigger it, who disables the system and how service continues. Include supplier outages, changed models and a failed control. Test the fallback and any backlog it creates.",
        example:
          "Proposed triggers: a failed validation/control check, unapproved system change, or serious error requiring investigation. Assign who suspends reliance, who switches to a tested manual process, and who handles backlog. Confirm access, staffing and restart authority; none is established by the historical report.",
        reading:
          "NIST MANAGE 2.1–2.4: resources, non-AI alternatives, recovery and deactivation; GOVERN 6.2 covers supplier contingencies.",
        sources: ["nist"],
      },
      {
        id: "reviewDate",
        label: "Review, change and exit",
        prompt:
          "Set a review date and owners for risk acceptance and renewal. What evidence is required before expanding scope, changing model or restarting? Describe record retention, supplier exit and how you will inform affected people of material changes.",
        example:
          "Before use or a material change, the accountable owner should examine validation, reviewer effectiveness, complaints and remedial actions. Record residual risks, dissent, outstanding approvals and a dated next review. Supplier exit must preserve necessary decision records under an agreed retention arrangement. Actual dates and owners remain unassigned.",
        reading:
          "NIST GOVERN 1.5–1.7 and MANAGE 3–4: scheduled review, decommissioning, third-party changes and improvement.",
        sources: ["nist", "playbook"],
      },
    ],
  },
];
export const findTool = (slug: string) =>
  policyTools.find((t) => t.slug === slug);
