import { formatRupees } from '@/lib/format'

/**
 * The only component permitted to render a price.
 * Section 5.2 requires the full price and the monthly EMI figure side by side, always —
 * a single renderer is what makes that structurally true instead of a habit.
 */
export function PriceDual({
  full,
  monthly,
  tenure,
  size = 'md',
}: {
  full: number
  monthly: number
  tenure: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const fullSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size]
  return (
    <div className="tnum flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`${fullSize} font-semibold text-ink`}>{formatRupees(full)}</span>
      <span className="text-sm text-ink/70">
        or <strong className="font-semibold text-forest">{formatRupees(monthly)}</strong>/month
        {' · '}
        {tenure} months
      </span>
    </div>
  )
}
