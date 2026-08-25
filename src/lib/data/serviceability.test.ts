import { describe, expect, it } from 'vitest'
import { checkServiceability } from './serviceability'

describe('checkServiceability', () => {
  it('confirms a serviceable pincode with a delivery estimate', async () => {
    const result = await checkServiceability('411001')
    expect(result.status).toBe('serviceable')
    if (result.status === 'serviceable') expect(result.days).toBeGreaterThan(0)
  })

  it('reports an unserved pincode as unserviceable, not as an error', async () => {
    expect((await checkServiceability('999999')).status).toBe('unserviceable')
  })

  it('rejects a malformed pincode as failed rather than guessing', async () => {
    expect((await checkServiceability('41')).status).toBe('failed')
    expect((await checkServiceability('abcdef')).status).toBe('failed')
  })
})
