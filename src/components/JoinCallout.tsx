import Link from "next/link";
import { Arrow } from "./Brand";

export default function JoinCallout() {
  return (
    <section className="join-callout" aria-labelledby="join-heading">
      <div className="container join-callout-inner">
        <div>
          <span className="label">
            Founding membership / The first 50
          </span>
          <h2 id="join-heading">
            Join
            <br />
            <em>the community.</em>
          </h2>
        </div>
        <div className="join-callout-copy">
          <p>
            A community of policymakers preparing governments for advanced AI.
            Bring your experience, exchange ideas and help set the questions
            we examine together. Every application is personally reviewed.
          </p>
          <Link className="button" href="/membership">
            Apply for membership <Arrow />
          </Link>
          <span className="join-note">
            Membership is by application and approval.
          </span>
        </div>
      </div>
    </section>
  );
}
