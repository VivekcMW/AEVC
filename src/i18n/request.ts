import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

type Messages = Record<string, unknown>

/** Hindi is a partial catalog by design, so English must survive under it key by key. */
function deepMerge(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base }
  for (const [key, value] of Object.entries(over)) {
    if (key.startsWith('$')) continue
    const existing = out[key]
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? deepMerge((existing as Messages) ?? {}, value as Messages)
        : value
  }
  return out
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const en = (await import('../messages/en.json')).default as Messages
  const messages =
    locale === 'en'
      ? en
      : deepMerge(en, (await import('../messages/hi.json')).default as Messages)

  return {
    locale,
    messages,
    onError(error) {
      // A missing key must never surface as a raw key on screen. Log it instead.
      if (process.env.NODE_ENV !== 'production') console.warn('[i18n]', error.message)
    },
  }
})
