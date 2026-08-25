import { describe, expect, it } from 'vitest'
import { filterModels, parseCriteria } from './filter'
import { getModels } from './models'

const all = await getModels()

describe('filterModels', () => {
  it('returns everything for empty criteria', () => {
    expect(filterModels(all, {})).toHaveLength(all.length)
  })

  it('filters by maximum price inclusively', () => {
    expect(filterModels(all, { maxPrice: 54990 }).map((m) => m.slug)).toEqual(['adhara-neev'])
  })

  it('filters by minimum range inclusively', () => {
    expect(filterModels(all, { minRange: 85 }).map((m) => m.slug)).toEqual(['adhara-sthir'])
  })

  it('combines criteria with AND', () => {
    expect(filterModels(all, { maxPrice: 70000, minRange: 80 }).map((m) => m.slug)).toEqual([
      'adhara-sthir',
    ])
  })

  it('returns an empty array rather than throwing when nothing matches', () => {
    expect(filterModels(all, { minRange: 500 })).toEqual([])
  })

  it('filters by minimum battery capacity', () => {
    expect(filterModels(all, { minBatteryKwh: 2.2 }).map((m) => m.slug)).toEqual(['adhara-bhaar'])
  })
})

describe('parseCriteria', () => {
  it('reads criteria from URL search params so results are shareable', () => {
    expect(parseCriteria(new URLSearchParams('?maxPrice=60000&minRange=60'))).toEqual({
      maxPrice: 60000,
      minRange: 60,
    })
  })

  it('ignores non-numeric junk instead of returning NaN', () => {
    expect(parseCriteria(new URLSearchParams('?maxPrice=abc'))).toEqual({})
  })

  it('ignores zero and negative values', () => {
    expect(parseCriteria(new URLSearchParams('?maxPrice=0&minRange=-5'))).toEqual({})
  })

  it('round-trips through toSearchParams', () => {
    const criteria = { maxPrice: 60000, minRange: 60 }
    expect(parseCriteria(new URLSearchParams(`?${new URLSearchParams(
      Object.entries(criteria).map(([k, v]) => [k, String(v)]),
    )}`))).toEqual(criteria)
  })
})
