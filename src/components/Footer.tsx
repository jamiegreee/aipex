import Link from "next/link";
import { Arrow, ExchangeMark } from "./Brand";
import { CookiePreferencesButton } from "./Analytics";

export default function Footer({
  tagline = "The public capacity to respond.",
}: {
  tagline?: string;
} = {}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link
            className="brand footer-brand"
            href="/"
            aria-label="AIPEX — home"
          >
            <ExchangeMark />
            <span className="brand-name">
              AI Policy
              <br />
              Exchange.
            </span>
          </Link>
          <p>
            Advanced AI.
            <br />
            {tagline}
          </p>
          <Link className="text-link" href="/contact">
            Say hello <Arrow diagonal />
          </Link>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          AIPEX<span>↗</span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AI Policy Exchange</span>
          <Link href="/membership">Membership</Link>
          <Link href="/privacy">Privacy</Link>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  );
}
