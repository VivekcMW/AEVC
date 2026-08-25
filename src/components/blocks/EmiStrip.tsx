import { getTranslations } from 'next-intl/server'

const STEPS = ['enroll', 'pay', 'alert', 'ride'] as const

export async function EmiStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
          {t('emiStripTitle')}
        </h2>
        <p className="mt-2 text-ink/70">{t('emiStripBody')}</p>
      </div>

      <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-forest/12 bg-forest/12 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step} className="relative flex flex-col gap-2 bg-surface p-5">
            <span
              aria-hidden
              className="tnum font-heading text-3xl leading-none font-bold text-forest/18"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span aria-hidden className="h-0.5 w-8 bg-turmeric" />
            <h3 className="font-heading text-lg font-semibold text-ink">{t(`steps.${step}`)}</h3>
            <p className="text-sm text-ink/70">{t(`steps.${step}Body`)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
