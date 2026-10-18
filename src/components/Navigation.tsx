"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, ExchangeMark } from "./Brand";
import { communityEnabled, gatheringsEnabled } from "@/lib/site";

const links = [
  { href: "/tools", label: "Tools" },
  { href: "/cases", label: "Case library" },
  { href: "/courses", label: "Courses" },
  ...(gatheringsEnabled ? [{ href: "/gatherings", label: "Gatherings" }] : []),
  { href: "/about", label: "About AIPEX" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    }
    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          className="brand"
          href="/"
          aria-label="AIPEX — home"
          onClick={() => setOpen(false)}
        >
          <ExchangeMark />
          <span className="brand-name">
            AI Policy
            <br />
            Exchange<span className="brand-period">.</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={(pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link href="/learn" className="button button-small">
            My learning <Arrow />
          </Link>
        </nav>
        <button
          id="menu-toggle"
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span
            className={open ? "menu-icon is-open" : "menu-icon"}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav container"
          aria-label="Mobile navigation"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={(pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <Arrow />
            </Link>
          ))}
          <Link href="/learn" onClick={() => setOpen(false)}>
            My learning <Arrow />
          </Link>
          {communityEnabled && (
            <Link href="/community" onClick={() => setOpen(false)}>
              Join the community <Arrow />
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
