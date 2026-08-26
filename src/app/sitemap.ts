import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getModels } from '@/lib/data/models'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adharaenergy.com'

// Preview/utility routes (buy, account, order tracking, maintenance) are deliberately
// excluded — each already carries robots: { index: false } on its own metadata.
const STATIC_PATHS = [
  '',
  '/vehicles',
  '/emi',
  '/emi/calculator',
  '/test-ride',
  '/dealers',
  '/support',
  '/support/raise-an-issue',
  '/support/warranty',
  '/contact',
  '/partner/dealer',
  '/partner/promoter',
  '/about',
  '/exchange',
  '/service',
  '/accessories',
  '/referral',
  '/insurance',
  '/careers',
  '/press',
  '/csr',
  '/legal/grievance-officer',
  '/legal/cookie-policy',
  '/legal/corporate-info',
  '/legal/accessibility',
  '/sitemap',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const models = await getModels()

  return routing.locales.flatMap((locale) => [
    ...STATIC_PATHS.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
    ...models.map((model) => ({
      url: `${BASE}/${locale}/vehicles/${model.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ])
}
