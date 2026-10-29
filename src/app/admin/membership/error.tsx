"use client";
import Link from "next/link";
export default function MembershipReviewError({ reset }: { reset: () => void }) {
  return <main id="main" className="container membership-admin"><p className="label">Membership review</p><h1>We couldn’t load the review queue.</h1><p>No decision has been made by this page. Retry or sign in again. If a previous save was interrupted, check the application’s current status before retrying.</p><button className="button" onClick={reset}>Try again</button><Link className="text-link" href="/login?next=/admin/membership">Sign in ↗</Link></main>;
}
