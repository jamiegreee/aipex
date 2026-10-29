import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Arrow, ExchangeMark } from "@/components/Brand";
import { policyTools } from "@/content/policy-tools";
import { policyCases } from "@/content/policy-cases";
import "./concept-b.css";

export const metadata: Metadata = {
  title: "Concept B — The gap",
  robots: { index: false },
};

const codes: Record<string, string> = {
  "United Kingdom": "GBR",
  Australia: "AUS",
  Netherlands: "NLD",
  "United States": "USA",
  Canada: "CAN",
  Singapore: "SGP",
  Brazil: "BRA",
};

// An illustrative, unquantified picture of the thesis: capability compounds
// while institutional capacity grows in steps. Not a data series.
function GapChart() {
  return (
    <figure className="cb-chart">
      <svg viewBox="0 0 600 380" role="img" aria-labelledby="cb-chart-title">
        <title id="cb-chart-title">
          Illustration: advanced AI capability rising faster than the public
          capacity to respond, leaving a gap to close.
        </title>
        {[76, 152, 228, 304].map((y) => (
          <line key={y} x1="0" x2="600" y1={y} y2={y} className="cb-grid" />
        ))}
        <path
          className="cb-gap"
          d="M0 350 C 200 345, 360 300, 470 170 S 580 20, 600 10 L 600 230 L 520 230 L 520 262 L 400 262 L 400 290 L 260 290 L 260 318 L 120 318 L 120 340 L 0 340 Z"
        />
        <path
          className="cb-capability"
          d="M0 350 C 200 345, 360 300, 470 170 S 580 20, 600 10"
        />
        <path
          className="cb-capacity"
          d="M0 340 H120 V318 H260 V290 H400 V262 H520 V230 H600"
        />
        <text x="420" y="60" className="cb-chart-label">Capability</text>
        <text x="408" y="290" className="cb-chart-label cb-muted">
          Capacity to respond
        </text>
        <text x="500" y="200" className="cb-chart-label cb-pink">
          the gap
        </text>
      </svg>
      <figcaption className="label">Fig. 1 — Illustrative, not to scale</figcaption>
    </figure>
  );
}

export default function ConceptB() {
  return (
    <div className="cb">
      <header className="cb-header container">
        <Link href="/" className="cb-brand" aria-label="AIPEX — home">
          <ExchangeMark /> AIPEX
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/tools">Tools</Link>
          <Link href="/cases">Case library</Link>
          <Link href="/about">About</Link>
          <Link href="/account" className="cb-pill">
            My account
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="container cb-hero" aria-labelledby="cb-h1">
          <div>
            <p className="label cb-kicker">
              <span /> For governments and policymakers
            </p>
            <h1 id="cb-h1">
              Helping governments <em>prepare for advanced AI.</em>
            </h1>
            <p className="cb-lede">
              AIPEX helps governments and policymakers understand, plan for and
              respond to the effects of advanced artificial intelligence on
              public institutions, the economy and society.
            </p>
            <div className="cb-actions">
              <Link className="cb-button" href="/tools">
                Find a tool <Arrow />
              </Link>
              <Link className="cb-link" href="/cases">
                Explore the case library <Arrow diagonal />
              </Link>
            </div>
          </div>
          <GapChart />
        </section>

        <section className="cb-pipeline" aria-labelledby="cb-tools">
          <div className="container">
            <div className="cb-section-head">
              <p className="label">01 / The workbench</p>
              <h2 id="cb-tools">
                From a difficult question <em>to a working brief.</em>
              </h2>
            </div>
            <ol className="cb-steps">
              {policyTools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`}>
                    <span className="cb-step-node">{t.number}</span>
                    <span className="label cb-muted">{t.time}</span>
                    <h3>{t.shortTitle}</h3>
                    <p>{t.description}</p>
                    <span className="cb-out">
                      <span className="label">Output</span> {t.output}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="cb-note">
              Structured prompts, complete worked examples and primary sources.
              No account needed to start.
            </p>
          </div>
        </section>

        <section className="container cb-cases" aria-labelledby="cb-cases-h">
          <div className="cb-section-head">
            <p className="label">02 / Case library</p>
            <h2 id="cb-cases-h">
              Good judgement <em>takes practice.</em>
            </h2>
            <Link className="cb-link" href="/cases">
              All {policyCases.length} cases <Arrow diagonal />
            </Link>
          </div>
          <div className="cb-case-grid">
            {policyCases.map((c) => (
              <Link key={c.slug} href={`/cases/${c.slug}`} className="cb-case">
                <span className="cb-code">{codes[c.country] ?? c.country}</span>
                <span className="label cb-muted">
                  {c.topic} · {c.minutes} min
                </span>
                <h3>{c.title}</h3>
                <span className="cb-period">{c.period}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="cb-mission" aria-labelledby="cb-mission-h">
          <div className="container">
            <p className="label">An enduring purpose</p>
            <h2 id="cb-mission-h">
              Plan for change. <em>Build the capacity to respond.</em>
            </h2>
            <p>
              Preparing for advanced AI means looking beyond individual
              deployments to the changes more capable systems could bring. Our
              purpose is to help governments anticipate those changes, weigh
              policy responses and build the institutions needed to act.
            </p>
            <Link className="cb-link" href="/about">
              About AIPEX <Arrow diagonal />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
