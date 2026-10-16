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
            <p className="label">Last updated: 16 October 2026</p>
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
            We use your message to respond to your enquiry and develop our
            courses and community. If you ask to hear about AIPEX updates, we
            use your email address to send those updates. You can ask us to stop
            by replying to any email.
          </p>
          <h2>The website</h2>
          <h3>Learning accounts and course work</h3>
          <p>
            When you create a learning account, we store your email address,
            optional name, enrolments, lesson progress, knowledge-check
            responses and the written exercises you choose to save. We use these
            to provide your account, let you resume courses and export your
            portfolio. Written work is private to your account in the learning
            interface. AIPEX’s operator and infrastructure providers may access
            data when necessary to administer the service or resolve a support
            issue.
          </p>
          <p>
            Neon provides authentication and database storage; Vercel hosts
            the application and Resend sends account emails. Account cookies maintain your sign-in session.
            These are necessary for account features. We do not use saved course
            work to train an AI model, and course exercises are not submitted to
            an AI service for grading. Please do not enter confidential material
            or personal information about other people in exercises.
          </p>
          <p>
            We keep your learning record while your account remains active. You
            can download your written work from My learning and request account
            and learning-data deletion using the contact details below. Deleted
            records may remain in infrastructure backups until those backups
            expire.
          </p>
          <p>
            Our hosting and email providers may process technical information needed
            to deliver the website and correspondence, such as IP addresses and
            email delivery records.
          </p>
          <h3>Optional website analytics</h3>
          <p>
            If you choose “Allow analytics”, Google Analytics measures visits to
            public AIPEX pages, including course reading pages. It receives page
            addresses and titles, a shortened referring address, device and browser
            information, and approximate location derived from your IP address.
            Analytics cookies help distinguish visits. We do not send your name,
            email address, saved answers or learning record to Google Analytics.
            Account, sign-in and password-reset pages are excluded, and we remove
            query strings and fragments from the page addresses we send.
          </p>
          <p>
            Analytics stays off until you opt in. You can reject it and still use
            the whole site, or change your choice through “Cookie preferences” at
            the bottom of any page. We remember your choice for six months;
            withdrawing consent stops collection and removes the analytics
            cookies from this browser. It does not remove data already collected.
            We keep advertising consent disabled. Google may process analytics
            data outside the UK; see its{" "}
            <a href="https://policies.google.com/privacy">privacy policy</a>.
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
