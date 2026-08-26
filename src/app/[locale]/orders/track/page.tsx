import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { OrderTrackingView } from '@/components/blocks/OrderTrackingView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'orders' })
  return { title: t('title'), description: t('intro'), robots: { index: false } }
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'orders' })

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>
      <p className="mt-4 rounded-md border-l-4 border-turmeric bg-surface p-4 text-sm text-ink/75">
        {t('placeholderNotice')}
      </p>
      <div className="mt-8">
        <OrderTrackingView />
      </div>
    </div>
  )
}
