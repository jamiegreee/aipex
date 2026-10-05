export default function LondonPoster() {
  return (
    <div className="london-poster" aria-hidden="true">
      <div className="label poster-caption">
        An invitation to think together
      </div>
      <div className="poster-title">
        Hello,
        <br />
        <em>London.</em>
      </div>
      <svg viewBox="0 0 430 180" fill="none" className="london-line">
        <path
          d="M0 166h50v-30h25v30h31V85h9V55h8V39h6v16h8v30h9v81h43V123h14v-17h39v17h14v43h50v-37h20v37h28V90h8V60h23V90h8v76h77"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle
          cx="126"
          cy="104"
          r="10"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M126 98v7l5 3M216 144v22M356 94v53M348 112h16M348 131h16"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <div className="poster-bottom label">
        <span>AI Policy Social</span>
        <span>№ 001</span>
      </div>
    </div>
  );
}
