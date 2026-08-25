import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { Blueprint } from '@/components/blocks/Blueprint'
import { EmiStrip } from '@/components/blocks/EmiStrip'
import { Hero } from '@/components/blocks/Hero'
import { ModelCard } from '@/components/blocks/ModelCard'
import { TrustBadges } from '@/components/blocks/TrustBadges'
import { getModels } from '@/lib/data/models'
import { getApprovedTestimonials } from '@/lib/legal/testimonials'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const models = await getModels()
  const testimonials = await getApprovedTestimonials()

  return (
    <>
      <Hero locale={locale} models={models} />
      <EmiStrip locale={locale} />

      <section className="border-t border-forest/12">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="display text-display-sm text-ink">{t('modelsTitle')}</h2>
              <p className="mt-5 text-lg text-ink/65">{t('modelsBody')}</p>
            </div>
            <Link
              href={`/${locale}/vehicles`}
              className="rounded-pill border border-forest/25 px-5 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white"
            >
              {tc('cta.seeAllModels')} →
            </Link>
          </div>

          <div className="reveal-stagger mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <ModelCard key={model.slug} model={model} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed Forest band. The accent is spent on the hero, so this leads on scale. */}
      <section className="relative isolate overflow-hidden bg-forest text-white">
        <Blueprint />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
          <div className="reveal max-w-3xl">
            <h2 className="display text-display-sm">{t('calcTeaserTitle')}</h2>
            <p className="mt-6 text-lg text-white/75 sm:text-xl">{t('calcTeaserBody')}</p>
            <div className="mt-10">
              <Button
                variant="ghost"
                size="lg"
                href={`/${locale}/emi/calculator`}
                className="!border-white/35 !text-white hover:!bg-white hover:!text-forest"
              >
                {tc('cta.calculate')} →
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges locale={locale} />

      {/*
        Renders only when a real, approved testimonial exists. Every placeholder is
        approved: false, so nothing shows here today — see src/lib/legal/testimonials.ts.
      */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <ul className="grid gap-10 sm:grid-cols-3">
            {testimonials.map((item) => (
              <li key={item.id} className="border-t border-forest/15 pt-5">
                <blockquote className="text-xl leading-snug text-ink/85">“{item.quote}”</blockquote>
                <p className="mt-4 text-sm text-ink/55">
                  {item.name} · {item.city}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
