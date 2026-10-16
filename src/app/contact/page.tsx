import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Say hello",
  description:
    "Get in touch with AIPEX about our courses, learning community or ideas for building AI policy capacity.",
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
              Write to Jamie about our courses, joining the learning community
              or contributing your expertise.
            </p>
            <a className="contact-email" href="mailto:hello@theaipex.org">
              hello@theaipex.org <Arrow diagonal />
            </a>
          </div>
          <div className="contact-aside">
            <h2>Want to join?</h2>
            <p>
              Tell us your name, what brings you to AI policy and what you would
              find useful as part of the learning community.
            </p>
            <Link className="text-link" href="/community">
              Join the exchange <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
