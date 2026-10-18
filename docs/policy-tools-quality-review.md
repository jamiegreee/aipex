# Policy tools and case library: quality review

Reviewed 18 October 2026. Scope: all three public tools, every field prompt and worked analysis, the complete public case library, exports and case-to-tool paths. This is an AIPEX editorial/source review, not independent accreditation, a legal opinion or observed user research.

## Changes made

- Removed the three fictional public cases, their homepage links, case-type filter and sitemap entries. Their routes now return 404. Existing learner drafts remain intact and carry a retired-fictional-material warning in the workspace and export.
- Replaced the tools’ Northbridge/Eastmere examples with worked analyses of GOV.UK Chat, England’s 2020 grades and the ICO recruitment audits. Facts come from the documented cases; proposed tests, controls and appraisal judgements are labelled as AIPEX analysis. Unknown costs, dates, owners and approval conditions remain unknown.
- Replaced the recruitment case’s generic findings paragraph with the regulator’s anonymised Organisation A findings on dataset separation and artificial-data bias tests/demographic filters. Added PDF page locators and concrete requests for evidence.
- Added a decision context and three concrete tasks to every case. The grading comparison is retrospective and uses a historical comparator; later evidence is not represented as available to the original decision makers.
- Added reading directions to every tool section, identifying the relevant source section and what it supports. Added tool-specific reasoning questions before export, included in the Markdown brief.
- Strengthened evidence prompts on evaluation leakage and non-response; options prompts on consistent time/price bases, wider social costs, double counting, longlisting and assumptions that could reverse a preference; oversight prompts on control effectiveness, inspection evidence, incident reporting and action triggers.
- Added an accessible side-by-side options table with explicit unresolved/failed conditions and missing entries. Editing cards open individually. There is no automatic ranking or professional-quality score.

## Source-support map

| Material | Primary support inspected | What it supports / limits |
| --- | --- | --- |
| Evidence: system identity, population, measures, subgroup results | [Model Cards for Model Reporting](https://arxiv.org/html/1810.03993v2), §§4.1–4.7 | Reporting the actual model/use, evaluation data, uncertainty and disaggregation. Documentation is not independent validation or proof of service benefit. |
| Evidence: test leakage | [ICO recruitment report](https://ico.org.uk/media2/migrated/4031620/ai-in-recruitment-outcomes-report.pdf), p. 20 | Organisation A’s separation of training/testing/validation data was unclear in practice. The tool turns this into a general question to investigate, not an accusation against an unreviewed supplier. |
| Evidence: comparator and attribution | [Magenta Book](https://www.gov.uk/government/publications/the-magenta-book/magenta-book-central-government-guidance-on-evaluation-html), chapters 2–3, especially §§3.4–3.5 | Distinguishing causal impact from observed change; choosing experimental, quasi-experimental or theory-based approaches appropriately. A controlled trial is not the only valid approach. |
| Evidence/oversight: intervention rather than model alone | [Impact evaluation of AI interventions](https://www.gov.uk/government/publications/the-magenta-book/guidance-on-the-impact-evaluation-of-ai-interventions-html), challenges for evaluation and methodology discussion | Context, changing systems, heterogeneous effects and the workflow around AI. The guidance itself contains illustrative scenarios; none is republished as a documented event in this library. |
| Options: baseline, mechanisms, longlist and essential conditions | [Green Book 2026](https://www.gov.uk/government/publications/the-green-book--2/the-green-book-2026), chapters 4–5 | Rationale, objectives and screening options, while keeping the baseline as a benchmark. This tool is an early qualitative aid, not a substitute for a business case. |
| Options: trade-offs and uncertainty | Green Book, chapters 6–7 and 10; “Sensitivity analysis and switching values” | Consistent comparison, distribution and decision-sensitive assumptions. A full economic appraisal needs more than these text fields; no invented monetary values or weights are supplied. |
| Oversight: accountability and human interpretation | [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/), GOVERN 2/3.2, MAP 2.2, MEASURE 2.3 | Assigned responsibility and testing in deployment-like conditions. This voluntary framework neither authorises a deployment nor certifies it safe. |
| Oversight: monitoring, challenge, pause and change | NIST GOVERN 1.5–1.7/5/6.2; MEASURE 2–3; MANAGE 2–4 | Operational risk management, external feedback, deactivation, contingencies and lifecycle review. Owners, cadence and thresholds in a real service require local decisions. |
| Oversight: meaningful human review | [AI Playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html), Human oversight, Accountability and lifecycle sections | Designing and assessing actual review. Used for operational guidance. Its dated legal descriptions are not presented as current law; appropriate specialists must check the rules for a real deployment. |
| GOV.UK Chat | [GDS January 2024](https://insidegovuk.blog.gov.uk/2024/01/18/the-findings-of-our-first-generative-ai-experiment-gov-uk-chat/), “Our early findings”; [GDS March 2026](https://insidegovuk.blog.gov.uk/2026/03/16/5-things-we-learned-testing-gov-uk-chat-an-ai-assistant-for-government/), finding 2 | Verified the 157-response usefulness survey separately from answer assessment, and the later reported accuracy figures. First-party reports do not alone allow an independent causal or like-for-like trend claim. There is no published confusion matrix here; the worked analysis leaves calculator inputs blank. |
| Recruitment | ICO recruitment report, pp. 5/9–10 (scope), p. 20 (separation), pp. 24–25 (Organisation A) | Verified audit dates, exclusions and concrete findings. The report is historical, selected and consensual; not an estimate of market-wide prevalence, an assessment of a current supplier or current legal clearance. Organisation A is the ICO’s anonymised label. |
| England’s 2020 grades | [Ofqual outliers report](https://www.gov.uk/government/publications/standardisation-of-grades-in-general-qualifications-in-summer-2020-outliers); [grading-gap analysis](https://www.gov.uk/government/publications/evaluation-of-centre-assessment-grades-and-grading-gaps-in-summer-2020/grading-gaps-in-summer-2020-who-was-affected-by-differences-between-centre-assessment-grades-and-calculated-grades), Executive summary and Introduction | The chronology/reversal is now cited directly to the account containing it. The three compared approaches appear in the official record. Grade differences compare estimates; cancelled exams supply no observed exam result. This statistical standardisation case is not generative AI. |

## Usability critique

The restrained editorial style passes the generic-AI-design check: it has clear typography, limited purposeful colour and task-centred pages. The main weakness was the working experience, not decoration: long stacked option forms made comparison a memory task, and fully populated examples risked appearing more resolved than their evidence justified.

Editorial heuristic scores (0–4; judgement from inspection, not measured usability):

| Heuristic | Before | Revised | Main finding |
| --- | ---: | ---: | --- |
| System status | 3 | 3 | Browser/account storage and text-presence status remain explicit. |
| Match to policy work | 3 | 4 | Unknowns, historical comparators and trade-offs now remain visible. |
| User control | 3 | 3 | Examples open separately; existing drafts are preserved. |
| Consistency | 3 | 3 | Same case/analysis/source distinction across tools, case pages and export. |
| Error prevention | 3 | 3 | No automatic ranking; stronger checks for inappropriate conclusions. |
| Recognition over recall | 2 | 3 | Option comparison visible across rows; source sections identified beside work. |
| Efficiency | 2 | 3 | Individual option editors reduce the form wall; direct section navigation remains. |
| Minimalist design | 3 | 3 | Removed redundant case-type filtering; help stays progressively disclosed. |
| Recovery | 3 | 3 | Existing import/storage guards retained; retired drafts remain exportable. |
| Contextual help | 3 | 4 | Concrete documented examples and reading directions at each field. |
| Total | 28/40 | 32/40 | Good foundation; still needs observation with users. |

Cognitive-load checklist: the original options step failed chunking, minimal simultaneous choices and working-memory support (3/8). Individual editors and a comparison table address these; the many section-navigation choices remain one limitation (1/8). These are editorial assessments, not experimental results.

Persona walkthroughs:

- A first-time policy learner could mistake a fully filled fictional plan for an evidenced decision. The replacement analyses identify proposals, leave unknowns explicit and require four substantive checks before relying on a brief.
- An experienced analyst had to remember earlier option cards while reading later ones. The table compares mechanisms, costs, distribution, feasibility and uncertainty without hiding failed conditions behind a score.
- A practitioner on a phone faced a very long options form. Closed individual editors reduce the wall; the comparison is keyboard-focusable and scrolls within its own region, with an instruction for narrow screens.

## Verification and remaining limits

Automated checks cover metric denominators, invalid imports, exports, source/case/lesson references, documented-only public cases, source locators, worked-analysis provenance, unresolved conditions and accessible/escaped comparison rendering. Build and lint are required. Local production-build browser verification passed for search/empty/reset, documented case launch with native input, case-to-tool launch, source-based worked analyses, option edits and condition changes in the comparison table, reload recovery, legacy-draft warnings, actual Markdown download with provenance/review checks, and desktop/mobile containment at 390px. HTTP checks passed for public routes, sitemap exclusions and all three removed-case 404s. Account APIs and schema are unchanged; production insert/update/reload/reopen passed earlier on 18 October 2026. Live smoke checks are recorded in the PR.

This remains a small UK-focused case collection, not a comprehensive global library. The tools record and scaffold reasoning; they cannot establish competence, validate user-entered evidence, set risk tolerances or supply legal approval. An independent practitioner review and observed learner pilot remain worthwhile next evidence, especially for workload and clarity. Historical first-party sources are explicitly limited; no claim of independent corroboration is made.
