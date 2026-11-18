import Link from "next/link";

const variants = [
  { href: "/", label: "Live" },
  { href: "/preview/home-a", label: "A · Refine" },
  { href: "/preview/home-b", label: "B · Rework" },
  { href: "/preview/home-c", label: "C · Radical" },
  { href: "/preview/home-c-light", label: "C · Light" },
];

// Floating switcher so the homepage alternatives can be compared quickly.
// Preview-only: none of these routes are linked from the live site.
export default function PreviewSwitcher({ current }: { current: string }) {
  return (
    <nav className="pv-switch" aria-label="Homepage alternatives">
      <span>Homepage preview</span>
      {variants.map((v) => (
        <Link key={v.href} href={v.href} aria-current={v.href === current ? "page" : undefined}>
          {v.label}
        </Link>
      ))}
    </nav>
  );
}
