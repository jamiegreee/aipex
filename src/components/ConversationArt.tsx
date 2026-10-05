export default function ConversationArt() {
  return (
    <div
      className="conversation-art"
      aria-label="An illustration of overlapping speech bubbles: different perspectives, common ground."
      role="img"
    >
      <div className="art-top">
        <span className="label">The AI Policy Exchange</span>
        <span className="art-plus" aria-hidden="true">
          +
        </span>
      </div>
      <svg
        className="conversation-shapes"
        viewBox="0 0 500 370"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="bubble-pink"
          d="M52 101c0-47 54-81 119-81s119 34 119 81-53 84-119 84h-34l-71 51 10-72c-16-17-24-39-24-63Z"
          fill="#F3B5C9"
        />
        <path
          className="bubble-cream"
          d="M212 179c0-56 54-96 120-96s120 40 120 96c0 28-14 51-38 69l10 71-71-46h-21c-66 0-120-39-120-94Z"
          stroke="#F4F1E9"
          strokeWidth="18"
        />
        <path
          d="m80 282 15-15m-15 0 15 15M379 30v25m-12-12h25"
          stroke="#DCEC91"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="157" cy="293" r="4" fill="#DCEC91" />
        <path
          d="M121 92h102m-102 23h68"
          stroke="#254BDD"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="292" cy="179" r="5" fill="#F4F1E9" />
        <circle cx="332" cy="179" r="5" fill="#F4F1E9" />
        <circle cx="372" cy="179" r="5" fill="#F4F1E9" />
      </svg>
      <div className="art-bottom">
        <p>
          Different perspectives.
          <br />
          <em>Common ground.</em>
        </p>
        <span className="art-edition label">
          London
          <br />& beyond
        </span>
      </div>
    </div>
  );
}
