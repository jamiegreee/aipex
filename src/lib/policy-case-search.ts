import type { PolicyCase } from "@/content/policy-cases";

export function filterPolicyCases(
  cases: PolicyCase[],
  {
    query = "",
    topic = "",
    country = "",
  }: { query?: string; topic?: string; country?: string },
) {
  const term = query.trim().toLocaleLowerCase("en");
  return cases.filter(
    (c) =>
      (!topic || c.topic === topic) &&
      (!country || c.country === country) &&
      [
        c.title,
        c.summary,
        c.topic,
        c.context,
        c.jurisdiction,
        c.country,
        ...c.evidence.flatMap((e) => [e.title, e.text]),
      ]
        .join(" ")
        .toLocaleLowerCase("en")
        .includes(term),
  );
}
