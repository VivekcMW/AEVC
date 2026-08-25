/**
 * The hairline grid that sits behind Forest grounds. Stands in for photography by
 * borrowing the language of a technical drawing — apt for a vehicle sold on spec honesty.
 */
export function Blueprint({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(255 255 255 / 0.055) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgb(255 255 255 / 0.055) 1px, transparent 1px)',
        backgroundSize: '2.25rem 2.25rem',
        maskImage: 'radial-gradient(120% 100% at 15% 0%, black 25%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(120% 100% at 15% 0%, black 25%, transparent 78%)',
      }}
    />
  )
}

/** A load-bearing rule. The one recurring structural mark across the site. */
export function Beam({
  className = '',
  tone = 'accent',
}: {
  className?: string
  tone?: 'accent' | 'quiet'
}) {
  return (
    <span
      aria-hidden
      className={`block h-0.5 ${tone === 'accent' ? 'bg-turmeric' : 'bg-forest/15'} ${className}`}
    />
  )
}
