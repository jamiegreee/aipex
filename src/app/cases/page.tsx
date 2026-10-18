import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CaseBrowser from "@/components/policy/CaseBrowser";
import { policyCases } from "@/content/policy-cases";
export const metadata = {
  title: "AI policy case library",
  description:
    "Examine documented AI and automated-decision policy cases. Source-backed evidence, decision questions and worked approaches, connected to practical AI policy tools.",
};
export default function Cases() {
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="page-intro">
          <div className="container">
            <p className="label">AIPEX / The case library</p>
            <h1>
              Evidence meets
              <br />
              <em>the real decision.</em>
            </h1>
            <p className="intro-description">
              Look closely at a decision. Examine what was known, what remained
              uncertain and what a responsible next step could look like.
            </p>
          </div>
        </header>
        <section
          className="container case-catalog"
          aria-label="Search the case library"
        >
          <div className="case-method">
            <p>
              <strong>Documented cases</strong> draw on dated primary accounts,
              with reported facts separated from AIPEX analysis. Each connects
              to a working tool. This is a small, UK-focused collection, not a
              map of the whole field; the 2020 grading case concerns statistical
              standardisation rather than generative AI.
            </p>
          </div>
          <CaseBrowser cases={policyCases} />
        </section>
      </main>
      <Footer />
    </>
  );
}
