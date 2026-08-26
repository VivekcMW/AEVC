import { AdharaMark } from './AdharaMark'

type Variant = 'crossbar' | 'underline' | 'stacked'

/**
 * Section 2.2's one-accent discipline, now carried by the brand mark itself rather than
 * a beam device: the interlocked rings are the single accent in every lockup below.
 */
export function Wordmark({
  variant = 'crossbar',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const mark = (
    <AdharaMark aria-hidden data-accent="true" className="h-[1em] w-auto shrink-0 text-turmeric" />
  )
  const wordmark = 'font-heading font-medium tracking-[-0.01em]'

  if (variant === 'stacked') {
    return (
      <span
        role="img"
        aria-label="Adhara Energy"
        className={`inline-flex w-fit flex-col items-start gap-2 leading-none ${className}`}
      >
        {mark}
        <span className={`${wordmark} text-[0.85em]`}>Adhara Energy</span>
      </span>
    )
  }

  if (variant === 'underline') {
    return (
      <span
        role="img"
        aria-label="Adhara Energy"
        className={`inline-flex w-fit flex-col items-start gap-1.5 leading-none ${className}`}
      >
        <span className="inline-flex items-center gap-2.5">
          {mark}
          <span className={`${wordmark} text-[1.1em]`}>Adhara Energy</span>
        </span>
        <span aria-hidden className="h-px w-full bg-current opacity-20" />
      </span>
    )
  }

  // crossbar: the default horizontal lockup — mark beside the wordmark
  return (
    <span
      role="img"
      aria-label="Adhara Energy"
      className={`inline-flex w-fit items-center gap-2.5 leading-none ${className}`}
    >
      {mark}
      <span className={`${wordmark} text-[1.1em]`}>Adhara Energy</span>
    </span>
  )
}

