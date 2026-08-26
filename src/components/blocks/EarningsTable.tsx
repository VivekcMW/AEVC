import { useTranslations } from 'next-intl'
import { monthlyEarnings } from '@/lib/promoter/earnings'
import { formatRupees } from '@/lib/format'

const SAMPLE_ENROLLMENTS = [1, 5, 10, 20] as const

/** Shows the tier boundaries, not just outcomes — commission transparency, not a black box. */
export function EarningsTable() {
  const t = useTranslations('partner.promoter')

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={t('enrollments')}
      className="overflow-x-auto rounded-lg border border-forest/12 bg-surface"
    >
      <table className="tnum w-full text-sm">
        <thead>
          <tr className="border-b border-forest/12 text-left text-ink/70">
            <th className="px-4 py-3 font-medium">{t('enrollments')}</th>
            <th className="px-4 py-3 font-medium">{t('base')}</th>
            <th className="px-4 py-3 font-medium">{t('bonus')}</th>
            <th className="px-4 py-3 font-medium">{t('total')}</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_ENROLLMENTS.map((count) => {
            const earnings = monthlyEarnings(count)
            return (
              <tr key={count} className="border-b border-forest/8 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{count}</td>
                <td className="px-4 py-3 text-ink/80">{formatRupees(earnings.base)}</td>
                <td className="px-4 py-3 text-ink/80">{formatRupees(earnings.bonus)}</td>
                <td className="px-4 py-3 font-semibold text-ink">{formatRupees(earnings.total)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
