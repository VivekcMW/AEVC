import { describe, expect, it } from 'vitest'
import { formatRupees } from './format'

describe('formatRupees', () => {
  it('groups in the Indian system, not thousands', () => {
    expect(formatRupees(154990)).toBe('₹1,54,990')
  })

  it('formats a five-figure price', () => {
    expect(formatRupees(54990)).toBe('₹54,990')
  })

  it('shows no decimals — paise never appear in a price', () => {
    expect(formatRupees(54990.4)).toBe('₹54,990')
  })

  it('handles zero', () => {
    expect(formatRupees(0)).toBe('₹0')
  })
})
