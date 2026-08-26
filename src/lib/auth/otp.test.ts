import { describe, expect, it } from 'vitest'
import { requestOtp, verifyOtp } from './otp'

describe('requestOtp', () => {
  it('sends for a valid ten-digit Indian mobile number', async () => {
    expect(await requestOtp('9876543210')).toEqual({ sent: true })
  })

  it('does not send for a malformed number', async () => {
    expect(await requestOtp('12345')).toEqual({ sent: false })
  })
})

describe('verifyOtp', () => {
  it('verifies any well-formed code except the obviously-wrong 000000', async () => {
    expect(await verifyOtp('9876543210', '123456')).toEqual({ verified: true })
  })

  it('rejects the placeholder failure code', async () => {
    expect(await verifyOtp('9876543210', '000000')).toEqual({ verified: false })
  })

  it('rejects a malformed code', async () => {
    expect(await verifyOtp('9876543210', '12')).toEqual({ verified: false })
  })
})
