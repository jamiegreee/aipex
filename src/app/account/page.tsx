import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { currentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";
import { membershipApplication, membershipReviewer } from "@/lib/membership-server";
import ApplicationStatus from "@/components/membership/ApplicationStatus";
import ProfileForm from "@/components/account/ProfileForm";

export const metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Account() {
  const user = await currentUser(true);
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
      <main id="main" className="container learning-dashboard account-page">
        <header className="dashboard-header">
          <div>
            <p className="label">Your account</p>
            <h1>
              Your <em>account.</em>
            </h1>
            <p>
              Manage your profile, account access and membership.
            </p>
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
        <div className="account-settings">
          <section aria-labelledby="account-profile-heading">
            <p className="label">01 / Profile</p>
            <h2 id="account-profile-heading">Your details.</h2>
            <ProfileForm initialName={user.name ?? ""} email={user.email} />
          </section>
          <section aria-labelledby="account-access-heading">
            <p className="label">02 / Account access</p>
            <h2 id="account-access-heading">Password.</h2>
            <p>Request an email link to reset your password.</p>
            <Link className="text-link" href="/forgot-password?next=%2Faccount">
              Reset password →
            </Link>
          </section>
        </div>
        {membershipUnavailable ? (
          <section className="membership-status"><h2>Membership status is temporarily unavailable.</h2><p>Please try again shortly.</p><Link className="text-link" href="/membership">Check membership ↗</Link></section>
        ) : application ? <ApplicationStatus application={application} /> : (
          <section className="membership-status"><p className="label">Founding membership</p><h2>A community of policymakers.</h2><p>Apply to join the first 50 members helping shape AIPEX. We review your application before granting membership.</p><Link className="button" href="/membership">Apply for membership →</Link></section>
        )}
        {reviewer && <section className="membership-status"><p className="label">Private / Membership review</p><h2>Review membership applications.</h2><Link className="button" href="/admin/membership">Open review queue →</Link></section>}
      </main>
      <Footer />
    </>
  );
}
