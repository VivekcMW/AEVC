import { describe, expect, it } from 'vitest'
import { getOpenTerritoryCount, getTerritories } from './territories'

describe('getTerritories', () => {
  it('returns territories across more than one state', async () => {
    const states = new Set((await getTerritories()).map((t) => t.state))
    expect(states.size).toBeGreaterThan(1)
  })

  it('uses only the three statuses the UI renders', async () => {
    for (const territory of await getTerritories()) {
      expect(['open', 'limited', 'taken']).toContain(territory.status)
    }
  })

  it('includes at least one of each status, so every UI state is exercised', async () => {
    const statuses = new Set((await getTerritories()).map((t) => t.status))
    expect(statuses).toEqual(new Set(['open', 'limited', 'taken']))
  })
})

describe('getOpenTerritoryCount', () => {
  it('counts open territories only', async () => {
    const all = await getTerritories()
    expect(await getOpenTerritoryCount()).toBe(all.filter((t) => t.status === 'open').length)
  })
})
