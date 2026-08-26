import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LeadForm } from '@/components/blocks/LeadForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'support.issue' })
  return { title: t('title'), description: t('intro') }
}

export default async function RaiseAnIssuePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'support.issue' })

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-8">
        <LeadForm
          kind="issue"
          fields={['name', 'phone', 'reference', 'message']}
          namespace="support.issue.form"
        />
      </div>
    </div>
  )
}
