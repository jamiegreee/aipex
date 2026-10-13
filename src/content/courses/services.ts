import type { Course } from "@/lib/courses";
import { resources as r } from "./resources";
export const services: Course = {
  slug: "governing-ai-in-public-services",
  title: "Governing AI in Public Services",
  subtitle: "Make better decisions about real deployments.",
  description:
    "Assess an AI proposal, ask better procurement questions, design meaningful oversight and decide when to launch, change or stop a public-service deployment.",
  duration: "6–8 hours",
  theme: "pink",
  audience:
    "Public-service teams, commissioners, policy professionals and people scrutinising public-sector AI.",
  prerequisite:
    "Basic familiarity with AI. You can take this course independently of AI Policy in Practice. No technical background required.",
  outcome:
    "A deployment assurance pack and a go / conditional go / no-go recommendation for a fictional council service.",
  modules: [
    {
      title: "Understand the service",
      lessons: [
        {
          slug: "start-with-the-service",
          title: "Start with the service",
          minutes: 20,
          objectives: [
            "Describe a service problem before selecting a tool",
            "Map the complete workflow and a non-AI alternative",
          ],
          body: `## A proposal is not yet a service improvement

You are advising the **fictional Eastmere Council**. Its housing advice team receives 1,200 enquiries a month and struggles to route them promptly. A supplier proposes a language model that summarises enquiries and suggests a queue. The council wants shorter waits without missing urgent need. All organisations, numbers and incidents in this case are invented for learning.

Start by drawing the service today: a resident contacts the council; staff read the enquiry; staff identify urgency and route it; an adviser responds; the resident may need follow-up or referral. Describe delays and mistakes at each stage. A tool that makes summarisation quicker does not necessarily improve advice or outcomes. Staff might spend the saved time verifying an unreliable summary, or the bottleneck might actually be adviser capacity.

## Specify the proposed change

Distinguish summarisation, routing suggestions and final decisions. These are different functions with different consequences. A summary may omit a detail that affects urgency. A queue suggestion can change waiting time even if the tool never formally decides entitlement. Calling something “administrative” does not establish low stakes.

Name users and affected people. Staff operate the interface, but residents bear the consequences. Include people contacting by phone, with limited English, on behalf of someone else, or through an adviser. Identify where their information enters and where a mistake could become consequential.

## Check alternatives

Possible improvements include clearer intake forms, staff training, better queue rules, additional triage capacity and a deterministic routing tool. Compare the AI proposal against an improved service, not just an intentionally weak status quo. Ask whether the service has reliable criteria and data before automating any part of it.

An initial objective might be “reduce time to the appropriate adviser without increasing missed urgent cases”. Establish the current measures and their limitations. The fictional volume of 1,200 is a planning assumption; it does not tell you the distribution of need, urgency or complexity.

## Set the boundary

For this course, the candidate tool may summarise and suggest routing. It must not decide housing eligibility, send advice directly or close cases. This boundary is a proposed governance design, not a claim that these exclusions remove every risk. Your final task is to decide whether this bounded use can be justified, what evidence and controls it needs, and what should happen if it fails.`,
          exercise:
            "Map the current and proposed service in six steps. Identify two failure points, two affected groups, a measurable service objective and a credible non-AI improvement.",
          rubric: [
            "Covers the full service journey",
            "Distinguishes suggestion from final decision",
            "Includes residents beyond interface users",
            "Compares against a credible alternative",
          ],
          modelAnswer:
            "Current: receive enquiry → read information → identify urgency → route → advise → follow up. Proposed: receive → generate summary and suggested queue → staff verify against source → staff decide urgency and route → advise → follow up. An omitted eviction date or incorrect queue can delay urgent support. Residents using non-standard language and people contacting via advocates may be especially exposed. We would measure time to the right adviser and missed urgent cases, with clear definitions and a pre-launch baseline. A simpler intake form and trained manual triage are a credible comparator. Eligibility and resident advice remain outside the tool's permitted function.",
          questions: [
            {
              prompt: "A routing suggestion can…",
              options: [
                "Never affect residents because it is administrative",
                "Change waiting times and access to support",
                "Replace the need for a service map",
              ],
              answer: 1,
              explanation:
                "Consequences depend on how outputs are used in the workflow, not whether the vendor calls them administrative.",
            },
            {
              prompt: "The right comparator is…",
              options: [
                "A deliberately neglected manual process",
                "A credible improved service without this tool",
                "No comparator",
              ],
              answer: 1,
              explanation:
                "The proposal should demonstrate value against realistic alternatives.",
            },
          ],
          resources: [r.playbook],
        },
        {
          slug: "purpose-and-system-boundaries",
          title: "Purpose and system boundaries",
          minutes: 20,
          objectives: [
            "Write permitted and prohibited uses",
            "Identify a change that requires reassessment",
          ],
          body: `## Define the system, not just the model

The deployed system includes a model, instructions, data flows, interface, staff procedures, supplier services and the surrounding organisation. A claim about the underlying model does not tell you how that whole system behaves. Record what goes in, what comes out and what staff are expected to do with it.

Eastmere's intended use is a draft summary plus a suggested queue, visible only to trained housing staff. The source enquiry remains accessible. Staff must examine the source and confirm routing. The tool has no permission to contact residents, update eligibility or close cases. Write those restrictions into the design and operating procedure rather than relying on a slide saying “human in the loop”.

## Anticipate use beyond the original plan

A useful summary feature may gradually become the main record staff read. A queue score may be used to rank urgency. An integration may start writing directly into a case management system. These changes alter the risk even if the product name stays the same.

Define reassessment triggers: a new model or prompt, new data categories, a new language, another service, direct write access, a major workload change or evidence that staff bypass review. Assign someone to decide whether the change needs additional testing and approval. Make an inventory entry that includes the system owner and current version.

## Use permissions as a control

If direct resident communication is out of scope, do not grant the tool an email-sending credential. If it only recommends routing, require staff confirmation before changing the queue. A technical restriction can support an operating rule; neither is complete on its own.

Document fallback and end of use. The council needs to continue receiving and handling enquiries if the tool is unavailable, the contract ends or approval is withdrawn. Know which records are exported, how retention works and how staff resume manual triage.

## Define a decision gate

The first gate is agreement on purpose, boundaries and ownership. Later evidence is only relevant if you know which system and use it supports. A successful test of summarisation does not justify automated eligibility assessment. The assurance pack should therefore begin with a clear description that a resident, manager and technical colleague can recognise as the same deployment.`,
          exercise:
            "Write a system-purpose statement, four prohibited uses, three reassessment triggers and a manual fallback. Identify a permission that should be withheld.",
          rubric: [
            "Purpose specifies inputs, outputs and users",
            "Restrictions are operational",
            "Triggers include workflow changes",
            "Fallback maintains access to the service",
          ],
          modelAnswer:
            "The system drafts enquiry summaries and queue suggestions for trained housing staff, who verify the source and make routing decisions. It must not decide eligibility, contact residents, close cases or replace the source record. Reassessment is required for a model/prompt change, a new service or data category, or evidence of routine unverified routing. Withhold resident-message and case-closure permissions. On failure, incoming enquiries enter the staffed manual triage queue; original enquiries remain available and staff follow the documented urgency procedure. The service owner maintains a versioned inventory entry and approves changes.",
          questions: [
            {
              prompt: "Which needs reassessment?",
              options: [
                "Using tested summaries to start making eligibility decisions",
                "Keeping source records visible",
                "Documenting the owner",
              ],
              answer: 0,
              explanation:
                "A new consequential use is outside the evidence and approval for summarisation.",
            },
            {
              prompt: "A prohibited action is best supported by…",
              options: [
                "A slogan alone",
                "Appropriate permissions, procedures and checks",
                "A supplier logo",
              ],
              answer: 1,
              explanation:
                "Controls should make the boundary real and detect attempts to cross it.",
            },
          ],
          resources: [r.nist],
        },
      ],
    },
    {
      title: "Assess impact and evidence",
      lessons: [
        {
          slug: "risk-and-affected-people",
          title: "Risk and affected people",
          minutes: 25,
          objectives: [
            "Trace harms through a service workflow",
            "Prioritise risks without treating scores as proof",
          ],
          body: `## Trace a failure to its consequence

“Hallucination” names a technical failure, not its complete public-service impact. In Eastmere, a fabricated sentence might imply a resident has accommodation when they do not. A staff member could then choose a slower queue. The eventual harm is delayed help. Map the chain from failure to consequence and identify where it can be prevented, detected or corrected.

Include omission, misleading confidence, routing error, data leakage, service outage and misuse. Consider harms to residents, staff and the institution. A system can also produce benefits; compare the risk to the manual baseline rather than assuming existing services are flawless.

## Look for unequal exposure

Ask whether errors vary by language, enquiry length, disability-related communication needs, contact channel and unusual cases. Some categories may be sensitive, and collecting information to evaluate differences requires appropriate justification and handling. Work with relevant specialists and affected people; do not casually gather sensitive data because a dashboard would look thorough.

Rare events can be consequential. A small average error rate does not establish that missed urgent cases are acceptable. Test urgency-bearing details deliberately, alongside representative ordinary cases. Record which populations or conditions were not tested.

## Build a usable register

For each risk record the scenario, affected people, severity, likelihood or uncertainty, existing controls, proposed controls, residual concern and owner. Use scoring to organise discussion, not as an automatic approval system. Different risks may not be meaningfully comparable in a single numeric product.

Separate the owner of a control from the person accepting residual risk. A supplier may fix a logging issue; the council must decide whether remaining uncertainty is acceptable for this service. Some issues require specialist legal, data protection, equality, security or accessibility assessment. An AI checklist does not replace those responsibilities.

## Test controls against the mechanism

If staff are supposed to catch omitted deadlines, test whether the source is visible, staff have enough time and they actually spot omissions. “Training provided” is not evidence that review works. Prefer controls tied to an observable failure pathway and a person able to act. Your risk register should shape procurement, testing and launch conditions, rather than becoming a document completed after the real decision.`,
          exercise:
            "Create four risk-register rows. Include an omitted urgent detail, unequal performance, data leakage and outage. For each give a consequence, control, owner, residual uncertainty and a test.",
          rubric: [
            "Connects technical failure to resident consequences",
            "Includes distribution and uncertainty",
            "Controls address mechanisms",
            "Owners and tests are specific",
          ],
          modelAnswer:
            "Omitted eviction deadline → delayed urgent help; source verification and critical-detail highlighting owned by the review lead; test with deliberately difficult urgent cases. Unequal language performance → some residents routed incorrectly; evaluate relevant language cases and retain assisted manual handling, owned by the service lead; untested languages remain outside approval. Data leakage → disclosure of housing circumstances; minimise data, restrict access and verify supplier handling with privacy/security specialists; test access and retention controls. Outage → unprocessed enquiries; staffed manual fallback owned by operations; rehearse loss of the tool. Residual risks and specialist dependencies remain explicit rather than being cleared by an aggregate score.",
          questions: [
            {
              prompt: "A risk register should connect…",
              options: [
                "Technical failure, consequence, control, owner and evidence",
                "Only model names and prices",
                "Only positive use cases",
              ],
              answer: 0,
              explanation:
                "The register is useful when it drives concrete controls and decisions about consequences.",
            },
            {
              prompt: "A low average error rate proves…",
              options: [
                "Every group is well served",
                "Nothing about rare serious errors without further analysis",
                "Review is unnecessary",
              ],
              answer: 1,
              explanation:
                "Aggregate metrics can hide consequential rare errors and uneven performance.",
            },
          ],
          resources: [r.nist, r.ethics],
        },
        {
          slug: "evaluate-supplier-evidence",
          title: "Evaluate supplier evidence",
          minutes: 25,
          objectives: [
            "Ask for evidence specific to the deployment",
            "Design a test that includes difficult cases and a baseline",
          ],
          body: `## A benchmark is a starting point

The fictional supplier says its model performs well on a general language benchmark. That may indicate useful capability, but Eastmere needs evidence about housing enquiries, urgency-bearing details and staff behaviour. Ask which version was tested, using what instructions, in what workflow and against which comparator.

Define acceptance criteria before the trial. Candidate measures include critical-detail omission, incorrect urgency routing, staff correction time, total time to the right adviser and resident experience. Specify what counts as a critical detail and who adjudicates ambiguous cases. Otherwise a favourable headline can conceal inconsistent labels.

## Assemble a defensible test set

Use appropriately handled representative examples plus designed stress cases. Include long, ambiguous, multilingual and urgent enquiries relevant to the approved scope. Keep a separate holdout set that is not used to tune the system. Document provenance, lawful handling and limitations with the appropriate specialists. Synthetic examples are useful for stress tests but cannot by themselves demonstrate real-world performance.

Compare the whole workflow with a credible manual alternative. Measure staff verification and correction, not merely model generation time. If users need to reconstruct omitted details, a fast model may create a slow service.

## Interpret numbers carefully

Imagine a fictional trial of 100 cases: four critical details are omitted. One summary might omit several details; define whether your denominator is cases or details. If only ten urgent cases were tested, the absence of an urgent-case error offers limited confidence. Do not advertise a precise guarantee from a small sample.

Ask about failure examples, confidence intervals or other appropriate uncertainty analysis, subgroup evidence and known limitations. Seek reproducible methods and appropriate access for independent scrutiny. Supplier confidentiality may require a proportionate arrangement; it should not become a blanket excuse for unverifiable consequential claims.

## Make testing decision-relevant

The trial should tell the council whether to reject, redesign or proceed to a tightly bounded pilot. Preserve the results, version and approval conditions. A material system change may require retesting. Approval belongs to the specific deployment supported by the evidence, not every future feature shipped under the supplier's brand.`,
          exercise:
            "Write a test plan with five case categories, three acceptance measures, a manual comparator, a holdout approach and two reasons the 100-case result cannot be treated as a guarantee.",
          rubric: [
            "Tests the actual task and version",
            "Includes ordinary and difficult cases",
            "Measures the whole workflow",
            "Reports sample and transfer limitations",
          ],
          modelAnswer:
            "Test ordinary enquiries, urgent deadlines, long mixed-topic messages, relevant multilingual enquiries and ambiguous cases. Measure critical-detail omissions, incorrect urgent routing and total staff handling time against trained manual triage. Define labels with independent reviewers, hold out cases from tuning and record disagreements. Use appropriately handled source examples alongside synthetic stress cases. Four omissions in 100 cases is an observed trial result, not a guaranteed live rate; the sample may be unrepresentative and contains too few urgent cases for strong conclusions. Reassess after any significant model, prompt or workflow change.",
          questions: [
            {
              prompt: "The strongest evidence concerns…",
              options: [
                "The supplier's largest benchmark",
                "The specific task, population, version and workflow",
                "The most attractive product demonstration",
              ],
              answer: 1,
              explanation:
                "Transfer to the intended service must be established rather than assumed.",
            },
            {
              prompt: "A holdout set should…",
              options: [
                "Be used repeatedly to tune the system",
                "Remain separate from tuning to support an independent test",
                "Contain only easy cases",
              ],
              answer: 1,
              explanation:
                "Repeated tuning on the test cases can make performance estimates misleading.",
            },
          ],
          resources: [r.playbook],
        },
      ],
    },
    {
      title: "Procure and govern data",
      lessons: [
        {
          slug: "procurement-and-contracts",
          title: "Procurement and contracts",
          minutes: 25,
          objectives: [
            "Turn assurance needs into procurement questions",
            "Identify change, audit and exit provisions",
          ],
          body: `## Buy a governable service

Procurement should ask whether the council can operate, inspect, change and leave the proposed service. Price and headline capability are only part of value. Involve commercial, operational, legal, security and data protection colleagues early enough to influence the requirement.

State the service problem and permitted use. Request evidence for the intended workflow, not a generic ethical AI statement. Ask who provides the model, which subcontractors process data, where relevant operations occur, what the council can inspect and how changes are communicated. Answers should be verifiable and tied to contractual or operational commitments where appropriate.

## Ask for operational control

For Eastmere, key questions include: can staff see and preserve source enquiries and outputs? Can the council obtain relevant logs? What happens when the model changes? Can automatic updates be withheld pending testing? How are incidents reported and investigated? What support exists during outages? What are the permitted and prohibited uses of council data?

Avoid demanding impossible absolute guarantees. Instead define reasonable evidence, response commitments, allocation of responsibilities and consequences for failure. A supplier's “human oversight” feature is not enough if staff cannot understand or correct the output.

## Plan the exit before signing

Determine what data can be exported in a usable format, how the service resumes manually, what assistance is provided at termination, and how deletion is verified subject to agreed retention obligations. Vendor lock-in can arise from workflow dependence, specialised integrations or loss of records, not just a long contract term.

Include whole-service costs: integration, staff verification, training, assurance, monitoring, support and exit. A low licence fee may obscure substantial council work. Compare alternatives and document assumptions.

## Preserve public accountability

Commercial confidentiality and public transparency need thoughtful handling; one does not automatically eliminate the other. Plan what can be explained about purpose, decision use, risks and accountability without exposing sensitive information. Check the current procurement requirements and applicable institutional processes with specialists. The questions in this lesson support that work; they are not a ready-made legally compliant contract or a substitute for the relevant procurement route.`,
          exercise:
            "Draft eight procurement questions covering evidence, logs, updates, incidents, data use, support, costs and exit. Choose three that should become explicit acceptance or contract conditions, and explain why.",
          rubric: [
            "Questions are verifiable",
            "Includes lifecycle and exit",
            "Covers full costs",
            "Distinguishes a question from an enforceable commitment",
          ],
          modelAnswer:
            "Ask for deployment-specific tests; accessible source/output logs; advance notice and control of material updates; incident reporting and investigation; documented data-use limits; outage support; full integration/assurance pricing; and usable export/deletion arrangements. Conditions should include access to agreed logs because review otherwise cannot work, change notification with reassessment because evidence is version-specific, and an exit arrangement because the service must continue after termination. Commercial and legal colleagues should draft the actual provisions and test whether the supplier can deliver them. A promise in a sales presentation is not treated as an enforceable condition.",
          questions: [
            {
              prompt: "Which belongs in whole-service costing?",
              options: [
                "Licence only",
                "Integration, verification, monitoring and exit as well as licence",
                "Only the demo setup",
              ],
              answer: 1,
              explanation:
                "Costs arise throughout delivery and operation, not just from the purchase price.",
            },
            {
              prompt: "Exit planning should happen…",
              options: [
                "Before committing to the service",
                "Only after the supplier fails",
                "Never for a pilot",
              ],
              answer: 0,
              explanation:
                "The council needs records and continuity even for a bounded pilot or early termination.",
            },
          ],
          resources: [r.procurement],
        },
        {
          slug: "data-and-access",
          title: "Data and access",
          minutes: 25,
          objectives: [
            "Map information flows and access",
            "Minimise unnecessary personal data in a deployment",
          ],
          body: `## Follow the information

Housing enquiries can contain intensely personal information. Draw the flow from intake to council storage, supplier processing, model service, logs, staff interface and any exports. Record what is sent, who can see it, how long it remains and whether it is used for other purposes. “The supplier is secure” is not a data-flow map.

For each step ask whether the information is necessary for the permitted task. A summary tool may need the facts of an enquiry but not every identifier. Removing names alone does not necessarily make a detailed account anonymous. Discuss proposed handling with the appropriate privacy and security specialists.

## Separate access roles

Staff reviewing an individual enquiry need different access from managers monitoring aggregate performance or suppliers supporting an incident. Give people and systems only the access needed for their role. Protect source records, outputs and logs; generated summaries may contain sensitive information too.

Define how access is granted, reviewed and revoked. Test that one staff role cannot inspect records outside its responsibility. Ensure support access is controlled and auditable. Protect credentials and avoid giving the model or integration broad permissions just because setup is easier.

## Establish retention and purpose

Agree what is retained to support casework, review, incident investigation and evaluation, and for how long. Check whether supplier terms allow training or reuse of council inputs; do not assume a marketing statement covers every subprocessor or configuration. Verify the actual service settings and agreement.

Balance minimisation with accountability. Deleting every output immediately may prevent investigation; keeping everything forever creates exposure. Document the purpose and rationale for each retained record with relevant specialists. Use controlled evaluation data rather than copying live cases into personal spreadsheets or general chat tools.

## Make a decision, not a checkbox

Applicable data protection duties, lawful basis, assessment requirements and international arrangements need current expert advice for the real deployment. This lesson provides the questions and information map that make that advice useful. A completed AI course or a signed supplier questionnaire cannot establish compliance. Unresolved material data-handling questions should be a gate before processing real resident information, with an approved safer test route if discovery must continue.`,
          exercise:
            "Map six data-flow steps. For each record purpose, recipient, access and retention questions. Propose two minimisation changes and one test of role-based access. Use fictional examples, not real residents' data.",
          rubric: [
            "Includes model provider and logs",
            "Does not equate removing names with anonymity",
            "Separates staff, monitoring and support roles",
            "Makes unresolved handling a decision gate",
          ],
          modelAnswer:
            "Intake → council case store → minimised request to supplier → model service → protected source/output log → staff review interface. For each, confirm purpose, processor/recipient, access controls and retention. Remove unnecessary identifiers and do not send attachments irrelevant to routing, while preserving source case records in the approved council system. Reviewers can see assigned cases; managers use appropriate aggregate reporting; support access is temporary and audited. Test that a reviewer cannot access an unrelated case by changing an identifier. Confirm provider reuse/training settings and retention with privacy/security colleagues before any live resident processing.",
          questions: [
            {
              prompt: "Removing names from a detailed enquiry…",
              options: [
                "Always makes it anonymous",
                "May still leave identifiable personal information",
                "Eliminates every security concern",
              ],
              answer: 1,
              explanation:
                "Other details and context can still identify a person.",
            },
            {
              prompt: "Generated summaries need…",
              options: [
                "No protection because they are generated",
                "Appropriate access and retention controls",
                "Public access by default",
              ],
              answer: 1,
              explanation:
                "Outputs can reproduce or infer sensitive information about residents.",
            },
          ],
          resources: [r.ethics],
        },
      ],
    },
    {
      title: "Design meaningful oversight",
      lessons: [
        {
          slug: "human-review-that-works",
          title: "Human review that works",
          minutes: 25,
          objectives: [
            "Specify the conditions for meaningful review",
            "Test automation bias in a real workflow",
          ],
          body: `## A person in the diagram is not enough

Human review can fail when staff lack time, information, training or authority. Eastmere's interface might show a polished summary first and hide the original enquiry behind several clicks. Busy staff may accept the suggested queue because disagreeing feels slow or risky. The nominal reviewer then becomes a stamp on the system's output.

Specify what reviewers must check: urgency-bearing facts against the source, unsupported statements, missing context and whether the suggested queue fits the service rules. Require source access at the point of decision. Staff need to know the tool's limits and how to record a correction without being penalised for appropriate challenge.

## Provide authority and capacity

A reviewer must be able to override the suggestion and route a case manually. There should be an escalation path for uncertainty and a staffed fallback for tool failure. If workload targets make verification impossible, the governance design has failed even if every member of staff attended training.

Measure reviewer behaviour during the pilot. Use deliberately flawed outputs in a controlled test to see whether staff identify and correct them. Observe handling time and ask staff where the interface nudges acceptance. Do not expose residents to avoidable harm merely to run a test; use an appropriately designed simulation or non-live environment.

## Choose where review occurs

For a draft summary and queue suggestion, review before consequential routing may be appropriate. Sampling after routing could detect trends but cannot reliably protect each urgent enquiry. Distinguish preventative checks, detection checks and incident investigation. Their timing determines which harms they can address.

Document the process with concrete examples: a missing date, an ambiguous living situation, an unsupported statement and an unfamiliar language. Let reviewers practice refusing an output and reverting to manual triage.

## Evaluate the control itself

If reviews miss repeated critical errors, adding another checkbox is unlikely to solve the problem. Redesign the interface, reduce scope, change staffing or stop the deployment. “Human oversight” is a claim that must be evidenced through actual work. Record the resources it requires and include them in the appraisal rather than counting all model-generated minutes as a saving.`,
          exercise:
            "Write a reviewer operating procedure covering five checks, source access, override, escalation and fallback. Design a safe test using three flawed outputs, with a success criterion for the review process.",
          rubric: [
            "Review is before consequential action",
            "Includes information, authority and time",
            "Tests reviewer behaviour",
            "Treats review costs as real resources",
          ],
          modelAnswer:
            "Reviewers compare source and summary, check deadlines and urgency, identify unsupported facts, check omitted context and apply approved routing rules. The source is visible beside the suggestion; staff can override and record reasons. Ambiguity goes to the senior triage lead, with manual routing if the tool fails. In a non-live simulation, insert an omitted deadline, a fabricated accommodation claim and a wrongly suggested low-priority queue. Require reviewers to detect and correct all three before independent live work, then monitor sampled practice and capacity. If workload or interface design defeats verification, pause rather than relying on the training record.",
          questions: [
            {
              prompt: "Meaningful review requires…",
              options: [
                "A staff name on a diagram",
                "Information, time, competence and authority to change the result",
                "A checkbox labelled responsible AI",
              ],
              answer: 1,
              explanation:
                "The control must enable a real assessment and correction.",
            },
            {
              prompt: "After-the-fact sampling alone…",
              options: [
                "Protects every urgent case before harm",
                "Can reveal patterns but may not prevent individual routing harm",
                "Replaces incident handling",
              ],
              answer: 1,
              explanation:
                "Timing matters: detection after a decision differs from preventative review.",
            },
          ],
          resources: [r.playbook],
        },
        {
          slug: "transparency-and-challenge",
          title: "Transparency and challenge",
          minutes: 20,
          objectives: [
            "Explain the tool's role in plain language",
            "Design a route for challenge and correction",
          ],
          body: `## Explain what changes for residents

Transparency should help people understand the service and exercise agency. A general statement that the council “uses innovative AI” does not explain whether a tool summarises an enquiry, influences its queue or decides eligibility. Describe the actual role, its limits, the human responsibility and where questions can go.

For Eastmere, a plain-language notice could say: “Staff may use a tool to draft a summary and suggest which team should handle your enquiry. Staff check the original information and make the routing decision. The tool does not decide your eligibility or send housing advice.” The notice is only truthful if the operating design actually follows it.

## Support challenge

Provide a usable route for someone to query a delay or correct a misunderstanding. It should not require knowing which model was used or speaking technical language. Offer accessible channels and ensure staff can locate the relevant record. Do not make residents explain the internal cause of a problem before the council investigates.

Separate public explanations, individual case communication and internal audit records. A public record describes purpose, accountability, data use and risks; individual communication concerns the person's enquiry; logs support investigation. Publishing a technical report alone does not replace a functioning challenge route.

## Check the applicable transparency standard

The UK Algorithmic Transparency Recording Standard provides a structured record for public-sector algorithmic tools. Its mandatory scope and exemptions are defined separately. Check the current official policy for the actual body and tool rather than claiming it is mandatory for every council or every AI use. The hub and scope guidance are linked below. Voluntary use can still help structure a clear public explanation.

For this fictional council, draft a record as a learning exercise without asserting that a legal publication duty applies. Include an owner, purpose, decision role, affected people, data categories, risks, mitigations and review date. Handle sensitive details appropriately with specialists.

## Keep the explanation current

If staff start using suggestions to rank urgency automatically, the original notice is no longer sufficient. Link transparency review to change control. Test explanations with residents and advisers: can they say what the tool does and how to get help? Accountability is visible when a person can obtain an answer and a correction, not just when a webpage exists.`,
          exercise:
            "Draft a 100-word resident notice, a challenge pathway with an owner and response process, and a short public-record outline. Explain how you would check whether ATRS publication is mandatory for a real deployment.",
          rubric: [
            "Plain language accurately describes the decision role",
            "Challenge does not require technical knowledge",
            "Distinguishes notices, records and logs",
            "Checks scope rather than claiming universal duties",
          ],
          modelAnswer:
            "Staff may use a tool to draft a summary and suggest a team for your enquiry. Staff check your original information and decide where it goes. The tool does not decide eligibility or provide advice. Contact the housing team by phone or the service form if information is wrong or you are concerned about a delay; a staff member will investigate and explain the next step. The service lead owns the route, retrieves records and escalates unresolved cases. The public outline covers purpose, owner, decision role, data, risks and review date. For a real deployment we would check the current ATRS scope and exemptions policy for the organisation and use case.",
          questions: [
            {
              prompt: "ATRS is mandatory for…",
              options: [
                "Every organisation using AI worldwide",
                "Organisations and tools within its current defined mandatory scope",
                "Only whichever supplier advertises compliance",
              ],
              answer: 1,
              explanation:
                "Check the official scope and exemptions policy; do not extend it universally.",
            },
            {
              prompt:
                "A resident should have to identify the model to complain?",
              options: [
                "Yes",
                "No; the service should investigate a usable description of the problem",
                "Only if the complaint is urgent",
              ],
              answer: 1,
              explanation:
                "A challenge route should be accessible to people who do not know the system's technical details.",
            },
          ],
          resources: [r.transparency],
        },
      ],
    },
    {
      title: "Operate and learn",
      lessons: [
        {
          slug: "pilot-and-launch-gates",
          title: "Pilot and launch gates",
          minutes: 25,
          objectives: [
            "Define a bounded pilot and observable gates",
            "Distinguish technical testing from live-service approval",
          ],
          body: `## A pilot needs limits

Calling something a pilot does not make it safe. Define its population, functions, staff, duration, maximum exposure and decision at the end. A bounded pilot provides useful learning while controlling exposure; an indefinite pilot can become an unexamined permanent service.

For Eastmere, consider a small staff-assisted pilot in one queue after non-live tests. Exclude eligibility decisions and direct resident messages. Untested conditions should have a documented manual route. Decide which enquiries are suitable based on the evidence rather than selecting only easy cases and later generalising the result.

## Define launch gates

Candidate gates include agreed purpose and owner; specialist approvals for data and security; relevant performance evidence; a demonstrated review process; accessible notices and challenge; monitored logs; staff capacity; and a rehearsed manual fallback. Tailor them to this case. A checklist is useful only if each answer points to evidence and a responsible decision.

Record unresolved issues and conditions. “Conditional go” should say who resolves what and by when, and whether live processing can begin before resolution. Material preconditions are gates, not tasks quietly deferred until after launch. The accountable service owner accepts residual risk within the institution's governance; the supplier does not approve itself.

## Design pilot learning

Track service outcomes, model failure and human review. Compare against trained manual triage, document the version and inspect subgroup or channel differences relevant to scope. Establish who sees reports and what triggers immediate action. A monthly report is inadequate if urgent-case errors need a same-day response.

Budget for evaluation and operations. Staff who verify outputs, investigate incidents and support residents need time. A pilot without that capacity cannot test the intended design reliably.

## Decide what happens next

Schedule an end decision: expand, revise, extend learning with a specific question, or stop. Define the evidence required and retain a fallback after the pilot. Avoid measuring success by deployment count. A well-run pilot that identifies unacceptable omission risk and prevents rollout has served the council. The assurance pack should make that possibility explicit before procurement enthusiasm turns into an assumed commitment.`,
          exercise:
            "Design an eight-week pilot: scope, exposure limit, five launch gates with evidence, owner, monitoring cadence and end decision. Include one condition that prevents live launch.",
          rubric: [
            "Pilot is bounded in scope and time",
            "Gates link to evidence",
            "Unresolved material preconditions block launch",
            "End decision can include stopping",
          ],
          modelAnswer:
            "Pilot one staffed routing queue for eight weeks with an agreed case-volume cap, excluding eligibility and direct messages. Gates: purpose approved; data/security handling signed off; task tests meet documented criteria; reviewers demonstrate correction; fallback and challenge route are rehearsed. Lack of approved live-data handling blocks launch. The service owner approves, the triage lead operates and an evaluation lead reports weekly on delay, omissions, correction and burden. Serious urgent-case failures are escalated immediately. At week eight decide whether evidence supports expansion, redesign or stopping against the manual comparator. Any extension must answer a specific unresolved question rather than becoming permanent by default.",
          questions: [
            {
              prompt: "A pilot is safe simply because it is called a pilot?",
              options: [
                "Yes",
                "No; its scope, safeguards and exposure still matter",
                "Only if free",
              ],
              answer: 1,
              explanation:
                "The label does not remove the consequences of live-service use.",
            },
            {
              prompt: "A material data-handling precondition should…",
              options: [
                "Be resolved before live processing",
                "Be hidden in a backlog",
                "Be waived by sales staff",
              ],
              answer: 0,
              explanation:
                "A precondition is a gate, not a post-launch aspiration.",
            },
          ],
          resources: [r.playbook],
        },
        {
          slug: "monitor-incidents-and-change",
          title: "Monitor, handle incidents and change",
          minutes: 25,
          objectives: [
            "Connect monitoring to intervention",
            "Plan incident response and version change",
          ],
          body: `## Monitor a service, not just a model

Track whether residents reach appropriate support, staff can perform review and the system remains within its approved boundaries. Useful measures include critical omissions, routing corrections, time to adviser, review burden, complaints, outages and relevant group or channel differences. Interpret them together rather than declaring success from speed alone.

Assign owners and action thresholds. A rising correction rate might indicate worse outputs or better staff detection. Investigate before drawing conclusions. A serious missed urgent case may require immediate containment regardless of the average trend.

## Rehearse an incident

Suppose staff discover that the tool repeatedly omits eviction dates. Preserve appropriate source/output records, alert the triage lead, stop affected use, switch to manual handling and identify cases requiring re-review. Support residents who may have been delayed. Bring in relevant incident, privacy, legal and safeguarding expertise according to the nature of the event and current institutional duties.

An investigation should examine the model, prompt, input format, interface, workload and review procedure. Do not blame a staff member for missing an error if the design made verification unrealistic. Identify immediate containment, underlying correction and conditions for restarting.

## Control updates

Record which version generated each relevant output. Material changes to the model, prompts, integrations, data or service use should trigger proportionate reassessment. A supplier update may improve average performance while worsening an important edge case. Keep approval tied to tested configurations and defined workflows.

Test rollback and manual continuity. If reverting is impossible, that limitation affects procurement and launch approval. Avoid assuming that “cloud software updates itself” absolves the council from managing consequences.

## Learn and report

After an incident, provide an accountable report: what happened, who was affected as far as known, what was done, limitations in the investigation and changes required. Protect sensitive information while giving meaningful explanations to those affected. Monitoring earns its cost when it leads to action. A chart that stays green because no one records failures is worse than an honest measure that prompts a pause and a better service.`,
          exercise:
            "Write a response plan for repeated omitted eviction dates: immediate containment, affected-case review, owner, records, resident support, root-cause questions and restart criteria. Add three change-control triggers.",
          rubric: [
            "Contains harm and maintains service",
            "Reviews affected cases",
            "Investigates the whole workflow",
            "Restart requires evidence, not reassurance",
          ],
          modelAnswer:
            "The triage lead pauses affected tool use and switches to manual handling. Preserve controlled source/output/version records and identify enquiries potentially affected by the omission pattern for re-review and resident follow-up. The service owner coordinates appropriate incident specialists. Investigate prompt changes, input formatting, source visibility, staff workload and reviewer detection. Restart only after the cause is addressed, representative urgent-case tests and review simulations pass, and the owner approves remaining risk. Model updates, new input channels and direct case-system write access trigger reassessment. Report what is known and unknown rather than promising no resident was affected without evidence.",
          questions: [
            {
              prompt: "Repeated critical omissions should trigger…",
              options: [
                "A marketing update",
                "Containment, case review and investigation",
                "Only a quarterly average",
              ],
              answer: 1,
              explanation:
                "The response must address affected residents and the mechanism of failure promptly.",
            },
            {
              prompt: "Approval for one version covers all future updates?",
              options: [
                "Yes",
                "No; material changes need proportionate reassessment",
                "Only if the product name is unchanged",
              ],
              answer: 1,
              explanation:
                "Evidence and controls apply to a defined configuration and use, not a brand indefinitely.",
            },
          ],
          resources: [r.nist],
        },
      ],
    },
    {
      title: "Make the deployment decision",
      lessons: [
        {
          slug: "assurance-pack-and-decision",
          title: "An assurance pack people can use",
          minutes: 20,
          objectives: [
            "Assemble evidence around a decision",
            "Explain a conditional recommendation precisely",
          ],
          body: `## Assurance is an argument with evidence

An assurance pack should explain why a deployment is justified, what evidence supports that judgment and what conditions remain. It is not a folder full of unrelated checklists. The decision-maker must be able to trace each important claim to evidence, control and owner.

Start with a one-page decision note: proposed use; service objective; recommendation; principal benefits and risks; evidence limits; unresolved gates; accountable owner; and next review. Use go, conditional go or no-go only with a clear explanation of what action is authorised.

## Organise supporting material

Include a system and service map, alternatives appraisal, risk register, data-flow map and specialist assessments, supplier evidence and procurement conditions, test results, review procedure, transparency and challenge materials, and pilot/monitoring/incident/exit plans. Keep the scope and version consistent across documents.

For Eastmere, if the supplier cannot provide adequate logs, that limitation must appear in the decision note, risk register and launch conditions. It should not be hidden in a procurement annex while the front page says “fully assured”. If tests excluded non-English enquiries, the scope must not imply approval for all languages.

## Distinguish evidence from promises

“Staff will verify every output” is a planned control. A simulation showing staff detected critical errors is evidence about that control under tested conditions. Live monitoring may later show whether it holds at real workloads. Label the status and date of each claim so the pack does not turn future work into accomplished fact.

## Make conditional approval precise

A conditional recommendation might authorise additional non-live testing while prohibiting live resident processing until data handling and review capacity are confirmed. Alternatively, it might authorise a bounded live pilot after all pre-launch conditions are independently checked. Spell out the difference.

Include the alternative if conditions fail. Better manual triage may deliver some benefits without the same deployment exposure. A defensible no-go recommendation should still explain how the underlying service problem will be addressed. Governance is useful when it enables better service decisions, including the decision not to use AI.`,
          exercise:
            "Draft a one-page assurance-pack index with a claim, evidence, owner and status for six key items. Write a precise conditional recommendation that distinguishes non-live work from live approval.",
          rubric: [
            "Pack supports an explicit decision",
            "Claims have evidence and status",
            "Scope/version is consistent",
            "Conditional approval states exactly what is permitted",
          ],
          modelAnswer:
            "Items: service benefit (workflow comparison, evaluation lead, provisional); urgency accuracy (test report, analyst, incomplete); meaningful review (simulation, triage lead, planned); data handling (flow and specialist assessment, privacy/security leads, unresolved); supplier governability (logs/update/exit commitments, commercial lead, negotiation); continuity (fallback rehearsal, operations lead, planned). Recommendation: continue controlled non-live testing and manual-process improvement; do not process real enquiries until live-data arrangements, record access, review capacity and launch tests are approved. The service owner returns with evidence for a bounded pilot decision. No language or use outside the tested scope is authorised.",
          questions: [
            {
              prompt: "A planned control is…",
              options: [
                "Already proven effective",
                "A commitment needing evidence and follow-through",
                "Equivalent to a completed test",
              ],
              answer: 1,
              explanation:
                "The pack must distinguish intended action from demonstrated performance.",
            },
            {
              prompt: "Conditional approval should specify…",
              options: [
                "Exactly which actions may proceed and which gates remain",
                "Only that the team is optimistic",
                "That all risks are gone",
              ],
              answer: 0,
              explanation:
                "Without precise conditions, a restricted recommendation can be mistaken for full rollout approval.",
            },
          ],
          resources: [r.playbook],
        },
        {
          slug: "capstone-deployment-decision",
          title: "Capstone: your deployment decision",
          minutes: 65,
          minimumWords: 300,
          objectives: [
            "Integrate service, evidence and controls into a deployment decision",
            "Identify unresolved conditions and a viable alternative",
          ],
          body: `## Decide for Eastmere

Write a 500–800 word deployment recommendation and assurance summary. Reuse your saved exercises to cover the service objective, alternatives, system boundary, risks, evidence, procurement/data conditions, human review, transparency, pilot gates and incident response.

The final fictional update: in a 100-case non-live trial, four summaries omitted a critical detail. Staff caught three of those four during a simulation. The trial included only ten urgent cases and did not cover every language used by residents. Overall handling time was lower, but staff reported that source comparison was awkward. The supplier offers advance update notice but has not agreed all logging and exit terms. Live-data handling still awaits specialist assessment. Manual triage remains operational.

Do not treat these invented observations as statistically conclusive or as facts about a real supplier. They are enough to expose dependencies: evidence is limited, human review missed a critical omission, interface design needs work and live-data arrangements remain unresolved. A recommendation for additional non-live work can be useful without approving a live pilot now.

## Choose and justify

You may recommend go, conditional go or no-go, but specify the action and evidence supporting it. A broad live rollout is hard to justify from this case. If you recommend a later bounded pilot, state which conditions must be satisfied first and who checks them. Include an alternative for improving manual triage if the conditions cannot be met.

Name two risks that would remain even after your controls. Show how monitoring detects them and who can pause use. Include a resident explanation and challenge route, and the effect of a material supplier update on approval.

## Review the complete argument

Ask whether a service manager can understand what is authorised, a reviewer can perform the procedure, a resident can obtain help and an evaluator can judge whether the deployment adds value. Ensure you have not assumed that efficiency proves appropriateness or that a person in the workflow guarantees protection.

The written recommendation is self-assessed using the rubric and worked example; checks test understanding of the course. Completion is a record of learning, not an accredited qualification, legal opinion or approval to deploy a real system. Save your final pack and export your portfolio from My learning. The useful result is a decision process you can adapt with the appropriate specialists in your own institution.`,
          exercise:
            "Write your 500–800 word recommendation for the updated case. Include the action authorised now, three alternatives, evidence limits, priority risks, exact launch gates and owners, review/transparency/incident arrangements, residual risks and a later decision. Minimum 300 words to submit; aim for the full recommendation.",
          rubric: [
            "Decision matches the case evidence and outstanding gates",
            "Compares the manual alternative",
            "Treats the missed omission and sample limits seriously",
            "Defines data, contract and review preconditions",
            "Supports resident challenge and continuity",
            "Names monitoring, pause and reassessment owners",
          ],
          modelAnswer: `**Recommendation:** conditional go for further controlled non-live development, not live resident processing or rollout. The service owner should return with a bounded pilot proposal after the gates below are evidenced.

**Objective and alternatives:** improve time to the appropriate housing adviser without increasing missed urgent need. Compare existing manual triage, improved intake and trained manual triage, and staff-assisted AI summaries/routing suggestions. Manual improvement remains the fallback and may be preferable if AI verification removes the apparent time benefit.

**Evidence:** the 100-case trial suggests possible handling-time improvement, but four critical omissions and one missed by reviewers undermine confidence in the present design. Ten urgent cases and incomplete language coverage are insufficient to support broad approval. These observations are the fictional case assumptions, not guaranteed live performance rates. Retest a revised interface using representative and stress cases against trained manual triage, with independent labels and a holdout set.

**Scope and gates:** permit only draft summaries and queue suggestions to trained staff; exclude eligibility, resident advice, case closure and untested uses. Before any live pilot, the privacy/security leads must approve real-data handling, the commercial lead must resolve appropriate logs/update/exit terms, the triage lead must demonstrate meaningful review and capacity, and operations must rehearse manual fallback. The service owner checks evidence and accepts residual risk through council governance.

**Oversight and residents:** place source enquiries alongside drafts, require checks of urgency-bearing facts before routing and enable override/escalation. Test reviewers with flawed outputs in a non-live simulation. Explain the tool's limited role in plain language and provide a staffed challenge route that does not require residents to know the model. Consider an ATRS-style public record after checking the actual mandatory scope.

**Operation:** a later eight-week capped pilot needs weekly whole-service measures, urgent incident escalation and an end decision. The triage lead can pause affected use for serious omission patterns, preserve controlled records, re-review affected cases and support residents through manual handling. Model, prompt, language or workflow changes require reassessment before extending approval.

**Residual risk and next step:** rare omissions and workload-driven automation bias may persist. Monitor correction, delays and review behaviour together. Do not count lower generation time as a guaranteed service saving. If evidence and conditions cannot be met, choose improved manual triage. This retains the service objective while declining an insufficiently supported deployment.`,
          questions: [
            {
              prompt: "What does the update justify?",
              options: [
                "Immediate broad rollout",
                "Further non-live work with unresolved live gates made explicit",
                "A claim that every error was caught",
              ],
              answer: 1,
              explanation:
                "The case contains material unresolved evidence, review, contract and data issues.",
            },
            {
              prompt: "If AI conditions cannot be met, the council should…",
              options: [
                "Ignore the service problem",
                "Consider the credible manual improvement alternative",
                "Deploy because procurement took effort",
              ],
              answer: 1,
              explanation:
                "The objective is a better public service, not deployment for its own sake.",
            },
          ],
          resources: [r.playbook, r.nist],
        },
      ],
    },
  ],
};
