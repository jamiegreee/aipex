import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import { policyTools } from "@/content/policy-tools";
import { policyCases } from "@/content/policy-cases";
import "./concept-a.css";

export const metadata: Metadata = {
  title: "Concept A — The paper",
  robots: { index: false },
};

// Concept A: the homepage as a state paper. Numbered paragraphs, an
// annex of tools and a register of every documented case.
export default function ConceptA() {
  return (
    <div className="ca">
      <Navigation />
      <main id="main">
        <header className="container ca-masthead">
          <div className="ca-rule">
            <span className="label">AI Policy Exchange</span>
            <span className="label">For governments and policymakers</span>
            <span className="label">
              {policyTools.length} tools · {policyCases.length} documented cases
            </span>
          </div>
          <h1>
            Helping governments prepare <em>for advanced AI.</em>
          </h1>
        </header>

        <section className="container ca-intro" aria-label="Introduction">
          <aside className="ca-margin">
            <p>Independent judgement, grounded in evidence.</p>
            <div className="ca-actions">
              <Link className="button" href="/tools">
                Find a tool <Arrow />
              </Link>
              <Link className="text-link" href="/cases">
                Explore the case library <Arrow diagonal />
              </Link>
            </div>
          </aside>
          <ol className="ca-paras">
            <li>
              AIPEX helps governments and policymakers understand, plan for and
              respond to the effects of advanced artificial intelligence on
              public institutions, the economy and society.
            </li>
            <li>
              Preparing for advanced AI means looking beyond individual
              deployments to the changes more capable systems could bring. Our
              purpose is to help governments anticipate those changes, weigh
              policy responses and build the institutions needed to act.
            </li>
            <li>
              We begin with practical tools and documented cases that help
              policymakers examine evidence, compare options and plan
              oversight. No account is needed to start.
            </li>
          </ol>
        </section>

        <section className="container ca-part" aria-labelledby="ca-tools">
          <div className="ca-part-head">
            <p className="label">Part I</p>
            <h2 id="ca-tools">
              From a difficult question <em>to a working brief.</em>
            </h2>
          </div>
          <div className="ca-tools">
            {policyTools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="ca-tool">
                <span className="ca-num">{t.number}</span>
                <span className="ca-tool-title">{t.shortTitle}</span>
                <span className="ca-tool-desc">{t.description}</span>
                <span className="ca-tool-out">
                  <span className="label">You leave with</span>
                  {t.output}
                </span>
                <span className="ca-tool-time label">
                  {t.time} <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container ca-part" aria-labelledby="ca-cases">
          <div className="ca-part-head">
            <p className="label">Part II</p>
            <h2 id="ca-cases">
              Good judgement <em>takes practice.</em>
            </h2>
            <p className="ca-part-note">
              Documented decisions, dated primary sources and explicit limits.
              Examine the evidence, try the decision and compare your reasoning
              with an AIPEX analysis.
            </p>
          </div>
          <table className="ca-register">
            <thead>
              <tr>
                <th className="label">Jurisdiction</th>
                <th className="label">Case</th>
                <th className="label">Theme</th>
                <th className="label">Record</th>
                <th className="label">Time</th>
              </tr>
            </thead>
            <tbody>
              {policyCases.map((c) => (
                <tr key={c.slug}>
                  <td>{c.country}</td>
                  <td>
                    <Link href={`/cases/${c.slug}`}>{c.title}</Link>
                  </td>
                  <td>{c.topic}</td>
                  <td>{c.period}</td>
                  <td>{c.minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="ca-close" aria-labelledby="ca-close-heading">
          <div className="container">
            <h2 id="ca-close-heading">
              Plan for change. <em>Build the capacity to respond.</em>
            </h2>
            <Link className="text-link" href="/about">
              About AIPEX <Arrow diagonal />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
