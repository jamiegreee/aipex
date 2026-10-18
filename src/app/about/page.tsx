import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JoinCallout from "@/components/JoinCallout";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "About the exchange",
  description:
    "AIPEX is building an enduring institution for AI policy education, understanding and public judgement. We begin with free, practical online courses.",
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
              AIPEX exists to advance understanding and public judgement about
              artificial intelligence, and to develop the people and institutions
              responsible for governing it.
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
              Its reputation should grow from careful teaching, independent
              judgement and work that helps people make better decisions. As
              capacity develops, education could sit alongside research,
              practical policy projects and public resources, each held to
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
              <h2 id="beginning-heading">Learning through<br /><em>policy work.</em></h2>
            </div>
            <div>
              <p>
                Today, AIPEX offers two free, self-paced online courses for
                people working in, or interested in, public policy. They cover
                practical policy development and the governance of AI in public
                services, combining sourced teaching, fictional cases, written
                exercises and worked examples.
              </p>
              <p>
                Our first task is to find out how well they help people do
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
