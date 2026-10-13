"use server";
import { redirect } from "next/navigation";
import { createAuth, authConfigured } from "@/lib/auth";
import { safeNext } from "@/lib/courses";
import { siteUrl } from "@/lib/site-url";

export type AuthState = {
  error?: string;
  message?: string;
  confirmationEmail?: string;
};
export async function authenticate(
  _: AuthState,
  form: FormData,
): Promise<AuthState> {
  if (!authConfigured())
    return {
      error: "Accounts are being configured. Please try again shortly.",
    };
  const mode = form.get("resend") === "yes" ? "resend" : form.get("mode");
  const next = safeNext(form.get("next"));
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return { error: "Enter a valid email address." };
  if (
    !["forgot", "resend"].includes(String(mode)) &&
    (password.length < (mode === "signup" ? 10 : 1) || password.length > 128)
  )
    return {
      error:
        mode === "signup"
          ? "Choose a password of 10–128 characters."
          : "Enter your password.",
    };
  if (mode === "signup" && password !== form.get("confirm"))
    return { error: "The passwords do not match." };
  const auth = createAuth();
  const callbackURL = `${siteUrl()}/login?confirmed=yes&next=${encodeURIComponent(next)}`;
  if (mode === "resend") {
    const { error } = await auth.sendVerificationEmail({ email, callbackURL });
    return error
      ? {
          error:
            "We could not resend the confirmation. Please wait a minute and try again, or sign in if you already confirmed.",
          confirmationEmail: email,
        }
      : {
          message:
            "A confirmation email has been requested. Check your inbox and spam folder.",
          confirmationEmail: email,
        };
  }
  if (mode === "forgot") {
    const { error } = await auth.requestPasswordReset({
      email,
      redirectTo: `${siteUrl()}/reset-password`,
    });
    return error
      ? {
          error:
            "We could not send a reset link. Please wait a minute and try again.",
        }
      : {
          message:
            "If an account exists for that email, a password reset link is on its way. Check your inbox and spam folder.",
        };
  }
  if (mode === "signup") {
    const name = String(form.get("name") ?? "")
      .trim()
      .slice(0, 80);
    const { error } = await auth.signUp.email({
      email,
      password,
      name: name || "Learner",
      callbackURL,
    });
    if (error)
      return {
        error:
          "We could not create your account. Choose a strong password, or sign in if you already have an account.",
      };
    return {
      message:
        "Check your email to confirm your account, then sign in to start learning. If you already have an account, sign in instead.",
      confirmationEmail: email,
    };
  }
  if (mode !== "login") return { error: "Refresh the page and try again." };
  const { error } = await auth.signIn.email({ email, password });
  if (error)
    return {
      error:
        error.code === "EMAIL_NOT_VERIFIED"
          ? "Confirm your email before signing in. Check the email sent when you signed up."
          : "We could not sign you in. Check your email and password, or reset your password.",
    };
  redirect(next);
}
export async function changePassword(
  _: AuthState,
  form: FormData,
): Promise<AuthState> {
  if (!authConfigured())
    return {
      error: "Accounts are being configured. Please try again shortly.",
    };
  const password = String(form.get("password") ?? "");
  const token = String(form.get("token") ?? "");
  if (!token || token.length > 2048)
    return { error: "Open the link in your password reset email first." };
  if (password.length < 10 || password.length > 128)
    return { error: "Choose a password of 10–128 characters." };
  if (password !== form.get("confirm"))
    return { error: "The passwords do not match." };
  const { error } = await createAuth().resetPassword({
    newPassword: password,
    token,
  });
  if (error)
    return {
      error:
        "We could not update your password. Try a new reset link or choose a different password.",
    };
  redirect("/login?password=updated");
}
export async function signOut() {
  if (authConfigured()) {
    const { error } = await createAuth().signOut();
    if (error) throw new Error("We could not sign you out. Please try again.");
  }
  redirect("/login");
}
