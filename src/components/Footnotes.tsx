"use client";

export function Ref({ n }: { n: number }) {
  return (
    <a
      href={`#fn-${n}`}
      id={`ref-${n}`}
      className="text-accent text-[11px] align-super ml-0.5 no-underline hover:opacity-70"
    >
      [{n}]
    </a>
  );
}

export function Footnotes({ notes }: { notes: string[] }) {
  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h3 className="text-[12px] font-medium tracking-[0.06em] uppercase text-muted mb-4">
        References
      </h3>
      <ol className="flex flex-col gap-2">
        {notes.map((note, i) => (
          <li key={i} id={`fn-${i + 1}`} className="text-[12px] font-light leading-[20px] text-muted">
            <a href={`#ref-${i + 1}`} className="text-accent no-underline mr-1">
              {i + 1}.
            </a>
            {note}
          </li>
        ))}
      </ol>
    </section>
  );
}
