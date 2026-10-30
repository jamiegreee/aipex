import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MembershipForm from "@/components/membership/MembershipForm";
import ApplicationStatus from "@/components/membership/ApplicationStatus";
import { currentUser } from "@/lib/auth";
import { membershipApplication } from "@/lib/membership-server";

export const metadata: Metadata = {
  title: "Apply for founding membership",
  description: "Apply to join AIPEX’s founding community of policymakers preparing governments for advanced AI. The first 50 members are individually reviewed and approved.",
  alternates: { canonical: "/membership" },
  // This page can show a signed-in applicant’s private status.
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function Membership() {
  const user = await currentUser();
  let application = null;
  let unavailable = false;
  if (user) {
    try { application = await membershipApplication(user.id); }
    catch { unavailable = true; }
  }
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="membership-intro">
          <div className="container">
            <p className="label">Founding membership / Our first 50 members</p>
            <h1>Help shape<br /><em>the public response.</em></h1>
            <p>We’re bringing together policymakers and practitioners helping governments prepare for advanced artificial intelligence. Apply to become one of AIPEX’s first 50 members.</p>
          </div>
        </header>
        <div className="container membership-layout">
          <aside className="membership-aside" aria-label="About founding membership">
            <p className="label">A community of policymakers</p>
            <h2>Public purpose.<br /><em>Practical experience.</em></h2>
            <p>For people shaping public decisions in government, parliaments, regulators and international institutions, and those whose work directly supports them.</p>
            <h3>Who we’re looking for</h3>
            <ul>
              <li>Current policymaking responsibilities or substantive experience supporting public policy.</li>
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
            ) : application ? <ApplicationStatus application={application} /> : <MembershipForm user={user ? { name: user.name, email: user.email } : null} />}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
