import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JoinCallout from "@/components/JoinCallout";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "About the exchange",
  description:
    "AIPEX builds capacity to understand, develop and deliver effective AI policy through free, practical online courses.",
};

const principles = [
  {
    title: "Curiosity comes first.",
    body: "Start with questions and explore the evidence. You do not need to have every answer before you begin.",
  },
  {
    title: "Different views belong.",
    body: "AI policy involves real disagreements. Examine competing arguments and draw on evidence from different disciplines and points of view.",
  },
  {
    title: "Practice matters.",
    body: "Turn understanding into decisions. Work through cases, compare your reasoning with worked examples and build a portfolio of policy work.",
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
              A changing landscape.
              <br />
              <em>The capacity to respond.</em>
            </h1>
            <p className="intro-description">
              AIPEX helps build capacity to understand, develop and deliver
              effective AI policy.
            </p>
          </div>
        </section>
        <section className="container about-story">
          <div>
            <p className="label">A simple starting point</p>
            <h2>
              Understanding AI
              <br />
              takes <em>practice.</em>
            </h2>
          </div>
          <div>
            <p>
              AI is raising questions about how we work, how government operates
              and how power is distributed. Making sense of those questions
              takes technical knowledge, institutional experience and an
              understanding of people&apos;s lives.
            </p>
            <p>
              AIPEX develops practical online courses for people working
              in—and interested in—public policy. Learn at your own pace,
              wherever you are.
            </p>
            <p>
              Our self-paced courses turn the debate into practical policy work:
              judging evidence, comparing interventions and governing
              public-service deployments. Each course combines sourced teaching,
              fictional cases, written exercises and worked examples to help you
              apply what you learn.
            </p>
            <Link className="text-link" href="/courses">
              Explore the courses <Arrow diagonal />
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
        <JoinCallout />
      </main>
      <Footer />
    </>
  );
}
