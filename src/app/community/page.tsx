import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Community — AI Policy Exchange",
  description: "Join the next generation of AI governance practitioners.",
};

const benefits = [
  {
    title: "Weekly newsletter",
    description: "Curated AI policy analysis delivered every Monday. The developments that matter, the context you need, and the analysis you won\u2019t find elsewhere.",
  },
  {
    title: "Slack community",
    description: "A private channel for discussion and networking with practitioners across technology, policy, civil service, and academia.",
  },
  {
    title: "Events & roundtables",
    description: "Regular seminars, workshops, and roundtables with policymakers, technologists, and researchers working on AI governance.",
  },
  {
    title: "Contribute to research",
    description: "Opportunities to contribute to policy briefs, provide feedback on drafts, and shape the Exchange\u2019s research agenda.",
  },
];

export default function Community() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Hero */}
      <section className="flex flex-col gap-8 w-full px-16 pt-[100px] pb-[80px] border-b border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Join the Exchange
        </p>
        <h1 className="text-[48px] font-light leading-[64px] tracking-[-0.03em] max-w-[800px]">
          A community for the next generation of AI governance
        </h1>
        <p className="text-[15px] font-light leading-[26px] text-muted max-w-[580px]">
          The people shaping AI governance need a place to think together. The
          Exchange brings practitioners from across sectors into one community —
          to learn, debate, and build.
        </p>
      </section>

      {/* Benefits */}
      <section className="w-full px-16 py-16">
        <div className="grid grid-cols-2 gap-10">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="border border-border p-10">
              <h2 className="text-[20px] font-normal leading-[30px] mb-3">
                {benefit.title}
              </h2>
              <p className="text-[14px] font-light leading-[24px] text-muted">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section className="w-full px-16 py-16 border-t border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-3">
          Who is this for
        </p>
        <h2 className="text-[32px] font-light leading-[44px] mb-6 max-w-[600px]">
          Anyone working on or interested in AI governance
        </h2>
        <div className="flex gap-16 max-w-[900px]">
          <div className="flex-1">
            <p className="text-[14px] font-light leading-[24px] text-muted">
              Policy professionals, civil servants, and regulators looking for
              technical fluency and peer perspectives on AI governance challenges.
            </p>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-light leading-[24px] text-muted">
              Technologists, researchers, lawyers, journalists, and anyone else
              who wants to engage seriously with the governance side of the AI
              transition.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center w-full px-16 py-20 bg-dark">
        <h2 className="text-[36px] font-light leading-[52px] text-light text-center max-w-[620px] mb-4">
          Ready to join?
        </h2>
        <p className="text-[14px] text-muted text-center mb-8 max-w-[500px]">
          Sign up to receive the weekly newsletter and get access to the Slack
          community, events, and more.
        </p>
        <Link
          href="/contact"
          className="flex items-center px-8 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          Join the Exchange &rarr;
        </Link>
      </section>

      {/* Fellowship pointer */}
      <section className="flex items-center justify-between w-full px-16 py-12 border-b border-border">
        <div className="max-w-[600px]">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
            // Go deeper
          </p>
          <h2 className="text-[24px] font-normal leading-[34px] mt-3">
            Looking for the Fellowship programme?
          </h2>
          <p className="text-[13px] text-muted mt-2">
            A 12-week structured programme for emerging AI governance leaders.
          </p>
        </div>
        <Link
          href="/fellowship"
          className="flex items-center px-7 py-3 border border-border text-[13px] hover:border-ink transition-colors"
        >
          Learn more &rarr;
        </Link>
      </section>

      <Footer />
    </div>
  );
}
