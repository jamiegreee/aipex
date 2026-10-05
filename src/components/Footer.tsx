import Link from "next/link";
import { Arrow, ExchangeMark } from "./Brand";

export default function Footer() {
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
            A changing world.
            <br />A conversation worth having.
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
            Starting in London. Thinking together.
          </span>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
