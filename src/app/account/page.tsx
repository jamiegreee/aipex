import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { currentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

export const metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Account() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");

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
      </main>
      <Footer />
    </>
  );
}
