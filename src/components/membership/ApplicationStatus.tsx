import Link from "next/link";
import type { MembershipApplication } from "@/lib/membership";

export default function ApplicationStatus({ application }: { application: MembershipApplication }) {
  const approved = application.status === "approved";
  const declined = application.status === "declined";
  return (
    <section className="membership-status" aria-labelledby="membership-status-heading">
      <p className="label">{approved ? "Founding member" : "Your membership application"}</p>
      <h2 id="membership-status-heading">{approved ? "Welcome to AIPEX." : declined ? "Your application has been reviewed." : "Application received."}</h2>
      <p>
        {approved
          ? "We’ve approved your founding membership. Thank you for helping shape a community preparing governments for advanced AI. We’ll share the next steps as the founding group takes shape."
          : declined
            ? "We’re unable to offer you a place in this founding group. Your AIPEX account and access to the public tools remain available."
            : "We review your application before granting membership. You can check the decision here or in My account. Submitting an application does not grant membership."}
      </p>
      <p className="small-copy">Submitted {new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(application.created_at))} · {application.email}</p>
      <p className="small-copy">To correct or withdraw your application, email <a href="mailto:hello@theaipex.org">hello@theaipex.org</a> from your account address.</p>
      <Link className="text-link" href="/tools">Explore the policy tools ↗</Link>
    </section>
  );
}
