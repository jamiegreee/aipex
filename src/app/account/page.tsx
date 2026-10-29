import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { currentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";
import { membershipApplication, membershipReviewer } from "@/lib/membership-server";
import ApplicationStatus from "@/components/membership/ApplicationStatus";

export const metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Account() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");

  let application = null;
  let reviewer = false;
  let membershipUnavailable = false;
  try {
    [application, reviewer] = await Promise.all([
      membershipApplication(user.id), membershipReviewer(),
    ]);
  } catch { membershipUnavailable = true; }

  return (
    <>
      <Navigation />
      <main id="main" className="container learning-dashboard">
        <header className="dashboard-header">
          <div>
            <p className="label">Your account</p>
            <h1>
              Your AIPEX <em>workspace.</em>
            </h1>
            <p>
              Open a policy tool to save a draft or return to your account work.
            </p>
            <Link className="button" href="/tools">
              Explore the tools →
            </Link>
          </div>
          <div className="account-controls">
            <p>{user.email}</p>
            <form action={signOut}>
              <button className="text-link" type="submit">
                Sign out →
              </button>
            </form>
          </div>
        </header>
        {membershipUnavailable ? (
          <section className="membership-status"><h2>Membership status is temporarily unavailable.</h2><p>Please try again shortly. Your tool drafts remain available.</p><Link className="text-link" href="/membership">Check membership ↗</Link></section>
        ) : application ? <ApplicationStatus application={application} /> : (
          <section className="membership-status"><p className="label">Founding membership</p><h2>A community of policymakers.</h2><p>Apply to join the first 50 members helping shape AIPEX. An account does not grant membership; every application is personally reviewed.</p><Link className="button" href="/membership">Apply for membership →</Link></section>
        )}
        {reviewer && <section className="membership-status"><p className="label">Private / Jamie’s review queue</p><h2>Review membership applications.</h2><Link className="button" href="/admin/membership">Open review queue →</Link></section>}
      </main>
      <Footer />
    </>
  );
}
