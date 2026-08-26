import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Blueprint } from '@/components/blocks/Blueprint'
import { EarningsTable } from '@/components/blocks/EarningsTable'
import { LeadForm } from '@/components/blocks/LeadForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partner.promoter' })
  return { title: t('title'), description: t('intro') }
}

export default async function BecomeAPromoterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'partner.promoter' })
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
        <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex min-w-0 flex-col gap-8">
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

            <section>
              <h2 className="font-heading text-xl font-semibold text-ink">{t('earningsTitle')}</h2>
              <div className="mt-4">
                <EarningsTable />
              </div>
              <p className="mt-3 text-xs text-ink/70">{t('tierNotice')}</p>
            </section>

            <p className="rounded-md border-l-4 border-turmeric bg-surface p-4 text-sm text-ink/75">
              {t('kycNotice')}
            </p>
          </div>

          <LeadForm
            kind="promoter"
            fields={['name', 'phone', 'city']}
            namespace="partner.promoter.form"
          />
        </div>
      </div>
    </>
  )
}
