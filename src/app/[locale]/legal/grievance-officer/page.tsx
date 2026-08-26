import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { EnquiryForm } from '@/components/blocks/EnquiryForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grievance' })
  return { title: t('title'), description: t('intro') }
}

export default async function GrievancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'grievance' })

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-forest/12 bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-ink">{t('officerTitle')}</h2>
            <p className="mt-2 text-sm text-ink/75">{t('officerPending')}</p>
          </section>

          <section className="rounded-lg border border-forest/12 bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-ink">{t('channelsTitle')}</h2>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/70">Email</dt>
                <dd className="font-medium text-ink">{t('email')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/70">Phone</dt>
                <dd className="tnum font-medium text-ink">{t('phone')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/70">Hours</dt>
                <dd className="font-medium text-ink">{t('hours')}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-forest/12 bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-ink">{t('slaTitle')}</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/75">
              <li>{t('ackSla')}</li>
              <li>{t('resolutionSla')}</li>
            </ul>
          </section>
        </div>

        <EnquiryForm namespace="grievance" message="Grievance raised via the grievance page" />
      </div>
    </div>
  )
}
