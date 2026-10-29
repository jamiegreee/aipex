import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { policyTools } from "@/content/policy-tools";
export const metadata = {
  title: "Tools for AI policy",
  description:
    "Free working aids to assess AI evidence, compare policy options and plan oversight. Structured prompts, worked examples, saved drafts and editable exports.",
};
export default function Tools() {
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="page-intro">
          <div className="container">
            <p className="label">AIPEX / The policy workbench</p>
            <h1>
              Make the question
              <br />
              <em>workable.</em>
            </h1>
            <p className="intro-description">
              Three working aids for policymakers and public institutions.
              Examine evidence, compare policy responses and plan oversight,
              leaving with a brief you can develop as the evidence changes.
            </p>
          </div>
        </header>
        <section
          className="container policy-tool-list"
          aria-label="Available policy tools"
        >
          {policyTools.map((t) => (
            <article className="policy-tool-row" key={t.slug}>
              <span className="policy-index">{t.number}</span>
              <div>
                <p className="label">{t.time} / Free to use</p>
                <h2>
                  <Link href={`/tools/${t.slug}`}>{t.title}</Link>
                </h2>
                <p>{t.description}</p>
                <p className="small-copy">
                  <strong>Take away:</strong> {t.output}.
                </p>
              </div>
              <Link className="text-link" href={`/tools/${t.slug}`}>
                Open workspace ↗
              </Link>
            </article>
          ))}
        </section>
        <section className="policy-band">
          <div className="container secondary-inner">
            <div>
              <p className="label">A place to begin</p>
              <h2>
                Start with a case.
                <br />
                <em>Build your judgement.</em>
              </h2>
            </div>
            <div>
              <p>
                Each tool includes an AIPEX worked analysis of a documented
                case, with unknowns left visible. Explore the original evidence,
                then carry the case into a fresh workspace.
              </p>
              <p>
                Work without signing in. Browser drafts, editable project files
                and account saving help you return to a question as the evidence
                develops.
              </p>
              <Link className="text-link" href="/cases">
                Explore the case library ↗
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
