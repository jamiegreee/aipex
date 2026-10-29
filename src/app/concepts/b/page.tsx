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
      <Navigation cta={{ href: "/membership", label: "Join the exchange" }} />
      <main id="main">
        <section className="container cb-hero" aria-labelledby="cb-h1">
          <div>
            <p className="label cb-kicker">
              <span /> The community for people who make AI policy
            </p>
            <h1 id="cb-h1">
              Preparing government for advanced AI, <em>together.</em>
            </h1>
            <p className="cb-lede">
              AIPEX is an online community for the public servants, regulators
              and advisers working on AI. Join us on Slack to compare notes
              with peers, share what&rsquo;s working and ask the questions
              you&rsquo;re wrestling with.
            </p>
            <div className="cb-actions">
              <Link className="button" href="/membership">
                Join the exchange <Arrow />
              </Link>
              <Link className="cb-link" href="/tools">
                Browse the tools first <Arrow diagonal />
              </Link>
            </div>
            <p className="cb-join-note">
              Join the community to learn and shape AI policy together.
            </p>
          </div>
          <GapChart />
        </section>

        <section className="cb-mission" aria-labelledby="cb-mission-h">
          <div className="container">
            <p className="label">Why a community</p>
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
            <div className="cb-actions">
              <Link className="button" href="/membership">
                Join the exchange <Arrow />
              </Link>
              <Link className="cb-link" href="/about">
                About AIPEX <Arrow diagonal />
              </Link>
            </div>
          </div>
        </section>

        <section className="cb-resources" aria-labelledby="cb-tools">
          <div className="container">
            <div className="cb-section-head">
              <p className="label">Open resources</p>
              <h2 id="cb-tools">
                From a difficult question <em>to a working brief.</em>
              </h2>
            </div>
            <ul className="cb-tool-list">
              {policyTools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`}>
                    <span className="cb-tool-num">{t.number}</span>
                    <span className="cb-tool-name">{t.shortTitle}</span>
                    <span className="cb-tool-desc">{t.description}</span>
                    <span className="label">{t.time}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="cb-case-link" href="/cases">
              <span>
                <span className="label">Case library</span>
                {policyCases.length} documented decisions from {countryCount}{" "}
                countries
              </span>
              <Arrow diagonal />
            </Link>
          </div>
        </section>
      </main>
      <Footer tagline="Worked out together." />
    </div>
  );
}
