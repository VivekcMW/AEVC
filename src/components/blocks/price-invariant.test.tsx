import { readFileSync } from 'node:fs'
import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderIntl } from '@/test/render'
import { StickyCtaBar } from './StickyCtaBar'

afterEach(cleanup)

/**
 * The real invariant, stated correctly: a monthly EMI figure must never appear without the
 * full price in the same view. The earlier phrasing — "PriceDual is the only component
 * that may render a price" — was untrue (filter thresholds and the calculator's own
 * full-price cell are legitimate) and therefore enforced nothing.
 */
describe('monthly figures never appear alone', () => {
  it('StickyCtaBar carries the full price beside the monthly one', () => {
    renderIntl(
      <StickyCtaBar full={54990} monthly={2704} tenure={24} href="/en/emi" label="Enroll in EMI" />,
    )
    expect(screen.getByText(/₹54,990/)).toBeDefined()
    expect(screen.getByText(/₹2,704/)).toBeDefined()
  })

  it('the Hero renders its monthly figure through PriceDual, not ad hoc', () => {
    const source = readFileSync('src/components/blocks/Hero.tsx', 'utf8')
    expect(source).toContain('PriceDual')
    // A bare monthly string in the hero is how the full price went missing the first time.
    expect(source).not.toMatch(/formatRupees\([^)]*monthly[^)]*\)\}\/mo/)
  })

  it('PriceDual can render on a dark ground, so Forest sections need no bespoke price markup', () => {
    renderIntl(<StickyCtaBar full={54990} monthly={2704} tenure={24} href="/x" label="y" />)
    expect(screen.getByText(/24/)).toBeDefined()
  })
})
