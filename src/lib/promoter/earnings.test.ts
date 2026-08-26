import { describe, expect, it } from 'vitest'
import { commission, monthlyEarnings } from './earnings'

describe('commission parameters', () => {
  it('is flagged placeholder — commission is a commercial decision', () => {
    expect(commission.PLACEHOLDER).toBe(true)
  })

  it('has tiers in ascending order, so tier lookup is unambiguous', () => {
    const froms = commission.tiers.map((t) => t.from)
    expect(froms).toEqual([...froms].sort((a, b) => a - b))
  })
})

describe('monthlyEarnings', () => {
  it('earns nothing on zero enrollments', () => {
    expect(monthlyEarnings(0)).toEqual({ base: 0, bonus: 0, total: 0 })
  })

  it('pays the base rate per enrollment', () => {
    expect(monthlyEarnings(3).base).toBe(3 * commission.perEnrollmentInr)
  })

  it('adds no bonus below the first tier', () => {
    expect(monthlyEarnings(1).bonus).toBe(0)
  })

  it('applies the highest tier reached, not every tier', () => {
    const top = commission.tiers[commission.tiers.length - 1]
    expect(monthlyEarnings(top.from).bonus).toBe(top.bonusInr)
  })

  it('totals base plus bonus', () => {
    const r = monthlyEarnings(10)
    expect(r.total).toBe(r.base + r.bonus)
  })

  it('rejects a negative count rather than paying a negative commission', () => {
    expect(() => monthlyEarnings(-1)).toThrow(/enrollments/i)
  })

  it('returns whole rupees', () => {
    expect(Number.isInteger(monthlyEarnings(7).total)).toBe(true)
  })
})
