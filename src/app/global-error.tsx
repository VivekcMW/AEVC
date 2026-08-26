'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { routing } from '@/i18n/routing'
import { fontClassNames } from '@/lib/fonts.loaders'
import './globals.css'

// Catches errors thrown in [locale]/layout.tsx itself (our de-facto root layout) or in
// error.tsx. Must define its own html/body and can't rely on next-intl or metadata exports.

export default function GlobalError({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string }
  retry: () => void
}>) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang={routing.defaultLocale} className={fontClassNames(routing.defaultLocale)}>
      <body className="flex min-h-dvh flex-col items-center justify-center bg-mist px-5 py-20 text-center text-ink">
        <h1 className="display text-display-sm text-ink">Something went wrong.</h1>
        <p className="mt-4 max-w-md text-lg text-ink/65">
          That&apos;s on us, not you. Try again, or head back to safer ground.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="lg" onClick={retry}>
            Try again
          </Button>
          <Button variant="secondary" size="lg" href={`/${routing.defaultLocale}`}>
            Back to home
          </Button>
        </div>
      </body>
    </html>
  )
}
