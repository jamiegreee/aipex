"use client";
import Link from "next/link";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container learning-error">
      <p className="label">My learning</p>
      <h1>We couldn’t load your learning record.</h1>
      <p>Your saved work remains in your account. Please retry.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link className="text-link" href="/courses">
        Explore courses →
      </Link>
    </main>
  );
}
