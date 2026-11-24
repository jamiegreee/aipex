import type { MembershipApplication } from "@/lib/membership";
import Link from "next/link";
import SlackMobileQR from "./SlackMobileQR";

// Reviewers run AIPEX, so they are members whether or not they ever applied.
export default function ApplicationStatus({ application, reviewer = false }: { application: MembershipApplication | null; reviewer?: boolean }) {
  const approved = reviewer || application?.status === "approved";
  const declined = !approved && application?.status === "declined";
  return (
    <section className="membership-status" aria-labelledby="membership-status-heading">
      {approved && <p className="label">Member</p>}
      <h2 id="membership-status-heading">{approved ? "Welcome to AIPEX." : declined ? "Your application has been reviewed." : "Application received."}</h2>
      <p>
        {approved
          ? reviewer
            ? "As an AIPEX admin you are a member automatically. Join the community on Slack to meet other members and take part in the conversation."
            : "Your AIPEX membership is approved. Join the community on Slack to meet other members and take part in the conversation."
          : declined
            ? "We’re unable to offer you membership at this stage. Your AIPEX account remains available."
            : "We will review your application and get back to you soon."}
      </p>
      {approved && <Link className="button" href="/community/slack">Join the Slack community →</Link>}
      {approved && <SlackMobileQR />}
    </section>
  );
}
