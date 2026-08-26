import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { FaqSearch } from '@/components/blocks/FaqSearch'
import { getFaqCategories, getFaqs } from '@/lib/data/faqs'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'support' })
  return { title: t('title'), description: t('intro') }
}

export default async function SupportPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { category } = await searchParams
  const t = await getTranslations({ locale, namespace: 'support' })

  const categories = await getFaqCategories()
  const allFaqs = await getFaqs()
  const faqs = category ? allFaqs.filter((f) => f.category === category) : allFaqs

  const entries = [
    { href: `/${locale}/support/raise-an-issue`, label: t('raiseIssue') },
    { href: `/${locale}/support/warranty`, label: t('warranty') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10">
        <FaqSearch faqs={faqs} />
      </div>

      <nav aria-label={t('categories')} className="mt-8">
        <h2 className="text-sm font-medium text-ink/60">{t('categories')}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          <li>
            <Link
              href={`/${locale}/support`}
              className={`rounded-pill border px-4 py-1.5 text-sm ${!category ? 'border-turmeric bg-turmeric/12 font-semibold text-ink' : 'border-forest/20 text-ink/75'}`}
            >
              {t('allCategories')}
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <Link
                href={`/${locale}/support?category=${encodeURIComponent(c)}`}
                className={`rounded-pill border px-4 py-1.5 text-sm ${category === c ? 'border-turmeric bg-turmeric/12 font-semibold text-ink' : 'border-forest/20 text-ink/75'}`}
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-lg border border-forest/12 bg-surface p-5 text-center font-medium text-ink transition-colors hover:border-forest/30"
          >
            {entry.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
