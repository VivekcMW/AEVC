import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BuyFlow } from '@/components/blocks/BuyFlow'
import { getModel, getModels } from '@/lib/data/models'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  const models = await getModels()
  return routing.locales.flatMap((locale) => models.map((m) => ({ locale, slug: m.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) return {}
  return { title: `Buy ${model.name}`, robots: { index: false } }
}

export default async function BuyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const model = await getModel(slug)
  if (!model) notFound()

  const t = await getTranslations({ locale, namespace: 'buy' })

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title', { model: model.name })}</h1>
      <div className="mt-8">
        <BuyFlow model={model} locale={locale} />
      </div>
    </div>
  )
}
