import Link from "next/link";
import { Arrow, ExchangeMark } from "@/components/Brand";
import { CookiePreferencesButton } from "@/components/Analytics";
import ThemeToggle from "@/components/ThemeToggle";
import "./home.css";


// Illustrative questions only: the kinds of things members bring. Roles are
// generic placeholders, not real people or real posts.
const thread = [
  { who: "Policy adviser", where: "Central government", text: "We’ve been asked for options on AI in public services by Friday. Has anyone seen a good framework for deciding where not to deploy?" },
  { who: "Regulator", where: "Financial services", text: "How are other regulators resourcing technical expertise? We can’t compete on salary, so we’re looking at secondments." },
  { who: "Public policy lead", where: "AI company", text: "We’re responding to a consultation on AI assurance. It would help to hear from officials how responses actually get used." },
  { who: "Official", where: "International institution", text: "Comparing national approaches to AI incident reporting. Happy to share our draft table if others add their country." },
];

// The homepage is the product: a member's-eye view of the exchange, with
// one call to action at the end of the thread. Minimal chrome, dark, almost
// no marketing copy.
export default function Home() {
  return (
    <div className="pc">
      <header className="pc-bar">
        <Link className="pc-brand" href="/" aria-label="AIPEX — home">
          <ExchangeMark /> AIPEX
        </Link>
        <nav aria-label="Main navigation">
          <ThemeToggle />
          <Link href="/account">My account</Link>
          <Link className="pc-bar-cta" href="/membership">
            Apply <Arrow />
          </Link>
        </nav>
      </header>
      <main id="main" className="pc-main">
        <section className="pc-intro" aria-labelledby="pc-h1">
          <h1 id="pc-h1">
            Building the community for AI policy practitioners.
            <em> Join to help build a positive future for AI.</em>
          </h1>
          <p>
            AIPEX is the private community bringing together people working on
            AI policy across government and industry.
          </p>
        </section>

        <section className="pc-channel" aria-label="An illustration of conversations inside AIPEX">
          <div className="pc-channel-head">
            <span># ask-the-exchange</span>
            <span className="pc-tag">Illustrative</span>
          </div>
          <ol className="pc-thread">
            {thread.map((m, i) => (
              <li key={i} style={{ animationDelay: `${0.4 + i * 0.5}s` }}>
                <span className="pc-avatar" aria-hidden="true" data-i={i} />
                <div>
                  <p className="pc-meta">
                    <strong>{m.who}</strong> · {m.where}
                  </p>
                  <p>{m.text}</p>
                </div>
              </li>
            ))}
            <li className="pc-you" style={{ animationDelay: `${0.4 + thread.length * 0.5}s` }}>
              <span className="pc-avatar pc-avatar-you" aria-hidden="true" />
              <div>
                <p className="pc-meta">
                  <strong>You</strong> · Your role here
                </p>
                <Link className="pc-compose" href="/membership">
                  <span>What are you wrestling with?</span>
                  <span className="pc-compose-cta">
                    Apply to join <Arrow />
                  </span>
                </Link>
              </div>
            </li>
          </ol>
        </section>

        <section className="pc-small" aria-label="About membership">
          <p><strong>Who.</strong> People working on AI policy in the public and private sectors: officials, regulators and parliamentary staff, and policy teams at companies and AI developers.</p>
          <p><strong>How.</strong> Apply, we review every application individually, then you join us on Slack.</p>
          <p><strong>Terms.</strong> Personal capacity. No endorsement by your employer. Leave confidential work out of it.</p>
        </section>
      </main>
      <footer className="pc-foot">
        <span>© {new Date().getFullYear()} AI Policy Exchange</span>
        <Link href="/contact">Say hello</Link>
        <Link href="/privacy">Privacy</Link>
        <CookiePreferencesButton />
      </footer>
    </div>
  );
}
