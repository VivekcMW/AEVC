'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ChargeState } from '@/components/ui/ChargeState'

/**
 * Error boundary for any page under a known locale. `retry` re-fetches and re-renders
 * the segment (Next 16); `reset` is also available but only clears state without
 * re-fetching, so `retry` is the right default for "Try again".
 */
export default function RouteError({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string }
  retry: () => void
}>) {
  const t = useTranslations('common.error')
  const { locale } = useParams<{ locale: string }>()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-36">
      <ChargeState status="out" label={t('title')} />
      <p className="mt-4 max-w-md text-lg text-ink/65">{t('body')}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={retry}>
          {t('retry')}
        </Button>
        <Button variant="secondary" size="lg" href={`/${locale ?? 'en'}`}>
          {t('cta')}
        </Button>
      </div>
    </div>
  )
}
