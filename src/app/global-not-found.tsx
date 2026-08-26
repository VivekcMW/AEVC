import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { AdharaMark } from '@/components/blocks/AdharaMark'
import { routing } from '@/i18n/routing'
import { fontClassNames } from '@/lib/fonts.loaders'
import './globals.css'

// Catches URLs that never resolve to the [locale] segment at all (bad/missing locale
// prefix, malformed paths). No root layout exists — [locale]/layout.tsx stands in for
// it — so per Next's global-not-found convention this owns its own html/body and is
// enabled via `experimental.globalNotFound` in next.config.ts.

export const metadata: Metadata = {
  title: 'Page not found · Adhara Energy',
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale} className={fontClassNames(routing.defaultLocale)}>
      <body className="flex min-h-dvh flex-col items-center justify-center bg-mist px-5 py-20 text-center text-ink">
        <AdharaMark aria-hidden className="h-9 w-auto text-forest/20" />
        <h1 className="display mt-6 text-display-sm text-ink">This page took a wrong turn.</h1>
        <p className="mt-4 max-w-md text-lg text-ink/65">
          We couldn&apos;t find what you were looking for. It may have moved, or the link might
          be off by a letter.
        </p>
        <Button variant="primary" size="lg" href={`/${routing.defaultLocale}`} className="mt-8">
          Back to home
        </Button>
      </body>
    </html>
  )
}
