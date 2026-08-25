import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { formatRupees } from '@/lib/format'
import { calculateEmi, scheme } from '@/lib/emi'
import type { VehicleModel } from '@/lib/data/types'
import { Blueprint } from './Blueprint'
import { VehicleGlyph } from './VehicleGlyph'

const LONGEST_TENURE = scheme.tenures[scheme.tenures.length - 1]

export async function Hero({ locale, models }: { locale: string; models: VehicleModel[] }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  // The headline number is the cheapest entry point across the range — the figure a
  // first-time buyer is actually deciding on.
  const cheapest = models.reduce((a, b) => (a.priceInr <= b.priceInr ? a : b))
  const entry = calculateEmi({ priceInr: cheapest.priceInr, tenureMonths: LONGEST_TENURE })

  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <Blueprint />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:pt-16 lg:pb-20">
        <div className="flex flex-col items-start">
          <p className="font-heading text-xs font-semibold tracking-[0.2em] text-turmeric uppercase">
            {t('heroEyebrow')}
          </p>

          <h1 className="mt-4 max-w-xl text-[2rem] leading-[1.08] font-bold tracking-[-0.02em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            {t('heroTitle')}
          </h1>

          <span aria-hidden className="mt-6 block h-0.5 w-24 bg-turmeric" />

          <p className="mt-6 max-w-md text-base text-white/80 sm:text-lg">{t('heroBody')}</p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              variant="primary"
              size="lg"
              href={`/${locale}/emi/calculator`}
              className="whitespace-nowrap"
            >
              {t('heroCta', { amount: formatRupees(entry.monthly) })}
            </Button>
            <Button variant="ghost" href={`/${locale}/vehicles`} className="whitespace-nowrap !text-white/85">
              {t('heroSecondary')}
            </Button>
          </div>
        </div>

        {/* Technical illustration, not a photograph — see the design note in VehicleGlyph. */}
        <div className="relative">
          <div className="rounded-lg border border-white/12 bg-white/[0.03] p-5 backdrop-blur-[1px]">
            <VehicleGlyph
              colour={cheapest.colours[0].hex}
              label={`${cheapest.name} technical illustration`}
              className="h-44 w-full text-white sm:h-56"
            />
            <dl className="tnum mt-4 grid grid-cols-3 gap-3 border-t border-white/12 pt-4 text-sm">
              {[
                { k: 'Model', v: cheapest.name },
                { k: 'Range', v: `${cheapest.rangeKm} km` },
                { k: 'From', v: `${formatRupees(entry.monthly)}/mo` },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="text-[0.6875rem] tracking-wide text-white/50 uppercase">{row.k}</dt>
                  <dd className="mt-0.5 font-medium text-white">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
