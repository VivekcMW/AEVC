import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Wordmark } from './Wordmark'

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' })

  const links = [
    { href: `/${locale}/vehicles`, label: t('nav.vehicles') },
    { href: `/${locale}/emi`, label: t('nav.emi') },
    { href: `/${locale}/emi/calculator`, label: t('nav.calculator') },
  ]

  return (
    <footer className="mt-auto bg-forest text-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            <Wordmark variant="stacked" className="text-2xl sm:text-3xl" />
            <p className="mt-8 max-w-sm text-xl text-white/70 sm:text-2xl">{t('tagline')}</p>
          </div>

          <nav aria-label={t('footer.explore')}>
            <h2 className="font-heading text-xs font-semibold tracking-[0.2em] text-turmeric uppercase">
              {t('footer.explore')}
            </h2>
            <ul className="mt-5 flex flex-col">
              {links.map((link) => (
                <li key={link.href} className="border-t border-white/12">
                  <Link
                    href={link.href}
                    className="block py-3.5 text-lg text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/*
        Section 12 lists pricing and scheme terms as unresolved. Saying so on every page is
        cheaper than a stakeholder quoting a placeholder figure back to us in a meeting.
      */}
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/50 sm:px-8">
          <p className="max-w-3xl">{t('footer.placeholderNotice')}</p>
          <p>© {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
