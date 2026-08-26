import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adharaenergy.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/buy/', '/account', '/orders/', '/maintenance'] }],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
