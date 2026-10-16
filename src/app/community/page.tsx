import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow, ExchangeMark } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Join the exchange",
  description:
    "Help shape AIPEX's learning community. Share your interests, course feedback and ideas for building AI policy capacity.",
};

const interestEmail =
  "mailto:hello@theaipex.org?subject=" +
  encodeURIComponent("I'd like to join the AI Policy Exchange") +
  "&body=" +
  encodeURIComponent(
    "Hi Jamie,\n\nI'd like to be part of AIPEX's learning community.\n\nMy name:\nMy interest in AI policy:\nMy feedback or ideas:\n",
  );
const benefits = [
  {
    title: "Learn across disciplines",
    body: "Explore perspectives from government, technology, research, law and civil society.",
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
    question: "How can I get started?",
    answer:
      "Our free online courses are open now. Work through lessons at your own pace and create an account to save exercises and track your progress.",
  },
  {
    question: "Can I take part from anywhere?",
    answer:
      "Yes. The courses are online and self-paced. They use UK policy examples while developing skills that can be applied in other settings.",
  },
  {
    question: "Can I help develop AIPEX?",
    answer:
      "We'd welcome your ideas, course feedback or subject expertise. Tell us what you would find useful and how you might like to contribute.",
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
              Share your interests, exchange ideas and help shape a learning
              community for AI and public policy.
            </p>
          </div>
          <div className="join-panel">
            <ExchangeMark />
            <h2>
              Be part of
              <br />
              <em>what comes next.</em>
            </h2>
            <p>
              Send us a short email with your name, what brings you to AI policy
              and any feedback or ideas you would like to share.
            </p>
            <a className="button" href={interestEmail}>
              Register interest by email <Arrow diagonal />
            </a>
            <p className="email-alternative">
              Or write to{" "}
              <a href="mailto:hello@theaipex.org">hello@theaipex.org</a>
            </p>
            <p className="privacy-note">
              If you would like occasional AIPEX updates, ask when you email us.
              You can opt out at any time by replying.{" "}
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
