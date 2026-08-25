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
        className="absolute -inset-x-[0.18em] -inset-y-[0.12em] h-[calc(100%+0.24em)] w-[calc(100%+0.36em)]"
      >
        <rect
          x="2"
          y="2"
          width="196"
          height="86"
          rx="43"
          fill="none"
          stroke="var(--adhara-color-turmeric)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}
