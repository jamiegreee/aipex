import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Say hello",
  description:
    "Get in touch with AIPEX about our courses, learning accounts or ideas for improving practical AI policy education.",
};

export default function Contact() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="page-intro">
          <div className="container">
            <p className="label">Get in touch</p>
            <h1>
              It starts with
              <br />
              <em>a hello.</em>
            </h1>
            <p className="intro-description">
              A question, course feedback or an idea for AIPEX—we&apos;d like to
              hear from you.
            </p>
          </div>
        </section>
        <section className="container contact-grid">
          <div>
            <h2>Let&apos;s talk.</h2>
            <p>
              Write to Jamie with course feedback, questions about your learning
              account or an offer to contribute subject expertise.
            </p>
            <a className="contact-email" href="mailto:hello@theaipex.org">
              hello@theaipex.org <Arrow diagonal />
            </a>
          </div>
          <div className="contact-aside">
            <h2>Ready to learn?</h2>
            <p>
              Explore two free, self-paced courses. Read the lessons online and
              create an account to save your exercises and track your progress.
            </p>
            <Link className="text-link" href="/courses">
              Explore the courses <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
