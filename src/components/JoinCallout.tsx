import Link from "next/link";
import { Arrow } from "./Brand";

export default function JoinCallout() {
  return (
    <section className="join-callout" aria-labelledby="join-heading">
      <div className="container join-callout-inner">
        <div>
          <span className="label">
            Practical AI policy resources
          </span>
          <h2 id="join-heading">
            Come curious.
            <br />
            <em>Build your judgement.</em>
          </h2>
        </div>
        <div className="join-callout-copy">
          <p>
            Examine evidence, compare policy options and plan oversight with
            practical tools and documented cases.
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
