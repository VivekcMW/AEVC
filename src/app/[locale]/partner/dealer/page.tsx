import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Blueprint } from '@/components/blocks/Blueprint'
import { ChargeState } from '@/components/ui/ChargeState'
import { LeadForm } from '@/components/blocks/LeadForm'
import { getOpenTerritoryCount, getTerritories } from '@/lib/data/territories'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partner.dealer' })
  return { title: t('title'), description: t('intro') }
}

const STATUS_TONE = { open: 'full', limited: 'low', taken: 'out' } as const

export default async function BecomeADealerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'partner.dealer' })

  const territories = await getTerritories()
  const openCount = await getOpenTerritoryCount()

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <Blueprint />
        <div className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
          <h1 className="display max-w-[18ch] text-display-md">{t('title')}</h1>
          <span aria-hidden className="beam-lay mt-6 block h-0.5 w-24 bg-turmeric" />
          <p className="mt-6 max-w-xl text-lg text-white/80">{t('intro')}</p>
          <p className="figure mt-8 text-6xl text-turmeric">{openCount}</p>
          <p className="mt-1 text-sm text-white/70">{t('territoriesTitle')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="font-heading text-xl font-semibold text-ink">{t('investmentTitle')}</h2>
              <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-forest/15 pt-4 text-sm">
                <div>
                  <dt className="text-ink/70">{t('investmentOutlay')}</dt>
                  <dd className="figure mt-1 text-2xl text-ink">{t('investmentOutlayValue')}</dd>
                </div>
                <div>
                  <dt className="text-ink/70">{t('investmentSetup')}</dt>
                  <dd className="figure mt-1 text-2xl text-ink">{t('investmentSetupValue')}</dd>
                </div>
                <div>
                  <dt className="text-ink/70">{t('investmentSupport')}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">{t('investmentSupportValue')}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-ink/70">{t('indicativeNotice')}</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-ink">{t('territoriesTitle')}</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {territories.map((territory) => (
                  <li
                    key={`${territory.state}-${territory.city}`}
                    className="flex items-center justify-between gap-3 border-t border-forest/12 pt-3"
                  >
                    <span className="text-ink/80">
                      {territory.city}, {territory.state}
                    </span>
                    <ChargeState status={STATUS_TONE[territory.status]} label={t(`status${territory.status.charAt(0).toUpperCase()}${territory.status.slice(1)}`)} />
                  </li>
                ))}
              </ul>
            </section>

            <p className="rounded-md border-l-4 border-turmeric bg-surface p-4 text-sm text-ink/75">
              {t('kycNotice')}
            </p>
          </div>

          <LeadForm
            kind="dealer"
            fields={['name', 'phone', 'city', 'message']}
            namespace="partner.dealer.form"
          />
        </div>
      </div>
    </>
  )
}
