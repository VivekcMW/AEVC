import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LeadForm } from '@/components/blocks/LeadForm'
import { getDealers } from '@/lib/data/dealers'

// Same placeholder support line as the floating WhatsApp entry — replace once confirmed.
const SUPPORT_WHATSAPP_NUMBER = '910000000000'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title'), description: t('intro') }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'contact' })
  const ts = await getTranslations({ locale, namespace: 'support' })
  const dealers = await getDealers()

  const whatsappHref = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hi Adhara, I have a question.',
  )}`

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-pill border border-forest/25 px-5 py-2.5 font-medium text-forest transition-colors hover:bg-forest hover:text-white"
          >
            {ts('whatsapp')}
            <span aria-hidden>↗</span>
          </a>

          <section>
            <h2 className="font-heading text-lg font-semibold text-ink">{t('dealersTitle')}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {dealers.map((dealer) => (
                <li
                  key={dealer.id}
                  className="flex flex-wrap items-baseline justify-between gap-3 border-t border-forest/12 pt-3"
                >
                  <span className="text-ink/80">
                    {dealer.name} · {dealer.city}
                  </span>
                  <a
                    href={`tel:${dealer.phone.replace(/\s/g, '')}`}
                    className="tnum font-medium text-forest"
                  >
                    {dealer.phone}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <LeadForm kind="enquiry" fields={['name', 'phone', 'message']} namespace="contact.form" />
      </div>
    </div>
  )
}
