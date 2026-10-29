import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import { policyTools } from "@/content/policy-tools";
import { policyCases } from "@/content/policy-cases";
import "./concept-c.css";

export const metadata: Metadata = {
  title: "Concept C — Show the brief",
  robots: { index: false },
};

// The question a policymaker brings to each tool, in their words.
const questions: Record<string, string> = {
  "assess-evidence": "Does the evidence actually support the claim?",
  "compare-options": "Which option can we defend?",
  "plan-oversight": "Who can pause it, and how?",
};

const tones = ["cc-lime", "cc-pink", "cc-blue"];

function BriefMock() {
  const tool = policyTools[0];
  const fields = tool.fields.slice(0, 3);
  return (
    <div className="cc-mock" aria-hidden="true">
      <div className="cc-sheet cc-sheet-back" />
      <div className="cc-sheet cc-sheet-mid" />
      <div className="cc-sheet">
        <div className="cc-sheet-head">
          <span className="label">Brief · {tool.number}</span>
          <span className="label">Draft saved</span>
        </div>
        <p className="cc-sheet-title">{tool.exampleTitle}</p>
        {fields.map((f, i) => (
          <div key={f.id} className="cc-field">
            <span className="label">
              {String(i + 1).padStart(2, "0")} — {f.label}
            </span>
            <p>{f.example}</p>
          </div>
        ))}
        <div className="cc-field cc-field-typing">
          <span className="label">04 — {tool.fields[3].label}</span>
          <p>
            <span className="cc-caret" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConceptC() {
  return (
    <div className="cc">
      <Navigation />
      <main id="main">
        <section className="container cc-hero" aria-labelledby="cc-h1">
          <div className="cc-hero-copy">
            <p className="label cc-tag">For governments and policymakers</p>
            <h1 id="cc-h1">
              Helping governments <em>prepare for advanced AI.</em>
            </h1>
            <p className="cc-lede">
              AIPEX helps governments and policymakers understand, plan for and
              respond to the effects of advanced artificial intelligence on
              public institutions, the economy and society.
            </p>
            <div className="cc-actions">
              <Link className="button" href="/tools">
                Start a brief <Arrow />
              </Link>
              <span className="cc-note">
                Free. No account needed to start.
              </span>
            </div>
          </div>
          <BriefMock />
        </section>

        <section className="cc-bands" aria-labelledby="cc-bands-h">
          <div className="container cc-bands-head">
            <h2 id="cc-bands-h">
              Where do <em>you begin?</em>
            </h2>
            <p>
              Each tool turns a difficult question into a working brief, with
              structured prompts, a complete worked example and primary
              sources.
            </p>
          </div>
          {policyTools.map((t, i) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className={`cc-band ${tones[i]}`}
            >
              <div className="container cc-band-inner">
                <span className="cc-band-num">{t.number}</span>
                <div>
                  <p className="cc-band-q">{questions[t.slug] ?? t.title}</p>
                  <p className="cc-band-meta">
                    <strong>{t.shortTitle}</strong> · {t.time} ·{" "}
                    {t.output}
                  </p>
                </div>
                <span className="cc-band-go">
                  <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="cc-cases" aria-labelledby="cc-cases-h">
          <div className="container cc-cases-head">
            <h2 id="cc-cases-h">
              Good judgement <em>takes practice.</em>
            </h2>
            <Link className="text-link" href="/cases">
              Explore the case library <Arrow diagonal />
            </Link>
          </div>
          <div className="cc-strip">
            {policyCases.map((c) => (
              <Link key={c.slug} href={`/cases/${c.slug}`} className="cc-card">
                <span className="label">
                  {c.country} · {c.minutes} min
                </span>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <span className="cc-card-cta">
                  Try the decision <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="cc-mission" aria-labelledby="cc-mission-h">
          <div className="container cc-mission-inner">
            <h2 id="cc-mission-h">
              Plan for change. <em>Build the capacity to respond.</em>
            </h2>
            <div>
              <p>
                Preparing for advanced AI means looking beyond individual
                deployments to the changes more capable systems could bring.
                Our purpose is to help governments anticipate those changes,
                weigh policy responses and build the institutions needed to
                act.
              </p>
              <Link className="cc-mission-link" href="/about">
                About AIPEX <Arrow diagonal />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
