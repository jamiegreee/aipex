import Link from "next/link";
import { Arrow } from "./Brand";

export default function JoinCallout() {
  return (
    <section className="join-callout" aria-labelledby="join-heading">
      <div className="container join-callout-inner">
        <div>
          <span className="label">
            For governments and policymakers
          </span>
          <h2 id="join-heading">
            Plan for change.
            <br />
            <em>Build the capacity to act.</em>
          </h2>
        </div>
        <div className="join-callout-copy">
          <p>
            Begin with the decisions in front of you. Examine evidence, compare
            policy responses and plan oversight with our open tools and cases.
          </p>
          <Link className="button" href="/tools">
            Explore the tools <Arrow />
          </Link>
          <span className="join-note">
            Open resources. No account needed to start.
          </span>
        </div>
      </div>
    </section>
  );
}
