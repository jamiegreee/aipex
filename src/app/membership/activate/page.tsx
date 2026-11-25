import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { currentUser } from "@/lib/auth";
import ActivationForm from "./ActivationForm";

export const metadata = {
  title: "Activate your membership",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ActivateMembership() {
  const user = await currentUser(true);
  if (!user) redirect("/login?next=%2Fmembership%2Factivate");

  return (
    <>
      <Navigation />
      <main id="main" className="container auth-page">
        <div className="auth-intro">
          <p className="label">AIPEX / Approved membership</p>
          <h1>Activate your <em>membership.</em></h1>
          <p>Use the same email address as your approved application to connect your account and join the community.</p>
        </div>
        <div className="auth-panel">
          <h2>Your member account</h2>
          <p className="small-copy">You’re signed in with <strong>{user.email}</strong>.</p>
          <ActivationForm />
          <p className="small-copy">Applied with a different email? Sign out in My account, then return to the link in your approval email.</p>
          <Link className="text-link" href="/account">My account →</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
