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
      <Link href="/" className="text-[15px] font-medium tracking-tight hover:text-accent transition-colors">
        AI Policy Exchange
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
