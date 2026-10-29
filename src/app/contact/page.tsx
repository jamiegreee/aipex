import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Say hello",
  description:
    "Get in touch with AIPEX about our policy tools, case library, accounts or ideas for building AI policy capacity.",
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
              A question, feedback on our resources or an idea for AIPEX—we&apos;d like to
              hear from you.
            </p>
          </div>
        </section>
        <section className="container contact-grid">
          <div>
            <h2>Let&apos;s talk.</h2>
            <p>
              Write to Jamie with feedback on our resources, questions about your
              account or an offer to contribute subject expertise.
            </p>
            <a className="contact-email" href="mailto:hello@theaipex.org">
              hello@theaipex.org <Arrow diagonal />
            </a>
          </div>
          <div className="contact-aside">
            <h2>A decision on your desk?</h2>
            <p>
              Use our practical tools to assess evidence, compare policy options
              or plan oversight. Start without an account and export your work.
            </p>
            <Link className="text-link" href="/tools">
              Explore the tools <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
