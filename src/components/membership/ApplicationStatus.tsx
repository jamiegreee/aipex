import type { MembershipApplication } from "@/lib/membership";

export default function ApplicationStatus({ application }: { application: MembershipApplication }) {
  const approved = application.status === "approved";
  const declined = application.status === "declined";
  return (
    <section className="membership-status" aria-labelledby="membership-status-heading">
      {approved && <p className="label">Founding member</p>}
      <h2 id="membership-status-heading">{approved ? "Welcome to AIPEX." : declined ? "Your application has been reviewed." : "Application received."}</h2>
      <p>
        {approved
          ? "We’ve approved your founding membership. Thank you for helping shape a community preparing governments for advanced AI. We’ll share the next steps as the founding group takes shape."
          : declined
            ? "We’re unable to offer you a place in this founding group. Your AIPEX account and access to the public tools remain available."
            : "We will review your application and get back to you soon."}
      </p>
    </section>
  );
}
