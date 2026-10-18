"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PolicyTool } from "@/content/policy-tools";
import { findCase, type PolicyCase } from "@/content/policy-cases";
import { policySources } from "@/content/policy-sources";
import {
  classificationMetrics,
  caseDraftToResume,
  emptyOption,
  isRetiredPracticeCase,
  emptyWorkspace,
  validWorkspace,
  workspaceGaps,
  type PolicyOption,
  type Workspace,
} from "@/lib/policy-workspace";
import { percentage, workspaceMarkdown } from "@/lib/policy-export";
import BriefPreview from "./BriefPreview";
import OptionsComparison from "./OptionsComparison";

type Draft = { document: Workspace; accountRevision: string | null };
type AccountDraft = { document: Workspace; updated_at: string };
const download = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export default function ToolWorkspace({
  tool,
  initialCase,
}: {
  tool: PolicyTool;
  initialCase?: PolicyCase;
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [current, setCurrent] = useState("");
  const [ready, setReady] = useState(false);
  const [localStatus, setLocalStatus] = useState("Loading browser drafts…");
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState<AccountDraft[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const initialised = useRef(false);
  const storageReadable = useRef(true);
  const changedElsewhere = useRef(false);
  const draft = drafts.find((d) => d.document.id === current);
  const w = draft?.document;
  const workingCase = w?.caseSlug ? findCase(w.caseSlug) : undefined;
  const storageKey = `aipex-policy-v1-${tool.slug}`;
  const steps = tool.fields
    .flatMap((f) => [
      { id: f.id, label: f.label },
      ...(f.id === "conditions"
        ? [{ id: "options", label: "Compare your options" }]
        : []),
      ...(tool.slug === "assess-evidence" && f.id === "results"
        ? [{ id: "calculator", label: "Optional metric calculator" }]
        : []),
    ])
    .concat({ id: "brief", label: "Review & export" });
  const step = steps[active];
  const field = tool.fields.find((f) => f.id === step.id);

  // Client-only storage is hydrated after SSR; it cannot supply server state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    let saved: Draft[] = [];
    let selected = "";
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          !Array.isArray(parsed.drafts) ||
          !parsed.drafts.every(
            (d: Draft) =>
              validWorkspace(d.document) && d.document.tool === tool.slug,
          )
        )
          throw new Error(
            "Unsupported browser draft format. Download existing work before clearing browser storage.",
          );
        saved = parsed.drafts;
        selected = parsed.current;
      }
    } catch {
      storageReadable.current = false;
      setLocalStatus(
        "Browser storage could not be read. Download a project file to keep your work.",
      );
    }
    const caseDraft =
      initialCase && caseDraftToResume(saved, selected, initialCase.slug);
    if (caseDraft) selected = caseDraft.document.id;
    if ((initialCase && !caseDraft) || !saved.length) {
      const document = emptyWorkspace(tool.slug, crypto.randomUUID());
      if (initialCase) {
        document.title = initialCase.title;
        document.caseSlug = initialCase.slug;
        document.fields = { ...initialCase.seed };
        if (initialCase.slug === tool.exampleCase && tool.exampleOptions)
          document.options = tool.exampleOptions.map((o) =>
            emptyOption(o.id, o.name),
          );
      }
      saved = [...saved, { document, accountRevision: null }];
      selected = document.id;
    }
    setDrafts(saved);
    setCurrent(
      saved.some((d) => d.document.id === selected)
        ? selected
        : saved[0].document.id,
    );
    setReady(true);
  }, [
    storageKey,
    tool.slug,
    tool.exampleCase,
    tool.exampleOptions,
    initialCase,
  ]);

  useEffect(() => {
    if (!ready || !storageReadable.current || changedElsewhere.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ drafts, current }));
      setLocalStatus("Saved in this browser");
    } catch {
      setLocalStatus(
        "Browser save unavailable or storage full. Download a project file to keep your work.",
      );
    }
  }, [drafts, current, storageKey, ready]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      changedElsewhere.current = true;
      setLocalStatus(
        "Browser saving paused: this tool changed in another tab. Download your open project before reloading to see the latest browser version",
      );
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  async function loadAccount() {
    setBusy(true);
    try {
      const res = await fetch(`/api/workspaces?tool=${tool.slug}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSignedIn(data.signedIn);
      setAccount(
        (data.drafts ?? []).filter(
          (d: AccountDraft) =>
            validWorkspace(d.document) && d.document.tool === tool.slug,
        ),
      );
      if (!data.signedIn)
        setMessage(
          "Sign in to use account drafts. You can keep working here without an account.",
        );
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Account drafts could not be loaded.",
      );
    } finally {
      setBusy(false);
    }
  }
  const update = (change: Partial<Workspace>) => {
    setDrafts((ds) =>
      ds.map((d) =>
        d.document.id === current
          ? { ...d, document: { ...d.document, ...change } }
          : d,
      ),
    );
    setMessage("");
  };
  const move = (index: number) => {
    setActive(index);
    requestAnimationFrame(() => {
      stepHeading.current?.focus();
      stepHeading.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  };
  function createDraft(example: boolean) {
    if (drafts.length >= 30) {
      setMessage(
        "This browser has 30 drafts for this tool. Download and remove a draft before creating another.",
      );
      return;
    }
    const document = emptyWorkspace(tool.slug, crypto.randomUUID());
    if (example) {
      document.caseSlug = tool.exampleCase;
      document.title = `Worked analysis · ${tool.exampleTitle}`;
      document.fields = Object.fromEntries(
        tool.fields.map((f) => [f.id, f.example]),
      );
      if (tool.exampleOptions)
        document.options = tool.exampleOptions.map((o) => ({ ...o }));
    }
    setDrafts((ds) => [...ds, { document, accountRevision: null }]);
    setCurrent(document.id);
    setActive(0);
    setMessage(
      example
        ? "Opened an AIPEX analysis of a documented case as a separate draft. Suggested controls and next steps are proposals, not reported actions. Your earlier work is retained."
        : "New draft created. Your earlier work is retained.",
    );
  }
  async function saveAccount() {
    if (!draft) return;
    setBusy(true);
    const saving = draft;
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: saving.document,
          expectedUpdatedAt: saving.accountRevision,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSignedIn(true);
      setDrafts((ds) =>
        ds.map((d) =>
          d.document.id === saving.document.id
            ? { ...d, accountRevision: data.updatedAt }
            : d,
        ),
      );
      setMessage(
        "Saved to your account. Later edits continue saving in this browser; choose Save to account again to update the account copy.",
      );
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Account save failed. Your browser draft is retained.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function importProject(file?: File) {
    if (!file) return;
    try {
      if (file.size > 250000)
        throw new Error("Choose an AIPEX project file smaller than 250 KB.");
      const imported: unknown = JSON.parse(await file.text());
      if (!validWorkspace(imported) || imported.tool !== tool.slug)
        throw new Error(
          "This is not a supported project for this tool. Open its original tool and try there.",
        );
      if (drafts.length >= 30)
        throw new Error(
          "Download and remove a browser draft before importing another.",
        );
      const document = { ...imported, id: crypto.randomUUID() };
      setDrafts((ds) => [...ds, { document, accountRevision: null }]);
      setCurrent(document.id);
      setActive(0);
      setMessage("Imported as a new browser draft. Existing work is retained.");
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "The project could not be imported.",
      );
    }
  }
  if (!ready || !w)
    return (
      <div className="container workspace-loading">
        <p role="status">Loading your workspace…</p>
        <noscript>
          Enable JavaScript to use this workspace. The guidance, cases and
          sources on this page remain available.
        </noscript>
      </div>
    );
  const metrics = classificationMetrics(w.matrix);
  const gaps = workspaceGaps(
    w,
    tool.fields.map((f) => f.id),
  );
  const missingFields = tool.fields.filter((f) => !w.fields[f.id]?.trim());
  const exportName = (w.title || "aipex-draft")
    .replace(/[^a-z0-9-]+/gi, "-")
    .slice(0, 70);
  return (
    <section className="workspace-shell" aria-label={`${tool.title} workspace`}>
      <div className="workspace-toolbar container">
        <div className="workspace-title">
          <label htmlFor="draft-title">Name your draft</label>
          <input
            id="draft-title"
            value={w.title}
            maxLength={160}
            onChange={(e) => update({ title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="browser-draft">Browser drafts</label>
          <select
            id="browser-draft"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
              setActive(0);
              setMessage("");
            }}
          >
            {drafts.map((d) => (
              <option key={d.document.id} value={d.document.id}>
                {d.document.title || "Untitled assessment"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="text-link"
          onClick={() => createDraft(false)}
        >
          New draft +
        </button>
        <button
          type="button"
          className="text-link"
          onClick={() => createDraft(true)}
        >
          Open worked example ↗
        </button>
      </div>
      <div className="container workspace-storage">
        <p>
          {localStatus}. Drafts stay on this device until you choose{" "}
          <strong>Save to account</strong>. Use fictional or anonymised
          material; avoid confidential information on shared devices.
        </p>
        <div className="workspace-actions">
          <button
            type="button"
            className="button button-small"
            disabled={busy}
            onClick={saveAccount}
          >
            {busy ? "Working…" : "Save to account"}
          </button>
          <button
            type="button"
            className="text-link"
            disabled={busy}
            onClick={() => {
              setAccountOpen(!accountOpen);
              if (!accountOpen) void loadAccount();
            }}
          >
            Account drafts
          </button>
        </div>
      </div>
      {workingCase && (
        <p className="container case-context-note">
          Draft source:{" "}
          <Link href={`/cases/${workingCase.slug}`}>{workingCase.title}</Link>.{" "}
          Reported facts come from the dated case sources. Your interpretations,
          proposed controls and next steps are analysis, not reported
          arrangements.
        </p>
      )}
      {isRetiredPracticeCase(w.caseSlug) && (
        <p className="container workspace-message">
          This saved draft uses a retired fictional teaching case. Your work is
          retained; its case facts are invented. Open the worked example to
          start a separate analysis of a documented case.
        </p>
      )}
      {message && (
        <p className="container workspace-message" role="status">
          {message}
          {!signedIn && message.includes("Sign in") && (
            <>
              {" "}
              <Link
                href={`/login?next=${encodeURIComponent(`/tools/${tool.slug}`)}`}
              >
                Sign in →
              </Link>{" "}
              or{" "}
              <Link
                href={`/signup?next=${encodeURIComponent(`/tools/${tool.slug}`)}`}
              >
                create an account
              </Link>
              .
            </>
          )}
        </p>
      )}
      {accountOpen && (
        <div className="container account-drafts">
          <h2>Account drafts for this tool</h2>
          <p>
            Open a copy to keep both the account version and your current work.
            Up to 100 recent account drafts are shown.
          </p>
          {signedIn && !account.length && (
            <p>No saved account drafts for this tool yet.</p>
          )}
          <ul>
            {account.map((d) => (
              <li key={d.document.id}>
                <span>
                  {d.document.title}{" "}
                  <small>
                    Saved {new Date(d.updated_at).toLocaleDateString("en-GB")}
                  </small>
                </span>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    if (drafts.length >= 30) {
                      setMessage(
                        "Remove a browser draft before opening another.",
                      );
                      return;
                    }
                    const document = { ...d.document, id: crypto.randomUUID() };
                    setDrafts((ds) => [
                      ...ds,
                      { document, accountRevision: null },
                    ]);
                    setCurrent(document.id);
                    setActive(0);
                    setMessage(
                      "Opened an account draft as a new browser copy.",
                    );
                  }}
                >
                  Open a copy ↗
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="container workspace-grid">
        <aside className="workspace-outline">
          <p className="label">Your working brief</p>
          <nav aria-label="Workspace sections">
            <ol>
              {steps.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-current={i === active ? "step" : undefined}
                    onClick={() => move(i)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                    {w.fields[s.id]?.trim() && (
                      <span aria-label="Drafted">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <p className="small-copy">
            {tool.fields.length - missingFields.length} / {tool.fields.length}{" "}
            sections drafted.
            <br />
            Text presence is not a quality assessment.
          </p>
        </aside>
        <div className="workspace-main">
          <p className="label">
            {String(active + 1).padStart(2, "0")} / {steps.length}
          </p>
          <h2
            ref={stepHeading}
            tabIndex={-1}
            className="workspace-step-heading"
          >
            {step.label}
          </h2>
          {field && (
            <div className="workspace-field">
              <p id={`help-${field.id}`}>{field.prompt}</p>
              <textarea
                aria-label={field.label}
                aria-describedby={`help-${field.id}`}
                rows={11}
                maxLength={12000}
                value={w.fields[field.id] ?? ""}
                onChange={(e) =>
                  update({
                    fields: { ...w.fields, [field.id]: e.target.value },
                  })
                }
                placeholder="Record your reasoning, evidence and unresolved questions…"
              />
              <details>
                <summary>See a source-based worked analysis</summary>
                <p>{field.example}</p>
                <p className="small-copy">
                  {tool.exampleNote}{" "}
                  <Link href={`/cases/${tool.exampleCase}`}>
                    Read the case and its evidence ↗
                  </Link>
                </p>
              </details>
              <p className="small-copy field-reading">{field.reading}</p>
              <p className="field-sources">
                Method informed by:{" "}
                {field.sources.map((id, i) => (
                  <span key={id}>
                    {i > 0 && " · "}
                    <a href={`#source-${id}`}>
                      {policySources[id].publisher}: {policySources[id].title}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          )}
          {step.id === "options" && (
            <>
              <p>
                Keep a realistic baseline (or a dated historical comparator).
                Compare at least two alternatives, including a non-AI or
                non-regulatory approach where relevant. Mark essential
                conditions against the evidence you recorded; this tool does not
                score or rank policies.
              </p>
              <OptionsComparison options={w.options} />
              <div className="option-stack">
                {w.options.map((o, i) => (
                  <details className="option-editor" key={o.id}>
                    <summary>
                      Edit {i === 0 ? "baseline" : `alternative ${i}`} ·{" "}
                      {o.name || "Unnamed option"}
                    </summary>
                    <fieldset className="option-card">
                      <legend>
                        {i === 0 ? "Baseline" : `Alternative ${i}`}
                      </legend>
                      <label htmlFor={`option-${o.id}-name`}>Option name</label>
                      <input
                        id={`option-${o.id}-name`}
                        maxLength={160}
                        value={o.name}
                        onChange={(e) =>
                          updateOption(o.id, "name", e.target.value)
                        }
                      />
                      {(
                        [
                          [
                            "mechanism",
                            "Mechanism: how would it change outcomes?",
                          ],
                          [
                            "benefits",
                            "Benefits: outcome, evidence and who benefits",
                          ],
                          [
                            "costs",
                            "Costs and burdens: public, private and ongoing",
                          ],
                          [
                            "distribution",
                            "Distribution: who loses, access and exceptional cases",
                          ],
                          [
                            "delivery",
                            "Delivery: authority, owner, resources and timing",
                          ],
                          [
                            "uncertainty",
                            "Uncertainty: assumptions, evidence gaps and sensitivity",
                          ],
                        ] as const
                      ).map(([key, label]) => (
                        <div key={key}>
                          <label htmlFor={`option-${o.id}-${key}`}>
                            {label}
                          </label>
                          <textarea
                            id={`option-${o.id}-${key}`}
                            rows={3}
                            maxLength={12000}
                            value={o[key]}
                            onChange={(e) =>
                              updateOption(o.id, key, e.target.value)
                            }
                          />
                        </div>
                      ))}
                      <label htmlFor={`gate-${o.id}`}>
                        Essential conditions
                      </label>
                      <select
                        id={`gate-${o.id}`}
                        value={o.gate}
                        onChange={(e) =>
                          updateOption(o.id, "gate", e.target.value)
                        }
                      >
                        <option value="unknown">
                          Unresolved — evidence needed
                        </option>
                        <option value="met">
                          All met — explain evidence above
                        </option>
                        <option value="not-met">Not met — explain above</option>
                      </select>
                      {i > 0 && w.options.length > 3 && (
                        <button
                          type="button"
                          className="text-link"
                          onClick={() =>
                            update({
                              options: w.options.filter((x) => x.id !== o.id),
                            })
                          }
                        >
                          Remove this alternative
                        </button>
                      )}
                    </fieldset>
                  </details>
                ))}
              </div>
              <button
                type="button"
                className="button button-outline"
                disabled={w.options.length >= 6}
                onClick={() =>
                  update({
                    options: [
                      ...w.options,
                      emptyOption(
                        crypto.randomUUID(),
                        `Option ${w.options.length}`,
                      ),
                    ],
                  })
                }
              >
                Add an alternative +
              </button>
              <p className="small-copy">
                Up to five alternatives, plus the baseline. The baseline remains
                a comparison even if it fails an essential condition.
              </p>
            </>
          )}
          {step.id === "calculator" && (
            <>
              <p>
                Optional: examine a binary classification claim. Define
                “positive” and the reference label in your assessment first.
                Counts must come from the same test population. Skip this for
                other evidence types.
              </p>
              <div className="metric-inputs">
                {(
                  [
                    [
                      "tp",
                      "True positives",
                      "Predicted positive; reference positive",
                    ],
                    [
                      "fp",
                      "False positives",
                      "Predicted positive; reference negative",
                    ],
                    [
                      "fn",
                      "False negatives",
                      "Predicted negative; reference positive",
                    ],
                    [
                      "tn",
                      "True negatives",
                      "Predicted negative; reference negative",
                    ],
                  ] as const
                ).map(([key, label, help]) => (
                  <div key={key}>
                    <label htmlFor={`matrix-${key}`}>{label}</label>
                    <input
                      id={`matrix-${key}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={1000000000}
                      step={1}
                      value={w.matrix[key] ?? ""}
                      onChange={(e) =>
                        update({
                          matrix: { ...w.matrix, [key]: e.target.value },
                        })
                      }
                    />
                    <p className="small-copy">{help}</p>
                  </div>
                ))}
              </div>
              {metrics ? (
                <div className="metric-results" role="status">
                  <h3>{metrics.total.toLocaleString("en-GB")} observations</h3>
                  <dl>
                    {(
                      [
                        ["Accuracy · (TP + TN) / total", metrics.accuracy],
                        ["Recall · TP / (TP + FN)", metrics.recall],
                        ["Precision · TP / (TP + FP)", metrics.precision],
                        [
                          "False-positive rate · FP / (FP + TN)",
                          metrics.falsePositiveRate,
                        ],
                        [
                          "Always-negative baseline accuracy · (TN + FP) / total",
                          metrics.baselineAccuracy,
                        ],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{percentage(value)}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>
                    Always-negative means rejecting or classifying every case as
                    negative. Its recall is zero when reference-positive cases
                    exist. High accuracy can conceal missed positives.
                  </p>
                </div>
              ) : (
                <p role="status">
                  Enter all four counts as non-negative whole numbers up to
                  1,000,000,000 to calculate.
                </p>
              )}
              <p className="small-copy">
                These are descriptive sample metrics. They do not estimate
                uncertainty, establish causal effects, assess fairness or
                recommend deployment. Record subgroup evidence and uncertainty
                in your results section.
              </p>
            </>
          )}
          {step.id === "brief" && (
            <>
              <div className="brief-review">
                <h3>Questions to resolve</h3>
                {gaps.length ? (
                  <>
                    <p>
                      {gaps.length}{" "}
                      {gaps.length === 1
                        ? "section or option card is"
                        : "sections or option cards are"}{" "}
                      still incomplete.
                    </p>
                    <ul>
                      {missingFields.map((f) => (
                        <li key={f.id}>
                          <button
                            className="text-link"
                            onClick={() =>
                              move(steps.findIndex((s) => s.id === f.id))
                            }
                          >
                            {f.label} →
                          </button>
                        </li>
                      ))}
                      {gaps.some((g) => g.id.startsWith("option:")) && (
                        <li>
                          <button
                            className="text-link"
                            onClick={() =>
                              move(steps.findIndex((s) => s.id === "options"))
                            }
                          >
                            Complete the option cards →
                          </button>
                        </li>
                      )}
                    </ul>
                  </>
                ) : (
                  <p>
                    Every section contains text. Review the substance, source
                    support and outstanding decisions with an appropriate
                    reviewer.
                  </p>
                )}
                {w.tool === "compare-options" &&
                  w.options.some((o) => o.gate !== "met") && (
                    <p>
                      <strong>
                        Essential conditions remain unresolved or not met.
                      </strong>{" "}
                      Explain their implications before recommending an option;
                      the baseline is retained as a comparison.
                    </p>
                  )}
              </div>
              <section
                className="brief-review"
                aria-labelledby="reasoning-checks"
              >
                <h3 id="reasoning-checks">Before you rely on this brief</h3>
                <p>
                  Review these questions with a colleague. Text in every section
                  is not a pass or a verified judgement.
                </p>
                <ul>
                  {tool.reviewChecks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </section>
              {w.tool === "compare-options" && (
                <OptionsComparison options={w.options} />
              )}
              <div className="workspace-export">
                <button
                  className="button"
                  onClick={() =>
                    download(
                      `${exportName}.md`,
                      workspaceMarkdown(w),
                      "text/markdown;charset=utf-8",
                    )
                  }
                >
                  Download brief (.md) ↓
                </button>
                <button
                  className="button button-outline"
                  onClick={() =>
                    download(
                      `${exportName}.json`,
                      JSON.stringify(w, null, 2),
                      "application/json",
                    )
                  }
                >
                  Download editable project ↓
                </button>
                <button className="text-link" onClick={() => window.print()}>
                  Print / save PDF ↗
                </button>
              </div>
              <p className="small-copy">
                The brief includes your reasoning, unresolved sections, metric
                calculations and framework sources. The project file can be
                reopened with Import project below. Downloads are not sent to
                AIPEX.
              </p>
              <div className="policy-brief-print">
                <BriefPreview>{workspaceMarkdown(w)}</BriefPreview>
              </div>
            </>
          )}
          <div className="workspace-step-actions">
            <button
              type="button"
              className="text-link"
              disabled={active === 0}
              onClick={() => move(active - 1)}
            >
              ← Previous
            </button>
            {active < steps.length - 1 && (
              <button
                type="button"
                className="button"
                onClick={() => move(active + 1)}
              >
                Continue →
              </button>
            )}
          </div>
          <div className="workspace-maintenance">
            <label className="text-link" htmlFor="import-project">
              Import project (.json) ↑
            </label>
            <input
              id="import-project"
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                void importProject(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              className="text-link"
              onClick={() => setConfirmClear(!confirmClear)}
            >
              Remove this browser draft
            </button>
            {confirmClear && (
              <div className="brief-review">
                <p>
                  Remove “{w.title}” from this browser? Download a copy first if
                  needed. Any separately saved account copy stays available.
                </p>
                <button
                  className="button button-outline"
                  onClick={() => {
                    const remaining = drafts.filter(
                      (d) => d.document.id !== current,
                    );
                    const next = remaining.length
                      ? remaining
                      : [
                          {
                            document: emptyWorkspace(
                              tool.slug,
                              crypto.randomUUID(),
                            ),
                            accountRevision: null,
                          },
                        ];
                    setDrafts(next);
                    setCurrent(next[0].document.id);
                    setConfirmClear(false);
                    setActive(0);
                  }}
                >
                  Remove browser draft
                </button>
                <button
                  className="text-link"
                  onClick={() => setConfirmClear(false)}
                >
                  Keep draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
  function updateOption(id: string, key: keyof PolicyOption, value: string) {
    if (!w) return;
    update({
      options: w.options.map((o) => (o.id === id ? { ...o, [key]: value } : o)),
    });
  }
}
