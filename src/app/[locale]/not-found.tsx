import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { AdharaMark } from '@/components/blocks/AdharaMark'

/** Renders for notFound() thrown anywhere under a known locale — a bad slug, mainly. */
export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations('common.notFound')

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-36">
      <AdharaMark aria-hidden className="h-9 w-auto text-forest/20" />
      <h1 className="display mt-6 text-display-sm text-ink">{t('title')}</h1>
      <p className="mt-4 max-w-md text-lg text-ink/65">{t('body')}</p>
      <Button variant="primary" size="lg" href={`/${locale}`} className="mt-8">
        {t('cta')}
      </Button>
    </div>
  )
}
