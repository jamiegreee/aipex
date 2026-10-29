"use client";
import { useActionState } from "react";
import Link from "next/link";
import { authenticate, changePassword } from "@/app/auth/actions";

export default function AuthForm({
  mode,
  next,
  linkError = false,
  resetToken = "",
}: {
  mode: "login" | "signup" | "forgot" | "reset";
  next: string;
  linkError?: boolean;
  resetToken?: string;
}) {
  const [state, action, pending] = useActionState(
    mode === "reset" ? changePassword : authenticate,
    {},
  );
  const signup = mode === "signup";
  return (
    <form action={action} className="auth-form">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="next" value={next} />
      {mode === "reset" && (
        <input type="hidden" name="token" value={resetToken} />
      )}
      {linkError && (
        <p className="form-alert" role="alert">
          That email link has expired or could not be verified. Sign in or
          request a new password reset.
        </p>
      )}
      {state.confirmationEmail ? (
        <>
          <input type="hidden" name="email" value={state.confirmationEmail} />
          <p className="small-copy">
            Confirmation requested for {state.confirmationEmail}.
          </p>
        </>
      ) : (
        <>
          {signup && (
            <label>
              Your name <span>(optional)</span>
              <input name="name" autoComplete="name" maxLength={80} />
            </label>
          )}
          {mode !== "reset" && (
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          )}
          {mode !== "forgot" && (
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                minLength={mode === "login" ? 1 : 10}
                maxLength={128}
              />
              {mode !== "login" && (
                <span>At least 10 characters. Use a unique password.</span>
              )}
            </label>
          )}
          {(signup || mode === "reset") && (
            <label>
              Confirm password
              <input
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={128}
              />
            </label>
          )}
        </>
      )}
      {state.error && (
        <p className="form-alert" role="alert">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="form-success" role="status">
          {state.message}
        </p>
      )}
      {state.confirmationEmail ? (
        <button
          type="submit"
          className="button"
          name="resend"
          value="yes"
          disabled={pending}
        >
          {pending ? "Sending…" : "Resend confirmation email"}
        </button>
      ) : (
        <button className="button" disabled={pending}>
          {pending
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : signup
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Save new password"}
        </button>
      )}
      {signup && (
        <p className="small-copy">
          Your email and the drafts you choose to save are stored in your account. Read our{" "}
          <Link href="/privacy">privacy notice</Link>. Please use fictional or
          anonymised examples in your drafts.
        </p>
      )}
      {mode === "login" && (
        <Link href="/forgot-password" className="text-link">
          Forgot your password?
        </Link>
      )}
      <p className="auth-switch">
        {signup ? (
          <>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`}>
              Sign in
            </Link>
          </>
        ) : mode === "login" ? (
          <>
            New to AIPEX?{" "}
            <Link href={`/signup?next=${encodeURIComponent(next)}`}>
              Create a free account
            </Link>
          </>
        ) : (
          <Link href="/login">Back to sign in</Link>
        )}
      </p>
    </form>
  );
}
