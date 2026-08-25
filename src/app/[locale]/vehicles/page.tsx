import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ModelCard } from '@/components/blocks/ModelCard'
import { ModelFilters } from '@/components/blocks/ModelFilters'
import { filterModels, parseCriteria } from '@/lib/data/filter'
import { getModels } from '@/lib/data/models'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'vehicles' })
  return { title: t('title'), description: t('intro') }
}

export default async function VehiclesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const raw = await searchParams
  const query = new URLSearchParams(
    Object.entries(raw).flatMap(([k, v]) =>
      v === undefined ? [] : [[k, Array.isArray(v) ? (v[0] ?? '') : v] as [string, string]],
    ),
  )
  const criteria = parseCriteria(query)

  const t = await getTranslations({ locale, namespace: 'vehicles' })
  const all = await getModels()
  const models = filterModels(all, criteria)

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 sm:pt-36 pb-20 sm:px-8 lg:pb-28">
      <header className="max-w-2xl">
        <h1 className="display text-display-sm text-ink">
          {t('title')}
        </h1>
        <span aria-hidden className="mt-4 block h-0.5 w-16 bg-turmeric" />
        <p className="mt-4 text-ink/75">{t('intro')}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_1fr] lg:items-start">
        <ModelFilters locale={locale} criteria={criteria} />

        <div>
          <p className="tnum text-sm font-medium text-ink/70">
            {t('filters.results', { count: models.length })}
          </p>

          {models.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-forest/25 bg-surface p-8 text-center">
              <p className="text-ink/75">{t('empty')}</p>
              <Link
                href={`/${locale}/vehicles`}
                className="mt-3 inline-block font-semibold text-forest underline decoration-2 underline-offset-4 hover:decoration-turmeric"
              >
                {t('filters.clear')}
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {models.map((model) => (
                <ModelCard key={model.slug} model={model} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
