import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { PriceDual } from '@/components/ui/PriceDual'
import { ColourSwitcher } from '@/components/blocks/ColourSwitcher'
import { ServiceabilityCheck } from '@/components/blocks/ServiceabilityCheck'
import { SpecTable } from '@/components/blocks/SpecTable'
import { StickyCtaBar } from '@/components/blocks/StickyCtaBar'
import { getFaqs } from '@/lib/data/faqs'
import { getModel, getModels } from '@/lib/data/models'
import { calculateEmi, scheme } from '@/lib/emi'
import { formatRupees } from '@/lib/format'
import { Claim } from '@/lib/legal/Claim'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  const models = await getModels()
  return routing.locales.flatMap((locale) => models.map((m) => ({ locale, slug: m.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) return {}
  return { title: model.name, description: model.tagline }
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const model = await getModel(slug)
  if (!model) notFound()

  const t = await getTranslations({ locale, namespace: 'model' })
  const faqs = await getFaqs(model.faqIds)
  const tenures = scheme.tenures.map((tenure) =>
    calculateEmi({ priceInr: model.priceInr, tenureMonths: tenure }),
  )
  const longest = tenures[tenures.length - 1]

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-32 sm:pt-36 pb-20 sm:px-8 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <ColourSwitcher
            colours={model.colours}
            modelName={model.name}
            title={t('colourTitle')}
          />

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="display text-display-sm text-ink">
                {model.name}
              </h1>
              <p className="mt-3 text-xl text-ink/60">{model.tagline}</p>
            </div>

            {/* Dual pricing across every offered tenure — never a monthly figure alone. */}
            <div className="flex flex-col gap-3 rounded-lg border-l-4 border-turmeric bg-surface p-5">
              <PriceDual
                full={model.priceInr}
                monthly={longest.monthly}
                tenure={longest.tenureMonths}
                size="lg"
              />
              <dl className="tnum flex flex-wrap gap-x-6 gap-y-2 border-t border-forest/10 pt-3 text-sm">
                {tenures.map((emi) => (
                  <div key={emi.tenureMonths}>
                    <dt className="text-ink/55">{emi.tenureMonths} months</dt>
                    <dd className="font-medium text-ink">{formatRupees(emi.monthly)}/mo</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href={`/${locale}/emi/calculator?model=${model.slug}`}>
                {t('cta.emi')}
              </Button>
              <Button variant="secondary" disabled title={t('cta.buyPending')}>
                {t('cta.buyPending')}
              </Button>
            </div>

            <ServiceabilityCheck modelSlug={model.slug} locale={locale} />
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <SpecTable specs={model.specs} title={t('specsTitle')} />

          <div className="flex flex-col gap-8">
            <section>
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">
                {t('classificationTitle')}
              </h2>
              <span aria-hidden className="mt-3 block h-0.5 w-12 bg-turmeric" />
              <p className="mt-4 rounded-lg border border-forest/12 bg-surface p-5 text-sm leading-relaxed text-ink/85">
                <Claim id="no-registration" />
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">{t('faqTitle')}</h2>
              <span aria-hidden className="mt-3 block h-0.5 w-12 bg-turmeric" />
              <div className="mt-4">
                <Accordion items={faqs} />
              </div>
            </section>
          </div>
        </div>
      </div>

      <StickyCtaBar
        full={model.priceInr}
        monthly={longest.monthly}
        tenure={longest.tenureMonths}
        href={`/${locale}/emi/calculator?model=${model.slug}`}
        label={t('cta.emi')}
      />
    </>
  )
}
