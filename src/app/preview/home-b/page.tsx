import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import GapChart from "../GapChart";
import PreviewSwitcher from "../PreviewSwitcher";
import "./b.css";

export const metadata: Metadata = { title: "Homepage preview B" };

const roles = [
  "Ministry officials",
  "Regulators",
  "Parliamentary staff",
  "Centre-of-government advisers",
  "Diplomats",
  "Multilateral institutions",
  "Policy advisers",
  "Public-sector technologists",
];

const inside = [
  {
    title: "Compare notes",
    body: "See how peers in other departments and countries are approaching the same problem before you commit to an approach.",
    example: "How are other regulators resourcing their AI teams?",
  },
  {
    title: "Pressure-test your judgement",
    body: "Put a draft position in front of people who understand the constraints of public office, in confidence.",
    example: "Does this definition of ‘frontier model’ survive contact with reality?",
  },
  {
    title: "Build capacity together",
    body: "Shape the questions the community examines next, and help build the institutions governments will need.",
    example: "What would an early-warning function for AI risks actually need?",
  },
];

// Alternative B: a bolder rework. Leads with the thesis (the gap) rather
// than the category, makes the founding 50 a visible device, and shows
// what membership is for with illustrative questions.
export default function HomeB() {
  return (
    <div className="pb">
      <Navigation cta={{ href: "/membership", label: "Apply to join" }} />
      <main id="main">
        <section className="pb-hero" aria-labelledby="pb-h1">
          <div className="container pb-hero-inner">
            <p className="label">AI Policy Exchange</p>
            <h1 id="pb-h1">
              AI is moving faster than government.
              <em> Let&rsquo;s close the gap.</em>
            </h1>
            <div className="pb-hero-foot">
              <p>
                AIPEX is a private community for the public servants, regulators
                and advisers preparing governments for advanced AI. Founding
                membership is open to our first 50 members.
              </p>
              <Link className="button pb-button-light" href="/membership">
                Apply for founding membership <Arrow />
              </Link>
            </div>
          </div>
          <div className="pb-chart" aria-hidden="false">
            <GapChart prefix="pb" />
          </div>
        </section>

        <section className="pb-inside" aria-labelledby="pb-inside-h">
          <div className="container">
            <div className="pb-head">
              <p className="label">Inside the exchange</p>
              <h2 id="pb-inside-h">
                A room of peers, <em>not another newsletter.</em>
              </h2>
            </div>
            <ul className="pb-cards">
              {inside.map((c, i) => (
                <li key={c.title}>
                  <span className="pb-num">0{i + 1}</span>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <blockquote>
                    <span className="label">For example</span>
                    {c.example}
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-who" aria-labelledby="pb-who-h">
          <div className="container">
            <p className="label">Who&rsquo;s in the room</p>
            <h2 id="pb-who-h" className="pb-visually-hidden">Who it&rsquo;s for</h2>
            <p className="pb-roles">
              {roles.map((r, i) => (
                <span key={r}>
                  {r}
                  {i < roles.length - 1 && <i aria-hidden="true"> / </i>}
                </span>
              ))}
            </p>
            <p className="pb-who-note">
              For people shaping public decisions in government, parliaments,
              regulators and international institutions, and those whose work
              directly supports them. Members join in a personal capacity.
            </p>
          </div>
        </section>

        <section className="pb-fifty" aria-labelledby="pb-fifty-h">
          <div className="container pb-fifty-inner">
            <div>
              <p className="label">Founding membership</p>
              <h2 id="pb-fifty-h">
                50 founding places. <em>Each one reviewed.</em>
              </h2>
              <p>
                We&rsquo;re starting small on purpose. Every application is read
                individually, so the people in the room can speak openly and
                trust who they&rsquo;re talking to.
              </p>
              <Link className="button" href="/membership">
                Apply to join <Arrow />
              </Link>
            </div>
            <div className="pb-seats" role="img" aria-label="An illustration of 50 founding places">
              {Array.from({ length: 50 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-faq" aria-labelledby="pb-faq-h">
          <div className="container pb-faq-inner">
            <h2 id="pb-faq-h">Good questions</h2>
            <div>
              <details open>
                <summary>What actually is AIPEX?</summary>
                <p>A private, online community on Slack for people working on AI policy in and around government. It&rsquo;s where members compare notes, share what&rsquo;s working and ask the questions they&rsquo;re wrestling with.</p>
              </details>
              <details>
                <summary>Who can apply?</summary>
                <p>People with current policymaking responsibilities or substantive experience supporting public policy, who take a serious interest in how advanced AI could affect public institutions, the economy and society.</p>
              </details>
              <details>
                <summary>Does joining speak for my employer?</summary>
                <p>No. Membership is in a personal capacity and does not imply endorsement by your employer. Please leave confidential work information out of your application.</p>
              </details>
              <details>
                <summary>What happens after I apply?</summary>
                <p>We review your application, and you can check your decision in My account. Applications are private.</p>
              </details>
            </div>
          </div>
        </section>
      </main>
      <Footer tagline="Worked out together." />
      <PreviewSwitcher current="/preview/home-b" />
    </div>
  );
}
