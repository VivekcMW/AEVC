import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AdharaMark } from '@/components/blocks/AdharaMark'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'maintenance' })
  return { title: t('title'), description: t('body'), robots: { index: false } }
}

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'maintenance' })

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-36">
      <AdharaMark aria-hidden className="h-9 w-auto text-forest/20" />
      <h1 className="display mt-6 text-display-sm text-ink">{t('title')}</h1>
      <p className="mt-4 max-w-md text-lg text-ink/65">{t('body')}</p>
      <p className="mt-2 text-sm font-medium text-ink/70">{t('eta')}</p>
      <p className="mt-6 text-sm text-ink/70">{t('contactNote')}</p>
    </div>
  )
}
