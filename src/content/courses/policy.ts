import type { Course, Lesson } from "@/lib/courses";
import { resources as r } from "./resources";

const lesson = (value: Lesson) => value;
export const policy: Course = {
  slug: "ai-policy-in-practice",
  title: "AI Policy in Practice",
  subtitle: "From a big question to a useful recommendation.",
  description:
    "Learn the craft of AI policy: define a problem, judge evidence, navigate institutions, compare interventions and write a recommendation someone can act on.",
  duration: "8–10 hours",
  theme: "blue",
  audience:
    "Policy professionals, researchers, advocates and people moving into AI policy.",
  prerequisite:
    "Basic familiarity with AI and its policy debates. No coding, economics degree or previous government role required.",
  outcome:
    "A decision briefing and delivery plan for a fictional AI recruitment policy case.",
  modules: [
    {
      title: "Frame the decision",
      lessons: [
        lesson({
          slug: "a-policy-problem-not-a-technology",
          title: "A policy problem, not a technology",
          minutes: 40,
          objectives: [
            "Separate a public problem from a proposed technical solution",
            "Write a decision question with a realistic scope",
          ],
          body: `## Start with a decision

An AI policy team earns its keep by helping someone make a better decision. “What should we do about AI?” is an area of interest. It is not yet a workable assignment. Name the decision-maker, the people affected, the harm or opportunity, and the decision that can actually be taken.

Throughout this course you advise the **fictional Northbridge Employment Partnership**. It funds local employment services and has heard complaints about automated recruitment screening. Its chair wants a recommendation in six weeks. You have two analysts and a small research budget. All organisations, numbers and incidents in this case are invented for learning; they are not findings about a real council or supplier.

Your initial case file contains three claims: employers report too many applications; applicants say rejections are difficult to challenge; suppliers say screening improves consistency. These claims can all be true. Your task is not to choose which group you like most, or to decide whether AI is good in general.

## Describe the mechanism

Follow a concrete pathway: a candidate submits an application; a screening system scores it; someone uses that score to decide who gets interviewed; a rejection affects the candidate's opportunities. Ask where a preventable problem could enter that pathway. A model can be accurate at predicting historic hiring decisions while reproducing an employer's past mistakes. A transparent rejection can still be unfair. A slow manual process can also exclude people.

Distinguish **the observed problem**, **your explanation**, and **the response**. “Applicants cannot obtain a review” describes an experience. “Employers rely on automated scores without a challenge route” is a hypothesis about why it happens. “Require a review mechanism” is an intervention to test. Mixing these together makes your preferred policy appear inevitable.

## Set boundaries

Choose a population, use case, place and time horizon. For Northbridge, begin with screening for jobs advertised through partnership-funded services over the next twelve months. This is narrower than regulating every recruitment product in the UK, but it gives the partnership a plausible lever. Record the wider questions you are setting aside, rather than pretending they do not matter.

A useful decision question is: **What conditions, if any, should Northbridge attach to funded recruitment services to improve access to review without making the service unusable?** That question leaves several answers open. Carry it into your research rather than starting with a demand to ban or subsidise a technology.`,
          exercise:
            "Write a 150–200 word scoping note for Northbridge. Include the decision-maker, population, observed problem, a causal hypothesis, the decision deadline and one explicit boundary. End with a decision question that leaves at least two responses open.",
          rubric: [
            "Names a decision Northbridge can take",
            "Separates an observation from an explanation",
            "Defines who and what is in scope",
            "Does not build a preferred intervention into the question",
          ],
          modelAnswer:
            "Northbridge's chair must decide within six weeks whether to change conditions for partnership-funded recruitment services. The initial concern is that applicants rejected after automated screening cannot get a meaningful review. We do not yet know its frequency or whether automation, staffing or employer policy causes it. One hypothesis is that staff lack access to the information needed to challenge a score. Scope is screening for jobs advertised through funded services, with effects assessed over twelve months. General national product regulation and decisions by employers outside the funded network are outside this initial recommendation. Our question is: which changes to funded-service conditions would improve access to review while preserving a viable recruitment service? We will compare a better manual process, notice and review requirements, and a restricted pilot before recommending a response.",
          questions: [
            {
              prompt: "Which is the strongest starting question?",
              options: [
                "How do we make Northbridge an AI leader?",
                "What service conditions would address barriers to reviewing screening decisions?",
                "How quickly can we ban automated recruitment?",
              ],
              answer: 1,
              explanation:
                "It links a specific problem to a decision within the partnership's potential control while leaving options open.",
            },
            {
              prompt: "A supplier's accuracy claim is initially…",
              options: [
                "Evidence that deployment is justified",
                "A claim to examine in context",
                "Proof of discrimination",
              ],
              answer: 1,
              explanation:
                "You need the definition of accuracy, population, comparator and independent evidence before drawing a policy conclusion.",
            },
          ],
          resources: [r.green],
        }),
        lesson({
          slug: "objectives-and-theory-of-change",
          title: "Objectives and a theory of change",
          minutes: 40,
          objectives: [
            "Turn an aspiration into measurable objectives",
            "Explain how an intervention could produce an outcome",
          ],
          body: `## Decide what better means

An objective should describe a change in the world, not just an activity. “Publish guidance” is an output. “Applicants can obtain a timely, meaningful review” is an outcome. Publication may contribute to that outcome, but only if the right people read the guidance, have incentives to follow it and can act on it.

For Northbridge, define improvement across three dimensions: effective access to review, equitable treatment of applicants and a recruitment service employers can still use. Resist collapsing these into one headline score. A quicker review process that never changes a decision may be less useful than a slower one that identifies serious errors.

## Build a causal chain

Try a provisional intervention: funded providers must explain how screening is used and offer a review by a trained person. The causal chain is: a condition in the funding agreement changes provider procedures; providers give understandable notices; applicants know a review exists; applicants can request it without unreasonable effort; reviewers have information and authority; correctable errors are identified and remedied.

Write the weakest link under each arrow. Applicants may fear that a complaint harms future job prospects. Reviewers may rubber-stamp scores. Providers may lack records. Employers may leave the scheme. These are design questions and evaluation questions, not reasons to ignore the chain.

## Specify measures before targets

Possible measures include the proportion of eligible applicants who know about review, time to a reasoned response, reviews identifying a material error, applicant experience, and employer participation. State denominators. “Ten complaints” means little without knowing whether there were fifty applicants or fifty thousand. A fall in complaints could mean fewer problems or a harder complaint process.

Do not invent a baseline as if it were known. Mark it “to establish” and say how: a sample of recent applicants, provider process checks and interviews with people who did not complain. In this fictional exercise, you can choose illustrative targets, but label them as proposals needing evidence and stakeholder agreement.

## Make trade-offs visible

An objective can conflict with another. A very fast review may require more staff; an extensive notice may overwhelm applicants. Identify minimum conditions you will not trade away casually, alongside benefits that can be balanced. Give each objective an owner and a review date. Your theory of change should help a delivery team decide what to test, and help a chair understand where confidence ends.`,
          exercise:
            "Draft three outcome objectives and a six-link theory of change for the review requirement. For each objective propose a measure and identify a missing baseline. Include two assumptions that could break the chain.",
          rubric: [
            "Objectives concern outcomes rather than publication or meetings",
            "Measures have clear denominators or definitions",
            "The causal chain explains behaviour",
            "At least two plausible failure mechanisms are identified",
          ],
          modelAnswer:
            "Objective one: eligible applicants can obtain a reasoned review; measure awareness and the proportion of valid requests receiving a response within an agreed time. Objective two: material screening errors are remedied; track independently sampled reviews and resulting corrections. Objective three: access to funded vacancies is maintained; track participating employers and vacancy volume. All baselines need establishing. Funding condition → provider procedure → accessible notice → applicant request → empowered review → correction and learning. Two critical assumptions are that applicants feel safe requesting review and reviewers can obtain evidence rather than merely repeat a supplier's score. We would test both with applicant interviews and a sample of completed reviews before expanding the requirement.",
          questions: [
            {
              prompt: "Which is an outcome?",
              options: [
                "Run four workshops",
                "More applicants obtain meaningful review",
                "Write a toolkit",
              ],
              answer: 1,
              explanation:
                "An outcome concerns the effect on people; workshops and toolkits are outputs.",
            },
            {
              prompt: "Complaints fall after launch. What follows?",
              options: [
                "The policy worked",
                "The policy failed",
                "Investigate alongside access and experience measures",
              ],
              answer: 2,
              explanation:
                "Complaint volumes are ambiguous without evidence about the underlying problems and ability to complain.",
            },
          ],
          resources: [r.magenta],
        }),
      ],
    },
    {
      title: "Work with evidence",
      lessons: [
        lesson({
          slug: "audit-an-evidence-claim",
          title: "Audit an evidence claim",
          minutes: 45,
          objectives: [
            "Interrogate a quantitative AI claim",
            "Distinguish prediction quality from policy value",
          ],
          body: `## What exactly was measured?

The fictional supplier SelectWise tells Northbridge that its product is “92% accurate” and “saves 40% of staff time”. Before repeating either number, ask for the task, sample, metric, comparator, period and uncertainty. Accurate at what: reproducing a historic shortlist, identifying later job performance, or finding all candidates qualified for an interview?

Imagine a test set with 1,000 applications, of which only 80 meet an agreed interview threshold. A system that rejects everyone is 92% accurate if accuracy simply counts correct classifications. It is useless for finding candidates. This arithmetic is illustrative, not a claim about real recruitment systems. Ask how many qualified applicants are missed, how many unqualified applicants are advanced, and how the threshold changes those errors.

## Separate four questions

First, does the technical result hold in the test setting? Second, does it transfer to Northbridge's applicants and jobs? Third, does it improve the actual recruitment workflow against a credible alternative? Fourth, does that improvement justify the costs and distribution of harms? A strong answer to the first is not a shortcut to the fourth.

Check provenance: who commissioned the study, who chose the comparator and whether the methods and limitations are available. Supplier evidence is not automatically worthless; it needs independent scrutiny proportionate to the decision. Applicant testimony is not a population estimate, but it can identify mechanisms that a benchmark misses.

## Examine the counterfactual

“Saves time” must be compared with something. Was the comparator an old manual system, an improved manual process, or a different tool? Does the time estimate include procurement, training, checking, appeals and fixing failures? A saving in one team can create work elsewhere or shift effort onto applicants.

Sample selection matters. A trial with enthusiastic staff, easy roles and English-language applications may say little about difficult cases. A before-and-after comparison may confuse the product with a change in vacancy mix. Ask what would have happened without the intervention, and what alternative explanations remain.

## Record confidence without theatre

Build a claim log: claim, evidence, limitations, relevance, confidence and decision implication. Use plain statements such as “promising in the supplier's test population; transfer to local vacancies untested”. Precision in wording is more useful than a decorative traffic light with no reasoning behind it. The next action should be clear: request subgroup error rates, commission a workflow trial, or discount an unsupported claim.`,
          exercise:
            "Produce an evidence audit of the supplier's two claims. Ask six specific questions, calculate the reject-everyone accuracy in the case example, and explain what evidence would change your decision.",
          rubric: [
            "Identifies metric and denominator",
            "Checks a credible comparator and full workflow costs",
            "Considers transfer and selection",
            "Links missing evidence to a decision",
          ],
          modelAnswer:
            "Rejecting all 1,000 applicants correctly rejects the 920 below threshold, giving 920/1,000 = 92% accuracy while missing all 80 qualified applicants. I would ask what outcome was labelled, who labelled it, the false-negative rate, errors across relevant applicant groups, which workflow supplied the time baseline, and whether review/training costs were counted. I would request a test on representative Northbridge vacancies against an improved manual baseline, with independent checks and documented uncertainty. Evidence of materially fewer harmful errors at acceptable whole-service cost would support a bounded pilot; a headline classification score alone would not justify rollout.",
          questions: [
            {
              prompt: "In the example, 92% accuracy can coexist with…",
              options: [
                "No qualified candidates being identified",
                "Proof that the tool is fair",
                "A guaranteed 40% cost saving",
              ],
              answer: 0,
              explanation:
                "An imbalanced dataset can make an always-reject classifier look accurate while missing every qualified candidate.",
            },
            {
              prompt: "Which cost belongs in the appraisal?",
              options: [
                "Only software licence cost",
                "Licence, staff, review, integration and failure costs",
                "Only the cost quoted in the sales deck",
              ],
              answer: 1,
              explanation:
                "The decision concerns the whole service, including costs moved elsewhere in the workflow.",
            },
          ],
          resources: [r.green],
        }),
        lesson({
          slug: "research-under-uncertainty",
          title: "Research under uncertainty",
          minutes: 40,
          objectives: [
            "Prioritise research that could change a recommendation",
            "Use scenarios without pretending to predict the future",
          ],
          body: `## Not every uncertainty deserves another study

You have six weeks, not a mandate to resolve every AI debate. Start with your decision and ask which unknowns could alter it. A missing fact about whether Northbridge's funding agreement can include a review condition may matter more than another forecast of AI's long-run economic effects.

Rank uncertainties by decision sensitivity and whether they can be reduced in time. For the recruitment case, identify legal authority, prevalence and severity of review failures, provider capacity, applicant trust and the likely participation response. Record what you already know, what you infer, and what remains genuinely unknown.

## Triangulate evidence

Design a modest research package: review the funding agreement with appropriate legal expertise; interview providers; sample recent applicant experiences; inspect a few screening workflows; and ask suppliers for relevant testing documentation. Different sources answer different questions. Interviews explain mechanisms but may miss people who are hardest to reach. Administrative data shows recorded events but excludes experiences never recorded.

Include a dissent search. If your emerging recommendation is a review requirement, look for cases where such requirements became inaccessible paperwork. Ask what a critic would need to demonstrate to make you change course. Document your search boundaries and non-response so a later reader can assess the evidence rather than just trust your confidence.

## Use scenarios as stress tests

Choose two or three plausible operating conditions: providers have enough capacity; review demand exceeds capacity; employers withdraw from the funded network. These are not probabilities unless you have a defensible basis for assigning them. Ask whether your option remains useful in each, what early signal would distinguish them, and what adaptation would be available.

A robust recommendation may be a limited pilot with explicit conditions, even if you cannot rank every future outcome. Reversibility is valuable when learning is possible and exposure can be bounded. It is not a substitute for safeguards where harm would be severe or difficult to undo.

## Give decision-makers usable uncertainty

Avoid both “more research is needed” and false certainty. Say: “We are confident the current review route is hard to navigate in the sampled services; we do not yet know prevalence across all providers. A short discovery phase should establish that baseline before imposing a network-wide condition.” End with a decision that can be taken now and a later decision that better evidence will unlock.`,
          exercise:
            "Create a five-row uncertainty register: unknown, why it matters, research method, deadline and decision changed. Add two operating scenarios and one trigger for adapting your recommendation.",
          rubric: [
            "Prioritises decision-sensitive uncertainty",
            "Uses complementary research methods",
            "Includes a realistic deadline",
            "Scenario triggers connect to an available action",
          ],
          modelAnswer:
            "Priority unknowns: authority (legal review, week one, determines available conditions); review failures (applicant sample, week three, determines scale); provider capacity (process observation, week three, determines timing); employer response (interviews, week four, determines participation safeguards); applicant trust (accessible interviews, week three, determines outreach). In the high-demand scenario we fund additional reviewers before expanding. If more than the agreed maximum of requests miss the response deadline for two consecutive reporting periods, pause expansion and investigate. In the withdrawal scenario we compare lost vacancies against access benefits and consider revising the condition. These are stress tests, not numerical forecasts.",
          questions: [
            {
              prompt: "Which research should come first?",
              options: [
                "Any interesting AI forecast",
                "Research that could change the live decision",
                "The largest available survey",
              ],
              answer: 1,
              explanation:
                "Research priorities follow decision sensitivity, feasibility and the time available.",
            },
            {
              prompt: "A scenario is best used to…",
              options: [
                "Claim a precise probability without evidence",
                "Stress-test an option and identify adaptation triggers",
                "Replace evidence gathering",
              ],
              answer: 1,
              explanation:
                "Scenarios make assumptions and response choices visible; they are not automatically predictions.",
            },
          ],
          resources: [r.magenta],
        }),
      ],
    },
    {
      title: "Find the levers",
      lessons: [
        lesson({
          slug: "institutions-and-authority",
          title: "Institutions and authority",
          minutes: 40,
          objectives: [
            "Map responsibilities without confusing influence and legal power",
            "Identify where expert legal advice is needed",
          ],
          body: `## A policy without an owner is a wish

AI problems cut across institutions. That does not mean every institution can act on every part. Map four roles: who decides, who delivers, who oversees, and who can challenge. Then distinguish formal powers from budget control, contractual leverage, expertise and public influence.

Northbridge controls some funding agreements and convenes employers. It does not acquire the powers of a national regulator because it cares about AI. A provider may control staff practice but not the underlying recruitment system. A supplier may control model updates while an employer retains the hiring decision. Responsibilities must be assigned at the level where action is possible.

## Draw the chain of authority

Begin with the partnership's governing documents and the actual agreements. Who approves new conditions? Is there a renewal date? Which services and employers are covered? Are there existing obligations relevant to the problem? Ask appropriately qualified colleagues to check the legal position, including applicable employment, equality and data protection requirements. This course teaches how to structure those questions; it does not decide legal compliance for a real organisation.

For each proposed intervention, make a row: instrument, authority, decision-maker, affected actor, enforcement route and unresolved questions. A voluntary statement of principles has different effects from a funded-service condition. A contract condition is not a new statute. An awareness campaign cannot compel a supplier to provide logs.

## Coordinate rather than duplicate

Identify organisations already addressing the problem and ask what you can add. Relevant public bodies depend on the jurisdiction, sector and specific conduct. Use current official sources to check responsibilities rather than copying an old organisational chart. A referral protocol may be more useful than inventing another reporting portal.

International frameworks can organise questions, but they are not interchangeable with domestic powers. A voluntary risk framework can guide evidence requests; it does not create an enforcement mandate. Similarly, a rule that applies to one category of organisation should not be advertised as applying universally.

## Turn the map into action

The point is not a handsome diagram. It is knowing whose agreement is needed, where delivery can fail and what Northbridge should refer elsewhere. End the institutional map with an accountable sponsor, an implementation owner and a list of approvals. If authority is uncertain, make resolving it a condition before proceeding, not a footnote after launch.`,
          exercise:
            "Map Northbridge, providers, employers, suppliers and applicants. For a funding condition and a voluntary guidance option, identify the decision owner, instrument, delivery actor, oversight route and one authority question requiring expert advice.",
          rubric: [
            "Distinguishes formal authority from influence",
            "Assigns delivery and oversight",
            "Avoids assuming a local body can regulate nationally",
            "Makes unresolved authority an explicit dependency",
          ],
          modelAnswer:
            "Northbridge's chair sponsors the proposal, with the governing board approving revised funding conditions if its powers and agreements permit. Providers implement notices and review routes; employers supply decision records; suppliers support access to relevant system information; applicants use and help test the route. A contract manager checks compliance and refers appropriate matters through established routes. Guidance can be agreed and published through the partnership's normal governance but has no equivalent enforcement mechanism. Legal advisers must establish whether existing agreements permit the new condition and how it interacts with the parties' existing duties. No option assumes Northbridge can regulate the whole recruitment market.",
          questions: [
            {
              prompt: "Which statement is sound?",
              options: [
                "An AI interest gives a partnership regulatory powers",
                "Contractual leverage and statutory powers are distinct",
                "A voluntary framework overrides domestic law",
              ],
              answer: 1,
              explanation:
                "Different instruments have different authority and enforcement routes.",
            },
            {
              prompt: "Uncertain authority should be…",
              options: [
                "Resolved as a delivery dependency",
                "Omitted to keep the brief short",
                "Treated as approval",
              ],
              answer: 0,
              explanation:
                "You cannot responsibly promise an intervention before checking that the relevant body can take it.",
            },
          ],
          resources: [r.nist],
        }),
        lesson({
          slug: "stakeholders-and-legitimacy",
          title: "Stakeholders and legitimacy",
          minutes: 40,
          objectives: [
            "Design engagement that includes affected people",
            "Use disagreement to improve a proposal",
          ],
          body: `## Influence is not the same as exposure

A stakeholder map should show who can block implementation and who bears its consequences. These groups may be very different. A supplier with a large account team can attend every meeting; a rejected applicant may have neither time nor confidence to join a formal consultation.

For Northbridge, include applicants, people who abandoned applications, employment advisers, small and large employers, providers, suppliers, relevant oversight bodies and groups supporting people facing access barriers. Do not treat any group as having a single opinion. People may want both efficient recruitment and a meaningful challenge route.

## Ask questions that matter

Engagement is most useful when it can alter a decision. Ask applicants what made review difficult, providers what information they can access, employers which burdens would change their participation, and advisers where existing processes fail. Present real alternatives with trade-offs. “Do you support fair AI?” tells you almost nothing about design.

Use accessible formats and proportionate support. A short phone interview, plain-language scenario and translated materials may reveal more than a long online questionnaire. Decide how to handle sensitive experiences and avoid collecting identifiable case information you do not need. Give people a way to contribute without being publicly named.

## Prevent a false consensus

Record disagreements explicitly. Applicants may favour independent review; providers may prefer internal review for speed; employers may oppose sharing detailed records. Do not write “stakeholders support the proposal” because the best-resourced attendees agreed. Track who participated, who was missing and how those limits affect confidence.

Conflicts of interest should be visible. A supplier can contribute technical expertise while also benefiting from a particular policy. An advocacy group can contribute lived-experience evidence while favouring a particular remedy. Assess evidence and incentives rather than dismissing participation because someone has an interest.

## Close the loop

Explain what changed after engagement, what did not and why. A feedback note should connect input to decisions: “Applicants could not understand the original notice, so we tested a shorter version; we retained an internal first review because independent review capacity is limited, with escalation for unresolved cases.” This makes engagement accountable. The goal is a defensible process and a better design, not universal agreement or a photograph of a busy workshop.`,
          exercise:
            "Design a one-page engagement plan with four groups, a decision-relevant question for each, accessible participation, an approach to conflicting interests and a way to report back. Identify a group likely to be missing.",
          rubric: [
            "Includes people affected with limited institutional power",
            "Questions could change design",
            "Explains participation barriers",
            "Records disagreement and closes the feedback loop",
          ],
          modelAnswer:
            "We would interview rejected and withdrawn applicants through advisers using short, optional calls; ask what made review inaccessible and test notices. Provider workshops would inspect what reviewers can see and change. Employer interviews would compare workload under each option. Supplier sessions would request evidence and system-access commitments while recording commercial interests. People who stopped using funded services are likely to be missing, so recruitment cannot rely solely on active applicant lists. We will publish an anonymised account of input, design changes and unresolved disagreements, and provide participants a plain-language update. Participation is not represented as consent to the final recommendation.",
          questions: [
            {
              prompt: "A packed supplier workshop establishes…",
              options: [
                "Representative public support",
                "Input from those who attended",
                "Legal authority to act",
              ],
              answer: 1,
              explanation:
                "Attendance provides evidence of participants' views, not representativeness or consent from everyone affected.",
            },
            {
              prompt: "The most useful question is…",
              options: [
                "Do you support responsible AI?",
                "Would a two-stage review route solve your access problem, and where would it fail?",
                "Is our logo appealing?",
              ],
              answer: 1,
              explanation:
                "It tests a concrete design and can reveal changes needed before delivery.",
            },
          ],
          resources: [r.ethics],
        }),
      ],
    },
    {
      title: "Compare interventions",
      lessons: [
        lesson({
          slug: "build-a-real-options-set",
          title: "Build a real options set",
          minutes: 45,
          objectives: [
            "Construct materially different interventions",
            "Include a credible baseline and non-AI alternatives",
          ],
          body: `## Options should differ in mechanism

Three versions of the same preferred policy do not constitute a meaningful choice. Start with how each option could change behaviour. Information may change understanding; funding conditions may change incentives; a redesigned service may change what is possible; oversight may change consequences for poor practice.

For Northbridge, create a longlist: keep existing arrangements with better monitoring; improve the manual review process; publish voluntary screening guidance; attach notice and review conditions to funding; run a restricted service pilot with independent review; or stop funding automated screening in the covered service. Do not assume every option is feasible or desirable. The longlist is a way to reveal alternatives before narrowing them.

## Use a credible baseline

The baseline is what would reasonably happen without your new proposal, including changes already committed. It is not a deliberately neglected service that makes the preferred option look brilliant. If provider training is already funded, include it. If contracts renew next year, that timing affects both the baseline and the intervention.

Consider a non-AI alternative. If the problem is opaque rejection, a simpler recruitment process, clearer criteria or better staff capacity might help regardless of the technology. Equally, a ban on one system may cause substitution to another process with the same problem. Follow the causal mechanism rather than the label on the tool.

## Filter transparently

Shortlist against explicit constraints: authority, relevance to objectives, delivery capacity, affordability and potential harm. Keep a record of why an option was removed. An option should not disappear merely because it inconveniences a powerful stakeholder or contradicts the team's first idea.

Separate constraints from preferences. Lack of legal authority may rule an option out for Northbridge. A preference for low administrative burden is a criterion that can be weighed alongside others. If an option needs action from another body, it might remain a referral recommendation rather than a direct intervention.

## Specify the option enough to compare

“Human oversight” is not a costable design. Say who reviews, when, with what information, how many cases, what authority and what happens after review. A shortlist of three well-described options is more useful than twenty slogans. Keep the same population and time horizon across them so differences in scope do not silently determine the result.`,
          exercise:
            "Create a six-option longlist, then shortlist three including a credible baseline. Describe each shortlisted mechanism and explain two exclusions. Include at least one alternative that improves the service without adopting new AI.",
          rubric: [
            "Options have different behavioural mechanisms",
            "Baseline includes committed changes",
            "Non-AI alternative is credible",
            "Exclusions are reasoned and visible",
          ],
          modelAnswer:
            "Longlist: baseline with existing training; clearer manual review; voluntary notices; funding-linked notices and review; restricted independent-review pilot; prohibition within funded services. Shortlist: baseline, improved manual review, and funding-linked review with a staged pilot. The baseline measures existing practice; manual review adds staff and clearer criteria; a funding condition creates a compliance incentive and an applicant route. We defer independent review at scale because capacity is unproven, retaining it as a pilot component. We exclude a blanket prohibition from the initial shortlist because evidence has not established that it addresses the review problem better than less restrictive options, and substitution effects need investigation.",
          questions: [
            {
              prompt: "Which baseline is credible?",
              options: [
                "One stripped of already-funded improvements",
                "Expected service without the proposal, including committed changes",
                "The worst imaginable service",
              ],
              answer: 1,
              explanation:
                "Appraisal compares a proposal against a realistic counterfactual, not a straw alternative.",
            },
            {
              prompt: "Three slogans for responsible AI are…",
              options: [
                "A complete options appraisal",
                "Insufficient without mechanisms and delivery specifications",
                "A legal mandate",
              ],
              answer: 1,
              explanation:
                "Options must be specific enough to assess their effects, costs and feasibility.",
            },
          ],
          resources: [r.green],
        }),
        lesson({
          slug: "appraisal-and-distribution",
          title: "Appraisal and distribution",
          minutes: 45,
          objectives: [
            "Compare benefits, costs and risks consistently",
            "Show whose gains and losses are hidden by an average",
          ],
          body: `## Compare like with like

Build an appraisal table using the same objectives, population and time horizon for every shortlisted option. Include access to review, meaningful correction, provider and employer burden, affordability, implementation risk and distributional effects. Record the evidence behind each judgment.

Do not turn a table into a machine for producing your preferred answer. A score of four rather than three is not evidence. If you use scores, define them, make weights explicit and test whether reasonable alternative weights change the ranking. A narrative explanation should remain understandable without the arithmetic.

## Make an illustrative cost estimate

Suppose a review pilot covers 2,000 applications, with a 10% review request rate and 30 minutes of reviewer time per request. That is 200 reviews and 100 reviewer hours. At an illustrative fully loaded cost of £40 per hour, direct review labour is £4,000. These figures are fictional assumptions, not a forecast or a market quote. Add training, administration, system access, evaluation and applicant effort before discussing total cost.

Test demand and handling time. At 20% demand and 45 minutes per review, labour becomes 300 hours, or £12,000 using the same assumption. A credible brief explains that sensitivity instead of reporting £4,000 as a precise budget. Some outcomes are difficult to monetise; describe them clearly rather than omitting them or fabricating a price.

## Look beneath the average

Who benefits from a digital review form? People confident online may use it easily; others may need supported access. Who bears compliance costs? A small employer may face a different burden from a large one. A service can have a positive average outcome while worsening access for a group already disadvantaged.

Map benefits and burdens across affected groups, then examine mitigation and remaining trade-offs. Avoid treating aggregate efficiency as an automatic answer to rights or legitimacy questions. State which minimum safeguards constrain the choice and where decision-makers must make a value judgment.

## Recommend with conditions

You may conclude that a funding-linked review pilot is worth testing but not ready for network-wide implementation. Specify the conditions under which it would become preferable: confirmed authority, access to records, enough reviewer capacity and evidence that affected applicants can use it. An appraisal should narrow the decision honestly, not hide uncertainty behind a single number.`,
          exercise:
            "Compare your three options against five criteria. Calculate the two illustrative labour estimates, identify one distributional concern and test whether a changed assumption could reverse your recommendation.",
          rubric: [
            "Uses consistent criteria",
            "Calculates £4,000 and £12,000 with assumptions visible",
            "Includes whole-service costs and unpriced effects",
            "Tests distribution and sensitivity",
          ],
          modelAnswer:
            "The baseline is easiest to deliver but leaves review access untested. Improved manual review has a direct mechanism and moderate staffing costs. Funding-linked review may create stronger incentives but depends on authority, records and provider capacity. Labour is 2,000 × 0.10 × 0.5 × £40 = £4,000; the stress case is 2,000 × 0.20 × 0.75 × £40 = £12,000. Neither is a total budget. Supported phone access would mitigate exclusion from a digital-only form. If providers cannot supply decision records or higher demand cannot be resourced, manual process improvement may outperform the conditional pilot. We therefore recommend discovery and a bounded pilot only after those dependencies are resolved.",
          questions: [
            {
              prompt: "What is the stressed direct labour estimate?",
              options: ["£4,000", "£8,000", "£12,000"],
              answer: 2,
              explanation:
                "2,000 applications × 20% × 0.75 hours × £40 = £12,000, before other costs.",
            },
            {
              prompt: "A positive average effect means…",
              options: [
                "Every group benefits",
                "Distributional effects still need examination",
                "Unpriced harms can be ignored",
              ],
              answer: 1,
              explanation:
                "An average can hide unequal access or concentrated harm.",
            },
          ],
          resources: [r.green],
        }),
      ],
    },
    {
      title: "Make it deliverable",
      lessons: [
        lesson({
          slug: "delivery-and-accountability",
          title: "Delivery and accountability",
          minutes: 40,
          objectives: [
            "Turn a recommendation into a sequenced delivery plan",
            "Assign ownership, dependencies and escalation",
          ],
          body: `## Design the work behind the announcement

A recommendation is incomplete until someone can deliver it. For Northbridge's pilot, the announcement is the least demanding part. Teams need authority confirmed, agreements amended, review procedures designed, staff trained, records accessible and applicants informed.

Start with the service journey. An applicant receives a decision, understands the notice, requests review, gets acknowledgment, has their case examined, receives a reasoned response and can escalate an unresolved issue. At each point ask who acts, what information they need, what deadline applies and what happens when the process fails.

## Sequence dependencies

Do not schedule training before the review procedure is agreed or invite applicants into a route without staffed capacity. A useful sequence is discovery and authority check; co-design and evidence access; small operational test; pilot launch; monitored review; expansion decision. Each stage should have an exit condition rather than a date alone.

For example, move from operational test to launch only when reviewers can access sample records, staff can handle the expected volume, notices have been tested with applicants and an escalation route works. These are proposed learning-case gates, not a universal standard. The team should record who checks them and who can authorise an exception.

## Give accountability a name

Choose an accountable sponsor, a delivery lead, provider contacts, an evaluation lead and an owner of the review route. “The partnership” is too vague when a case needs action at 4 pm on a Friday. Specify who can pause the pilot and which issues must go to the governing board.

Plan resources beyond launch: staff cover, training refreshes, maintenance, monitoring, applicant support and contract management. If these costs are unfunded, the policy is less deliverable than the announcement suggests. Add a dependency register showing the consequences of late legal advice, unavailable records or provider withdrawal.

## Treat escalation as part of the service

Set out response levels for routine delay, repeated failures and serious incidents. Ensure affected applicants are supported during a pause rather than merely turning off a dashboard. Accountability includes a route to correction and learning. It is not fulfilled by assigning a senior person's name to a document that nobody uses.`,
          exercise:
            "Write a five-stage delivery plan with an owner, dependency, exit condition and indicative date for each stage. Include a pause authority and a fallback for applicants if the review route fails.",
          rubric: [
            "Stages follow dependencies",
            "Exit conditions are observable",
            "Owners and pause authority are explicit",
            "Fallback protects service continuity",
          ],
          modelAnswer:
            "Weeks 1–2: policy lead confirms authority and scope with legal advisers; exit is documented approval. Weeks 2–4: delivery lead designs notices and record access with providers; exit is tested materials and access agreement. Week 5: review lead runs sample cases; exit is demonstrated capacity and escalation. Week 6: the board considers a costed proposal. Later, after renewal timing, authority and staffing gates are met, the pilot lead launches and reports weekly against access, delay and error measures. After the agreed pilot period, the evaluation lead presents findings for the board's expansion decision. The accountable sponsor can pause expansion, with urgent service failures escalated immediately. During a pause, applicants receive a staffed manual review route and an explanation rather than losing their ability to challenge.",
          questions: [
            {
              prompt: "Which is a launch gate?",
              options: [
                "A press release has been drafted",
                "Reviewers demonstrate access and a functioning escalation route",
                "A supplier promises everything is ready",
              ],
              answer: 1,
              explanation:
                "A gate needs observable operational evidence relevant to safe and useful delivery.",
            },
            {
              prompt: "Who owns a serious pilot failure?",
              options: [
                "Everybody in general",
                "The named accountable owner through a defined escalation route",
                "Only the model",
              ],
              answer: 1,
              explanation:
                "Accountability belongs to people and institutions with responsibilities and power to act.",
            },
          ],
          resources: [r.playbook],
        }),
        lesson({
          slug: "evaluation-and-adaptation",
          title: "Evaluation and adaptation",
          minutes: 40,
          objectives: [
            "Separate monitoring from evaluation",
            "Define an expansion, revision or stop decision",
          ],
          body: `## Build learning into delivery

Monitoring tells you what is happening: review requests, response times, costs and provider participation. Evaluation investigates why, for whom and whether the intervention made a difference. A dashboard with improving numbers is not automatically evidence that the policy caused improvement.

For Northbridge, ask three kinds of question. Process: were notices understandable and reviews delivered as designed? Impact: did applicants obtain better review and correction than under the alternative? Value: were benefits worth the whole-service resources and burdens? These questions call for different evidence.

## Establish a comparison

Where feasible and appropriate, compare pilot services with similar services continuing the existing process, or use a phased introduction. Check whether groups differ before launch, whether cases move between services and whether other changes happen at the same time. Randomisation is one possible method, not a slogan that resolves practical and ethical design questions.

If a strong causal comparison is not feasible, be explicit. Combine before-and-after measures, process evidence, interviews and a reasoned account of alternative explanations. Do not call an association a proven effect. Good evaluation can still identify a broken mechanism and guide adaptation without claiming certainty it does not have.

## Pre-agree the decision rules

Define success, acceptable burdens and conditions requiring pause before seeing the results. For the exercise, propose that expansion needs demonstrated access for different applicant groups, evidence of meaningful correction, manageable costs and no unresolved serious failure. Actual thresholds should be justified by baseline evidence and accountable judgment.

Add an early review for unexpected harms. Waiting until the end of a pilot can be inappropriate when a serious problem is already visible. Conversely, changing thresholds every week to keep the preferred option alive undermines learning. Record revisions and reasons.

## Close the policy loop

The final report should answer an actual decision: expand, revise, extend learning or stop. Preserve useful process improvements even if the AI-related intervention is rejected. Share limitations and negative findings. A pilot that prevents an expensive ineffective rollout can be a useful result; the policy team should not measure its success solely by the number of deployments it secures.`,
          exercise:
            "Draft an evaluation plan with one process, impact and value question; evidence for each; a comparator; two alternative explanations; and explicit expand/revise/stop criteria.",
          rubric: [
            "Distinguishes monitoring and causal inference",
            "Uses an appropriate comparison",
            "Checks unintended effects and group differences",
            "Connects evidence to a decision rule",
          ],
          modelAnswer:
            "Process: can applicants understand and use review? Use notice testing, sampled cases and interviews. Impact: does the pilot improve meaningful correction relative to comparable non-pilot services? Establish pre-launch measures and a phased comparison, checking vacancy mix and simultaneous staffing changes. Value: what is the whole-service cost per useful review, with unpriced access benefits described? Expand only if access and correction improve with manageable burden and no unresolved serious failures. Revise if awareness improves but reviewers lack authority. Stop or pause if the review route cannot protect applicants or records remain inaccessible. Report attribution limits rather than presenting all observed changes as pilot effects.",
          questions: [
            {
              prompt: "Lower waiting times after launch prove…",
              options: [
                "Causation",
                "An observed change requiring a comparison and alternative explanations",
                "That all harms disappeared",
              ],
              answer: 1,
              explanation:
                "Staffing, vacancy mix and other changes could also affect waiting times.",
            },
            {
              prompt: "Decision rules should be set…",
              options: [
                "Only after seeing favourable results",
                "Before results, with documented reasons for any revision",
                "By the supplier alone",
              ],
              answer: 1,
              explanation:
                "Pre-agreed criteria make the learning and subsequent decision more credible.",
            },
          ],
          resources: [r.magenta],
        }),
      ],
    },
    {
      title: "Advise a decision-maker",
      lessons: [
        lesson({
          slug: "write-a-decision-brief",
          title: "Write a decision brief",
          minutes: 40,
          objectives: [
            "Lead with the decision and recommendation",
            "Present evidence, trade-offs and uncertainty concisely",
          ],
          body: `## Write for the person deciding

A decision briefing is not a condensed literature review. Its reader needs to know what you are asking them to decide, why now, what options exist and what follows from choosing one. Put the requested decision in the opening paragraph. If approval is conditional, say so there.

A useful structure is: decision sought; recommendation and conditions; problem and scope; options comparison; evidence and uncertainty; delivery and resource implications; risks and mitigations; next decision. Adapt it to the institution rather than treating the headings as compulsory bureaucracy.

## Use evidence with the right verbs

“The sampled applicants reported difficulty obtaining review” is different from “automated screening causes unfair hiring across the region”. The first may be supported by your interviews; the second needs much stronger evidence. Match the claim to what the methods can establish. Label illustrative assumptions and keep a record of sources.

Use numbers only when they help the decision. Explain their denominator and sensitivity. A short main brief can refer to a supporting annex for methods, costing assumptions and stakeholder input. Do not hide a material limitation in an annex that changes the recommendation's meaning.

## Give alternatives a fair hearing

Describe why the runner-up might be preferable. If improved manual review is cheaper and easier but lacks contractual incentives, say that. If a review requirement depends on record access, do not describe that dependency as already secured. A fair comparison strengthens the recommendation because the reader can see your reasoning.

Present the strongest objection and your response. For Northbridge, it might be that additional conditions will drive employers away. Answer with the evidence you have, the evidence missing, and the pilot design or alternative that limits exposure. “We have engaged stakeholders” is not a response to the substance.

## Ask for a bounded commitment

Conclude with who will do what and when the chair will see the next decision. For example: approve a discovery phase within the existing research budget, authorise contract feasibility work, and return in six weeks with a costed pilot proposal. The precise commitment should match current evidence and authority. Clarity is a service to the decision-maker, not a reason to remove complexity that matters.`,
          exercise:
            "Write the opening 200 words of a brief. Include the decision sought, recommendation, strongest reason, important condition and runner-up option. Then remove one claim that exceeds your evidence.",
          rubric: [
            "Decision appears immediately",
            "Recommendation states its conditions",
            "Alternative is fairly represented",
            "Claims and numbers match their evidence",
          ],
          modelAnswer:
            "Decision sought: approve a six-week discovery phase to assess a funded-service notice and review pilot. Initial applicant accounts suggest review may be hard to obtain, but they do not establish prevalence or prove that automation causes the problem. We recommend discovery before changing network-wide conditions. It will confirm Northbridge's authority, test access to decision records, establish a baseline and cost a limited pilot with providers and applicants. Improved manual review is the main alternative and may be preferable if contractual conditions add cost without improving correction. No rollout is requested today. The delivery lead will return with a three-option appraisal, resource requirement and explicit launch gates. We removed a claim that the proposal would eliminate discrimination because the current evidence and design cannot support it.",
          questions: [
            {
              prompt: "A brief should normally open with…",
              options: [
                "A history of artificial intelligence",
                "The decision sought and recommendation",
                "Every source consulted",
              ],
              answer: 1,
              explanation:
                "The reader first needs to understand the decision they are being asked to take.",
            },
            {
              prompt: "A material uncertainty belongs…",
              options: [
                "Only in an unread annex",
                "Alongside the recommendation it qualifies",
                "Nowhere if it weakens the argument",
              ],
              answer: 1,
              explanation:
                "The recommendation must not appear stronger than its evidence or unresolved conditions justify.",
            },
          ],
          resources: [r.green],
        }),
        lesson({
          slug: "capstone-policy-recommendation",
          title: "Capstone: your policy recommendation",
          minutes: 90,
          minimumWords: 350,
          objectives: [
            "Integrate evidence, authority and delivery into a defensible recommendation",
            "Review your work against an explicit standard",
          ],
          body: `## Your final assignment

Submit a 600–900 word decision briefing for Northbridge's chair, with a compact delivery and evaluation plan. Use the work you saved in earlier lessons. You are not expected to discover a single correct intervention. You are expected to make a reasoned, bounded recommendation that another person could assess and act on.

The final fictional case update is mixed. Applicant interviews identify confusing notices in two sampled services, but the sample is small and excludes people who abandoned applications. Providers can usually record a rejection reason; one supplier cannot yet provide detailed screening logs. Employers support clearer criteria but some small employers worry about delay. The partnership's legal adviser says a new funding condition may be possible at renewal, subject to detailed review. Existing funding covers discovery, but no pilot staffing budget has been approved.

These facts are the exercise's assumptions, not real research. They constrain your answer. You cannot promise universal record access, immediate contract changes or a funded pilot that nobody has approved. Equally, uncertainty does not prevent a useful next decision.

## Build the briefing

Lead with a decision sought today. Define the problem and scope. Compare at least three options, including the credible baseline and a non-AI service improvement. Explain how your preferred option changes behaviour, how evidence supports that mechanism and what might make the alternative better.

Include a short distributional assessment: whose access improves, who may be missed and who bears costs. Name the delivery owner and two critical dependencies. Give a resource range or a method for costing it; use the illustrative labour calculation only as an assumption. Set conditions for a pilot, an escalation route and a later expand/revise/stop decision.

## Review before marking complete

Read your brief as a sceptical chair. Can you identify exactly what is being approved? Are observations distinguished from causal claims? Can a delivery team turn the plan into work? Could an applicant understand how the proposal affects them? Would negative evidence change your mind?

The knowledge checks test concepts; the written capstone is **self-assessed**, using the rubric and worked example below. Completion records participation and passed checks, not an externally accredited qualification or expert review. Save your final work and download your portfolio from My learning. You can revisit and improve it as your judgment develops.`,
          exercise:
            "Write your 600–900 word final briefing using the updated case. Include a three-option comparison, recommendation, authority and evidence limits, distribution, delivery dependencies, resources and evaluation decision. Minimum 350 words to submit; aim for the full brief. Use the rubric to review your answer before completing.",
          rubric: [
            "Seeks a specific, feasible decision now",
            "Fairly compares three options and a non-AI alternative",
            "Uses evidence proportionately and labels case assumptions",
            "Addresses authority, affected groups and full costs",
            "Assigns delivery and explicit gates",
            "Defines evaluation and what would change the recommendation",
          ],
          modelAnswer: `### An example structure, not a required conclusion

**Decision:** approve a six-week discovery phase within the existing research budget; request a costed proposal before approving any pilot staffing or amended funding conditions.

**Problem:** sampled applicants face confusing notices and an uncertain route to review in funded recruitment services. The sample supports a concern about process, not a population-wide estimate or a finding that automation alone caused unfair hiring. Scope is partnership-funded screening services over the coming year.

**Options:** the baseline retains existing training and monitors reviews, at low additional burden but with limited leverage over provider practice. Improved manual review adds clear criteria, accessible notices and a staffed challenge route without procuring new AI. A funding-linked notice and review pilot could create stronger incentives, but depends on renewal timing, legal review, records and staffing. A blanket rollout is premature.

**Recommendation:** establish the baseline and co-design accessible review procedures now. Develop a limited funding-linked pilot alongside the manual improvement alternative. Prefer the manual option if record access or provider capacity prevents a meaningful pilot. A review mechanism is valuable only if reviewers can investigate and correct relevant errors.

**Distribution:** test notices and assisted phone access with applicants who face digital or language barriers. Seek people who abandoned applications. Examine small-employer burdens and whether delay reduces vacancy participation, rather than assuming an average benefit reaches everyone.

**Delivery:** the policy lead owns discovery; a contract lead obtains legal advice on renewal conditions; the review lead tests sample cases and escalation. Launch gates are confirmed authority, accessible notices, working record access and funded staff capacity. The supplier without adequate logs cannot be assumed ready. A staffed manual route supports applicants during any pause.

**Resources and learning:** request a whole-service cost estimate covering training, review, administration and evaluation. The illustrative £4,000–£12,000 review labour range is not a total budget. Establish awareness, correction, delay and participation baselines; compare pilot and similar non-pilot services where feasible, reporting attribution limits. Return to the chair after discovery, and schedule a later expansion decision only if access, meaningful correction and manageable burden are demonstrated. Pause for unresolved serious failures. This recommendation buys relevant evidence and process improvement while keeping the commitment proportionate to present confidence.`,
          questions: [
            {
              prompt:
                "Given the case update, which commitment is justified now?",
              options: [
                "Promise immediate network-wide conditions and staff funding",
                "Approve bounded discovery and require a costed, authorised pilot proposal",
                "Claim the supplier's logs are available",
              ],
              answer: 1,
              explanation:
                "Current authority, evidence and resources support a bounded next step; the unresolved conditions must remain visible.",
            },
            {
              prompt: "The written capstone is…",
              options: [
                "A legal compliance certificate",
                "Self-assessed practice supported by a rubric and example",
                "A guarantee of employment",
              ],
              answer: 1,
              explanation:
                "Course completion records learning activity and passed checks, not external accreditation or professional approval.",
            },
          ],
          resources: [r.green, r.magenta],
        }),
      ],
    },
  ],
};
