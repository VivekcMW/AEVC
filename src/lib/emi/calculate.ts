import { scheme, type Tenure } from './emi-scheme.placeholder'

export type EmiInput = { priceInr: number; tenureMonths: number }

export type EmiResult = {
  monthly: number
  total: number
  premium: number
  eligibilityAfterPayments: number
  tenureMonths: number
}

export function calculateEmi({ priceInr, tenureMonths }: EmiInput): EmiResult {
  if (!(priceInr > 0)) throw new Error(`Invalid price: ${priceInr}`)
  if (!scheme.tenures.includes(tenureMonths as Tenure)) {
    throw new Error(`Unsupported tenure: ${tenureMonths}. Offered: ${scheme.tenures.join(', ')}`)
  }

  const monthly = Math.round((priceInr * (1 + scheme.schemeFee)) / tenureMonths)
  // Total is derived from the rounded monthly, so what a customer adds up on paper
  // matches what we tell them the scheme costs.
  const total = monthly * tenureMonths

  return {
    monthly,
    total,
    premium: total - priceInr,
    eligibilityAfterPayments: Math.ceil(tenureMonths * scheme.eligibilityThreshold),
    tenureMonths,
  }
}

/**
 * UTC throughout, so the eligibility month never shifts with the server's timezone,
 * and clamped to the last day of the target month rather than overflowing into the next.
 * Enrolling on 31 January must land on 30 September, not 1 October — a payment schedule
 * that silently skips a month is a dispute waiting to happen.
 */
export function eligibilityDate(start: Date, tenureMonths: number): Date {
  const months = Math.ceil(tenureMonths * scheme.eligibilityThreshold)
  const year = start.getUTCFullYear()
  const month = start.getUTCMonth() + months
  const lastDayOfTarget = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return new Date(
    Date.UTC(
      year,
      month,
      Math.min(start.getUTCDate(), lastDayOfTarget),
      start.getUTCHours(),
      start.getUTCMinutes(),
      start.getUTCSeconds(),
      start.getUTCMilliseconds(),
    ),
  )
}
