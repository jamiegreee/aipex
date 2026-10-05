import Link from "next/link";
import { Arrow } from "./Brand";

export default function JoinCallout() {
  return (
    <section className="join-callout" aria-labelledby="join-heading">
      <div className="container join-callout-inner">
        <div>
          <span className="label">
            There&apos;s a place for your perspective
          </span>
          <h2 id="join-heading">
            Come curious.
            <br />
            <em>Leave connected.</em>
          </h2>
        </div>
        <div className="join-callout-copy">
          <p>
            We&apos;re just getting started. Help shape the community and be
            part of the first conversation.
          </p>
          <Link className="button" href="/community">
            Join the exchange <Arrow />
          </Link>
          <span className="join-note">
            London first. More cities as we grow.
          </span>
        </div>
      </div>
    </section>
  );
}
