/**
 * Rings one word of a headline in Turmeric. Borrowed structurally from the reference's
 * highlight device, but drawn as a support enclosure rather than a marker scribble —
 * consistent with the beam motif and आधार's meaning of holding something up.
 *
 * The ring is decorative: the word stays plain text, so selection, wrapping, screen
 * readers and translation are all unaffected.
 */
export function CircledWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative mx-[0.26em] inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 200 90"
        preserveAspectRatio="none"
        className="ring-draw absolute -inset-x-[0.18em] -inset-y-[0.12em] h-[calc(100%+0.24em)] w-[calc(100%+0.36em)]"
      >
        {/*
          pathLength normalises the perimeter to 100 so the dash animation in motion.css
          needs no knowledge of this rect's actual dimensions.
        */}
        <rect
          x="2"
          y="2"
          width="196"
          height="86"
          rx="43"
          pathLength="100"
          fill="none"
          stroke="var(--adhara-color-turmeric)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
