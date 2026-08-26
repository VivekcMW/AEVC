import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Blueprint } from '@/components/blocks/Blueprint'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'csr' })
  return { title: t('title'), description: t('intro') }
}

export default async function CsrPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'csr' })

  const sections = [
    { title: t('manufacturingTitle'), body: t('manufacturingBody') },
    { title: t('batteryTitle'), body: t('batteryBody') },
    { title: t('communityTitle'), body: t('communityBody') },
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <Blueprint />
        <div className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
          <h1 className="display max-w-[18ch] text-display-md">{t('title')}</h1>
          <span aria-hidden className="beam-lay mt-6 block h-0.5 w-24 bg-turmeric" />
          <p className="mt-6 max-w-xl text-lg text-white/80">{t('intro')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-2 text-ink/75">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
