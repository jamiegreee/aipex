import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow, ExchangeMark } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Join the exchange",
  description:
    "Be part of a new community for AI and public policy. Express interest in our first London gathering or help bring AIPEX to your city.",
};

const interestEmail =
  "mailto:hello@theaipex.org?subject=" +
  encodeURIComponent("I'd like to join the AI Policy Exchange") +
  "&body=" +
  encodeURIComponent(
    "Hi Jamie,\n\nI'd like to hear about AIPEX gatherings.\n\nMy name:\nMy city:\nMy interest in AI policy:\n\nPlease email me about upcoming AIPEX gatherings.\n",
  );
const benefits = [
  {
    title: "Meet people across policy",
    body: "Exchange perspectives with people from government, technology, research, law and civil society.",
  },
  {
    title: "Explore the questions together",
    body: "Bring what you know and what you're wondering about. There's room for different levels of experience.",
  },
  {
    title: "Help shape the community",
    body: "We're at the beginning. Your ideas and participation will help decide where the exchange goes next.",
  },
];
const questions = [
  {
    question: "Do I need to work in AI policy?",
    answer:
      "No. You might work in another area of policy, build technology, study the field or simply want to understand it better. An interest in AI and public policy is enough.",
  },
  {
    question: "When is the first gathering?",
    answer:
      "We're planning our first London social. The date and venue are still to be confirmed. Email us to express interest and we'll share the details when they're ready.",
  },
  {
    question: "Can I join from outside London?",
    answer:
      "Yes. Tell us your city when you get in touch. We're starting in London and would love to hear from people interested in future gatherings elsewhere.",
  },
  {
    question: "Can I help organise or host?",
    answer:
      "We'd welcome a conversation. If you can help bring people together, suggest a venue or host a future gathering, tell us what you have in mind.",
  },
];

export default function Community() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="container join-page">
          <div>
            <p className="label">
              <span className="status-dot" /> A new community, taking shape
            </p>
            <h1>
              Bring your
              <br />
              <em>perspective.</em>
            </h1>
            <p className="join-page-description">
              Meet people interested in AI and public policy. Exchange ideas,
              build relationships and help shape the conversation.
            </p>
          </div>
          <div className="join-panel">
            <ExchangeMark />
            <h2>
              Be part of
              <br />
              <em>the first conversation.</em>
            </h2>
            <p>
              We&apos;re planning our first London gathering. Send us a short
              email with your name, city and what brings you to AI policy.
            </p>
            <a className="button" href={interestEmail}>
              Register interest by email <Arrow diagonal />
            </a>
            <p className="email-alternative">
              Or write to{" "}
              <a href="mailto:hello@theaipex.org">hello@theaipex.org</a>
            </p>
            <p className="privacy-note">
              Ask to hear about future gatherings when you email us. You can opt
              out at any time by replying.{" "}
              <Link href="/privacy">Privacy information</Link>.
            </p>
          </div>
        </section>
        <section
          className="container join-benefits"
          aria-label="Being part of AIPEX"
        >
          {benefits.map(({ title, body }, i) => (
            <div key={title}>
              <span className="label">0{i + 1}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </section>
        <section className="faq-section">
          <div className="container faq-inner">
            <h2>
              A few things
              <br />
              <em>you might wonder.</em>
            </h2>
            <div className="faq-list">
              {questions.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
