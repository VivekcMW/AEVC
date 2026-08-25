import { beforeEach, describe, expect, it } from 'vitest'
import { checkRateLimit, resetRateLimit } from './rate-limit'

beforeEach(resetRateLimit)

describe('checkRateLimit', () => {
  it('allows the first submissions from a key', () => {
    for (let i = 0; i < 5; i++) expect(checkRateLimit('1.2.3.4').allowed).toBe(true)
  })

  it('blocks the sixth within the window — the referral-fraud surface starts here', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('1.2.3.4')
    const result = checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks keys independently', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('1.2.3.4')
    expect(checkRateLimit('5.6.7.8').allowed).toBe(true)
  })
})
