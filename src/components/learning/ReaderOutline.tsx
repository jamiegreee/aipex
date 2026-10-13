"use client";
import { useEffect, useRef } from "react";
export default function ReaderOutline({
  children,
}: {
  children: React.ReactNode;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (details.current && window.matchMedia("(min-width: 761px)").matches)
      details.current.open = true;
  }, []);
  return (
    <details className="reader-outline" ref={details}>
      <summary className="label">
        Course contents <span aria-hidden="true">⌄</span>
      </summary>
      {children}
    </details>
  );
}
