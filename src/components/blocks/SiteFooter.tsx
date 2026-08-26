import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Wordmark } from './Wordmark'

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const l = (key: string) => t(`footer.links.${key}`)

  const columns = [
    {
      title: t('footer.explore'),
      links: [
        { href: `/${locale}/vehicles`, label: l('vehicles') },
        { href: `/${locale}/emi`, label: l('emi') },
        { href: `/${locale}/emi/calculator`, label: l('calculator') },
        { href: `/${locale}/dealers`, label: l('dealers') },
        { href: `/${locale}/test-ride`, label: l('testRide') },
        { href: `/${locale}/exchange`, label: l('exchange') },
        { href: `/${locale}/service`, label: l('service') },
        { href: `/${locale}/accessories`, label: l('accessories') },
        { href: `/${locale}/referral`, label: l('referral') },
        { href: `/${locale}/insurance`, label: l('insurance') },
        { href: `/${locale}/orders/track`, label: l('trackOrder') },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { href: `/${locale}/about`, label: l('about') },
        { href: `/${locale}/careers`, label: l('careers') },
        { href: `/${locale}/press`, label: l('press') },
        { href: `/${locale}/csr`, label: l('csr') },
        { href: `/${locale}/legal/corporate-info`, label: l('corporateInfo') },
        { href: `/${locale}/partner/dealer`, label: l('partnerDealer') },
        { href: `/${locale}/partner/promoter`, label: l('partnerPromoter') },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { href: `/${locale}/support`, label: l('support') },
        { href: `/${locale}/contact`, label: l('contactUs') },
        { href: `/${locale}/legal/grievance-officer`, label: l('grievance') },
        { href: `/${locale}/legal/cookie-policy`, label: l('cookiePolicy') },
        { href: `/${locale}/legal/accessibility`, label: l('accessibility') },
        { href: `/${locale}/sitemap`, label: l('sitemap') },
      ],
    },
  ]

  return (
    <footer className="mt-auto bg-forest text-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:items-start">
          <div>
            <Wordmark variant="stacked" className="text-2xl sm:text-3xl" />
            <p className="mt-8 max-w-sm text-xl text-white/70 sm:text-2xl">{t('tagline')}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-heading text-xs font-semibold tracking-[0.2em] text-turmeric uppercase">
                {column.title}
              </h2>
              <ul className="mt-5 flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href} className="border-t border-white/12">
                    <Link
                      href={link.href}
                      className="block py-3.5 text-base text-white/80 transition-colors hover:text-white sm:text-lg"
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
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/50 sm:px-8">
          <p className="max-w-3xl">{t('footer.placeholderNotice')}</p>
          <p>© {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
