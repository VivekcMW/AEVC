import { getTranslations } from 'next-intl/server'

const STEPS = ['enroll', 'pay', 'alert', 'ride'] as const

export async function EmiStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
      <div className="max-w-3xl">
        <h2 className="display text-display-sm text-ink">{t('emiStripTitle')}</h2>
        <p className="mt-5 text-lg text-ink/65 sm:text-xl">{t('emiStripBody')}</p>
      </div>

      {/*
        A single spine draws left-to-right across all four steps at wide viewports —
        the same beam-lay motif each step already carries individually, now also tying
        them into one continuous path rather than four disconnected marks.
      */}
      <div className="relative mt-16">
        <span
          aria-hidden
          className="reveal-beam absolute inset-x-0 top-0 hidden h-0.5 bg-turmeric lg:block"
        />
        <ol className="reveal-stagger grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step} className="beam-rule flex flex-col border-t border-forest/15 pt-5">
              <span aria-hidden className="figure text-5xl text-forest/45 sm:text-6xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-ink">
                {t(`steps.${step}`)}
              </h3>
              <p className="mt-2 text-ink/65">{t(`steps.${step}Body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
