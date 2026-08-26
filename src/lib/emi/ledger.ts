import { calculateEmi } from './calculate'

export type LedgerInstallment = {
  month: number
  amount: number
  status: 'paid' | 'due' | 'upcoming'
}

/**
 * Mock ledger — stands in for the platform's real EMI ledger, blocked on Plan 4's
 * platform-API decision. `monthsPaid` simulates how far into the schedule this demo
 * account is; the read view this drives is exactly what My Account will show once
 * that data is real.
 */
export function buildLedger({
  priceInr,
  tenureMonths,
  monthsPaid,
}: {
  priceInr: number
  tenureMonths: number
  monthsPaid: number
}): LedgerInstallment[] {
  const { monthly } = calculateEmi({ priceInr, tenureMonths })

  return Array.from({ length: tenureMonths }, (_, i) => {
    const month = i + 1
    const status: LedgerInstallment['status'] =
      month <= monthsPaid ? 'paid' : month === monthsPaid + 1 ? 'due' : 'upcoming'
    return { month, amount: monthly, status }
  })
}
