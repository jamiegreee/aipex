import type { PolicyOption } from "@/lib/policy-workspace";

const rows = [
  ["mechanism", "How it works"],
  ["benefits", "Benefits and evidence"],
  ["costs", "Costs and burdens"],
  ["distribution", "Who gains or loses"],
  ["delivery", "Authority and delivery"],
  ["uncertainty", "Uncertainty"],
] as const;
const gates = {
  unknown: "Unresolved — evidence needed",
  met: "Met — author’s assessment",
  "not-met": "Not met — explain consequences",
};

export default function OptionsComparison({
  options,
}: {
  options: PolicyOption[];
}) {
  return (
    <section className="options-comparison" aria-label="Options side by side">
      <h3>See the trade-offs.</h3>
      <p className="small-copy">
        Compare across the same row. Use “Compare your options” to edit each
        card, then check which assumption could reverse your preference. These
        are your entries and condition judgements, without independent
        verification or automatic ranking. On a narrow screen, scroll the table
        sideways.
      </p>
      <div
        className="comparison-scroll"
        tabIndex={0}
        role="region"
        aria-label="Scrollable options comparison"
      >
        <table>
          <caption>Options comparison</caption>
          <thead>
            <tr>
              <th scope="col">Compare</th>
              {options.map((o, i) => (
                <th scope="col" key={o.id}>
                  {o.name || "Unnamed option"}
                  {i === 0 ? " · Baseline" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Essential conditions</th>
              {options.map((o) => (
                <td key={o.id}>{gates[o.gate]}</td>
              ))}
            </tr>
            {rows.map(([key, label]) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                {options.map((o) => (
                  <td key={o.id}>{o[key].trim() || "Not yet drafted"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
