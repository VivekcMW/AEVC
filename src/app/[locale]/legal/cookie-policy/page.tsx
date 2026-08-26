import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cookiePolicy' })
  return { title: t('title'), description: t('intro') }
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'cookiePolicy' })

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 flex flex-col gap-8">
        <section>
          <h2 className="font-heading text-xl font-semibold text-ink">{t('whatTitle')}</h2>
          <p className="mt-2 text-ink/75">{t('whatBody')}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ink">{t('categoriesTitle')}</h2>
          <ul className="mt-3 flex flex-col gap-2 rounded-lg border border-forest/12 bg-surface p-5 text-sm text-ink/80">
            <li>{t('essential')}</li>
            <li>{t('analytics')}</li>
            <li>{t('marketing')}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ink">{t('controlTitle')}</h2>
          <p className="mt-2 text-ink/75">{t('controlBody')}</p>
        </section>

        <p className="rounded-md border-l-4 border-turmeric bg-surface p-4 text-sm text-ink/75">
          {t('reviewNotice')}
        </p>
      </div>
    </div>
  )
}
