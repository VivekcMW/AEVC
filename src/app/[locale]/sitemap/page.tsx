import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sitemap' })
  return { title: t('title'), description: t('intro') }
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'sitemap' })
  const tc = await getTranslations({ locale, namespace: 'common' })

  const groups = [
    {
      title: t('sections.explore'),
      links: [
        { href: `/${locale}`, label: tc('brand') },
        { href: `/${locale}/vehicles`, label: tc('footer.links.vehicles') },
        { href: `/${locale}/emi`, label: tc('footer.links.emi') },
        { href: `/${locale}/emi/calculator`, label: tc('footer.links.calculator') },
        { href: `/${locale}/dealers`, label: tc('footer.links.dealers') },
        { href: `/${locale}/test-ride`, label: tc('footer.links.testRide') },
        { href: `/${locale}/exchange`, label: tc('footer.links.exchange') },
        { href: `/${locale}/service`, label: tc('footer.links.service') },
        { href: `/${locale}/accessories`, label: tc('footer.links.accessories') },
        { href: `/${locale}/referral`, label: tc('footer.links.referral') },
        { href: `/${locale}/insurance`, label: tc('footer.links.insurance') },
        { href: `/${locale}/orders/track`, label: tc('footer.links.trackOrder') },
      ],
    },
    {
      title: t('sections.company'),
      links: [
        { href: `/${locale}/about`, label: tc('footer.links.about') },
        { href: `/${locale}/careers`, label: tc('footer.links.careers') },
        { href: `/${locale}/press`, label: tc('footer.links.press') },
        { href: `/${locale}/csr`, label: tc('footer.links.csr') },
        { href: `/${locale}/legal/corporate-info`, label: tc('footer.links.corporateInfo') },
        { href: `/${locale}/partner/dealer`, label: tc('footer.links.partnerDealer') },
        { href: `/${locale}/partner/promoter`, label: tc('footer.links.partnerPromoter') },
      ],
    },
    {
      title: t('sections.legal'),
      links: [
        { href: `/${locale}/support`, label: tc('footer.links.support') },
        { href: `/${locale}/contact`, label: tc('footer.links.contactUs') },
        { href: `/${locale}/legal/grievance-officer`, label: tc('footer.links.grievance') },
        { href: `/${locale}/legal/cookie-policy`, label: tc('footer.links.cookiePolicy') },
        { href: `/${locale}/legal/accessibility`, label: tc('footer.links.accessibility') },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 grid gap-10 sm:grid-cols-3">
        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-ink/70 uppercase">
              {group.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-grow text-ink/80 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </div>
  )
}
