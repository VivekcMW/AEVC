import { describe, expect, it } from 'vitest'
import { fontVariableNames } from './fonts'

describe('fontVariableNames', () => {
  it('loads Anek Latin and Inter for English', () => {
    const names = fontVariableNames('en')
    expect(names).toContain('--font-anek-latin')
    expect(names).toContain('--font-inter')
  })

  it('adds Anek Devanagari for Hindi so the script is matched, not substituted', () => {
    expect(fontVariableNames('hi')).toContain('--font-anek-devanagari')
  })

  it('does not ship the Devanagari face to English readers', () => {
    expect(fontVariableNames('en')).not.toContain('--font-anek-devanagari')
  })
})
