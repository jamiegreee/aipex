export default function CourseArt({
  theme,
  compact = false,
}: {
  theme: "blue" | "pink";
  compact?: boolean;
}) {
  return (
    <div
      className={`course-art ${theme} ${compact ? "compact" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 480 300" fill="none">
        <path
          d="M75 70H230V210H165L75 262V70Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M245 40H405V180H335L245 232V40Z"
          fill="currentColor"
          opacity=".14"
        />
        <path
          d="M245 40H405V180H335L245 232V40Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M140 115H195M140 139H195M140 163H177M280 88H365M280 112H365M280 136H331"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="230" cy="140" r="62" fill="var(--color-cream)" />
        <path
          d="M202 140H257M239 122L257 140L239 158"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>
      <span className="label">Learn / Apply / Build capacity</span>
    </div>
  );
}
