import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between w-full px-16 py-8 bg-cream-dark">
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
