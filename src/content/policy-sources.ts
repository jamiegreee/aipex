export const reviewedOn = "18 October 2026";
export const policySources = {
  green: {
    title: "The Green Book (2026)",
    publisher: "HM Treasury",
    url: "https://www.gov.uk/government/publications/the-green-book--2/the-green-book-2026",
    location:
      "Chapters 4–7 and 10: objectives, options, distribution and evaluation",
    note: "UK appraisal guidance. Our comparison aid covers an early options discussion; it does not replace a full business case or economic appraisal.",
  },
  magenta: {
    title: "The Magenta Book (2026)",
    publisher: "HM Treasury",
    url: "https://www.gov.uk/government/publications/the-magenta-book/magenta-book-central-government-guidance-on-evaluation-html",
    location: "Evaluation design, impact evaluation and the counterfactual",
    note: "Use to distinguish observed change from effects attributable to an intervention. Evaluation design must fit the question and context.",
  },
  evaluation: {
    title: "Guidance on the impact evaluation of AI interventions",
    publisher: "UK Government",
    url: "https://www.gov.uk/government/publications/the-magenta-book/guidance-on-the-impact-evaluation-of-ai-interventions-html",
    location: "Evaluating AI interventions in their operational setting",
    note: "Helps frame evaluation of the intervention and its workflow, alongside technical model testing.",
  },
  nist: {
    title: "AI Risk Management Framework: Core",
    publisher: "NIST",
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/",
    location: "GOVERN 1–3, 5–6; MAP 1–2; MEASURE 2–3; MANAGE 2–4",
    note: "A voluntary US framework for organising risk management. It does not establish legal authority or certify a deployment as safe.",
  },
  playbook: {
    title: "AI Playbook for the UK Government",
    publisher: "UK Government",
    url: "https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html",
    location:
      "Human oversight; testing and evaluation; managing the AI lifecycle",
    note: "Used here for operational oversight and lifecycle guidance. Its legal descriptions reflect its publication context; check current law and regulatory guidance with the responsible specialists. A completed plan is not legal clearance.",
  },
  cards: {
    title: "Model Cards for Model Reporting (2019)",
    publisher: "Mitchell et al.",
    url: "https://arxiv.org/abs/1810.03993",
    location: "Intended use, evaluation data, metrics and subgroup performance",
    note: "A reporting proposal, useful for asking what an evaluation covers and leaves out. A model card is not independent validation.",
  },
  recruitment: {
    title: "AI in Recruitment Outcomes Report (2024)",
    publisher: "Information Commissioner’s Office",
    url: "https://ico.org.uk/media2/migrated/4031620/ai-in-recruitment-outcomes-report.pdf",
    location:
      "Report pp. 5, 9–10 (scope); p. 20 (data separation); pp. 24–25 (Organisation A and bias monitoring)",
    note: "Historical findings from selected consensual audits conducted August 2023–May 2024. Generative AI was outside scope. Findings do not estimate prevalence across the recruitment market or state current law.",
  },
  chat2024: {
    title:
      "The findings of our first generative AI experiment: GOV.UK Chat (2024)",
    publisher: "Government Digital Service",
    url: "https://insidegovuk.blog.gov.uk/2024/01/18/the-findings-of-our-first-generative-ai-experiment-gov-uk-chat/",
    location: "Our early findings; expert evaluation and user surveys",
    note: "The delivery team’s account of an early experiment, not an independent evaluation or a description of the current service.",
  },
  chat2026: {
    title: "5 things we learned testing GOV.UK Chat (2026)",
    publisher: "Government Digital Service",
    url: "https://insidegovuk.blog.gov.uk/2026/03/16/5-things-we-learned-testing-gov-uk-chat-an-ai-assistant-for-government/",
    location: "User testing, answer evaluation and the next phase",
    note: "A later team account. Read alongside the 2024 report to avoid treating early limitations as an unchanging property of the service.",
  },
  grades: {
    title: "Standardisation of grades in summer 2020: outliers",
    publisher: "Ofqual",
    url: "https://www.gov.uk/government/publications/standardisation-of-grades-in-general-qualifications-in-summer-2020-outliers",
    location:
      "December 2020 report: analysis of students for whom standardisation might be unreliable",
    note: "A retrospective official account of statistical grade standardisation. This was not a generative AI system.",
  },
  gradesAnalysis: {
    title: "Grading gaps in summer 2020: who was affected?",
    publisher: "Ofqual",
    url: "https://www.gov.uk/government/publications/evaluation-of-centre-assessment-grades-and-grading-gaps-in-summer-2020/grading-gaps-in-summer-2020-who-was-affected-by-differences-between-centre-assessment-grades-and-calculated-grades",
    location:
      "Executive summary and Introduction: grading method, 13–17 August 2020 chronology and limits of grade comparisons",
    note: "Official retrospective analysis. Centre assessment grades are a comparator, not observed examination outcomes.",
  },
  robodebt: {
    title: "Robodebt Royal Commission: report and recommendations (2023)",
    publisher: "Royal Commission into the Robodebt Scheme",
    url: "https://robodebt.royalcommission.gov.au/publications/report",
    location:
      "Published 7 July 2023; recommendations 10.1, 15.1, 15.5, 17.1 and 17.2",
    note: "Primary inquiry recommendations concerning Australia's income-compliance scheme. Recommendations are proposals in a dated report, not proof of implementation or a statement of current Australian law. This is a conventional automation/governance case, not generative AI.",
  },
  syri: {
    title: "SyRI legislation and Article 8: the court's account (2020)",
    publisher: "The Hague District Court / Rechtspraak",
    url: "https://www.rechtspraak.nl/organisatie-en-contact/organisatie/rechtbanken/rechtbank-den-haag/nieuws/2020/02/syri-wetgeving-in-strijd-met-het-europees-verdrag-voor-de-rechten-voor-de-mens",
    location:
      "5 February 2020; sections Toets and Inzet SyRI onvoldoende inzichtelijk en controleerbaar; links to ECLI:NL:RBDHA:2020:865",
    note: "The court's Dutch-language summary of its judgment. AIPEX paraphrases it in English. The ruling concerns the particular SyRI legislation and privacy safeguards, not a prohibition of all algorithmic fraud detection. Consult the judgment for legal reliance.",
  },
  riteComplaint: {
    title: "FTC v. Rite Aid: complaint (2023)",
    publisher: "US Federal Trade Commission",
    url: "https://www.ftc.gov/system/files/ftc_gov/pdf/2023190_riteaid_complaint_filed.pdf",
    location:
      "19 December 2023; paragraphs 22, 43 and 50–55 on image quality, demographic monitoring and pre-deployment testing",
    note: "A regulator's allegations, not findings established after a contested trial. Read alongside the settlement document; it neither provides a universal error threshold nor evaluates current products.",
  },
  riteOrder: {
    title: "Rite Aid: modified decision and order (2024)",
    publisher: "US Federal Trade Commission",
    url: "https://www.ftc.gov/system/files/ftc_gov/pdf/c4308riteaidmodifiedorder.pdf",
    location:
      "Introductory findings; sections I (five-year prohibition), II (deletion), III (monitoring programme)",
    note: "Settlement terms, including a neither-admit-nor-deny provision. The prohibition is measured from the order's effective date; this historical case does not calculate its present status or infer later compliance.",
  },
  ircc2022: {
    title: "Advanced analytics for temporary resident visa applications (2022)",
    publisher: "Immigration, Refugees and Citizenship Canada",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/committees/ollo-may-16-2022/advanced-data-analytics.html",
    location:
      "16 May 2022 briefing; Key Messages, Supplementary Messages and Background",
    note: "The department's description of its workflow and safeguards, not an independent impact evaluation. Positive eligibility determinations are distinct from final visa decisions. Do not conflate this system with the separate Excel-based Chinook tool.",
  },
  irccInventory: {
    title: "Uses of technology across IRCC",
    publisher: "Immigration, Refugees and Citizenship Canada",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/digital-transparency-advanced-data-analytics/uses-technology.html",
    location:
      "Inventory row: Visitor visa for overseas applications; algorithmic impact assessment links",
    note: "A department-maintained inventory inspected 18 October 2026. It documents declared functions and assessment links, not independent confirmation that controls work or outcomes improve. The case's detailed workflow claims are dated to the 2022 briefing.",
  },
  retina: {
    title:
      "Development and Validation of a Deep Learning System for Diabetic Retinopathy (2017)",
    publisher: "Ting et al. / JAMA",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2665775",
    location:
      "Abstract; Table 4 (primary validation); Limitations; Conclusions; doi:10.1001/jama.2017.18152",
    note: "Primary diagnostic-validation study using Singapore and external datasets. Retinal images, eyes and patients have different denominators. This is not a randomised trial of patient outcomes or evidence about every later SELENA/SELENA+ product version. Several authors disclosed a related patent interest.",
  },
  victor: {
    title: "Victor and the boundary of judicial automation (2026)",
    publisher: "Brazil's Supremo Tribunal Federal",
    url: "https://noticias.stf.jus.br/postsnoticias/banco-mundial-cita-ferramenta-de-ia-do-stf-como-exemplo-de-eficiencia-juridica/",
    location:
      "19 August 2026; opening account of the 40-minute/five-second claim and Como funciona",
    note: "Court-authored Portuguese-language account, paraphrased by AIPEX in English. Its timing claim concerns an initial classification task and attributes the comparison to a World Bank report. It is not treated here as an independently reproduced evaluation of total case duration or judicial quality. Victor and VitorIA are distinct tools.",
  },
} as const;
export type SourceId = keyof typeof policySources;
