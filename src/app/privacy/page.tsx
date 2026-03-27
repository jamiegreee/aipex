import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Policy Exchange",
  description: "Privacy policy for the AI Policy Exchange website.",
};

export default function Privacy() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      <section className="w-full px-16 pt-[100px] pb-[80px] max-w-[720px]">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-6">
          // Legal
        </p>
        <h1 className="text-[40px] font-light leading-[56px] tracking-[-0.03em] mb-10">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[18px] font-normal leading-[28px] mb-3">Overview</h2>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              The AI Policy Exchange (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to
              protecting your privacy. This policy explains how we collect, use,
              and safeguard your personal information when you visit our website
              or engage with our community.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-normal leading-[28px] mb-3">What we collect</h2>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              We collect information you provide directly: your name and email
              when you join the newsletter or community, and any additional
              information you share through forms or correspondence. We also
              collect basic analytics data (page views, referral sources) using
              privacy-respecting analytics tools that do not track individual
              users across the web.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-normal leading-[28px] mb-3">How we use it</h2>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              We use your information to send you the newsletter you signed up
              for, to give you access to the community Slack, and to communicate
              about events and programmes you&rsquo;ve expressed interest in. We do
              not sell your data, share it with third parties for marketing
              purposes, or use it for any purpose beyond what you consented to.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-normal leading-[28px] mb-3">Your rights</h2>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              You can request access to, correction of, or deletion of your
              personal data at any time via our{" "}
              <Link href="/contact" className="text-accent hover:opacity-80 transition-opacity">
                contact page
              </Link>
              . You can unsubscribe from the newsletter at any time using the
              link in any email.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-normal leading-[28px] mb-3">Cookies</h2>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              We use only essential cookies required for the website to function.
              We do not use tracking cookies, advertising cookies, or third-party
              analytics that require cookie consent.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-normal leading-[28px] mb-3">Contact</h2>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              For any privacy-related questions,{" "}
              <Link href="/contact" className="text-accent hover:opacity-80 transition-opacity">
                get in touch
              </Link>
              .
            </p>
          </div>

          <p className="text-[12px] text-muted mt-4">
            Last updated: March 2026
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
