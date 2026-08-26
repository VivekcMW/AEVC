import { describe, expect, it } from 'vitest'
import { getFactoryStats, getMilestones } from './company'

describe('getMilestones', () => {
  it('returns milestones in chronological order', async () => {
    const years = (await getMilestones()).map((m) => Number(m.year))
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })

  it('gives every milestone a title and a body', async () => {
    for (const m of await getMilestones()) {
      expect(m.title.length).toBeGreaterThan(0)
      expect(m.body.length).toBeGreaterThan(0)
    }
  })

  it('claims no year later than the present, so the timeline is not aspirational', async () => {
    const years = (await getMilestones()).map((m) => Number(m.year))
    expect(Math.max(...years)).toBeLessThanOrEqual(2026)
  })
})

describe('getFactoryStats', () => {
  it('returns stats as label and value pairs', async () => {
    for (const stat of await getFactoryStats()) {
      expect(typeof stat.label).toBe('string')
      expect(typeof stat.value).toBe('string')
    }
  })

  it('returns at least three, because two reads as thin and four fills the row', async () => {
    expect((await getFactoryStats()).length).toBeGreaterThanOrEqual(3)
  })
})
