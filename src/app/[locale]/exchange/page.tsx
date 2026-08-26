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
  const t = await getTranslations({ locale, namespace: 'exchange' })
  return { title: t('title'), description: t('intro') }
}

export default async function ExchangePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'exchange' })
  const steps = ['step1', 'step2', 'step3'] as const

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
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            <section>
              <h2 className="font-heading text-xl font-semibold text-ink">{t('howTitle')}</h2>
              <ol className="mt-4 flex flex-col gap-3">
                {steps.map((key, i) => (
                  <li key={key} className="flex gap-4 border-t border-forest/15 pt-3">
                    <span aria-hidden className="figure text-2xl text-forest/45">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-ink/80">{t(key)}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-md border-l-4 border-turmeric bg-surface p-4">
              <h2 className="font-heading text-sm font-semibold text-ink">{t('noteTitle')}</h2>
              <p className="mt-1 text-sm text-ink/75">{t('noteBody')}</p>
            </section>
          </div>

          <EnquiryForm namespace="exchange" message="Vehicle exchange estimate request" />
        </div>
      </div>
    </>
  )
}
