/** PLACEHOLDER commission structure. Adhara's decision, not a calculation. */
export const commission = {
  PLACEHOLDER: true,
  perEnrollmentInr: 750,
  perDeliveryInr: 1500,
  tiers: [
    { from: 5, bonusInr: 2000 },
    { from: 10, bonusInr: 5000 },
    { from: 20, bonusInr: 12000 },
  ],
} as const

export function monthlyEarnings(enrollments: number): {
  base: number
  bonus: number
  total: number
} {
  if (!Number.isFinite(enrollments) || enrollments < 0) {
    throw new Error(`Invalid enrollments: ${enrollments}`)
  }

  const base = Math.round(enrollments * commission.perEnrollmentInr)
  // Highest tier reached wins; tiers do not stack.
  const bonus = commission.tiers
    .filter((tier) => enrollments >= tier.from)
    .reduce((highest, tier) => Math.max(highest, tier.bonusInr), 0)

  return { base, bonus, total: base + bonus }
}
