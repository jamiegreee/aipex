import type { MembershipApplication } from "@/lib/membership";
import Link from "next/link";

export default function ApplicationStatus({ application }: { application: MembershipApplication }) {
  const approved = application.status === "approved";
  const declined = application.status === "declined";
  return (
    <section className="membership-status" aria-labelledby="membership-status-heading">
      {approved && <p className="label">Founding member</p>}
      <h2 id="membership-status-heading">{approved ? "Welcome to AIPEX." : declined ? "Your application has been reviewed." : "Application received."}</h2>
      <p>
        {approved
          ? "Your AIPEX membership is approved. Join the community on Slack to meet other members and take part in the conversation."
          : declined
            ? "We’re unable to offer you membership at this stage. Your AIPEX account remains available."
            : "We will review your application and get back to you soon."}
      </p>
      {approved && <Link className="button" href="/community/slack">Join the Slack community →</Link>}
    </section>
  );
}
