"use client";

import { useActionState } from "react";
import { retryMembershipEmails } from "@/app/membership/actions";
import type { MembershipEmailCounts } from "@/lib/membership-email-server";

export default function EmailQueue({ counts, configured }: { counts: MembershipEmailCounts | null; configured: boolean }) {
  const [state, action, pending] = useActionState(retryMembershipEmails, {});
  return (
    <section className="membership-review" aria-labelledby="membership-emails-heading">
      <h2 id="membership-emails-heading">Membership emails.</h2>
      {!configured && <p className="form-alert">Email sending is not configured. Applications and decisions are saved, and notification emails remain queued.</p>}
      {counts ? <p>{counts.pending} queued · {counts.sending} processing · {counts.sent} accepted by Resend</p> : <p>Email status is temporarily unavailable.</p>}
      {counts && (counts.failed > 0 || counts.needs_review > 0) && <p className="form-alert">{counts.failed + counts.needs_review} email{counts.failed + counts.needs_review === 1 ? " needs" : "s need"} attention. Check Resend and the private delivery record before sending again.</p>}
      <p className="small-copy">New emails send after an application or decision is saved. If an attempt is interrupted, queued emails can be retried here. A saved application or decision is kept even if email delivery fails.</p>
      <form action={action}>
        <button className="button button-small" type="submit" disabled={pending || !configured || !counts || counts.pending + counts.sending === 0}>{pending ? "Sending queued emails…" : "Send queued emails"}</button>
        {state.error && <p className="form-alert" role="alert">{state.error}</p>}
        {state.notice && <p className="form-success" role="status">{state.notice}</p>}
      </form>
    </section>
  );
}
