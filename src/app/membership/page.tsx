import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MembershipForm from "@/components/membership/MembershipForm";
import ApplicationStatus from "@/components/membership/ApplicationStatus";
import { currentUser } from "@/lib/auth";
import { membershipApplication, membershipReviewer } from "@/lib/membership-server";

export const metadata: Metadata = {
  title: "Apply for membership",
  description: "Apply to join AIPEX’s community of AI policy people from the public and private sectors. Every application is individually reviewed.",
  alternates: { canonical: "/membership" },
  // This page can show a signed-in applicant’s private status.
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Membership() {
  const user = await currentUser();
  let application = null;
  let reviewer = false;
  let unavailable = false;
  if (user) {
    try { [application, reviewer] = await Promise.all([membershipApplication(user.id), membershipReviewer()]); }
    catch { unavailable = true; }
  }
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="membership-intro">
          <div className="container">
            <p className="label">Membership</p>
            <h1>Help shape<br /><em>the public response.</em></h1>
            <p>We’re bringing together people from the public and private sectors who are working on policy for advanced artificial intelligence.</p>
          </div>
        </header>
        <div className="container membership-layout">
          <aside className="membership-aside" aria-label="About membership">
            <p className="label">Public and private sector</p>
            <h2>Different vantage points.<br /><em>Shared problems.</em></h2>
            <p>For people working on AI policy in government, parliaments, regulators and international institutions, and for policy teams at companies and AI developers.</p>
            <h3>Who we’re looking for</h3>
            <ul>
              <li>Current responsibility for AI policy, in the public or private sector, or substantive experience shaping it.</li>
              <li>A serious interest in how advanced AI could affect public institutions, the economy and society.</li>
              <li>A willingness to share useful experience and engage constructively across different views.</li>
            </ul>
            <h3>How it works</h3>
            <ol>
              <li>Verify your email and tell us about your work and interests.</li>
              <li>We review your application.</li>
              <li>Check your decision in <Link href="/account">My account</Link>.</li>
            </ol>
            <p className="small-copy">Applications are private. Membership is in a personal capacity and does not imply endorsement by your employer. Please leave out confidential work information.</p>
          </aside>
          <section className="membership-panel" aria-label="Membership application">
            {unavailable ? (
              <div className="form-alert" role="alert">
                <h2>Applications are temporarily unavailable.</h2>
                <p>We couldn’t check your application status. Please try again shortly. If you have already applied, your saved application has not been changed.</p>
                <Link className="text-link" href="/membership">Try again ↗</Link>
                <p>For help, email <a href="mailto:hello@theaipex.org">hello@theaipex.org</a>.</p>
              </div>
            ) : application || reviewer ? <ApplicationStatus application={application} reviewer={reviewer} /> : <MembershipForm user={user ? { name: user.name, email: user.email } : null} />}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
