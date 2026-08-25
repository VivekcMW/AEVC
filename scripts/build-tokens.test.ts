import { describe, expect, it } from 'vitest'
import { buildTokens } from './build-tokens'
import { contrastRatio } from './lib/derive'

const { css, figma, app } = buildTokens()

describe('buildTokens css output', () => {
  it('emits the base palette verbatim', () => {
    expect(css).toContain('--color-forest: #0E3B2E;')
    expect(css).toContain('--color-turmeric: #E8A020;')
    expect(css).toContain('--color-ink: #14201B;')
    expect(css).toContain('--color-mist: #F4F6F1;')
  })

  it('emits all three charge states', () => {
    expect(css).toContain('--color-charge-full: #2F9E6B;')
    expect(css).toContain('--color-charge-low: #E8A020;')
    expect(css).toContain('--color-charge-out: #C6453C;')
  })

  it('emits derived interaction variants rather than hand-authored ones', () => {
    expect(css).toContain('--color-forest-hover:')
    expect(css).toContain('--color-turmeric-hover:')
    expect(css).toContain('--color-turmeric-disabled:')
  })

  it('emits spacing, radius and font families', () => {
    expect(css).toContain('--space-4: 1rem;')
    expect(css).toContain('--radius-md: 0.5rem;')
    expect(css).toContain('--font-heading:')
  })
})

describe('accessibility assertions', () => {
  it('keeps body ink on the page surface above AA for normal text', () => {
    expect(contrastRatio('#14201B', '#F4F6F1')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps white on forest above AA', () => {
    expect(contrastRatio('#FFFFFF', '#0E3B2E')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps ink on turmeric above AA, which is why CTA text is ink and not white', () => {
    expect(contrastRatio('#14201B', '#E8A020')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps every charge state legible as ink-on-tint at large-text AA', () => {
    for (const hex of ['#2F9E6B', '#E8A020', '#C6453C']) {
      expect(contrastRatio('#14201B', hex)).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('export artefacts', () => {
  it('produces a flat string map for the customer app', () => {
    expect(app['color.forest']).toBe('#0E3B2E')
    expect(app['color.charge.out']).toBe('#C6453C')
    expect(Object.values(app).every((v) => typeof v === 'string')).toBe(true)
  })

  it('produces Figma variable collections', () => {
    expect(figma).toHaveProperty('collections')
  })
})
