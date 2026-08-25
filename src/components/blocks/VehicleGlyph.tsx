/**
 * A technical-drawing silhouette in place of product photography. Takes the model's
 * colour so the switcher on the detail page has something real to change, and reads as a
 * deliberate engineering illustration rather than a missing image.
 */
export function VehicleGlyph({
  colour,
  label,
  className = '',
}: {
  colour: string
  label: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 240 132"
      role="img"
      aria-label={label}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* wheels */}
      <circle cx="52" cy="96" r="25" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
      <circle cx="188" cy="96" r="25" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
      <circle cx="52" cy="96" r="8" fill="currentColor" opacity="0.25" />
      <circle cx="188" cy="96" r="8" fill="currentColor" opacity="0.25" />

      {/* body — the one element carrying the model colour */}
      <path
        d="M64 92 L84 58 L134 56 L150 40 L176 40 L186 62 L176 92 Z"
        fill={colour}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.92"
      />
      {/* seat + handlebar */}
      <path d="M132 56 L166 54" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <path d="M150 40 L138 24 M132 24 L152 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      {/* battery bay, drawn as a labelled component */}
      <rect x="96" y="66" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M104 76 h14 M111 70 v12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />

      {/* dimension line — the drafting cue that makes this read as a spec, not a sketch */}
      <g opacity="0.35" stroke="currentColor" strokeWidth="1">
        <path d="M27 124 H213" />
        <path d="M27 119 V129 M213 119 V129" />
      </g>
    </svg>
  )
}
