import { describe, expect, it } from 'vitest'
import { routing } from './routing'

describe('routing', () => {
  it('ships English, Hindi and Kannada, per the unconfirmed launch language set', () => {
    expect(routing.locales).toEqual(['en', 'hi', 'kn'])
  })

  it('defaults to English', () => {
    expect(routing.defaultLocale).toBe('en')
  })
})
