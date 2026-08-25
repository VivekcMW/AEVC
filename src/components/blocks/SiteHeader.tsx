import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Wordmark } from './Wordmark'

/**
 * A floating pill rather than a full-width bar: it lets the hero run edge to edge and
 * keeps the chrome light, which is the reference's most transferable structural move.
 */
export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const nav = [
    { href: `/${locale}/vehicles`, label: t('nav.vehicles') },
    { href: `/${locale}/emi`, label: t('nav.emi') },
    { href: `/${locale}/emi/calculator`, label: t('nav.calculator') },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-6 focus:z-50 focus:rounded-pill focus:bg-turmeric focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {t('skipToContent')}
      </a>

      <div className="mx-auto max-w-7xl">
        <div className="header-shell flex items-center gap-4 rounded-pill border border-white/12 bg-forest/85 px-4 py-2.5 text-white shadow-[0_8px_30px_-12px_rgb(20_32_27_/_0.45)] backdrop-blur-xl sm:px-6 sm:py-3">
          <Link href={`/${locale}`} className="shrink-0 text-white">
            <Wordmark variant="crossbar" className="text-base sm:text-lg" />
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-7 text-sm md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-grow py-0.5 text-white/80 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <LocaleSwitcher />
            {/* Mobile disclosure — native, so it works before hydration. */}
            <details className="group relative md:hidden">
              <summary
                aria-label="Menu"
                className="flex size-9 cursor-pointer list-none items-center justify-center rounded-pill border border-white/20 marker:hidden"
              >
                <span aria-hidden className="text-lg leading-none text-turmeric transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <ul className="absolute right-0 mt-3 w-52 overflow-hidden rounded-xl border border-white/12 bg-forest/95 py-1 shadow-xl backdrop-blur-xl">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block px-4 py-3 text-sm text-white/85">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}
