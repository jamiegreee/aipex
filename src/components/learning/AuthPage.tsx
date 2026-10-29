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
  const next = safeNext(params.next);
  const user = await currentUser();
  if (user && (mode === "login" || mode === "signup")) redirect(next);
  const titles = {
    login: "Welcome back.",
    signup: "Start building your policy practice.",
    forgot: "A fresh start.",
    reset: "Choose a new password.",
  };
  return (
    <>
      <Navigation />
      <main id="main" className="container auth-page">
        <div className="auth-intro">
          <p className="label">AIPEX / Your practice</p>
          <h1>{titles[mode]}</h1>
          <p>
            Practical tools for AI policy decisions. Save your working drafts
            to your account and return to them when you need them.
          </p>
          <div className="auth-note">
            <span className="label">Your work, saved</span>
            <p>
              Save policy tool drafts, return to your work and download a copy
              whenever you need it.
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
              Email confirmation finished. Sign in to save your work.
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
