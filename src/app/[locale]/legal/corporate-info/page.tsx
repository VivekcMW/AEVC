import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'corporateInfo' })
  return { title: t('title'), description: t('intro') }
}

export default async function CorporateInfoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'corporateInfo' })

  const rows = [
    { label: t('legalNameTitle'), value: t('legalName') },
    { label: t('cinTitle'), value: t('cinPending') },
    { label: t('gstinTitle'), value: t('gstinPending') },
    { label: t('addressTitle'), value: t('addressPending') },
  ]

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>

      <dl className="tnum mt-10 divide-y divide-forest/12 rounded-lg border border-forest/12 bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-5">
            <dt className="text-sm text-ink/70">{row.label}</dt>
            <dd className="text-right font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8 rounded-lg border border-forest/12 bg-surface p-5">
        <h2 className="font-heading text-lg font-semibold text-ink">{t('contactTitle')}</h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink/70">Email</dt>
            <dd className="font-medium text-ink">{t('email')}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink/70">Phone</dt>
            <dd className="tnum font-medium text-ink">{t('phone')}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
