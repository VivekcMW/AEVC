import { describe, expect, it } from 'vitest'
import { parseAttribution } from './attribution'

describe('parseAttribution', () => {
  it('captures a promoter referral code, which is the whole point of ?ref=', () => {
    expect(parseAttribution(new URLSearchParams('?ref=PROMO123')).referralCode).toBe('PROMO123')
  })

  it('uppercases referral codes so PROMO123 and promo123 are one code', () => {
    expect(parseAttribution(new URLSearchParams('?ref=promo123')).referralCode).toBe('PROMO123')
  })

  it('captures utm parameters', () => {
    const a = parseAttribution(new URLSearchParams('?utm_source=meta&utm_medium=cpc&utm_campaign=diwali'))
    expect(a.source).toBe('meta')
    expect(a.medium).toBe('cpc')
    expect(a.campaign).toBe('diwali')
  })

  it('falls back to direct when nothing is present', () => {
    const a = parseAttribution(new URLSearchParams(''))
    expect(a.source).toBe('direct')
    expect(a.referralCode).toBeNull()
  })

  it('rejects an over-long referral code rather than storing junk', () => {
    expect(parseAttribution(new URLSearchParams(`?ref=${'A'.repeat(64)}`)).referralCode).toBeNull()
  })

  it('strips anything that is not alphanumeric from the referral code', () => {
    expect(parseAttribution(new URLSearchParams('?ref=<script>')).referralCode).toBeNull()
  })

  it('rejects a referral code that is too short to be real', () => {
    expect(parseAttribution(new URLSearchParams('?ref=AB')).referralCode).toBeNull()
  })

  it('stamps when the visitor landed', () => {
    expect(parseAttribution(new URLSearchParams('?ref=A1B2')).landedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
