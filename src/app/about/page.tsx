import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JoinCallout from "@/components/JoinCallout";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "About the exchange",
  description:
    "AIPEX exists to help governments and policymakers prepare for advanced artificial intelligence and respond to its effects on public institutions, the economy and society.",
};

const principles = [
  {
    title: "Understanding comes first.",
    body: "Examine the evidence, make uncertainty visible and take competing arguments seriously. Change our views when the evidence warrants it.",
  },
  {
    title: "Independent judgement.",
    body: "Build the freedom to ask difficult questions and reach conclusions that funders, partners or leaders may find inconvenient. Earn trust through the quality of the work.",
  },
  {
    title: "Practice matters.",
    body: "Connect learning with the decisions people and institutions face. Judge our contribution by what people become able to do and whether the work helps.",
  },
];

export default function About() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="page-intro">
          <div className="container">
            <p className="label">About the AI Policy Exchange</p>
            <h1>
              An enduring purpose.
              <br />
              <em>A practical beginning.</em>
            </h1>
            <p className="intro-description">
              AIPEX exists to help governments and policymakers understand,
              plan for and respond to the effects of advanced artificial
              intelligence.
            </p>
          </div>
        </section>
        <section className="container about-story">
          <div>
            <p className="label">The long view</p>
            <h2>
              Built to serve
              <br />
              <em>generations.</em>
            </h2>
          </div>
          <div>
            <p>
              We want AIPEX to endure for a thousand years and more: an
              institution that remains useful as technology, societies and the
              questions before them change. That is a long-term ambition, with
              the work of building it still ahead of us.
            </p>
            <p>
              Our focus is on what increasingly capable AI could mean for
              public institutions, the economy and society, and the choices
              governments need to prepare for. We want to strengthen the
              judgement and institutional capacity needed to make those choices
              as the evidence changes.
            </p>
            <p>
              Its reputation should grow from independent judgement and useful
              work. As capacity develops, research, practical policy projects
              and public resources should inform one another, each held to
              standards that others can examine and challenge.
            </p>
            <p>
              An enduring institution must be able to continue beyond any one
              leader or generation. Our founding charter sets out proposed
              commitments to access, intellectual independence, responsible
              stewardship and a lasting record of what we learn.
            </p>
            <Link className="text-link" href="/charter">
              Read the founding charter <Arrow diagonal />
            </Link>
          </div>
        </section>
        <section
          className="principles"
          aria-label="How we approach the exchange"
        >
          <div className="container principles-inner">
            {principles.map(({ title, body }, i) => (
              <div className="principle" key={title}>
                <span className="label">0{i + 1} / Our approach</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="secondary-section" aria-labelledby="beginning-heading">
          <div className="container secondary-inner">
            <div>
              <p className="label">Where we begin</p>
              <h2 id="beginning-heading">A foundation for<br /><em>public decisions.</em></h2>
            </div>
            <div>
              <p>
                Today, AIPEX offers practical tools and a library of documented
                cases for policymakers and people working in public institutions.
                They help people examine evidence, compare options and plan
                oversight, with primary sources and worked analyses.
              </p>
              <p>
                Our first task is to find out how well these resources help people do
                policy work: invite independent scrutiny, learn from participants
                and improve. The standards we establish now should be worthy of
                the institution we hope others will inherit.
              </p>
            </div>
          </div>
        </section>
        <JoinCallout />
      </main>
      <Footer />
    </>
  );
}
