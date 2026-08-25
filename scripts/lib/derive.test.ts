import { describe, expect, it } from 'vitest'
import { contrastRatio, shift } from './derive'

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1)
  })

  it('returns 1 for identical colours', () => {
    expect(contrastRatio('#0E3B2E', '#0E3B2E')).toBeCloseTo(1, 2)
  })

  it('accepts hexes in either order', () => {
    expect(contrastRatio('#14201B', '#F4F6F1')).toBeCloseTo(
      contrastRatio('#F4F6F1', '#14201B'), 4,
    )
  })
})

describe('shift', () => {
  it('darkens on a negative amount', () => {
    expect(contrastRatio(shift('#E8A020', -0.2), '#FFFFFF')).toBeGreaterThan(
      contrastRatio('#E8A020', '#FFFFFF'),
    )
  })

  it('lightens on a positive amount', () => {
    expect(shift('#0E3B2E', 0.5)).not.toBe('#0E3B2E')
    expect(contrastRatio(shift('#0E3B2E', 0.5), '#FFFFFF')).toBeLessThan(
      contrastRatio('#0E3B2E', '#FFFFFF'),
    )
  })

  it('clamps rather than wrapping at the extremes', () => {
    expect(shift('#FFFFFF', 0.9)).toBe('#ffffff')
    expect(shift('#000000', -0.9)).toBe('#000000')
  })

  it('returns a six-digit lowercase hex', () => {
    expect(shift('#E8A020', -0.08)).toMatch(/^#[0-9a-f]{6}$/)
  })
})
