import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import en from '@/messages/en.json'
import hi from '@/messages/hi.json'
import kn from '@/messages/kn.json'

const catalogs: Record<string, Record<string, unknown>> = { en, hi, kn }

/**
 * Renders against the real message catalog, so component tests assert on shipped copy
 * rather than on strings invented by the test.
 */
export function renderIntl(ui: React.ReactNode, locale: 'en' | 'hi' | 'kn' = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={catalogs[locale]}>
      {ui}
    </NextIntlClientProvider>,
  )
}
