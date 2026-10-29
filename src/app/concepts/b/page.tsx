import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
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

const countryCount = new Set(policyCases.map((c) => c.country)).size;

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
        <text x="405" y="60" className="cb-chart-label">AI capability</text>
        <text x="408" y="298" className="cb-chart-label cb-muted">
          What governments can do
        </text>
        <text x="500" y="200" className="cb-chart-label cb-accent">
          the gap
        </text>
      </svg>
    </figure>
  );
}

export default function ConceptB() {
  return (
    <div className="cb">
      <Navigation cta={{ href: "/community", label: "Join the exchange" }} />
      <main id="main">
        <section className="container cb-hero" aria-labelledby="cb-h1">
          <div>
            <p className="label cb-kicker">
              <span /> A community for the people making AI policy
            </p>
            <h1 id="cb-h1">
              Preparing government for advanced AI, <em>together.</em>
            </h1>
            <p className="cb-lede">
              AIPEX is an exchange for public servants, regulators and advisers
              working on advanced AI. We compare notes, test our judgement on
              real decisions and build the tools governments will need,
              together.
            </p>
            <div className="cb-actions">
              <Link className="button" href="/community">
                Join the exchange <Arrow />
              </Link>
              <Link className="cb-link" href="/tools">
                Explore the tools <Arrow diagonal />
              </Link>
            </div>
          </div>
          <GapChart />
        </section>

        <section className="cb-pipeline" aria-labelledby="cb-tools">
          <div className="container">
            <div className="cb-section-head">
              <p className="label">01 / Shared tools</p>
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
              Free to use on your own and better with others. Tell us where
              they fall short, and we&rsquo;ll improve them together.
            </p>
          </div>
        </section>

        <section className="container cb-cases" aria-labelledby="cb-cases-h">
          <div className="cb-section-head">
            <p className="label">02 / Case library</p>
            <h2 id="cb-cases-h">
              Learn from <em>decisions already made.</em>
            </h2>
            <Link className="cb-link" href="/cases">
              All {policyCases.length} cases <Arrow diagonal />
            </Link>
          </div>
          <p className="cb-cases-intro">
            {policyCases.length} documented decisions from {countryCount}{" "}
            countries. Examine the evidence, make the call, then compare your
            reasoning with ours and with your peers&rsquo;.
          </p>
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
              Capacity is built by people, <em>not papers.</em>
            </h2>
            <p>
              Preparing for advanced AI means looking beyond individual
              deployments to the changes more capable systems could bring. No
              single department will work this out alone. AIPEX brings together
              the people who will have to, so they can compare notes,
              pressure-test their judgement and build the institutions needed to
              act.
            </p>
            <Link className="cb-link" href="/about">
              About AIPEX <Arrow diagonal />
            </Link>
          </div>
        </section>
      </main>
      <Footer tagline="The people preparing government for it." />
    </div>
  );
}
