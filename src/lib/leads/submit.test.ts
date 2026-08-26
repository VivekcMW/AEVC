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

describe('extended lead kinds', () => {
  it('accepts a test-ride booking carrying a dealer and a slot', async () => {
    const result = await submitLead(
      { kind: 'test-ride', name: 'Ravi Menon', phone: '9812345670', dealerId: 'd-pune-01', slotId: 's1' },
      attribution,
      '4.4.4.4',
    )
    expect(result.ok).toBe(true)
    expect(readAll().at(-1)?.lead.slotId).toBe('s1')
  })

  it('accepts a support issue carrying a reference', async () => {
    const result = await submitLead(
      { kind: 'issue', name: 'Meera Rao', phone: '9812345671', reference: 'ADH-12345', message: 'Battery not charging' },
      attribution,
      '5.5.5.5',
    )
    expect(result.ok).toBe(true)
    expect(readAll().at(-1)?.lead.reference).toBe('ADH-12345')
  })

  it('rejects a kind the platform does not recognise', async () => {
    const result = await submitLead(
      { kind: 'not-a-kind', name: 'X Y', phone: '9812345672' },
      attribution,
      '6.6.6.6',
    )
    expect(result.ok).toBe(false)
  })

  it('truncates nothing silently — an over-long message is rejected, not trimmed', async () => {
    const result = await submitLead(
      { kind: 'enquiry', name: 'A B', phone: '9812345673', message: 'x'.repeat(1001) },
      attribution,
      '7.7.7.7',
    )
    expect(result.ok).toBe(false)
  })
})
