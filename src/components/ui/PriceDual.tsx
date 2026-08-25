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
  tone = 'dark',
}: {
  full: number
  monthly: number
  tenure: number
  size?: 'sm' | 'md' | 'lg'
  /** 'light' for Forest grounds, so dark sections need no bespoke price markup. */
  tone?: 'dark' | 'light'
}) {
  const fullSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size]
  const palette =
    tone === 'light'
      ? { full: 'text-white', meta: 'text-white/70', monthly: 'text-turmeric' }
      : { full: 'text-ink', meta: 'text-ink/70', monthly: 'text-forest' }

  return (
    <div className="tnum flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`${fullSize} font-semibold ${palette.full}`}>{formatRupees(full)}</span>
      <span className={`text-sm ${palette.meta}`}>
        or <strong className={`font-semibold ${palette.monthly}`}>{formatRupees(monthly)}</strong>
        /month
        {' · '}
        {tenure} months
      </span>
    </div>
  )
}
