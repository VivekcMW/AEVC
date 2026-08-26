import { describe, expect, it } from 'vitest'
import { routing } from '@/i18n/routing'
import sitemap from './sitemap'

const entries = await sitemap()
const urls = entries.map((e) => e.url)

describe('sitemap', () => {
  it('includes every locale for every route', () => {
    for (const locale of routing.locales) {
      expect(urls.some((u) => u.includes(`/${locale}/vehicles`))).toBe(true)
    }
  })

  it('includes a URL per model', () => {
    expect(urls.filter((u) => u.includes('/vehicles/adhara-')).length).toBeGreaterThanOrEqual(3)
  })

  it('includes every page built in this plan', () => {
    for (const path of [
      '/dealers',
      '/test-ride',
      '/support',
      '/contact',
      '/partner/dealer',
      '/partner/promoter',
      '/about',
    ]) {
      expect(urls.some((u) => u.endsWith(`/en${path}`))).toBe(true)
    }
  })

  it('excludes preview/utility routes', () => {
    expect(urls.some((u) => u.includes('/buy/'))).toBe(false)
    expect(urls.some((u) => u.endsWith('/account'))).toBe(false)
    expect(urls.some((u) => u.includes('/orders/'))).toBe(false)
    expect(urls.some((u) => u.endsWith('/maintenance'))).toBe(false)
  })

  it('emits absolute URLs', () => {
    for (const url of urls) expect(url).toMatch(/^https?:\/\//)
  })

  it('has no duplicates', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })
})
