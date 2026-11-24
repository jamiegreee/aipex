import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettings } from "@/components/Analytics";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Choose whether AIPEX can use analytics cookies and see what we store in your browser.",
};

export default function Cookies() {
  return (
    <>
      <Navigation />
      <main id="main">
        <header className="page-intro">
          <div className="container">
            <h1>Cookies on AIPEX</h1>
          </div>
        </header>
        <div className="container prose-page">
          <h2>Analytics cookies</h2>
          <p>
            With your permission, we use Google Analytics to see which public
            pages people visit. These cookies are optional and stay off until
            you accept them.
          </p>
          <CookieSettings />
          <details>
            <summary>What Google Analytics collects</summary>
            <p>
              Google receives the page title and address, a shortened
              referring address, and details about your browser and device.
              It uses your IP address to estimate your location. We leave out
              private pages, your name, email address, saved work and any part
              of the page address after a question mark or hash.
            </p>
            <p>
              Google’s cookies (<code>_ga</code> and names starting with{" "}
              <code>_ga_</code>) help distinguish visits and last up to six
              months between visits. Turning analytics off removes these
              cookies from this browser and stops future collection. Data
              already collected is unaffected.
            </p>
            <p>
              Advertising features are off. Google may process analytics data
              outside the UK. Read{" "}
              <a href="https://policies.google.com/privacy">Google’s privacy policy</a>.
            </p>
          </details>
          <h2>Essential cookies</h2>
          <p>
            If you sign in, we use cookies to keep you signed in. Once you make
            a cookie choice, we remember it in this browser for six months.
            You can change it on this page at any time.
          </p>
          <p>
            If you use a policy tool, your browser also stores your draft on
            this device. Read about{" "}
            <Link href="/privacy#tool-drafts">saving and deleting drafts</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
