import { describe, expect, it } from 'vitest'
import { getModel, getModels } from './models'

describe('getModels', () => {
  it('returns the placeholder catalog', async () => {
    const models = await getModels()
    expect(models.length).toBeGreaterThanOrEqual(3)
  })

  it('keeps every model within low-speed EV limits, which is what exempts registration', async () => {
    for (const m of await getModels()) {
      expect(m.topSpeedKmph).toBeLessThanOrEqual(25)
      expect(m.motorW).toBeLessThanOrEqual(250)
    }
  })

  it('gives every model a slug, a price and at least one colour', async () => {
    for (const m of await getModels()) {
      expect(m.slug).toMatch(/^[a-z0-9-]+$/)
      expect(m.priceInr).toBeGreaterThan(0)
      expect(m.colours.length).toBeGreaterThan(0)
    }
  })

  it('has unique slugs', async () => {
    const slugs = (await getModels()).map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('getModel', () => {
  it('finds a model by slug', async () => {
    const first = (await getModels())[0]
    expect((await getModel(first.slug))?.name).toBe(first.name)
  })

  it('returns null for an unknown slug rather than throwing', async () => {
    expect(await getModel('does-not-exist')).toBeNull()
  })
})
