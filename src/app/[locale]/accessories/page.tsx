import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Blueprint } from '@/components/blocks/Blueprint'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'accessories' })
  return { title: t('title'), description: t('intro') }
}

const ITEMS = ['helmet', 'phoneHolder', 'sideBags', 'charger', 'raincover'] as const

export default async function AccessoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'accessories' })

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <Blueprint />
        <div className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
          <h1 className="display max-w-[18ch] text-display-md">{t('title')}</h1>
          <span aria-hidden className="beam-lay mt-6 block h-0.5 w-24 bg-turmeric" />
          <p className="mt-6 max-w-xl text-lg text-white/80">{t('intro')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <h2 className="font-heading text-xl font-semibold text-ink">{t('catalogTitle')}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between gap-3 rounded-lg border border-forest/12 bg-surface p-5"
            >
              <span className="font-medium text-ink">{t(item)}</span>
              <span className="tnum text-ink/70">{t(`${item}Price`)}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl rounded-md border-l-4 border-turmeric bg-surface p-4 text-sm text-ink/75">
          {t('placeholderNotice')}
        </p>

        <div className="mt-10 max-w-xl">
          <EnquiryForm namespace="accessories" message="Accessory enquiry" />
        </div>
      </div>
    </>
  )
}
