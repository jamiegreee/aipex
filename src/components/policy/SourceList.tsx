import {
  policySources,
  reviewedOn,
  type SourceId,
} from "@/content/policy-sources";
export default function SourceList({ ids }: { ids: SourceId[] }) {
  return (
    <section className="policy-sources" aria-labelledby="sources-heading">
      <p className="label">Read the evidence / Reviewed {reviewedOn}</p>
      <h2 id="sources-heading">Sources & scope.</h2>
      <p>
        AIPEX’s prompts and worked approaches are our own synthesis. Use the
        linked material to examine the method and its limits.
      </p>
      <ol>
        {[...new Set(ids)].map((id) => {
          const s = policySources[id];
          return (
            <li key={id} id={`source-${id}`}>
              <span className="label">{s.publisher}</span>
              <h3>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title} ↗
                </a>
              </h3>
              <p>{s.location}</p>
              <p className="small-copy">{s.note}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
