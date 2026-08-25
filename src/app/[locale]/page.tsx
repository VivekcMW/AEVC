import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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

      <section className="border-t border-forest/12 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
                {t('modelsTitle')}
              </h2>
              <p className="mt-2 text-ink/70">{t('modelsBody')}</p>
            </div>
            <Link
              href={`/${locale}/vehicles`}
              className="text-sm font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-turmeric"
            >
              {tc('cta.seeAllModels')} →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <ModelCard key={model.slug} model={model} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator teaser. The accent is spent on the hero, so this leads with a rule. */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="relative overflow-hidden rounded-lg border-l-4 border-turmeric bg-surface p-6 sm:p-10">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
              {t('calcTeaserTitle')}
            </h2>
            <p className="mt-3 text-ink/75">{t('calcTeaserBody')}</p>
            <Link
              href={`/${locale}/emi/calculator`}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-forest px-5 py-2.5 font-medium text-white transition-colors hover:bg-forest-hover"
            >
              {tc('cta.calculate')}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <TrustBadges locale={locale} />

      {/*
        Renders only when a real, approved testimonial exists. Every placeholder is
        approved: false, so nothing shows here today — see src/lib/legal/testimonials.ts.
      */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <ul className="grid gap-5 sm:grid-cols-3">
            {testimonials.map((item) => (
              <li key={item.id} className="rounded-lg border border-forest/12 bg-surface p-5">
                <blockquote className="text-ink/85">“{item.quote}”</blockquote>
                <p className="mt-3 text-sm text-ink/60">
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
