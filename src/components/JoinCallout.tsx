import Link from "next/link";
import { Arrow } from "./Brand";

export default function JoinCallout() {
  return (
    <section className="join-callout" aria-labelledby="join-heading">
      <div className="container join-callout-inner">
        <div>
          <span className="label">
            Practical AI policy education
          </span>
          <h2 id="join-heading">
            Come curious.
            <br />
            <em>Build your judgement.</em>
          </h2>
        </div>
        <div className="join-callout-copy">
          <p>
            Explore practical AI policy courses, work through real decisions
            and develop skills you can use.
          </p>
          <Link className="button" href="/courses">
            Explore the courses <Arrow />
          </Link>
          <span className="join-note">
            Free, online and self-paced.
          </span>
        </div>
      </div>
    </section>
  );
}
