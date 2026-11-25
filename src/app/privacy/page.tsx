import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How AIPEX handles information you share when using our policy tools, creating an account or contacting us.",
};

export default function Privacy() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="page-intro">
          <div className="container">
            <p className="label">Last updated 25 November 2026</p>
            <h1>Privacy policy</h1>
          </div>
        </section>
        <section className="container prose-page">
          <h2>How we use your information</h2>
          <p>
            When you use our contact form, we send your name, email address and
            message to our inbox so we can reply. We use your message to respond to your enquiry and develop our
            resources. If you ask to hear about AIPEX updates, we
            use your email address to send those updates. You can ask us to stop
            by replying to any email.
          </p>
          <h2>The website</h2>
          <h3>Membership applications</h3>
          <p>You can apply for membership without creating an account. We store the email address, name, role, organisation, country or region, optional LinkedIn profile, policy interests and written answers you submit. We use these to review your application, contact you about it and administer membership. We record the decision, reviewer and time.</p>
          <p>Applications are available to authorised reviewers. We do not publish a member directory or share your application with other members. Membership is in a personal capacity; it does not imply endorsement by an employer. Please do not include confidential employer information or sensitive personal details.</p>
          <p>We retain your application and decision for review and membership administration. You can request a copy, correction, withdrawal or deletion by emailing hello@theaipex.org from the address you applied with. We may need to verify that address before acting on a request. Application and review pages are excluded from Google Analytics, and application text is not sent to an AI service. We limit repeated submissions to help prevent abuse.</p>
          <p>Resend delivers your application confirmation and our approval or decline email. We also send the authorised reviewer a short alert containing your name, role and organisation, with a link to your application. We keep delivery status so failed emails can be investigated and retried. If approved, you can create an account with the same email address and verify it to activate membership. Your membership status will then appear in My account.</p>
          <h3>Accounts and saved work</h3>
          <p>
            When you create an account, we store your email address, optional
            name and the work you choose to save. We use these to provide your
            account and let you return to your drafts. Existing written
            exercises, progress records and responses previously saved to your
            account remain stored. Saved work is private to your account in the
            interface. AIPEX’s operator and infrastructure providers may access
            data when necessary to administer the service or resolve a support
            issue.
          </p>
          <p>
            We use service providers to manage accounts, store saved work,
            host the website and deliver emails. We do not use saved work
            to train an AI model or submit it to an AI service for grading.
            Please do not enter confidential material or personal information
            about other people in your drafts.
          </p>
          <p>
            We keep your saved records while your account remains active. You
            can request a copy of previously saved work, or account and data
            deletion, using the contact details below. Deleted
            records may remain in infrastructure backups until those backups
            expire.
          </p>
          <p>
            Our hosting and email providers may process technical information needed
            to deliver the website and correspondence, such as IP addresses and
            email delivery records.
          </p>
          <h3 id="tool-drafts">Policy tool drafts</h3>
          <p>Tools save drafts in your browser’s local storage, including on shared devices. You can remove an individual browser draft from its workspace. Downloads and imports happen on your device. Clearing browser data also removes these local copies. If you switch between light and dark mode, that choice is saved there too.</p>
          <p>Choosing Save to account stores a copy of your draft with your account. The access, deletion and backup arrangements above also apply to saved drafts. Removing a browser draft does not delete an account copy. To request deletion of a saved draft, contact us using the details below. Tool text is not sent to an AI service.</p>
          <h3 id="cookies">Cookies and analytics</h3>
          <p>
            We use essential cookies for sign-in and to remember your cookie
            choice. Google Analytics measures visits to public pages only if you
            agree. <Link href="/cookies">See which cookies we use and change your settings</Link>.
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
