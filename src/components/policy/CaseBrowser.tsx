"use client";
import { useState } from "react";
import Link from "next/link";
import type { PolicyCase } from "@/content/policy-cases";
export default function CaseBrowser({ cases }: { cases: PolicyCase[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All cases");
  const [topic, setTopic] = useState("All topics");
  const results = cases.filter(
    (c) =>
      (kind === "All cases" || c.kind === kind) &&
      (topic === "All topics" || c.topic === topic) &&
      `${c.title} ${c.summary} ${c.topic} ${c.context} ${c.jurisdiction}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="case-filters">
        <div>
          <label htmlFor="case-search">Find a case</label>
          <input
            id="case-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try recruitment, review or chatbot"
          />
        </div>
        <div>
          <label htmlFor="case-kind">Case type</label>
          <select
            id="case-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {["All cases", "Practice case", "Documented case"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="case-topic">Topic</label>
          <select
            id="case-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {["All topics", ...new Set(cases.map((c) => c.topic))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="case-result-count" role="status">
        {results.length} {results.length === 1 ? "case" : "cases"}
      </p>
      <div className="case-grid">
        {results.map((c) => (
          <article className="case-card" key={c.slug}>
            <p className="label">
              {c.kind} / {c.minutes} min
            </p>
            <h2>
              <Link href={`/cases/${c.slug}`}>{c.title}</Link>
            </h2>
            <p>{c.summary}</p>
            <p className="small-copy">
              {c.jurisdiction} · {c.period}
            </p>
            <Link className="text-link" href={`/cases/${c.slug}`}>
              Examine the case ↗
            </Link>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className="policy-empty">
          <h2>No cases match those filters.</h2>
          <p>Try another term, or see the full library.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setKind("All cases");
              setTopic("All topics");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
