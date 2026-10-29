"use client";
import { useActionState, useState } from "react";
import { reviewMembership } from "@/app/membership/actions";

export default function ReviewDecision({ userId, fullName, updatedAt }: { userId: string; fullName: string; updatedAt: string }) {
  const [state, action, pending] = useActionState(reviewMembership, {});
  const [decision, setDecision] = useState("");
  if (state.success) return <p className="form-success" role="status">Decision saved. This application has left the pending queue.</p>;
  return (
    <form action={action} className="membership-review-decision">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="expectedUpdatedAt" value={updatedAt} />
      <label>
        Decision for {fullName}
        <select name="decision" required value={decision} onChange={e => setDecision(e.target.value)}>
          <option value="">Choose a decision</option>
          <option value="approved">Approve founding membership</option>
          <option value="declined">Decline this application</option>
        </select>
      </label>
      <p className="small-copy">{decision === "approved" ? "This grants founding membership and uses one of the first 50 places." : decision === "declined" ? "The applicant will see that a place has not been offered. Their account stays active." : "Nothing changes until you save a decision."} The decision appears in the applicant’s account; this does not send an email.</p>
      {state.error && <p className="form-alert" role="alert">{state.error}</p>}
      <button className="button button-small" type="submit" disabled={pending || !decision}>{pending ? "Saving decision…" : "Save decision"}</button>
    </form>
  );
}
