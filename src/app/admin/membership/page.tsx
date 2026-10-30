import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReviewDecision from "@/components/membership/ReviewDecision";
import { currentUser } from "@/lib/auth";
import { membershipReviewQueue, membershipReviewer } from "@/lib/membership-server";
import { membershipInterestOptions } from "@/lib/membership";
import EmailQueue from "@/components/membership/EmailQueue";
import { membershipEmailConfigured, membershipEmailCounts } from "@/lib/membership-email-server";

export const metadata: Metadata = { title: "Membership review", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function MembershipReview({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const user = await currentUser(true);
  if (!user) redirect("/login?next=/admin/membership");
  // A hidden URL is not permission: the database enforces this same check.
  if (!(await membershipReviewer())) notFound();
  const params = await searchParams;
  const status = ["pending", "approved", "declined"].includes(params.status ?? "") ? params.status! : "pending";
  const page = /^\d{1,4}$/.test(params.page ?? "") ? Number(params.page) : 0;
  const { applications, counts } = await membershipReviewQueue(status, page);
  const emailCounts = await membershipEmailCounts().catch(() => null);
  const total = counts[status as "pending" | "approved" | "declined"];
  const date = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(new Date(value));
  return (
    <>
      <Navigation />
      <main id="main" className="container membership-admin">
        <header className="membership-admin-header">
          <p className="label">Private / Membership review</p>
          <h1>The founding <em>group.</em></h1>
          <p>{counts.approved} of {counts.limit} founding places approved · {counts.pending} awaiting review</p>
          <p className="small-copy">Every membership decision is yours. Saving a decision updates the applicant’s account and queues an email to them.</p>
          <Link className="text-link" href="/account">My account ↗</Link>
        </header>
        <EmailQueue counts={emailCounts} configured={membershipEmailConfigured()} />
        <nav className="membership-review-tabs" aria-label="Application status">
          {(["pending", "approved", "declined"] as const).map(s => <Link key={s} aria-current={s === status ? "page" : undefined} href={`/admin/membership?status=${s}`}>{s[0].toUpperCase() + s.slice(1)} ({counts[s]})</Link>)}
        </nav>
        {!applications.length && <section className="membership-review"><h2>No {status} applications on this page.</h2><p>New applications will appear in the pending queue.</p></section>}
        {applications.map(a => (
          <article key={`${a.user_id}:${a.updated_at}`} className="membership-review">
            <header><p className="label">{a.status} / Submitted {date(a.created_at)} UK time</p><h2>{a.full_name}</h2><p>{a.role} · {a.organisation} · {a.country}</p><p><a href={`mailto:${a.email}`}>{a.email}</a>{a.profile_url && <> · <a href={a.profile_url} target="_blank" rel="noopener noreferrer">LinkedIn profile ↗</a></>}</p></header>
            <dl>
              <dt>Policy interests</dt><dd>{a.interests.map(i => membershipInterestOptions.find(o => o.value === i)?.label ?? i).join("; ")}</dd>
              <dt>Why they want to join</dt><dd>{a.motivation}</dd>
              {a.contribution && <><dt>What they could contribute</dt><dd>{a.contribution}</dd></>}
            </dl>
            {a.reviewed_at && <p className="small-copy">Decision recorded {date(a.reviewed_at)} UK time.</p>}
            {a.status === "pending" && <ReviewDecision userId={a.user_id} fullName={a.full_name} updatedAt={a.updated_at} />}
          </article>
        ))}
        <nav className="membership-pagination" aria-label="Application pages">
          {page > 0 && <Link className="text-link" href={`/admin/membership?status=${status}&page=${page - 1}`}>← Previous 25</Link>}
          {(page + 1) * 25 < total && <Link className="text-link" href={`/admin/membership?status=${status}&page=${page + 1}`}>Next 25 →</Link>}
        </nav>
      </main>
      <Footer />
    </>
  );
}
