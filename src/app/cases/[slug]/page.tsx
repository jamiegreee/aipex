import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SourceList from "@/components/policy/SourceList";
import { policyCases, findCase } from "@/content/policy-cases";
import { findTool } from "@/content/policy-tools";
import { policySources } from "@/content/policy-sources";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return policyCases.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: Props) {
  const c = findCase((await params).slug);
  return { title: c?.title ?? "Case not found", description: c?.summary };
}
export default async function CasePage({ params }: Props) {
  const c = findCase((await params).slug);
  if (!c) notFound();
  const tool = findTool(c.tool)!;
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="container policy-detail-intro">
          <Link className="breadcrumb" href="/cases">
            ← Case library
          </Link>
          <p className="label">
            {c.kind} / {c.minutes} min / {c.topic}
          </p>
          <h1>
            {c.title}
            <em>.</em>
          </h1>
          <p>{c.summary}</p>
          <p className="small-copy">
            {c.jurisdiction} · {c.period}
          </p>
        </header>
        <div className="container case-detail-grid">
          <aside className="case-decision">
            <p className="label">The decision in front of you</p>
            <h2>
              What would
              <br />
              <em>you do?</em>
            </h2>
            <p>{c.question}</p>
            <Link className="button" href={`/tools/${c.tool}?case=${c.slug}`}>
              Work through this case →
            </Link>
            <p className="small-copy">
              Opens {tool.shortTitle.toLowerCase()} with the case facts ready to
              assess. No account required.
            </p>
          </aside>
          <article className="case-reading">
            <h2>The setting</h2>
            <p>{c.context}</p>
            <h2>The evidence to examine</h2>
            {c.evidence.map((e) => (
              <section className="case-evidence" key={e.title}>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                {e.source && (
                  <a className="small-copy" href={`#source-${e.source}`}>
                    Source: {policySources[e.source].publisher},{" "}
                    {policySources[e.source].title} ↓
                  </a>
                )}
              </section>
            ))}
            <div className="case-limits">
              <h3>What this does not establish</h3>
              <p>{c.limits}</p>
            </div>
            <section className="case-task">
              <p className="label">Try the decision first</p>
              <h2>Your task.</h2>
              <p>{c.question}</p>
              <Link
                className="text-link"
                href={`/tools/${c.tool}?case=${c.slug}`}
              >
                Start a working draft ↗
              </Link>
            </section>
            <details className="worked-approach">
              <summary>Read one defensible approach</summary>
              <p className="small-copy">
                AIPEX analysis for discussion. Other conclusions can be
                defensible if their evidence, assumptions and trade-offs are
                explicit.
              </p>
              <ol>
                {c.approach.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </details>
            <SourceList ids={c.sources} />
          </article>
        </div>
        <section className="container policy-next">
          <p className="label">Keep examining</p>
          <h2>Another angle.</h2>
          <div className="case-grid">
            {policyCases
              .filter(
                (x) =>
                  x.slug !== c.slug && (x.tool === c.tool || x.kind !== c.kind),
              )
              .sort(
                (a, b) => Number(b.tool === c.tool) - Number(a.tool === c.tool),
              )
              .slice(0, 2)
              .map((x) => (
                <article className="case-card" key={x.slug}>
                  <p className="label">{x.kind}</p>
                  <h3>
                    <Link href={`/cases/${x.slug}`}>{x.title}</Link>
                  </h3>
                  <p>{x.summary}</p>
                </article>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
