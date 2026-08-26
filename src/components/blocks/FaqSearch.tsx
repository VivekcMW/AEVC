'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Accordion } from '@/components/ui/Accordion'
import { searchFaqs } from '@/lib/support/search'
import type { Faq } from '@/lib/data/types'

export function FaqSearch({ faqs }: { faqs: Faq[] }) {
  const t = useTranslations('support')
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchFaqs(faqs, query), [faqs, query])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="faq-search" className="text-sm font-medium text-ink">
          {t('searchLabel')}
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-md border border-forest/25 bg-white px-4 py-3 text-ink placeholder:text-ink/35"
        />
      </div>

      <p role="status" className="text-sm text-ink/70">
        {t('resultCount', { count: results.length })}
      </p>

      {results.length > 0 ? (
        <Accordion items={results} />
      ) : (
        <div className="rounded-lg border border-dashed border-forest/25 bg-surface p-6 text-center">
          <p className="font-medium text-ink">{t('noMatchTitle')}</p>
          <p className="mt-1 text-sm text-ink/70">{t('noMatchBody')}</p>
          <Link
            href={`/${locale}/support/raise-an-issue`}
            className="mt-4 inline-block font-semibold text-forest underline decoration-2 underline-offset-4"
          >
            {t('raiseIssue')}
          </Link>
        </div>
      )}
    </div>
  )
}
