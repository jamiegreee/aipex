import type { Workspace } from "./policy-workspace";
import { classificationMetrics, workspaceGaps } from "./policy-workspace";
import { findTool } from "@/content/policy-tools";
import { policySources, reviewedOn } from "@/content/policy-sources";
import { findCase } from "@/content/policy-cases";
export const percentage = (n: number | null) =>
  n === null ? "Not defined (zero denominator)" : `${(n * 100).toFixed(1)}%`;
export function workspaceMarkdown(w: Workspace) {
  const tool = findTool(w.tool)!;
  const startingCase = w.caseSlug ? findCase(w.caseSlug) : undefined;
  const lines = [
    `# ${w.title || "Untitled assessment"}`,
    `AIPEX · ${tool.title} · working draft`,
    "",
    tool.scope,
    "",
    "## Assessment",
  ];
  if (startingCase?.tool === w.tool)
    lines.splice(
      4,
      0,
      `Starting case: [${startingCase.title}](https://theaipex.org/cases/${startingCase.slug}) · ${startingCase.kind}. ${startingCase.kind === "Practice case" ? "All case facts and numbers are fictional teaching assumptions." : "Case facts are from dated reports, not a statement of present performance."}`,
      "",
    );
  for (const f of tool.fields)
    lines.push(
      `\n### ${f.label}\n`,
      w.fields[f.id]?.trim() || "[Not yet drafted]",
    );
  if (w.tool === "compare-options") {
    lines.push(
      "\n## Options comparison\n",
      "Essential-condition status is recorded by the author, not verified by AIPEX. Business as usual is retained as a benchmark even when it fails conditions.",
    );
    for (const o of w.options) {
      lines.push(
        `\n### ${o.name || "Unnamed option"}\n`,
        `Essential conditions: ${o.gate}`,
        ...[
          ["Mechanism", o.mechanism],
          ["Benefits", o.benefits],
          ["Costs and burdens", o.costs],
          ["Distribution and access", o.distribution],
          ["Authority and delivery", o.delivery],
          ["Evidence and uncertainty", o.uncertainty],
        ].map(
          ([label, value]) =>
            `\n**${label}:** ${value.trim() || "[Not yet drafted]"}`,
        ),
      );
    }
  }
  const metrics =
    w.tool === "assess-evidence" && classificationMetrics(w.matrix);
  if (metrics)
    lines.push(
      "\n## Optional binary classification calculation\n",
      `TP ${w.matrix.tp}; FP ${w.matrix.fp}; FN ${w.matrix.fn}; TN ${w.matrix.tn}. Sample: ${metrics.total}.`,
      `Accuracy: ${percentage(metrics.accuracy)}. Recall: ${percentage(metrics.recall)}. Precision: ${percentage(metrics.precision)}. False-positive rate: ${percentage(metrics.falsePositiveRate)}. Always-negative baseline accuracy: ${percentage(metrics.baselineAccuracy)}.`,
      "These are descriptive sample metrics. They do not measure uncertainty, causal effects, fairness or service suitability.",
    );
  const gaps = workspaceGaps(
    w,
    tool.fields.map((f) => f.id),
  );
  if (startingCase?.tool === w.tool) {
    lines.push("\n## Starting case references\n");
    for (const id of startingCase.sources) {
      const s = policySources[id];
      lines.push(`- ${s.publisher}: [${s.title}](${s.url}). ${s.note}`);
    }
  }
  lines.push(
    "\n## Draft review\n",
    gaps.length
      ? `Sections or option cards still incomplete: ${gaps.map((g) => tool.fields.find((f) => f.id === g.id)?.label ?? w.options.find((o) => `option:${o.id}` === g.id)?.name ?? g.id).join("; ")}.`
      : "All sections contain text. This is not verification of the reasoning, evidence or decision.",
  );
  if (w.tool === "compare-options") {
    const unresolved = w.options.filter((o) => o.gate !== "met");
    if (unresolved.length)
      lines.push(
        `Essential conditions unresolved or not met: ${unresolved.map((o) => `${o.name} (${o.gate})`).join("; ")}. Explain the consequences in your recommendation.`,
      );
  }
  lines.push(
    "\n## Framework sources\n",
    `AIPEX original working aid; sources last reviewed ${reviewedOn}. These references inform the method, not the truth of statements entered above.`,
  );
  for (const id of tool.sources) {
    const s = policySources[id];
    lines.push(
      `\n- ${s.publisher}: [${s.title}](${s.url}). ${s.location}. ${s.note}`,
    );
  }
  return lines.join("\n");
}
