const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export type OtpRequestResult = { sent: boolean }
export type OtpVerifyResult = { verified: boolean }

const PHONE = /^[6-9][0-9]{9}$/
const CODE = /^[0-9]{6}$/

/**
 * Stub — no SMS provider is wired up yet (Plan 4's platform-API decision). requestOtp
 * succeeds for any valid-looking phone; verifyOtp rejects only '000000' so the failure
 * path stays demoable. Replace both with real provider calls once that lands.
 */
export async function requestOtp(phone: string): Promise<OtpRequestResult> {
  await delay(400)
  return { sent: PHONE.test(phone) }
}

export async function verifyOtp(phone: string, code: string): Promise<OtpVerifyResult> {
  await delay(400)
  return { verified: PHONE.test(phone) && CODE.test(code) && code !== '000000' }
}
