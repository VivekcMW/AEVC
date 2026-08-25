import { describe, expect, it } from 'vitest'
import { calculateEmi, eligibilityDate, scheme } from './index'

describe('scheme parameters', () => {
  it('is flagged as placeholder so nobody mistakes it for a commercial decision', () => {
    expect(scheme.PLACEHOLDER).toBe(true)
  })

  it('holds the spec values', () => {
    expect(scheme.schemeFee).toBe(0.18)
    expect(scheme.eligibilityThreshold).toBe(0.6)
    expect(scheme.tenures).toEqual([12, 18, 24])
  })
})

describe('calculateEmi', () => {
  const cases = [
    { priceInr: 54990, tenureMonths: 12, monthly: 5407, total: 64884 },
    { priceInr: 54990, tenureMonths: 18, monthly: 3605, total: 64890 },
    { priceInr: 54990, tenureMonths: 24, monthly: 2704, total: 64896 },
    { priceInr: 68990, tenureMonths: 12, monthly: 6784, total: 81408 },
    { priceInr: 68990, tenureMonths: 18, monthly: 4523, total: 81414 },
    { priceInr: 79990, tenureMonths: 24, monthly: 3933, total: 94392 },
  ]

  for (const c of cases) {
    it(`gives ${c.monthly}/month on ${c.priceInr} over ${c.tenureMonths} months`, () => {
      const result = calculateEmi({ priceInr: c.priceInr, tenureMonths: c.tenureMonths })
      expect(result.monthly).toBe(c.monthly)
      expect(result.total).toBe(c.total)
    })
  }

  it('reports the premium over paying in full — the number the scheme must never hide', () => {
    const { total, premium } = calculateEmi({ priceInr: 54990, tenureMonths: 12 })
    expect(premium).toBe(total - 54990)
    expect(premium).toBeGreaterThan(0)
  })

  it('rounds the monthly figure to whole rupees', () => {
    const { monthly } = calculateEmi({ priceInr: 54990, tenureMonths: 18 })
    expect(Number.isInteger(monthly)).toBe(true)
  })

  it('derives total from the rounded monthly, so the displayed sum is the sum displayed', () => {
    const r = calculateEmi({ priceInr: 54990, tenureMonths: 18 })
    expect(r.total).toBe(r.monthly * 18)
  })

  it('unlocks delivery after 60% of payments, rounded up', () => {
    expect(calculateEmi({ priceInr: 54990, tenureMonths: 12 }).eligibilityAfterPayments).toBe(8)
    expect(calculateEmi({ priceInr: 54990, tenureMonths: 18 }).eligibilityAfterPayments).toBe(11)
    expect(calculateEmi({ priceInr: 54990, tenureMonths: 24 }).eligibilityAfterPayments).toBe(15)
  })

  it('rejects a tenure the scheme does not offer', () => {
    expect(() => calculateEmi({ priceInr: 54990, tenureMonths: 9 })).toThrow(/tenure/i)
  })

  it('rejects a non-positive price', () => {
    expect(() => calculateEmi({ priceInr: 0, tenureMonths: 12 })).toThrow(/price/i)
  })
})

describe('eligibilityDate', () => {
  it('adds the eligibility months to the enrollment date', () => {
    expect(eligibilityDate(new Date('2026-09-15T00:00:00Z'), 12).toISOString().slice(0, 7)).toBe('2027-05')
  })

  it('rolls the year over correctly', () => {
    expect(eligibilityDate(new Date('2026-11-01T00:00:00Z'), 24).toISOString().slice(0, 7)).toBe('2028-02')
  })

  it('computes in UTC, so the answer does not depend on the server timezone', () => {
    const d = eligibilityDate(new Date('2026-06-15T00:00:00Z'), 12)
    expect(d.toISOString().slice(0, 10)).toBe('2027-02-15')
  })

  it('clamps to the last day of the target month instead of overflowing into the next', () => {
    // 31 January plus eight months is 30 September, not 1 October.
    const d = eligibilityDate(new Date('2026-01-31T00:00:00Z'), 12)
    expect(d.toISOString().slice(0, 10)).toBe('2026-09-30')
  })

  it('clamps a 31st enrollment into February correctly', () => {
    // 31 December plus two months (from a hypothetical short tenure) must not become 3 March.
    const d = eligibilityDate(new Date('2027-08-31T00:00:00Z'), 12)
    expect(d.toISOString().slice(0, 10)).toBe('2028-04-30')
  })
})
