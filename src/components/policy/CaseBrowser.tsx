"use client";
import { useState } from "react";
import Link from "next/link";
import { filterPolicyCases } from "@/lib/policy-case-search";
import type { PolicyCase } from "@/content/policy-cases";
export default function CaseBrowser({ cases }: { cases: PolicyCase[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [country, setCountry] = useState("");
  const results = filterPolicyCases(cases, { query, topic, country });
  const countries = [...new Set(cases.map((c) => c.country))].sort();
  const resultCountries = new Set(results.map((c) => c.country)).size;
  const filtered = Boolean(query.trim() || topic || country);
  const resetFilters = () => {
    setQuery("");
    setTopic("");
    setCountry("");
  };
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
            placeholder="Try welfare, facial recognition or screening"
          />
        </div>
        <div>
          <label htmlFor="case-topic">Topic</label>
          <select
            id="case-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">All topics</option>
            {[...new Set(cases.map((c) => c.topic))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="case-country">Country</label>
          <select
            id="case-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="case-results-toolbar">
        <p className="case-result-count" role="status">
          {results.length} {results.length === 1 ? "case" : "cases"} ·{" "}
          {resultCountries} {resultCountries === 1 ? "country" : "countries"}
        </p>
        {filtered && (
          <button className="text-link" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>
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
          <button className="button button-outline" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
