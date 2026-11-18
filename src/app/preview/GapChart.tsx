// The homepage's illustrative (unquantified) gap diagram, shared by the
// preview variants. Class names are prefixed so each variant can style it.
export default function GapChart({ prefix, labels = true }: { prefix: string; labels?: boolean }) {
  const c = (n: string) => `${prefix}-${n}`;
  return (
    <svg viewBox="0 0 600 380" role="img" aria-labelledby={c("chart-title")} className={c("chart-svg")}>
      <title id={c("chart-title")}>
        Illustration: advanced AI capability rising faster than the public
        capacity to respond, leaving a gap to close.
      </title>
      {[76, 152, 228, 304].map((y) => (
        <line key={y} x1="0" x2="600" y1={y} y2={y} className={c("grid")} />
      ))}
      <path
        className={c("gap")}
        d="M0 350 C 200 345, 360 300, 470 170 S 580 20, 600 10 L 600 230 L 520 230 L 520 262 L 400 262 L 400 290 L 260 290 L 260 318 L 120 318 L 120 340 L 0 340 Z"
      />
      <path className={c("capability")} d="M0 350 C 200 345, 360 300, 470 170 S 580 20, 600 10" />
      <path className={c("capacity")} d="M0 340 H120 V318 H260 V290 H400 V262 H520 V230 H600" />
      {labels && (
        <>
          <text x="405" y="60" className={c("chart-label")}>AI capability</text>
          <text x="408" y="298" className={`${c("chart-label")} ${c("muted")}`}>What governments can do</text>
          <text x="500" y="200" className={`${c("chart-label")} ${c("accent")}`}>the gap</text>
        </>
      )}
    </svg>
  );
}
