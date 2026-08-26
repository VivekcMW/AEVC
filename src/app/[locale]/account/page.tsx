import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AccountView } from '@/components/blocks/AccountView'
import { getModels } from '@/lib/data/models'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return { title: t('title'), robots: { index: false } }
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const models = await getModels()

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <AccountView demoModel={models[0]} />
    </div>
  )
}
