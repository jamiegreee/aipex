"use client";

export function CopyLinkButton() {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
      }}
      className="block text-[14px] leading-[22px] py-1 hover:text-accent transition-colors cursor-pointer"
    >
      Copy link
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 border border-border text-[13px] hover:border-ink transition-colors cursor-pointer"
    >
      PDF version
    </button>
  );
}
