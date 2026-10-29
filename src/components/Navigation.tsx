"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, ExchangeMark } from "./Brand";
import { gatheringsEnabled } from "@/lib/site";

const links = [
  { href: "/membership", label: "Membership" },
  { href: "/tools", label: "Tools" },
  { href: "/cases", label: "Case library" },
  ...(gatheringsEnabled ? [{ href: "/gatherings", label: "Gatherings" }] : []),
  { href: "/about", label: "About AIPEX" },
];

type NavCta = { href: string; label: string };

// A page can swap the account button for its own call to action; the
// account link then moves into the plain links.
export default function Navigation({ cta }: { cta?: NavCta } = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Don't repeat the call to action as a plain link.
  const navLinks = links.filter(({ href }) => href !== cta?.href);

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
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={(pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          {cta && <Link href="/account">My account</Link>}
          <Link href={cta?.href ?? "/account"} className="button button-small">
            {cta?.label ?? "My account"} <Arrow />
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
          {navLinks.map(({ href, label }) => (
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
          {cta && (
            <Link href={cta.href} onClick={() => setOpen(false)}>
              {cta.label} <Arrow />
            </Link>
          )}
          <Link href="/account" onClick={() => setOpen(false)}>
            My account <Arrow />
          </Link>
        </nav>
      )}
    </header>
  );
}
