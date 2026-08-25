import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PriceDual } from '@/components/ui/PriceDual'
import { calculateEmi, scheme } from '@/lib/emi'
import type { VehicleModel } from '@/lib/data/types'
import { VehicleGlyph } from './VehicleGlyph'

const LONGEST_TENURE = scheme.tenures[scheme.tenures.length - 1]

export function ModelCard({ model, locale = 'en' }: { model: VehicleModel; locale?: string }) {
  const t = useTranslations('common')
  const emi = calculateEmi({ priceInr: model.priceInr, tenureMonths: LONGEST_TENURE })
  const href = `/${locale}/vehicles/${model.slug}`

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-forest/12 bg-surface transition-colors hover:border-forest/30">
      <div className="relative border-b border-forest/10 bg-mist px-5 pt-6 pb-3">
        <VehicleGlyph
          colour={model.colours[0].hex}
          label={`${model.name} technical illustration`}
          className="mx-auto h-32 w-full text-forest"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-heading text-xl font-semibold text-ink">
            <Link href={href} className="underline-offset-4 hover:underline">
              {model.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-ink/65">{model.tagline}</p>
        </div>

        <dl className="tnum grid grid-cols-3 gap-3 border-y border-forest/10 py-3 text-sm">
          {[
            { label: t('spec.range'), value: `${model.rangeKm} km` },
            { label: t('spec.topSpeed'), value: `${model.topSpeedKmph} km/h` },
            { label: t('spec.battery'), value: `${model.batteryKwh} kWh` },
          ].map((spec) => (
            <div key={spec.label}>
              <dt className="text-[0.6875rem] tracking-wide text-ink/55 uppercase">{spec.label}</dt>
              <dd className="mt-0.5 font-medium text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-col gap-3">
          <PriceDual full={model.priceInr} monthly={emi.monthly} tenure={emi.tenureMonths} size="sm" />
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 transition-colors hover:decoration-turmeric"
          >
            {t('cta.viewModel')}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}
