import { describe, expect, it } from 'vitest'
import { getSlotById, getSlots } from './slots'

describe('getSlots', () => {
  it('returns slots for a test-ride dealer', async () => {
    expect((await getSlots('d-pune-01')).length).toBeGreaterThan(0)
  })

  it('returns nothing for a dealer that does not offer test rides', async () => {
    expect(await getSlots('d-bhopal-01')).toEqual([])
  })

  it('returns an empty list for an unknown dealer rather than throwing', async () => {
    expect(await getSlots('nope')).toEqual([])
  })

  it('includes both available and unavailable slots, so the UI has to handle both', async () => {
    const list = await getSlots('d-pune-01')
    expect(list.some((s) => s.available)).toBe(true)
    expect(list.some((s) => !s.available)).toBe(true)
  })
})

describe('getSlotById', () => {
  it('finds a slot', async () => {
    const first = (await getSlots('d-pune-01'))[0]
    expect((await getSlotById(first.id))?.dealerId).toBe('d-pune-01')
  })

  it('returns null for an unknown id', async () => {
    expect(await getSlotById('nope')).toBeNull()
  })
})
