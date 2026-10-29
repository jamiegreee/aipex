import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import { policyTools } from "@/content/policy-tools";
import { policyCases } from "@/content/policy-cases";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section
          className="hero container policy-home-hero"
          aria-labelledby="hero-heading"
        >
          <div className="hero-copy">
            <p className="label hero-label">
              <span className="status-dot" /> Building AI policy capacity
            </p>
            <h1 id="hero-heading">
              Big questions.
              <br />
              <em>Better policy.</em>
            </h1>
            <p className="hero-description">
              Build the judgement to act. Practical tools and source-backed
              cases for people shaping how AI is governed.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/tools">
                Find a tool <Arrow />
              </Link>
              <Link className="text-link" href="/cases">
                Explore the case library <Arrow diagonal />
              </Link>
            </div>
            <p className="hero-footnote">
              Open resources. Practical questions. Work worth doing.
            </p>
          </div>
          <aside
            className="home-workbench"
            aria-label="Choose your starting question"
          >
            <p className="label">On your desk / A decision to make</p>
            <h2>
              Where do
              <br />
              <em>you begin?</em>
            </h2>
            {policyTools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`}>
                <span className="label">{t.number}</span>
                <span>
                  {t.shortTitle}
                  <small>{t.time} · A brief to take away</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <p>No account needed to start.</p>
          </aside>
        </section>
        <section className="policy-band" aria-labelledby="home-tools-heading">
          <div className="container">
            <div className="section-heading">
              <p className="label">01 / Use a tool</p>
              <Link className="text-link" href="/tools">
                The policy workbench ↗
              </Link>
            </div>
            <h2 className="policy-section-title" id="home-tools-heading">
              From a difficult question
              <br />
              to a <em>working brief.</em>
            </h2>
            <div className="home-tool-grid">
              {policyTools.map((t) => (
                <article key={t.slug}>
                  <p className="label">
                    {t.number} / {t.time}
                  </p>
                  <h3>
                    <Link href={`/tools/${t.slug}`}>{t.shortTitle}.</Link>
                  </h3>
                  <p>{t.description}</p>
                  <Link className="text-link" href={`/tools/${t.slug}`}>
                    Open workspace ↗
                  </Link>
                </article>
              ))}
            </div>
            <p className="policy-section-note">
              Structured prompts, complete worked examples and primary sources.
              Save drafts, compare your reasoning and export something you can
              develop further.
            </p>
          </div>
        </section>
        <section
          className="container home-cases"
          aria-labelledby="home-cases-heading"
        >
          <div className="section-heading">
            <p className="label">02 / Examine a case</p>
            <Link className="text-link" href="/cases">
              Explore the case library ↗
            </Link>
          </div>
          <h2 className="policy-section-title" id="home-cases-heading">
            Good judgement
            <br />
            <em>takes practice.</em>
          </h2>
          <div className="case-grid">
            {policyCases
              .filter((c) =>
                [
                  "robodebt",
                  "singapore-retinal-screening",
                  "brazil-victor",
                ].includes(c.slug),
              )
              .map((c) => (
                <article className="case-card" key={c.slug}>
                  <p className="label">
                    {c.kind} / {c.minutes} min
                  </p>
                  <h3>
                    <Link href={`/cases/${c.slug}`}>{c.title}</Link>
                  </h3>
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
          <p className="policy-section-note">
            Documented decisions from the UK and beyond, dated primary sources
            and explicit limits. Examine the evidence, try the decision and
            compare your reasoning with an AIPEX analysis.
          </p>
        </section>
        <section className="mission-section" aria-labelledby="mission-heading">
          <div className="container mission-inner">
            <p className="label">An enduring purpose</p>
            <div>
              <h2 id="mission-heading">
                Understanding AI.
                <br />
                <em>Building public judgement.</em>
              </h2>
              <div className="mission-copy">
                <p>
                  AIPEX is building capacity to understand, develop and deliver
                  effective AI policy. We begin with useful work: careful
                  teaching, questions that can be examined and resources people
                  can put into practice.
                </p>
              </div>
              <Link className="text-link" href="/about">
                About AIPEX <Arrow diagonal />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
