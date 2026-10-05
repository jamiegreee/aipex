import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import ConversationArt from "@/components/ConversationArt";
import LondonPoster from "@/components/LondonPoster";
import JoinCallout from "@/components/JoinCallout";

const questions = [
  {
    title: "Work & the economy",
    question: "Who benefits from the AI transition?",
  },
  {
    title: "Government & public services",
    question: "What does an AI-ready state look like?",
  },
  { title: "Power & accountability", question: "Who gets to shape the rules?" },
  {
    title: "Security & global cooperation",
    question: "How do we respond together?",
  },
];

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="hero container" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="label hero-label">
              <span className="status-dot" /> A new community for AI & public
              policy
            </p>
            <h1 id="hero-heading">
              Big questions.
              <br />
              <em>
                Better
                <br className="hero-break" /> conversations.
              </em>
            </h1>
            <p className="hero-description">
              Bringing the policy community together to understand the changing
              AI landscape and shape how we respond.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/community">
                Join the exchange <Arrow />
              </Link>
              <Link className="text-link" href="/gatherings">
                Our first gathering <Arrow diagonal />
              </Link>
            </div>
            <p className="hero-footnote">
              <span className="location-cross" aria-hidden="true">
                ⌖
              </span>{" "}
              Starting in London. Open to different perspectives.
            </p>
          </div>
          <div className="hero-art">
            <ConversationArt />
          </div>
        </section>
        <section className="mission-section" aria-labelledby="mission-heading">
          <div className="container mission-inner">
            <p className="label">01 / Why we gather</p>
            <div>
              <h2 id="mission-heading">
                AI is changing the world.
                <br />
                Let&apos;s make sense of it <em>together.</em>
              </h2>
              <div className="mission-copy">
                <p>
                  The questions AI raises reach across government, work,
                  security and everyday life. Understanding them takes different
                  kinds of experience.
                </p>
                <p>
                  AIPEX brings people working in—and interested in—public policy
                  into the same room. A place to exchange ideas, meet new people
                  and work out what comes next.
                </p>
              </div>
              <Link className="text-link" href="/about">
                Meet the exchange <Arrow diagonal />
              </Link>
            </div>
          </div>
        </section>
        <section
          className="gathering-section container"
          aria-labelledby="gathering-heading"
        >
          <div className="section-heading">
            <p className="label">02 / In good company</p>
            <Link className="text-link" href="/gatherings">
              Explore gatherings <Arrow diagonal />
            </Link>
          </div>
          <div className="gathering-feature">
            <LondonPoster />
            <div className="gathering-copy">
              <span className="pill">
                <span className="status-dot" /> Our first gathering · In the
                making
              </span>
              <h2 id="gathering-heading">
                A big topic.
                <br />
                <em>An informal evening.</em>
              </h2>
              <p>
                Meet people thinking about AI and public policy over a drink and
                a good conversation. Bring your questions, your experience and
                your curiosity.
              </p>
              <dl className="event-facts">
                <div>
                  <dt>Where</dt>
                  <dd>London</dd>
                </div>
                <div>
                  <dt>When</dt>
                  <dd>Date & venue to be announced</dd>
                </div>
                <div>
                  <dt>Who</dt>
                  <dd>Policy people & curious minds</dd>
                </div>
              </dl>
              <Link className="button" href="/community">
                Be part of the first one <Arrow />
              </Link>
            </div>
          </div>
        </section>
        <section
          className="questions-section"
          aria-labelledby="questions-heading"
        >
          <div className="container">
            <div className="section-heading">
              <p className="label">03 / Plenty to talk about</p>
              <span className="label questions-aside">
                A few conversation starters
              </span>
            </div>
            <h2 id="questions-heading">
              Different angles.
              <br />
              <em>Shared questions.</em>
            </h2>
            <div className="question-grid">
              {questions.map(({ title, question }, i) => (
                <div className="question-item" key={title}>
                  <span className="label question-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{question}</p>
                </div>
              ))}
            </div>
            <p className="questions-note">
              You don&apos;t need to have all the answers. That&apos;s why
              we&apos;re getting together.
            </p>
          </div>
        </section>
        <JoinCallout />
      </main>
      <Footer />
    </>
  );
}
