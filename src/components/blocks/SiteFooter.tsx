import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Wordmark } from './Wordmark'

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' })

  const columns = [
    {
      heading: t('footer.explore'),
      links: [
        { href: `/${locale}/vehicles`, label: t('nav.vehicles') },
        { href: `/${locale}/emi`, label: t('nav.emi') },
        { href: `/${locale}/emi/calculator`, label: t('nav.calculator') },
      ],
    },
  ]

  return (
    <footer className="mt-auto border-t-2 border-turmeric bg-forest text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <Wordmark variant="stacked" className="text-lg" />
          <p className="max-w-sm text-sm text-white/70">{t('tagline')}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-turmeric uppercase">
                {col.heading}
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/*
        Section 12 lists pricing and scheme terms as unresolved. Saying so on every page is
        cheaper than a stakeholder quoting a placeholder figure back to us in a meeting.
      */}
      <div className="border-t border-white/10 bg-ink/25">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:px-6">
          <p className="max-w-3xl">{t('footer.placeholderNotice')}</p>
          <p>© {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
