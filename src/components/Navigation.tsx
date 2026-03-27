"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/fellowship", label: "Fellowship" },
  { href: "/community", label: "Community" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between w-full px-16 py-6 border-b border-border">
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="4" fill="#D4612A"/>
          <path d="M8 22L12.5 10H15L19.5 22H17L16 19H11.5L10.5 22H8ZM12.1 17H15.4L13.75 12.2L12.1 17Z" fill="#F5F2ED"/>
        </svg>
        <span className="text-[15px] font-medium tracking-tight">AI Policy Exchange</span>
      </Link>
      <div className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[13px] transition-colors ${
              pathname.startsWith(link.href) ? "text-accent" : "hover:text-accent"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/community"
          className="text-[13px] font-medium text-cream bg-accent px-5 py-2 hover:opacity-90 transition-opacity"
        >
          Join &rarr;
        </Link>
      </div>
    </nav>
  );
}
