import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import JoinCallout from "@/components/JoinCallout";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "About the exchange",
  description:
    "AIPEX builds capacity to understand, develop and deliver effective AI policy through practical education and community.",
};

const principles = [
  {
    title: "Curiosity comes first.",
    body: "You can arrive with questions, a different perspective or a willingness to listen. We learn by making room for each other.",
  },
  {
    title: "Different views belong.",
    body: "AI policy involves real disagreements. We welcome thoughtful discussion across disciplines, backgrounds and points of view.",
  },
  {
    title: "Relationships matter.",
    body: "Good conversations take trust. We want to build a community where people get to know one another and keep showing up.",
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
              takes <em>all of us.</em>
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
              We want to bring those perspectives together. AIPEX is a new
              community for people working in—and interested in—public policy.
            </p>
            <p>
              Our self-paced courses turn the debate into practical policy work:
              judging evidence, comparing interventions and governing
              public-service deployments. Alongside education, informal
              gatherings in London help people exchange ideas and build
              relationships.
            </p>
            <p>Founded by Jamie Green.</p>
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
