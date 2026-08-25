import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Wordmark } from './Wordmark'

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const nav = [
    { href: `/${locale}/vehicles`, label: t('nav.vehicles') },
    { href: `/${locale}/emi`, label: t('nav.emi') },
    { href: `/${locale}/emi/calculator`, label: t('nav.calculator') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-turmeric focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {t('skipToContent')}
      </a>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="shrink-0 text-white">
          <Wordmark variant="crossbar" className="text-base sm:text-lg" />
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 underline-offset-8 transition-colors hover:text-white hover:underline hover:decoration-turmeric hover:decoration-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <LocaleSwitcher />
        </div>
      </div>

      {/* Mobile nav: a native disclosure, so it works before any JavaScript arrives. */}
      <details className="group border-t border-white/10 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium text-white/85 marker:hidden">
          {t('nav.vehicles')} · {t('nav.emi')}
          <span aria-hidden className="text-turmeric transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <ul className="pb-2">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block border-t border-white/5 px-4 py-2.5 text-sm text-white/80"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </header>
  )
}
