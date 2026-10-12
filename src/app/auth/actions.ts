"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, authConfigured } from "@/lib/supabase/server";
import { safeNext } from "@/lib/courses";

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
  const client = await createClient();
  const requestHeaders = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    requestHeaders.get("origin") ||
    "https://theaipex.org";
  const callback = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  if (mode === "resend") {
    const { error } = await client.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: callback },
    });
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
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });
    if (error)
      return {
        error:
          error.status === 429
            ? "Too many requests. Please wait a few minutes before trying again."
            : "We could not send a reset link. Please try again shortly.",
      };
    return {
      message:
        "If an account exists for that email, a password reset link is on its way. Check your inbox and spam folder.",
    };
  }
  if (mode === "signup") {
    const name = String(form.get("name") ?? "")
      .trim()
      .slice(0, 80);
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: callback },
    });
    if (error)
      return {
        error:
          error.status === 429
            ? "Too many attempts. Wait a few minutes and try again."
            : error.code === "weak_password"
              ? "Choose a stronger password using a mix of characters."
              : "We could not create your account. If you already have one, sign in or reset your password.",
      };
    if (!data.session)
      return {
        message:
          "Check your email to confirm your account, then come back to start learning. If you already have an account, sign in instead.",
        confirmationEmail: email,
      };
  } else if (mode === "login") {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error)
      return {
        error:
          error.code === "email_not_confirmed"
            ? "Confirm your email before signing in. Check the email sent when you signed up."
            : error.status === 429
              ? "Too many attempts. Please wait a few minutes."
              : "We could not sign you in. Check your email and password, or reset your password.",
      };
  } else
    return {
      error: "This form could not be submitted. Refresh and try again.",
    };
  redirect(next);
}
export async function changePassword(
  _: AuthState,
  form: FormData,
): Promise<AuthState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 10 || password.length > 128)
    return { error: "Choose a password of 10–128 characters." };
  if (password !== form.get("confirm"))
    return { error: "The passwords do not match." };
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user)
    return { error: "Your reset link has expired. Request a new one." };
  const { error } = await client.auth.updateUser({ password });
  if (error)
    return {
      error:
        "We could not update your password. Try a new reset link or choose a different password.",
    };
  redirect("/learn?password=updated");
}
export async function signOut() {
  const client = await createClient();
  const { error } = await client.auth.signOut();
  if (error) throw new Error("We could not sign you out. Please try again.");
  redirect("/login");
}
