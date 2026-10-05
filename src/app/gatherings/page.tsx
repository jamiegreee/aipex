import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LondonPoster from "@/components/LondonPoster";
import JoinCallout from "@/components/JoinCallout";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Gatherings",
  description:
    "Informal gatherings for people interested in AI and public policy. Our first London social is being planned.",
};

export default function Gatherings() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="page-intro">
          <div className="container">
            <p className="label">The conversation starts in person</p>
            <h1>
              Good company.
              <br />
              <em>Big questions.</em>
            </h1>
            <p className="intro-description">
              Informal evenings for people thinking about AI and public policy.
              A chance to exchange perspectives and get to know one another.
            </p>
          </div>
        </section>
        <section
          className="container detail-section gathering-detail"
          aria-labelledby="social-heading"
        >
          <LondonPoster />
          <div className="gathering-copy detail-content">
            <span className="pill">
              <span className="status-dot" /> First gathering · Being planned
            </span>
            <h2 id="social-heading">
              AI Policy Social
              <br />
              <em>London, № 001</em>
            </h2>
            <p>
              We&apos;re bringing the first group together in London. Expect a
              relaxed evening, introductions to people across the policy
              community and plenty of space for conversation.
            </p>
            <dl className="event-facts">
              <div>
                <dt>Location</dt>
                <dd>London · Venue to be announced</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>To be announced</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Informal conversation & introductions</dd>
              </div>
            </dl>
            <Link className="button" href="/community">
              Register your interest <Arrow />
            </Link>
            <h3>Come as you are</h3>
            <p>
              Whether you work on AI policy every day or are finding your way
              into the field, you&apos;re welcome. Bring a question or something
              you&apos;ve been thinking about.
            </p>
          </div>
        </section>
        <section className="secondary-section">
          <div className="container secondary-inner">
            <div>
              <p className="label">A community taking shape</p>
              <h2>
                London first.
                <br />
                <em>Then, let&apos;s see.</em>
              </h2>
            </div>
            <div>
              <p>
                We&apos;re starting with a small group and a simple idea: make
                it easier for people interested in AI policy to meet regularly.
              </p>
              <p>
                As the community grows, we&apos;d love to bring the exchange to
                other cities. If you&apos;d like to help host a future
                gathering, tell us where you are and what you have in mind.
              </p>
              <Link className="text-link" href="/contact">
                Help bring people together <Arrow diagonal />
              </Link>
            </div>
          </div>
        </section>
        <JoinCallout />
      </main>
      <Footer />
    </>
  );
}
