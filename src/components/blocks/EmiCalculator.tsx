'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Field } from '@/components/ui/Field'
import type { VehicleModel } from '@/lib/data/types'
import { calculateEmi, scheme } from '@/lib/emi'
import { formatRupees } from '@/lib/format'

const selectClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink ' +
  'focus-visible:border-forest'

export function EmiCalculator({
  models,
  initialSlug,
}: {
  models: VehicleModel[]
  initialSlug?: string
}) {
  const t = useTranslations('emi.calculator')
  const tc = useTranslations('common.spec')
  const [slug, setSlug] = useState(
    initialSlug && models.some((m) => m.slug === initialSlug) ? initialSlug : models[0].slug,
  )
  const [tenure, setTenure] = useState<number>(scheme.tenures[0])

  const model = models.find((m) => m.slug === slug) ?? models[0]
  const emi = calculateEmi({ priceInr: model.priceInr, tenureMonths: tenure })

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="flex flex-col gap-5 rounded-lg border border-forest/12 bg-surface p-5 sm:p-6">
        <Field id="emi-model" label={t('model')}>
          <select
            id="emi-model"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={selectClass}
          >
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name} — {formatRupees(m.priceInr)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="emi-tenure" label={t('tenure')}>
          <select
            id="emi-tenure"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className={selectClass}
          >
            {scheme.tenures.map((months) => (
              <option key={months} value={months}>
                {t('months', { count: months })}
              </option>
            ))}
          </select>
        </Field>

        <dl className="tnum flex flex-wrap gap-x-8 gap-y-2 border-t border-forest/10 pt-4 text-sm">
          <div>
            <dt className="text-ink/55">{tc('range')}</dt>
            <dd className="font-medium text-ink">{model.rangeKm} km</dd>
          </div>
          <div>
            <dt className="text-ink/55">{tc('battery')}</dt>
            <dd className="font-medium text-ink">{model.batteryKwh} kWh</dd>
          </div>
          <div>
            <dt className="text-ink/55">{tc('fullPrice')}</dt>
            <dd className="font-medium text-ink">{formatRupees(model.priceInr)}</dd>
          </div>
        </dl>
      </div>

      {/*
        The monthly figure never appears without its total and premium. Job J3 sells
        transparent terms; a calculator that hides the cost of the scheme would sell the
        opposite. There is deliberately no state in which these three come apart.
      */}
      <div className="tnum relative overflow-hidden rounded-lg bg-forest p-6 text-white sm:p-8">
        <div>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-turmeric uppercase">
            {t('monthly')}
          </p>
          <p
            data-testid="emi-monthly"
            className="mt-2 font-heading text-[2.75rem] leading-none font-bold sm:text-5xl"
          >
            {formatRupees(emi.monthly)}
          </p>
          <p className="mt-1 text-sm text-white/65">
            × {t('months', { count: emi.tenureMonths })}
          </p>
        </div>

        <span aria-hidden className="mt-6 mb-5 block h-0.5 w-16 bg-turmeric" />

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-white/60">{t('total')}</dt>
            <dd data-testid="emi-total" className="mt-0.5 text-xl font-semibold">
              {formatRupees(emi.total)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-white/60">{t('premium')}</dt>
            <dd data-testid="emi-premium" className="mt-0.5 text-xl font-semibold text-charge-low">
              {formatRupees(emi.premium)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-white/60">{t('eligibility')}</dt>
            <dd data-testid="emi-eligibility" className="mt-0.5 text-xl font-semibold">
              {t('eligibilityValue', { count: emi.eligibilityAfterPayments })}
            </dd>
          </div>
        </dl>

        <p className="mt-6 border-t border-white/12 pt-4 text-sm text-white/75">
          {t('transparencyNote', { amount: formatRupees(model.priceInr) })}
        </p>
      </div>
    </div>
  )
}
