import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import GapChart from "../GapChart";
import PreviewSwitcher from "../PreviewSwitcher";
import "../../home.css";
import "./a.css";

export const metadata: Metadata = { title: "Homepage preview A" };

// Alternative A: a conservative refinement. Same structure and visual
// language as the live page, with sharper copy, honest expectations about
// the application, and the "who" and "how" answered on the page.
export default function HomeA() {
  return (
    <div className="cb pa">
      <Navigation cta={{ href: "/membership", label: "Apply to join" }} />
      <main id="main">
        <section className="container cb-hero" aria-labelledby="pa-h1">
          <div>
            <h1 id="pa-h1">
              The community for people <em>making AI policy.</em>
            </h1>
            <p className="cb-lede">
              AIPEX brings together the public servants, regulators and advisers
              working on AI. Compare notes with peers, share what&rsquo;s working
              and ask the questions you&rsquo;re wrestling with, in a private
              Slack community.
            </p>
            <div className="cb-actions">
              <Link className="button" href="/membership">
                Apply to join <Arrow />
              </Link>
              <a className="cb-link" href="#how">
                How it works
              </a>
            </div>
            <ul className="pa-facts" aria-label="Membership at a glance">
              <li>By application</li>
              <li>First 50 founding members</li>
              <li>Personal capacity</li>
            </ul>
          </div>
          <figure className="cb-chart">
            <GapChart prefix="cb" />
            <figcaption className="pa-caption label">Illustrative, not to scale</figcaption>
          </figure>
        </section>

        <section className="pa-who" aria-labelledby="pa-who-h">
          <div className="container">
            <p className="label">Who it&rsquo;s for</p>
            <h2 id="pa-who-h">People shaping public decisions on AI.</h2>
            <ul className="pa-who-grid">
              <li>
                <span className="pa-num">01</span>
                <h3>Government</h3>
                <p>Officials and advisers in departments, ministries and the centre of government.</p>
              </li>
              <li>
                <span className="pa-num">02</span>
                <h3>Regulators and parliaments</h3>
                <p>Staff at regulators, legislatures and their committees, scrutinising and overseeing AI.</p>
              </li>
              <li>
                <span className="pa-num">03</span>
                <h3>International institutions</h3>
                <p>People at multilateral bodies, and those whose work directly supports public policy.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="cb-mission" aria-labelledby="cb-mission-h">
          <div className="container">
            <p className="label">Why a community</p>
            <h2 id="cb-mission-h">
              Capacity is built by people, <em>not papers.</em>
            </h2>
            <p>
              Preparing for advanced AI means looking beyond individual
              deployments to the changes more capable systems could bring. No
              single department will work this out alone. AIPEX brings together
              the people who will have to, so they can compare notes,
              pressure-test their judgement and build the institutions needed to
              act.
            </p>
          </div>
        </section>

        <section className="pa-how" id="how" aria-labelledby="pa-how-h">
          <div className="container">
            <div className="pa-how-head">
              <p className="label">How it works</p>
              <h2 id="pa-how-h">Three steps to the exchange.</h2>
            </div>
            <ol className="pa-steps">
              <li>
                <span className="pa-num">1</span>
                <h3>Apply</h3>
                <p>Verify your email and tell us about your work and interests. It takes a few minutes.</p>
              </li>
              <li>
                <span className="pa-num">2</span>
                <h3>We review</h3>
                <p>Every application is read individually. Your application stays private.</p>
              </li>
              <li>
                <span className="pa-num">3</span>
                <h3>Join on Slack</h3>
                <p>Check your decision in My account, then join the conversation with your peers.</p>
              </li>
            </ol>
            <div className="pa-how-cta">
              <Link className="button" href="/membership">
                Apply for founding membership <Arrow />
              </Link>
              <p>Membership is in a personal capacity and does not imply endorsement by your employer.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer tagline="Worked out together." />
      <PreviewSwitcher current="/preview/home-a" />
    </div>
  );
}
