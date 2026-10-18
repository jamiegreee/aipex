export type ToolSlug = "assess-evidence" | "compare-options" | "plan-oversight";
export type Workspace = {
  version: 1;
  id: string;
  tool: ToolSlug;
  title: string;
  caseSlug?: string;
  fields: Record<string, string>;
  options: PolicyOption[];
  matrix: Record<string, string>;
};
export type PolicyOption = {
  id: string;
  name: string;
  mechanism: string;
  benefits: string;
  costs: string;
  distribution: string;
  delivery: string;
  uncertainty: string;
  gate: "unknown" | "met" | "not-met";
};
export function emptyOption(id: string, name = ""): PolicyOption {
  return {
    id,
    name,
    mechanism: "",
    benefits: "",
    costs: "",
    distribution: "",
    delivery: "",
    uncertainty: "",
    gate: "unknown",
  };
}
export function caseDraftToResume<T extends { document: Workspace }>(
  drafts: T[],
  selectedId: string,
  caseSlug: string,
): T | undefined {
  return (
    drafts.find(
      (d) => d.document.id === selectedId && d.document.caseSlug === caseSlug,
    ) ?? [...drafts].reverse().find((d) => d.document.caseSlug === caseSlug)
  );
}
export function emptyWorkspace(tool: ToolSlug, id: string): Workspace {
  return {
    version: 1,
    id,
    tool,
    title: "Untitled assessment",
    fields: {},
    options:
      tool === "compare-options"
        ? [
            emptyOption("baseline", "Business as usual"),
            emptyOption("option-1", "Option 1"),
            emptyOption("option-2", "Option 2"),
          ]
        : [],
    matrix: {},
  };
}
const textRecord = (value: unknown): value is Record<string, string> =>
  Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length <= 80 &&
      Object.entries(value).every(
        ([k, v]) =>
          k.length <= 80 && typeof v === "string" && v.length <= 12000,
      ),
  );
export function validWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") return false;
  const w = value as Workspace;
  return (
    w.version === 1 &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
      w.id,
    ) &&
    ["assess-evidence", "compare-options", "plan-oversight"].includes(w.tool) &&
    typeof w.title === "string" &&
    w.title.length <= 160 &&
    (w.caseSlug === undefined ||
      (typeof w.caseSlug === "string" &&
        /^[a-z0-9-]{1,80}$/.test(w.caseSlug))) &&
    textRecord(w.fields) &&
    textRecord(w.matrix) &&
    Array.isArray(w.options) &&
    w.options.length <= 6 &&
    w.options.every(
      (o) =>
        textRecord(o) &&
        [
          "id",
          "name",
          "mechanism",
          "benefits",
          "costs",
          "distribution",
          "delivery",
          "uncertainty",
        ].every((k) => typeof o[k as keyof PolicyOption] === "string") &&
        o.id.length > 0 &&
        o.id.length <= 80 &&
        ["unknown", "met", "not-met"].includes(o.gate),
    ) &&
    new Set(w.options.map((o) => o.id)).size === w.options.length &&
    (w.tool !== "compare-options" ||
      (w.options.length >= 3 && w.options[0].id === "baseline")) &&
    JSON.stringify(w).length <= 180000
  );
}
export type MatrixResult = {
  total: number;
  accuracy: number | null;
  recall: number | null;
  precision: number | null;
  falsePositiveRate: number | null;
  baselineAccuracy: number | null;
};
export function classificationMetrics(
  matrix: Record<string, string>,
): MatrixResult | null {
  const keys = ["tp", "fp", "fn", "tn"];
  if (keys.some((k) => !/^\d+$/.test(matrix[k] ?? ""))) return null;
  const [tp, fp, fn, tn] = keys.map((k) => Number(matrix[k]));
  if ([tp, fp, fn, tn].some((n) => !Number.isSafeInteger(n) || n > 1e9))
    return null;
  const total = tp + fp + fn + tn;
  const ratio = (n: number, d: number) => (d === 0 ? null : n / d);
  return {
    total,
    accuracy: ratio(tp + tn, total),
    recall: ratio(tp, tp + fn),
    precision: ratio(tp, tp + fp),
    falsePositiveRate: ratio(fp, fp + tn),
    baselineAccuracy: ratio(tn + fp, total),
  };
}
export function workspaceGaps(w: Workspace, fieldIds: string[]) {
  const gaps = fieldIds
    .filter((id) => !w.fields[id]?.trim())
    .map((id) => ({ kind: "field" as const, id }));
  if (w.tool === "compare-options") {
    for (const o of w.options) {
      if (
        ![
          o.name,
          o.mechanism,
          o.benefits,
          o.costs,
          o.distribution,
          o.delivery,
          o.uncertainty,
        ].every((s) => s.trim())
      )
        gaps.push({ kind: "field", id: `option:${o.id}` });
    }
  }
  return gaps;
}
