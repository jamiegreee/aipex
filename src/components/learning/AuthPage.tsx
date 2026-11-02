import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthForm from "./AuthForm";
import { safeNext } from "@/lib/courses";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthPage({
  mode,
  searchParams,
}: {
  mode: "login" | "signup" | "forgot" | "reset";
  searchParams: Promise<{
    next?: string;
    error?: string;
    token?: string;
    password?: string;
    confirmed?: string;
  }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next, "/account");
  const applying = next === "/membership" || next.startsWith("/membership/");
  const openingSlack = next === "/community/slack";
  const resettingPassword = mode === "forgot" || mode === "reset";
  const user = await currentUser();
  if (user && (mode === "login" || mode === "signup")) redirect(next);
  const titles = {
    login: "Welcome back.",
    signup: applying ? "Start your application." : "Connect around AI policy.",
    forgot: "A fresh start.",
    reset: "Choose a new password.",
  };
  const introduction = resettingPassword
    ? mode === "forgot"
      ? "Enter your account email and we’ll send you a link to reset your password."
      : "Choose a new password for your AIPEX account."
    : mode === "signup"
      ? applying
        ? "Create and verify your account, then tell us about your work and why you’d like to become an AIPEX member."
        : "Create an account to apply for membership in a community helping governments prepare for advanced AI."
      : openingSlack
        ? "Sign in with the account linked to your approved AIPEX membership to open the Slack invitation."
        : applying
          ? "Sign in to continue your application or check your membership status."
          : "A community of policymakers helping governments prepare for advanced AI. Sign in to manage your account and membership.";
  const accountNote = resettingPassword
    ? "Your profile and membership stay with your account when you reset your password."
    : mode === "signup"
      ? "Creating an account lets you apply for membership. We review your application before inviting you to the Slack community."
      : "Check your application status in My account. Approved members can join our Slack community.";
  return (
    <>
      <Navigation />
      <main id="main" className="container auth-page">
        <div className="auth-intro">
          <p className="label">{resettingPassword ? "AIPEX / Account access" : applying ? "AIPEX / Membership application" : "AIPEX / Community"}</p>
          <h1>{titles[mode]}</h1>
          <p>
            {introduction}
          </p>
          <div className="auth-note">
            <span className="label">{resettingPassword ? "Your account" : mode === "signup" ? "Membership by application" : "Your AIPEX membership"}</span>
            <p>
              {accountNote}
            </p>
          </div>
        </div>
        <div className="auth-panel">
          <h2>
            {mode === "login"
              ? "Sign in to your account"
              : mode === "signup"
                ? "Create your account"
                : mode === "forgot"
                  ? "Reset your password"
                  : "Update your password"}
          </h2>
          {mode === "login" && params.password === "updated" && (
            <p className="form-success" role="status">
              Your password has been updated. Sign in with your new password.
            </p>
          )}
          {mode === "login" && params.confirmed === "yes" && (
            <p className="form-success" role="status">
              Your email is verified. Sign in to continue.
            </p>
          )}
          {mode === "reset" && (!params.token || params.token.length > 2048) ? (
            <p className="form-alert">
              Open the link in your password reset email first.{" "}
              <a href="/forgot-password">Request a new link</a>.
            </p>
          ) : (
            <AuthForm
              mode={mode}
              next={next}
              linkError={params.error === "link"}
              resetToken={params.token ?? ""}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
