import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Founding Charter — AI Policy Exchange",
  description:
    "Why we exist, what we believe, and how we intend to operate. The founding principles of the AI Policy Exchange.",
};

export default function Charter() {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Hero */}
      <section className="flex flex-col gap-6 w-full px-6 sm:px-10 lg:px-16 pt-14 md:pt-[100px] pb-12 md:pb-[80px] border-b border-border">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
          // Founding Charter
        </p>
        <h1 className="text-[30px] md:text-[48px] font-light leading-[40px] md:leading-[64px] tracking-[-0.03em] max-w-[900px]">
          AI governance cannot wait for perfect information
        </h1>
        <p className="text-[15px] font-light leading-[26px] text-muted max-w-[640px]">
          The founding principles of the AI Policy Exchange — why we exist, what
          we believe, and how we intend to operate.
        </p>
      </section>

      {/* Body */}
      <section className="w-full px-6 sm:px-10 lg:px-16 py-10 md:py-16 max-w-full md:max-w-[800px]">
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="text-[24px] font-normal leading-[34px] mb-4">
              The moment we are in
            </h2>
            <p className="text-[14px] font-light leading-[26px] text-muted mb-4">
              AI is not a future challenge. It is a present one. Governments are
              already making decisions about procurement, regulation, workforce
              policy, and national security that will shape how this technology
              develops and who benefits from it. Most of these decisions are
              being made without adequate information, institutional capacity, or
              input from the people who understand what these systems actually
              do.
            </p>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              The conversation about AI governance has been dominated by two
              camps: those who see AI primarily as an existential risk to be
              contained, and those who want to move fast with minimal oversight.
              Neither position serves the policymakers, civil servants, and
              practitioners who need practical guidance on the near-term
              challenges they face right now.
            </p>
          </div>

          <div>
            <h2 className="text-[24px] font-normal leading-[34px] mb-4">
              What we believe
            </h2>
            <div className="flex flex-col gap-6">
              <div className="border-l-2 border-accent pl-6">
                <p className="text-[14px] font-normal leading-[26px] mb-1">
                  Governance and capability are complementary, not in tension.
                </p>
                <p className="text-[14px] font-light leading-[26px] text-muted">
                  Britain and its allies should lead in both AI capability and AI
                  governance. Getting governance right is a competitive advantage,
                  not a drag on innovation.
                </p>
              </div>
              <div className="border-l-2 border-accent pl-6">
                <p className="text-[14px] font-normal leading-[26px] mb-1">
                  Policy must be grounded in operational reality.
                </p>
                <p className="text-[14px] font-light leading-[26px] text-muted">
                  The best AI policy comes from people who have built and deployed
                  technology — in startups, international institutions, and
                  government. Theory without practice produces rules that don&apos;t
                  work.
                </p>
              </div>
              <div className="border-l-2 border-accent pl-6">
                <p className="text-[14px] font-normal leading-[26px] mb-1">
                  We learn by doing — iteratively.
                </p>
                <p className="text-[14px] font-light leading-[26px] text-muted">
                  The pace of AI development demands that policy frameworks evolve
                  in real time. Waiting for perfect information is itself a policy
                  choice — and a bad one.
                </p>
              </div>
              <div className="border-l-2 border-accent pl-6">
                <p className="text-[14px] font-normal leading-[26px] mb-1">
                  The next generation must be at the table.
                </p>
                <p className="text-[14px] font-light leading-[26px] text-muted">
                  AI governance will be shaped by the people who show up.
                  Emerging practitioners — across technology, policy, law, and
                  civil society — need the knowledge, networks, and platforms to
                  lead.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[24px] font-normal leading-[34px] mb-4">
              How we operate
            </h2>
            <p className="text-[14px] font-light leading-[26px] text-muted mb-4">
              We publish policy briefs that take a position — rigorous,
              accessible analysis with concrete recommendations. We are not a
              neutral convener; we have views, grounded in evidence and
              experience, and we state them clearly.
            </p>
            <p className="text-[14px] font-light leading-[26px] text-muted mb-4">
              We build a community of practitioners who span sectors — the
              technologists building AI systems, the policymakers governing them,
              and the researchers studying them. These groups too rarely talk to
              each other. We create the spaces where they do.
            </p>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              We develop the next generation of AI governance leaders through our
              fellowship programme — equipping emerging practitioners with the
              knowledge, network, and published work to lead in their careers.
            </p>
          </div>

          <div>
            <h2 className="text-[24px] font-normal leading-[34px] mb-4">
              Our commitment
            </h2>
            <p className="text-[14px] font-light leading-[26px] text-muted mb-4">
              We are independent. We do not accept funding that compromises our
              editorial independence or constrains the positions we take. Our
              research is driven by what matters, not what pays.
            </p>
            <p className="text-[14px] font-light leading-[26px] text-muted">
              We are transparent about our reasoning. When we take a position, we
              show our working. When we change our mind, we say so. The
              credibility of this institution depends on intellectual honesty, and
              we intend to earn it.
            </p>
          </div>
        </div>
      </section>

      {/* Signed */}
      <section className="w-full px-6 sm:px-10 lg:px-16 py-10 md:py-12 border-t border-border">
        <p className="text-[14px] font-light text-muted italic mb-2">
          Jamie Green
        </p>
        <p className="text-[12px] text-muted">
          Founder, AI Policy Exchange — March 2026
        </p>
      </section>

      {/* CTA */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between w-full px-6 sm:px-10 lg:px-16 py-10 md:py-12 gap-6 md:gap-0 border-t border-border">
        <div className="max-w-[600px]">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent">
            // Get involved
          </p>
          <h2 className="text-[24px] font-normal leading-[34px] mt-3">
            Share these principles? Join us.
          </h2>
        </div>
        <Link
          href="/community"
          className="flex items-center px-7 py-3 bg-accent text-cream text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          Join the Exchange &rarr;
        </Link>
      </section>

      <Footer />
    </div>
  );
}
