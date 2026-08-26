import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Blueprint } from '@/components/blocks/Blueprint'
import { PhotoFrame } from '@/components/ui/PhotoFrame'
import { Button } from '@/components/ui/Button'
import { getDealers } from '@/lib/data/dealers'
import { getFactoryStats, getMilestones } from '@/lib/data/company'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title'), description: t('nameMeaningBody') }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })

  const stats = await getFactoryStats()
  const milestones = await getMilestones()
  const dealers = await getDealers()

  return (
    <>
      {/* Band 1: the name argued, not asserted. */}
      <section className="relative overflow-hidden bg-forest text-white">
        <Blueprint />
        <div className="relative mx-auto max-w-4xl px-5 pt-36 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
          <h1 className="display max-w-[18ch] text-display-md">{t('title')}</h1>
          <span aria-hidden className="beam-lay mt-6 block h-0.5 w-24 bg-turmeric" />
          <p className="mt-6 font-heading text-xl font-semibold text-turmeric">{t('nameMeaning')}</p>
          <p className="mt-3 max-w-xl text-lg text-white/80">{t('nameMeaningBody')}</p>
        </div>
      </section>

      {/* Band 2: factory stats. */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <h2 className="font-heading text-xl font-semibold text-ink">{t('statsTitle')}</h2>
        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-forest/15 pt-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm text-ink/70">{stat.label}</dt>
              <dd className="figure mt-1 text-3xl text-ink sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Band 3: milestones. */}
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20">
        <h2 className="font-heading text-xl font-semibold text-ink">{t('timelineTitle')}</h2>
        <ol className="mt-8 flex flex-col gap-10">
          {milestones.map((milestone) => (
            <li key={milestone.year} className="relative pl-16">
              <span
                aria-hidden
                className="figure absolute top-0 left-0 text-5xl text-forest/45 sm:text-6xl"
              >
                {milestone.year}
              </span>
              <h3 className="font-heading text-lg font-semibold text-ink">{milestone.title}</h3>
              <p className="mt-2 text-ink/75">{milestone.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Band 4: factory photography slots. */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <h2 className="font-heading text-xl font-semibold text-ink">{t('factoryTitle')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PhotoFrame ratio="3 / 2" subject={t('factorySubject1')} />
          <PhotoFrame ratio="3 / 2" subject={t('factorySubject2')} />
          <PhotoFrame ratio="3 / 2" subject={t('factorySubject3')} />
        </div>
      </section>

      {/* Close: visit us. */}
      <section className="border-t border-forest/12">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 lg:py-20">
          <h2 className="font-heading text-xl font-semibold text-ink">{t('visitTitle')}</h2>
          <p className="tnum mt-2 text-ink/70">{t('visitBody', { count: dealers.length })}</p>
          <Button variant="primary" size="lg" href={`/${locale}/dealers`} className="mt-6">
            {t('visitTitle')}
          </Button>
        </div>
      </section>
    </>
  )
}
