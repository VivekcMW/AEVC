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
    /*
     * One link per card, stretched over the whole surface. Three separate links to the
     * same destination made the card clickable but announced the model name three times.
     */
    <article className="group relative flex flex-col">
      <div className="overflow-hidden rounded-2xl bg-forest/[0.045] px-6 py-10 transition-colors group-hover:bg-forest/[0.08]">
        <VehicleGlyph
          colour={model.colours[0].hex}
          label={`${model.name} technical illustration`}
          className="mx-auto h-36 w-full text-forest/45 transition-transform duration-500 group-hover:scale-[1.03] sm:h-40"
        />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <h3 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">
          <Link
            href={href}
            className="underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {model.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-ink/60">{model.tagline}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-forest/15 pt-5">
          {[
            { label: t('spec.range'), value: model.rangeKm, unit: 'km' },
            { label: t('spec.topSpeed'), value: model.topSpeedKmph, unit: 'km/h' },
            { label: t('spec.battery'), value: model.batteryKwh, unit: 'kWh' },
          ].map((spec) => (
            <div key={spec.label}>
              <dt className="text-xs tracking-wide text-ink/45">{spec.label}</dt>
              <dd className="figure mt-1 text-xl text-ink">
                {spec.value}
                <span className="ml-1 text-sm font-normal text-ink/50">{spec.unit}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-col gap-4 pt-6">
          <PriceDual full={model.priceInr} monthly={emi.monthly} tenure={emi.tenureMonths} size="sm" />
          {/* Visual affordance only — the stretched link above already owns the click. */}
          <span className="inline-flex items-center gap-2 self-start rounded-pill border border-forest/25 px-5 py-2.5 text-sm font-medium text-forest transition-colors group-hover:bg-forest group-hover:text-white">
            {t('cta.viewModel')}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </article>
  )
}
