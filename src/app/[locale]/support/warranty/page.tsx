import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Claim } from '@/lib/legal/Claim'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'support.warranty' })
  return { title: t('title'), description: t('intro') }
}

export default async function WarrantyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'support.warranty' })
  const ts = await getTranslations({ locale, namespace: 'support' })

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 flex flex-col gap-6">
        <section className="rounded-lg border-l-4 border-charge-full bg-surface p-5">
          <h2 className="font-heading text-lg font-semibold text-ink">{t('coverTitle')}</h2>
          <p className="mt-2 text-sm text-ink/80">
            <Claim id="soh-warranty" /> <Claim id="soh-threshold" />
          </p>
        </section>

        <section className="rounded-lg border-l-4 border-turmeric bg-surface p-5">
          <h2 className="font-heading text-lg font-semibold text-ink">{t('exclusionsTitle')}</h2>
          <p className="mt-2 text-sm text-ink/80">
            <Claim id="warranty-exclusions" />
          </p>
        </section>

        <section className="rounded-lg border border-forest/12 bg-surface p-5">
          <h2 className="font-heading text-lg font-semibold text-ink">{t('claimTitle')}</h2>
          <p className="mt-2 text-sm text-ink/75">{t('claimBody')}</p>
          <Link
            href={`/${locale}/support/raise-an-issue`}
            className="mt-3 inline-block font-semibold text-forest underline decoration-2 underline-offset-4"
          >
            {ts('raiseIssue')}
          </Link>
        </section>
      </div>
    </div>
  )
}
