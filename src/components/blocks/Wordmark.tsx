type Variant = 'crossbar' | 'underline' | 'stacked'

/**
 * Section 2.2: keep the one-accent discipline, drop the battery charge-dot device
 * (which belonged to the word "urja") and replace it with a foundation beam — literal
 * to आधार, meaning base or support. Three options for the design team to choose between.
 *
 * Built in HTML rather than SVG deliberately: the beam is positioned against real loaded
 * font metrics, so it cannot drift when Anek Latin swaps in.
 */
export function Wordmark({
  variant = 'crossbar',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const beam = 'bg-turmeric'

  if (variant === 'stacked') {
    return (
      <span
        role="img"
        aria-label="Adhara Energy"
        className={`inline-flex w-fit flex-col items-start leading-none ${className}`}
      >
        <span className="font-heading text-[1.45em] font-bold tracking-[0.01em]">Adhara</span>
        <span aria-hidden data-accent="true" className={`my-[0.22em] h-[0.11em] w-full ${beam}`} />
        <span className="font-heading text-[0.72em] font-medium tracking-[0.34em] uppercase opacity-90">
          Energy
        </span>
      </span>
    )
  }

  if (variant === 'underline') {
    return (
      <span
        role="img"
        aria-label="Adhara Energy"
        className={`inline-flex w-fit flex-col items-start leading-none ${className}`}
      >
        <span className="font-heading text-[1.2em] tracking-[-0.01em]">
          <span className="font-bold">Adhara</span>
          <span className="font-normal opacity-85"> Energy</span>
        </span>
        {/* Beam spans only "Adhara" — the name it holds up. */}
        <span aria-hidden data-accent="true" className={`mt-[0.2em] h-[0.1em] w-[52%] ${beam}`} />
      </span>
    )
  }

  // crossbar: the A's crossbar extended past the letter as a support beam
  return (
    <span
      role="img"
      aria-label="Adhara Energy"
      className={`relative inline-block w-fit leading-none ${className}`}
    >
      <span className="font-heading text-[1.2em] tracking-[-0.01em]">
        <span className="font-bold">Adhara</span>
        <span className="font-normal opacity-85"> Energy</span>
      </span>
      <span
        aria-hidden
        data-accent="true"
        className={`absolute top-[0.5em] left-[0.05em] h-[0.13em] w-[0.66em] rounded-full ${beam}`}
      />
    </span>
  )
}
