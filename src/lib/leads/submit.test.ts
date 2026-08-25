import { beforeEach, describe, expect, it } from 'vitest'
import { parseAttribution } from './attribution'
import { resetRateLimit } from './rate-limit'
import { readAll, resetSink } from './sink'
import { submitLead } from './submit'

const attribution = parseAttribution(new URLSearchParams('?ref=PROMO123&utm_source=meta'))

const valid = {
  kind: 'test-ride' as const,
  name: 'Asha Kulkarni',
  phone: '9876543210',
  pincode: '411001',
  modelSlug: 'adhara-neev',
}

beforeEach(() => {
  resetSink()
  resetRateLimit()
})

describe('submitLead', () => {
  it('accepts a valid lead and returns an id', async () => {
    expect((await submitLead(valid, attribution, '1.2.3.4')).ok).toBe(true)
  })

  it('persists the referral code with the lead, so attribution survives the funnel', async () => {
    await submitLead(valid, attribution, '1.2.3.4')
    expect(readAll()[0].attribution.referralCode).toBe('PROMO123')
    expect(readAll()[0].attribution.source).toBe('meta')
  })

  it('rejects a phone number that is not ten digits', async () => {
    const result = await submitLead({ ...valid, phone: '123' }, attribution, '1.2.3.4')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/phone|mobile/i)
  })

  it('rejects an Indian mobile number that does not start 6-9', async () => {
    expect((await submitLead({ ...valid, phone: '1234567890' }, attribution, '1.2.3.4')).ok).toBe(false)
  })

  it('rejects an empty name', async () => {
    expect((await submitLead({ ...valid, name: '  ' }, attribution, '1.2.3.4')).ok).toBe(false)
  })

  it('stores nothing when validation fails', async () => {
    await submitLead({ ...valid, phone: 'x' }, attribution, '1.2.3.4')
    expect(readAll()).toHaveLength(0)
  })

  it('does not spend rate-limit budget on a request that never validated', async () => {
    for (let i = 0; i < 6; i++) await submitLead({ ...valid, phone: 'x' }, attribution, '7.7.7.7')
    expect((await submitLead(valid, attribution, '7.7.7.7')).ok).toBe(true)
  })

  it('refuses once the rate limit is hit, with a human message', async () => {
    for (let i = 0; i < 5; i++) await submitLead(valid, attribution, '9.9.9.9')
    const result = await submitLead(valid, attribution, '9.9.9.9')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/too many|try again/i)
  })

  it('issues distinct ids for concurrent submissions', async () => {
    const results = await Promise.all([
      submitLead(valid, attribution, 'a.1'),
      submitLead(valid, attribution, 'b.2'),
      submitLead(valid, attribution, 'c.3'),
    ])
    const ids = results.filter((r) => r.ok).map((r) => (r.ok ? r.id : ''))
    expect(new Set(ids).size).toBe(3)
  })
})
