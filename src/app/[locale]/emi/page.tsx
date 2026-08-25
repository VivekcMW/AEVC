import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { Blueprint } from '@/components/blocks/Blueprint'
import { Accordion } from '@/components/ui/Accordion'
import { getFaqs } from '@/lib/data/faqs'
import { Claim } from '@/lib/legal/Claim'

const STEPS = ['enroll', 'pay', 'alert', 'ride'] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'emi' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function EmiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'emi' })
  const th = await getTranslations({ locale, namespace: 'home' })
  const faqs = await getFaqs(['emi-no-bank', 'registration', 'battery-life'])

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <Blueprint />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="max-w-2xl font-heading text-3xl font-bold tracking-[-0.02em] text-balance sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <span aria-hidden className="mt-6 block h-0.5 w-24 bg-turmeric" />
          <p className="mt-6 max-w-xl text-lg text-white/80">{t('subtitle')}</p>
          <div className="mt-8">
            <Button variant="primary" size="lg" href={`/${locale}/emi/calculator`}>
              {t('calculator.title')}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
              {t('whyNoBank')}
            </h2>
            <span aria-hidden className="mt-4 block h-0.5 w-12 bg-turmeric" />
            <p className="mt-5 text-ink/80">{t('whyNoBankBody')}</p>
            <p className="mt-5 rounded-lg border-l-4 border-turmeric bg-surface p-4 text-sm text-ink/85">
              <Claim id="no-credit-check" />
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-3xl">
              {t('stepsTitle')}
            </h2>
            <span aria-hidden className="mt-4 block h-0.5 w-12 bg-turmeric" />
            <ol className="mt-5 flex flex-col gap-px overflow-hidden rounded-lg border border-forest/12 bg-forest/12">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-4 bg-surface p-5">
                  <span
                    aria-hidden
                    className="tnum font-heading text-2xl leading-none font-bold text-forest/20"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-ink">{th(`steps.${step}`)}</h3>
                    <p className="mt-1 text-sm text-ink/70">{th(`steps.${step}Body`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-forest/12 bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <Accordion items={faqs} />

          {/*
            Section 5.4 requires versioned, dated scheme terms. They cannot be written
            before legal sign-off, so the page says so rather than shipping a stub page
            that reads as if terms exist.
          */}
          <p className="mt-8 rounded-lg border border-dashed border-forest/30 bg-mist p-5 text-sm text-ink/75">
            {t('termsPending')}
          </p>

          <Link
            href={`/${locale}/emi/calculator`}
            className="mt-6 inline-flex items-center gap-2 font-semibold text-forest underline decoration-2 underline-offset-4 hover:decoration-turmeric"
          >
            {t('calculator.title')} →
          </Link>
        </div>
      </section>
    </>
  )
}
