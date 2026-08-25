'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'

/**
 * Swaps the locale segment while holding the rest of the path, so a reader switching
 * language stays on the page they were reading.
 */
export function LocaleSwitcher() {
  const t = useTranslations('common.localeSwitcher')
  const pathname = usePathname() ?? '/'
  const { locale } = useParams<{ locale: string }>()

  return (
    <nav aria-label={t('label')} className="flex items-center gap-1 text-sm">
      {routing.locales.map((target, i) => {
        const href = pathname.replace(/^\/[^/]+/, `/${target}`)
        const active = target === locale
        return (
          <span key={target} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className="text-white/25">/</span>}
            <Link
              href={href}
              hrefLang={target}
              aria-current={active ? 'true' : undefined}
              className={
                active
                  ? 'font-semibold text-turmeric underline decoration-turmeric decoration-2 underline-offset-4'
                  : 'text-white/70 underline-offset-4 hover:text-white hover:underline'
              }
            >
              {t(target)}
            </Link>
          </span>
        )
      })}
    </nav>
  )
}
