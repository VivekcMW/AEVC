import { getTranslations } from 'next-intl/server'
import { Claim } from '@/lib/legal/Claim'

const CLAIM_IDS = ['soh-warranty', 'no-credit-check', 'no-registration'] as const

export async function TrustBadges({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <section className="border-y border-forest/12 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
          {t('trustTitle')}
        </h2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {CLAIM_IDS.map((id) => (
            <li key={id} className="flex flex-col gap-3 border-t-2 border-turmeric pt-4">
              <Claim id={id} className="text-sm leading-relaxed text-ink/85" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
