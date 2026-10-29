import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SourceList from "@/components/policy/SourceList";
import ToolWorkspace from "@/components/policy/ToolWorkspace";
import { findTool, policyTools } from "@/content/policy-tools";
import { findCase } from "@/content/policy-cases";
type Props = {
  params: Promise<{ tool: string }>;
  searchParams: Promise<{ case?: string }>;
};
export function generateStaticParams() {
  return policyTools.map((t) => ({ tool: t.slug }));
}
export async function generateMetadata({ params }: Props) {
  const t = findTool((await params).tool);
  return {
    title: t?.title ?? "Policy tool",
    description: t?.description,
    alternates: { canonical: `/tools/${t?.slug ?? ""}` },
  };
}
export default async function ToolPage({ params, searchParams }: Props) {
  const tool = findTool((await params).tool);
  if (!tool) notFound();
  const candidate = findCase((await searchParams).case ?? "");
  const initialCase = candidate?.tool === tool.slug ? candidate : undefined;
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="container policy-detail-intro">
          <Link className="breadcrumb" href="/tools">
            ← All tools
          </Link>
          <p className="label">
            Tool {tool.number} / {tool.time}
          </p>
          <h1>
            {tool.title}
            <em>.</em>
          </h1>
          <p>{tool.description}</p>
          <p className="small-copy">
            <strong>Your output:</strong> {tool.output}.
          </p>
          <details className="tool-scope">
            <summary>When to use this tool</summary>
            <p>{tool.scope}</p>
          </details>
          {initialCase && (
            <p className="case-context-note">
              Case entry:{" "}
              <Link href={`/cases/${initialCase.slug}`}>
                {initialCase.title}
              </Link>
              . Returning to this case reopens its browser draft. If you switch
              drafts below, the draft source note identifies the work currently
              open.
            </p>
          )}
        </header>
        <ToolWorkspace
          key={`${tool.slug}:${initialCase?.slug ?? "blank"}`}
          tool={tool}
          initialCase={initialCase}
        />
        <div className="container policy-reading">
          <SourceList ids={tool.sources} />
          <section className="policy-next">
            <h2>Go further.</h2>
            <p>
              Examine a documented decision and try applying this tool to
              another case.
            </p>
            <div className="workspace-actions">
              <Link className="text-link" href="/cases">
                Case library ↗
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
