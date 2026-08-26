import { describe, expect, it } from 'vitest'
import { claims, getClaim } from './claims'

describe('claims registry', () => {
  it('holds the no-registration claim as unapproved, per Section 12 question 3', () => {
    expect(getClaim('no-registration')?.approved).toBe(false)
  })

  it('gives every claim a neutral fallback to render while unapproved', () => {
    for (const c of claims) {
      expect(c.fallback.length).toBeGreaterThan(0)
      expect(c.fallback).not.toBe(c.text)
    }
  })

  it('returns null for an unknown claim id rather than an empty string', () => {
    expect(getClaim('nonexistent')).toBeNull()
  })

  it('never lets an unapproved claim carry a states array implying it was vetted', () => {
    for (const c of claims) {
      if (!c.approved) expect(c.states).toBeUndefined()
    }
  })
})

describe('warranty claims', () => {
  it('has a claim for the state-of-health threshold', () => {
    expect(getClaim('soh-threshold')).not.toBeNull()
  })

  it('has a claim for what the warranty excludes', () => {
    expect(getClaim('warranty-exclusions')).not.toBeNull()
  })

  it('leaves exclusions unapproved — an exclusion list is a legal document, not marketing copy', () => {
    expect(getClaim('warranty-exclusions')?.approved).toBe(false)
  })
})
