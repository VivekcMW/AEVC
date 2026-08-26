import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'accessibility' })
  return { title: t('title'), description: t('intro') }
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'accessibility' })

  const features = ['featureContrast', 'featureKeyboard', 'featureMotion', 'featureFocus'] as const

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 flex flex-col gap-8">
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink">{t('standardTitle')}</h2>
          <p className="mt-2 text-ink/75">{t('standardBody')}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ink">{t('featuresTitle')}</h2>
          <ul className="mt-3 flex flex-col gap-2 rounded-lg border border-forest/12 bg-surface p-5 text-sm text-ink/80">
            {features.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border-l-4 border-turmeric bg-surface p-5">
          <h2 className="font-heading text-lg font-semibold text-ink">{t('feedbackTitle')}</h2>
          <p className="mt-2 text-sm text-ink/75">{t('feedbackBody')}</p>
          <p className="mt-2 text-sm font-medium text-ink">{t('email')}</p>
        </section>
      </div>
    </div>
  )
}
