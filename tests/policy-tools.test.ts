import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  classificationMetrics,
  caseDraftToResume,
  emptyWorkspace,
  validWorkspace,
  workspaceGaps,
} from "../src/lib/policy-workspace";
import { workspaceMarkdown } from "../src/lib/policy-export";
import { policyTools, findTool } from "../src/content/policy-tools";
import { policyCases } from "../src/content/policy-cases";
import { policySources } from "../src/content/policy-sources";
import { courses } from "../src/content/courses";
import { allLessons } from "../src/lib/courses";
import { isAnalyticsPage } from "../src/lib/analytics";

test("case reloads resume the selected edited copy, or the latest copy when arriving from another draft", () => {
  const original = {
    document: {
      ...emptyWorkspace("assess-evidence", randomUUID()),
      caseSlug: "screening-accuracy",
    },
  };
  const edited = {
    document: {
      ...original.document,
      id: randomUUID(),
      fields: { claim: "My developed reasoning" },
    },
  };
  const other = { document: emptyWorkspace("assess-evidence", randomUUID()) };
  const drafts = [original, edited, other];
  assert.equal(
    caseDraftToResume(drafts, edited.document.id, "screening-accuracy"),
    edited,
  );
  assert.equal(
    caseDraftToResume(drafts, original.document.id, "screening-accuracy"),
    original,
  );
  assert.equal(
    caseDraftToResume(drafts, other.document.id, "screening-accuracy"),
    edited,
  );
  assert.equal(
    caseDraftToResume(drafts, other.document.id, "govuk-chat"),
    undefined,
  );
});

test("classification counts use the correct denominators and expose the trivial baseline", () => {
  const result = classificationMetrics({
    tp: "60",
    fp: "20",
    fn: "20",
    tn: "900",
  })!;
  assert.equal(result.total, 1000);
  assert.equal(result.accuracy, 0.96);
  assert.equal(result.recall, 0.75);
  assert.equal(result.precision, 0.75);
  assert.equal(result.falsePositiveRate, 20 / 920);
  assert.equal(result.baselineAccuracy, 0.92);
  const asymmetric = classificationMetrics({
    tp: "8",
    fp: "2",
    fn: "12",
    tn: "78",
  })!;
  assert.equal(asymmetric.precision, 0.8);
  assert.equal(asymmetric.recall, 0.4);
});
test("undefined metrics stay undefined and invalid counts do not produce a plausible score", () => {
  const zero = classificationMetrics({ tp: "0", fp: "0", fn: "0", tn: "0" })!;
  assert.equal(zero.total, 0);
  assert.equal(zero.accuracy, null);
  assert.equal(zero.precision, null);
  assert.equal(
    classificationMetrics({ tp: "0", fp: "0", fn: "4", tn: "96" })!.recall,
    0,
  );
  for (const bad of ["", "-1", "1.5", "NaN", "1e3", "1000000001"])
    assert.equal(
      classificationMetrics({ tp: bad, fp: "0", fn: "0", tn: "1" }),
      null,
    );
});
test("project imports reject malformed, oversized and incomplete option records", () => {
  const w = emptyWorkspace("compare-options", randomUUID());
  assert.ok(validWorkspace(JSON.parse(JSON.stringify(w))));
  for (const bad of [
    null,
    [],
    {},
    { ...w, tool: "unknown" },
    { ...w, title: 3 },
    { ...w, id: "------------------------------------" },
    { ...w, fields: { x: "x".repeat(12001) } },
    { ...w, options: [{ id: "baseline", gate: "unknown" }, {}, {}] },
    { ...w, options: [w.options[1], ...w.options] },
    { ...w, options: [w.options[0], w.options[1], w.options[1]] },
    { ...w, matrix: { tp: 5 } },
  ])
    assert.equal(validWorkspace(bad), false);
});
test("export preserves reasoning, incomplete sections, unresolved conditions and source scope", () => {
  const w = emptyWorkspace("compare-options", randomUUID());
  w.title = "An actual draft";
  w.fields.problem = "Authority is not yet confirmed.";
  assert.ok(
    workspaceGaps(
      w,
      findTool(w.tool)!.fields.map((f) => f.id),
    ).length > 0,
  );
  const markdown = workspaceMarkdown(w);
  assert.ok(markdown.includes("Authority is not yet confirmed."));
  assert.ok(markdown.includes("[Not yet drafted]"));
  assert.ok(markdown.includes("Business as usual"));
  assert.ok(markdown.includes("Essential conditions unresolved or not met"));
  assert.ok(markdown.includes(policySources.green.url));
  assert.ok(markdown.includes("not the truth of statements entered above"));
});
test("exports include optional metric inputs as well as the derived result", () => {
  const w = emptyWorkspace("assess-evidence", randomUUID());
  w.matrix = { tp: "60", fp: "20", fn: "20", tn: "900" };
  const md = workspaceMarkdown(w);
  assert.ok(md.includes("TP 60; FP 20; FN 20; TN 900"));
  assert.ok(md.includes("Recall: 75.0%"));
  assert.ok(md.includes("baseline accuracy: 92.0%"));
});
test("a case-based export retains its original evidence references and fictional status", () => {
  const w = emptyWorkspace("assess-evidence", randomUUID());
  w.caseSlug = "govuk-chat";
  assert.ok(workspaceMarkdown(w).includes(policySources.chat2024.url));
  assert.ok(
    workspaceMarkdown(w).includes("not a statement of present performance"),
  );
  w.caseSlug = "screening-accuracy";
  assert.ok(workspaceMarkdown(w).includes("fictional teaching assumptions"));
});
test("every source reference and related lesson resolves; case types cover each tool", () => {
  for (const t of policyTools) {
    for (const id of [...t.sources, ...t.fields.flatMap((f) => f.sources)])
      assert.ok(policySources[id]);
    assert.ok(
      t.fields.every((f) => f.sources.every((id) => t.sources.includes(id))),
    );
    const course = courses.find((c) => c.slug === t.course)!;
    assert.ok(
      allLessons(course).some((l) => l.slug === t.lesson),
      t.lesson,
    );
    assert.ok(
      policyCases.some((c) => c.tool === t.slug && c.kind === "Practice case"),
    );
    assert.ok(
      policyCases.some(
        (c) => c.tool === t.slug && c.kind === "Documented case",
      ),
    );
    assert.equal(
      isAnalyticsPage(`/tools/${t.slug}`),
      false,
      "writing workspaces stay out of analytics",
    );
  }
  for (const c of policyCases) {
    assert.ok(findTool(c.tool));
    assert.ok(c.sources.every((id) => policySources[id]));
    assert.ok(
      c.evidence.every((e) => !e.source || c.sources.includes(e.source)),
    );
    assert.ok(
      Object.keys(c.seed).every((k) =>
        findTool(c.tool)!.fields.some((f) => f.id === k),
      ),
    );
  }
});
