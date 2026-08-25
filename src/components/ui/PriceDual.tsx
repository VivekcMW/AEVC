import { useTranslations } from 'next-intl'
import { formatRupees } from '@/lib/format'

/**
 * The canonical renderer for a price pair. Section 5.2 requires the full price and the
 * monthly EMI figure to appear together; every place that shows a monthly figure uses this,
 * so the pairing cannot come apart. Copy comes from the catalog — a hardcoded "/month"
 * here would render English inside a Hindi page.
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
  const t = useTranslations('common.price')
  const fullSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size]
  const palette =
    tone === 'light'
      ? { full: 'text-white', meta: 'text-white/70' }
      : { full: 'text-ink', meta: 'text-ink/70' }

  return (
    <div className="tnum flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`${fullSize} font-semibold ${palette.full}`}>{formatRupees(full)}</span>
      <span className={`text-sm ${palette.meta}`}>
        {t('dual', { monthly: formatRupees(monthly), tenure })}
      </span>
    </div>
  )
}
