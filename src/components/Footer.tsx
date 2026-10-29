import Link from "next/link";
import { Arrow, ExchangeMark } from "./Brand";

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
          <span className="footer-location">
            Helping governments prepare for advanced AI.
          </span>
          <Link href="/charter">Founding charter</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
