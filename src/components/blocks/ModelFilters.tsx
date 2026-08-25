import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { formatRupees } from '@/lib/format'
import { type Criteria, toSearchParams } from '@/lib/data/filter'

type Group = { key: keyof Criteria; labelKey: string; options: { value: number; label: string }[] }

const GROUPS: Group[] = [
  {
    key: 'maxPrice',
    labelKey: 'price',
    options: [
      { value: 60000, label: `under ${formatRupees(60000)}` },
      { value: 75000, label: `under ${formatRupees(75000)}` },
    ],
  },
  {
    key: 'minRange',
    labelKey: 'range',
    options: [
      { value: 70, label: '70 km +' },
      { value: 85, label: '85 km +' },
    ],
  },
  {
    key: 'minBatteryKwh',
    labelKey: 'battery',
    options: [
      { value: 2, label: '2.0 kWh +' },
      { value: 2.2, label: '2.2 kWh +' },
    ],
  },
]

/**
 * Filters are links, not form state — so they work without JavaScript, are shareable,
 * and every combination is a crawlable URL.
 */
export async function ModelFilters({
  locale,
  criteria,
}: {
  locale: string
  criteria: Criteria
}) {
  const t = await getTranslations({ locale, namespace: 'vehicles.filters' })
  const base = `/${locale}/vehicles`
  const active = Object.keys(criteria).length > 0

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-forest/12 bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-ink/60 uppercase">
          {t('heading')}
        </h2>
        {active && (
          <Link
            href={base}
            className="text-sm font-medium text-forest underline decoration-2 underline-offset-4 hover:decoration-turmeric"
          >
            {t('clear')}
          </Link>
        )}
      </div>

      {GROUPS.map((group) => (
        <fieldset key={group.key} className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-ink">{t(group.labelKey)}</legend>
          <div className="flex flex-wrap gap-2">
            {[{ value: undefined, label: t('any') }, ...group.options].map((option) => {
              const isActive = criteria[group.key] === option.value
              const next = { ...criteria }
              if (option.value === undefined) delete next[group.key]
              else next[group.key] = option.value

              return (
                <Link
                  key={String(option.value)}
                  href={`${base}${toSearchParams(next)}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={
                    isActive
                      ? 'rounded-full border-2 border-turmeric bg-turmeric/12 px-3 py-1 text-sm font-semibold text-ink'
                      : 'rounded-full border border-forest/20 px-3 py-1 text-sm text-ink/75 transition-colors hover:border-forest/45 hover:text-ink'
                  }
                >
                  {option.label}
                </Link>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
