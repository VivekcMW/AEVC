import { describe, expect, it } from 'vitest'
import { buildTokens } from './build-tokens'
import { contrastRatio } from './lib/derive'

const { css, figma, app } = buildTokens()

describe('buildTokens css output', () => {
  it('emits the base palette verbatim', () => {
    expect(css).toContain('--adhara-color-forest: #0B0C0A;')
    expect(css).toContain('--adhara-color-turmeric: #C6FF33;')
    expect(css).toContain('--adhara-color-ink: #111111;')
    expect(css).toContain('--adhara-color-mist: #F4F6F1;')
  })

  it('emits all three charge states', () => {
    expect(css).toContain('--adhara-color-charge-full: #1F7A52;')
    expect(css).toContain('--adhara-color-charge-low: #E8A020;')
    expect(css).toContain('--adhara-color-charge-out: #B33A31;')
  })

  it('emits derived interaction variants rather than hand-authored ones', () => {
    expect(css).toContain('--adhara-color-forest-hover:')
    expect(css).toContain('--adhara-color-turmeric-hover:')
    expect(css).toContain('--adhara-color-turmeric-disabled:')
  })

  it('emits spacing, radius and font families', () => {
    expect(css).toContain('--adhara-space-4: 1rem;')
    expect(css).toContain('--adhara-radius-md: 0.5rem;')
    expect(css).toContain('--adhara-font-heading:')
  })
})

describe('accessibility assertions', () => {
  it('keeps body ink on the page surface above AA for normal text', () => {
    expect(contrastRatio('#111111', '#F4F6F1')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps white on forest above AA', () => {
    expect(contrastRatio('#FFFFFF', '#0B0C0A')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps ink on turmeric above AA, which is why CTA text is ink and not white', () => {
    expect(contrastRatio('#111111', '#C6FF33')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps every charge state legible as ink-on-tint at large-text AA', () => {
    for (const hex of ['#1F7A52', '#E8A020', '#B33A31']) {
      expect(contrastRatio('#111111', hex)).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('export artefacts', () => {
  it('produces a flat string map for the customer app', () => {
    expect(app['color.forest']).toBe('#0B0C0A')
    expect(app['color.charge.out']).toBe('#B33A31')
    expect(Object.values(app).every((v) => typeof v === 'string')).toBe(true)
  })

  it('produces Figma variable collections', () => {
    expect(figma).toHaveProperty('collections')
  })
})
