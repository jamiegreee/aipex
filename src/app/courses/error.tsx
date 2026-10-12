"use client";
import Link from "next/link";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container learning-error">
      <p className="label">AIPEX courses</p>
      <h1>Something interrupted this page.</h1>
      <p>
        Keep any unsaved answer open and try again. Your previously saved work
        remains in your account.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link className="text-link" href="/courses">
        Back to courses →
      </Link>
    </main>
  );
}
