import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { PriceDual } from '@/components/ui/PriceDual'
import { calculateEmi, scheme } from '@/lib/emi'
import { formatRupees } from '@/lib/format'
import type { VehicleModel } from '@/lib/data/types'
import { Blueprint } from './Blueprint'
import { CircledWord } from './CircledWord'
import { VehicleGlyph } from './VehicleGlyph'

const LONGEST_TENURE = scheme.tenures[scheme.tenures.length - 1]
const TICKER = ['noBank', 'noCreditCheck', 'monthly', 'soh', 'delivery'] as const

export async function Hero({ locale, models }: { locale: string; models: VehicleModel[] }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  // The headline number is the cheapest entry point across the range — the figure a
  // first-time buyer is actually deciding on.
  const cheapest = models.reduce((a, b) => (a.priceInr <= b.priceInr ? a : b))
  const entry = calculateEmi({ priceInr: cheapest.priceInr, tenureMonths: LONGEST_TENURE })

  return (
    <section className="relative isolate flex min-h-[88svh] flex-col overflow-hidden bg-forest text-white">
      <Blueprint />

      {/* The vehicle sits behind the type at scale, the way a photograph would. */}
      <VehicleGlyph
        colour="transparent"
        label=""
        className="pointer-events-none absolute right-0 bottom-[22%] h-[38%] w-[96%] text-white/[0.06] sm:w-[70%] lg:top-1/2 lg:right-[2%] lg:bottom-auto lg:h-[46%] lg:w-[46%] lg:-translate-y-[46%]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-28 pb-12 sm:px-8 lg:pt-32 lg:pb-16">
        <p className="enter-stagger font-heading text-xs font-semibold tracking-[0.22em] text-turmeric uppercase">
          <span className="inline-block">{t('heroEyebrow')}</span>
        </p>

        {/* Transform only, no fade: this is the LCP candidate and must paint immediately. */}
        <h1 className="display enter-rise mt-6 max-w-[17ch] text-display-md">
          {t('heroTitleBefore')} <CircledWord>{t('heroTitleRinged')}</CircledWord>{' '}
          {t('heroTitleAfter')}
        </h1>

        <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <p className="enter-stagger enter-delay-1 max-w-md text-lg text-white/75 sm:text-xl">
            <span className="inline-block">{t('heroBody')}</span>
          </p>

          <div className="enter-stagger enter-delay-2 flex flex-col items-start gap-5 lg:items-end">
            <PriceDual
              full={cheapest.priceInr}
              monthly={entry.monthly}
              tenure={entry.tenureMonths}
              size="md"
              tone="light"
            />
            {/* Full-width taps on mobile; nowrap only where the line actually fits. */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button
                variant="primary"
                size="lg"
                href={`/${locale}/emi/calculator`}
                className="w-full text-center sm:w-auto sm:whitespace-nowrap"
              >
                {t('heroCta', { amount: formatRupees(entry.monthly) })}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                href={`/${locale}/vehicles`}
                className="w-full text-center !border-white/35 !text-white hover:!bg-white hover:!text-forest sm:w-auto sm:whitespace-nowrap"
              >
                {t('heroSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature ticker. Carries the differentiators without another block of prose. */}
      <div className="enter-stagger enter-delay-3 relative border-t border-white/12">
        <ul className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-5 py-4 text-sm whitespace-nowrap text-white/70 sm:px-8 [&::-webkit-scrollbar]:hidden">
          {TICKER.map((item) => (
            <li key={item} className="flex shrink-0 items-center gap-2.5">
              <span aria-hidden className="beam-lay h-px w-5 bg-turmeric" />
              {t(`ticker.${item}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
