import Image from "next/image";
import Link from "next/link";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface Section {
  id: string;
  title: string;
}

interface BriefLayoutProps {
  tag: string;
  date: string;
  readTime: string;
  title: string;
  subtitle: string;
  sections: Section[];
  recommendation: {
    title: string;
    body: string;
  };
  children: React.ReactNode;
}

export default function BriefLayout({
  tag,
  date,
  readTime,
  title,
  subtitle,
  sections,
  recommendation,
  children,
}: BriefLayoutProps) {
  return (
    <div className="flex flex-col w-full font-mono">
      <Navigation />

      {/* Header */}
      <section className="w-full px-16 pt-[80px] pb-[60px] border-b border-border">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium tracking-[0.06em] uppercase text-accent">
            {tag}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted" />
          <span className="text-xs text-muted">{date}</span>
          <span className="w-1 h-1 rounded-full bg-muted" />
          <span className="text-xs text-muted">{readTime}</span>
        </div>
        <h1 className="text-[40px] font-light leading-[56px] tracking-[-0.03em] max-w-[900px] mb-6">
          {title}
        </h1>
        <p className="text-[16px] font-light leading-[28px] text-muted max-w-[720px] mb-8">
          {subtitle}
        </p>
        <div className="flex items-center gap-3">
          <Image src="/jamie-green.png" alt="Jamie Green" width={40} height={40} className="rounded-full object-cover w-10 h-10" />
          <div>
            <p className="text-[14px] font-medium">Jamie Green</p>
            <p className="text-[12px] text-muted">Founder, AI Policy Exchange</p>
          </div>
        </div>
      </section>

      {/* Body + Sidebar */}
      <section className="flex gap-16 w-full px-16 py-16">
        {/* Article body */}
        <div className="flex-1 max-w-[720px]">
          {children}

          {/* Key Recommendation */}
          <div className="bg-cream-dark p-8 my-10 border-l-2 border-accent">
            <p className="text-[12px] font-bold tracking-[0.06em] uppercase mb-3">
              Key recommendation
            </p>
            <p className="text-[14px] font-light leading-[24px]">
              {recommendation.body}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-[280px] shrink-0">
          <div className="mb-8">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted mb-4">
              In this brief
            </p>
            {sections.map((section, i) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block text-[14px] leading-[22px] py-1 hover:text-accent transition-colors ${
                  i === 0 ? "text-accent" : "text-ink"
                }`}
              >
                {section.title}
              </a>
            ))}
          </div>
          <div className="border-t border-border pt-6 mb-8">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted mb-4">
              Share
            </p>
            <button className="block text-[14px] leading-[22px] py-1 hover:text-accent transition-colors">
              Copy link
            </button>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="block text-[14px] leading-[22px] py-1 hover:text-accent transition-colors">
              X / Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-[14px] leading-[22px] py-1 hover:text-accent transition-colors">
              LinkedIn
            </a>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted mb-4">
              Download
            </p>
            <button className="px-4 py-2 border border-border text-[13px] hover:border-ink transition-colors">
              PDF version
            </button>
          </div>
        </aside>
      </section>

      {/* Back to research */}
      <section className="flex items-center w-full px-16 py-8 border-t border-border">
        <Link href="/research" className="text-[14px] text-accent hover:opacity-80 transition-opacity">
          &larr; All publications
        </Link>
      </section>

      <Footer />
    </div>
  );
}
