import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { DealerList } from '@/components/blocks/DealerList'
import { IndiaMap } from '@/components/blocks/IndiaMap'
import { findDealersNear, getDealers } from '@/lib/data/dealers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dealers' })
  return { title: t('title'), description: t('intro') }
}

export default async function DealersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ near?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { near } = await searchParams
  const t = await getTranslations({ locale, namespace: 'dealers' })

  const dealers = near ? await findDealersNear(near) : await getDealers()

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{t('intro')}</p>

      <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="near" className="text-sm font-medium text-ink">
            {t('searchLabel')}
          </label>
          <input
            id="near"
            name="near"
            defaultValue={near}
            placeholder="411001"
            className="tnum w-48 rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-forest px-5 py-2.5 font-medium text-white transition-colors hover:bg-forest-hover"
        >
          {t('search')}
        </button>
      </form>

      <p className="tnum mt-6 text-sm font-medium text-ink/60">
        {near ? t('nearest') : t('all')} · {t('count', { count: dealers.length })}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <IndiaMap dealers={dealers} />
        <DealerList dealers={dealers} />
      </div>
    </div>
  )
}
