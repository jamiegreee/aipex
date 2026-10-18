import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import { charterSections } from "@/content/charter";

export const metadata: Metadata = {
  title: "Founding charter",
  description:
    "AIPEX’s founding charter: a proposed purpose and commitments to education, independent judgement and stewardship across generations.",
};

export default function Charter() {
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="page-intro">
          <div className="container">
            <p className="label">Our founding charter · Draft 0.1</p>
            <h1>
              A purpose for
              <br />
              <em>generations.</em>
            </h1>
            <p className="intro-description">
              The purpose and commitments we want future stewards of AIPEX to
              inherit, question and carry forward.
            </p>
          </div>
        </header>
        <article className="container prose-page charter-text" aria-label="Founding charter draft 0.1">
          <p className="charter-status">
            <strong>Draft 0.1 — prepared <time dateTime="2026-10-16">16 October 2026</time>.</strong>{" "}
            A proposed statement of purpose and institutional commitments, for
            discussion and revision. It has not been formally adopted and is
            separate from any future legal constitution.
          </p>
          {charterSections.map(({ id, title, paragraphs }, index) => (
            <section className="charter-section" key={id} aria-labelledby={id}>
              <h2 id={id}>{title}</h2>
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraph}>
                  {index === 0 && paragraphIndex === 0 ? <strong>{paragraph}</strong> : paragraph}
                </p>
              ))}
            </section>
          ))}
          <Link className="text-link" href="/about">
            About AIPEX <Arrow diagonal />
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
