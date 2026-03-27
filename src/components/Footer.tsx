import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between w-full px-6 sm:px-10 lg:px-16 py-6 md:py-8 gap-4 md:gap-0 bg-cream-dark">
      <span className="text-[11px] text-muted">
        &copy; 2026 AI Policy Exchange
      </span>
      <a href="https://theaipex.org" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted hover:text-ink transition-colors">
        theaipex.org
      </a>
      <div className="flex gap-6">
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted hover:text-ink transition-colors">X</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted hover:text-ink transition-colors">LinkedIn</a>
        <Link href="/privacy" className="text-[11px] text-muted hover:text-ink transition-colors">Privacy</Link>
      </div>
    </footer>
  );
}
