'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'

/**
 * Swaps the locale segment while holding the rest of the path, so a reader switching
 * language stays on the page they were reading. A native disclosure rather than a
 * <select>, so it works before hydration — same pattern as the mobile nav menu.
 */
export function LocaleSwitcher() {
  const t = useTranslations('common.localeSwitcher')
  const pathname = usePathname() ?? '/'
  const { locale } = useParams<{ locale: string }>()

  return (
    <details className="group relative">
      <summary
        aria-label={t('label')}
        className="flex cursor-pointer list-none items-center gap-1.5 rounded-pill border border-white/20 px-3 py-1.5 text-sm font-medium text-white marker:hidden"
      >
        {t(locale)}
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="h-2 w-3 fill-none stroke-current transition-transform group-open:rotate-180"
        >
          <path d="M1 1.5 6 6.5 11 1.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ul className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl border border-white/12 bg-forest/95 py-1 shadow-xl backdrop-blur-xl">
        {routing.locales.map((target) => {
          const href = pathname.replace(/^\/[^/]+/, `/${target}`)
          const active = target === locale
          return (
            <li key={target}>
              <Link
                href={href}
                hrefLang={target}
                aria-current={active ? 'true' : undefined}
                className={
                  active
                    ? 'block px-4 py-2.5 text-sm font-semibold text-turmeric'
                    : 'block px-4 py-2.5 text-sm text-white/80 hover:text-white'
                }
              >
                {t(target)}
              </Link>
            </li>
          )
        })}
      </ul>
    </details>
  )
}

