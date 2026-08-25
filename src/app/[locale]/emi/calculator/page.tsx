import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { EmiCalculator } from '@/components/blocks/EmiCalculator'
import { EmiInterestForm } from '@/components/blocks/EmiInterestForm'
import { getModels } from '@/lib/data/models'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'emi.calculator' })
  return { title: t('title'), description: t('intro') }
}

export default async function CalculatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ model?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const { model: initialSlug } = await searchParams
  const t = await getTranslations({ locale, namespace: 'emi.calculator' })
  const models = await getModels()

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 sm:pt-36 pb-20 sm:px-8 lg:pb-28">
      <header className="max-w-2xl">
        <h1 className="display text-display-sm text-ink">
          {t('title')}
        </h1>
        <span aria-hidden className="mt-4 block h-0.5 w-16 bg-turmeric" />
        <p className="mt-4 text-ink/75">{t('intro')}</p>
      </header>

      <div className="mt-8">
        <EmiCalculator models={models} initialSlug={initialSlug} />
      </div>

      {/*
        Section 5.4 wants the calculator to deep-link into enrollment. Enrollment ships
        with checkout, so this captures the lead and says so rather than presenting a
        flow that dead-ends.
      */}
      <div className="mt-10 max-w-3xl">
        <EmiInterestForm modelSlug={initialSlug} />
      </div>
    </div>
  )
}
