import { describe, expect, it } from 'vitest'
import { fontVariableNames } from './fonts'

describe('fontVariableNames', () => {
  it('loads Comfortaa and Poppins for English', () => {
    const names = fontVariableNames('en')
    expect(names).toContain('--font-comfortaa')
    expect(names).toContain('--font-poppins')
  })

  it('adds Anek Devanagari for Hindi so the script is matched, not substituted', () => {
    expect(fontVariableNames('hi')).toContain('--font-anek-devanagari')
  })

  it('adds Anek Kannada for Kannada so the script is matched, not substituted', () => {
    expect(fontVariableNames('kn')).toContain('--font-anek-kannada')
  })

  it('does not ship the Devanagari face to English readers', () => {
    expect(fontVariableNames('en')).not.toContain('--font-anek-devanagari')
  })

  it('does not cross-ship Devanagari and Kannada faces to each other', () => {
    expect(fontVariableNames('hi')).not.toContain('--font-anek-kannada')
    expect(fontVariableNames('kn')).not.toContain('--font-anek-devanagari')
  })
})
