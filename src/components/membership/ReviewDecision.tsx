"use client";
import { useActionState, useState } from "react";
import { reviewMembership } from "@/app/membership/actions";

export default function ReviewDecision({ userId, fullName, updatedAt, source = "account" }: { userId: string; fullName: string; updatedAt: string; source?: "account" | "request" }) {
  const [state, action, pending] = useActionState(reviewMembership, {});
  const [decision, setDecision] = useState("");
  if (state.success) return <p className="form-success" role="status">Decision saved. This application has left the pending queue.</p>;
  return (
    <form action={action} className="membership-review-decision">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="expectedUpdatedAt" value={updatedAt} />
      <label>
        Decision for {fullName}
        <select name="decision" required value={decision} onChange={e => setDecision(e.target.value)}>
          <option value="">Choose a decision</option>
          <option value="approved">Approve membership</option>
          <option value="declined">Decline this application</option>
        </select>
      </label>
      <p className="small-copy">{decision === "approved" ? source === "request" ? "The applicant will receive an invitation to create their account and activate membership with their verified email." : "This grants membership." : decision === "declined" ? "The applicant will be emailed our decision." : "Nothing changes until you save a decision."} Saving a decision also emails the applicant.</p>
      {state.error && <p className="form-alert" role="alert">{state.error}</p>}
      <button className="button button-small" type="submit" disabled={pending || !decision}>{pending ? "Saving decision…" : "Save decision"}</button>
    </form>
  );
}
