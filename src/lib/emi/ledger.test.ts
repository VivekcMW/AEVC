import { describe, expect, it } from 'vitest'
import { buildLedger } from './ledger'

describe('buildLedger', () => {
  it('marks past months paid, the next one due, and the rest upcoming', () => {
    const ledger = buildLedger({ priceInr: 54990, tenureMonths: 12, monthsPaid: 3 })
    expect(ledger).toHaveLength(12)
    expect(ledger.filter((i) => i.status === 'paid').map((i) => i.month)).toEqual([1, 2, 3])
    expect(ledger.find((i) => i.status === 'due')?.month).toBe(4)
    expect(ledger.filter((i) => i.status === 'upcoming')).toHaveLength(8)
  })

  it('charges every installment the same monthly amount', () => {
    const ledger = buildLedger({ priceInr: 54990, tenureMonths: 12, monthsPaid: 0 })
    const amounts = new Set(ledger.map((i) => i.amount))
    expect(amounts.size).toBe(1)
  })

  it('marks every installment due when none have been paid yet', () => {
    const ledger = buildLedger({ priceInr: 54990, tenureMonths: 12, monthsPaid: 0 })
    expect(ledger[0].status).toBe('due')
    expect(ledger.filter((i) => i.status === 'upcoming')).toHaveLength(11)
  })
})
