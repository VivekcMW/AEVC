import { getTranslations } from 'next-intl/server'
import { Claim } from '@/lib/legal/Claim'

const CLAIM_IDS = ['soh-warranty', 'no-credit-check', 'no-registration'] as const

export async function TrustBadges({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <section className="border-t border-forest/12">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <h2 className="display max-w-2xl text-display-sm text-ink">{t('trustTitle')}</h2>

        <ul className="reveal-stagger mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {CLAIM_IDS.map((id, i) => (
            <li key={id} className="beam-rule flex flex-col gap-4 border-t border-forest/15 pt-5">
              <span aria-hidden className="figure text-3xl text-forest/45">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Claim id={id} className="text-lg leading-snug text-ink/85" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
