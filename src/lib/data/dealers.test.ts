import { describe, expect, it } from 'vitest'
import { findDealersNear, getDealerById, getDealers, groupByState } from './dealers'

describe('findDealersNear', () => {
  it('puts same-pincode-prefix dealers first', async () => {
    const found = await findDealersNear('411028')
    expect(found[0].pincode.slice(0, 3)).toBe('411')
  })

  it('falls back to the same state before other states', async () => {
    // 422 is Nashik; no dealer shares the 999 prefix, so state matching must carry it.
    const found = await findDealersNear('422999')
    expect(found[0].state).toBe('Maharashtra')
  })

  it('still returns dealers for an unserved pincode rather than an empty list', async () => {
    const found = await findDealersNear('999999')
    expect(found.length).toBeGreaterThan(0)
  })

  it('returns every dealer, unordered, for a malformed pincode instead of throwing', async () => {
    const found = await findDealersNear('nonsense')
    expect(found.length).toBe((await getDealers()).length)
  })

  it('respects the limit', async () => {
    expect(await findDealersNear('411001', 2)).toHaveLength(2)
  })
})

describe('getDealerById', () => {
  it('finds a dealer', async () => {
    expect((await getDealerById('d-pune-01'))?.city).toBe('Pune')
  })

  it('returns null for an unknown id', async () => {
    expect(await getDealerById('nope')).toBeNull()
  })
})

describe('groupByState', () => {
  it('groups dealers under their state, alphabetically', async () => {
    const groups = groupByState(await getDealers())
    expect(groups.map((g) => g.state)).toEqual([...groups.map((g) => g.state)].sort())
  })

  it('keeps every dealer', async () => {
    const all = await getDealers()
    const grouped = groupByState(all).flatMap((g) => g.dealers)
    expect(grouped).toHaveLength(all.length)
  })
})
