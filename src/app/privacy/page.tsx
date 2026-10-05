import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How AIPEX handles information you share when contacting us about the community.",
};

export default function Privacy() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="page-intro">
          <div className="container">
            <p className="label">Last updated: 4 October 2026</p>
            <h1>
              Your information.
              <br />
              <em>Handled with care.</em>
            </h1>
          </div>
        </section>
        <section className="container prose-page">
          <h2>Contacting AIPEX</h2>
          <p>
            AIPEX is a founder-led community run by Jamie Green. When you email
            us, we receive your email address and the information you choose to
            include, such as your name, city and interest in AI policy.
          </p>
          <h2>How we use your information</h2>
          <p>
            We use your message to respond to your enquiry and organise
            community gatherings. If you ask to hear about future gatherings, we
            use your email address to send those updates. You can ask us to stop
            by replying to any email.
          </p>
          <h2>The website</h2>
          <p>
            This website does not use advertising or analytics cookies. Our
            hosting and email providers may process technical information needed
            to deliver the website and correspondence, such as IP addresses and
            email delivery records.
          </p>
          <h2>Access, correction and deletion</h2>
          <p>
            To ask about your information, correct it or request deletion, email{" "}
            <a href="mailto:hello@theaipex.org">hello@theaipex.org</a>. You can
            also <Link href="/contact">contact Jamie</Link> with any privacy
            questions.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
