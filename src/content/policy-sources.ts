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
} as const;
export type SourceId = keyof typeof policySources;
