/**
 * PLACEHOLDER commercial parameters. Every value here is Adhara's decision to make,
 * not a calculation. Replacing them is a one-file edit by design.
 */
export const scheme = {
  PLACEHOLDER: true,
  /** Premium charged over the cash price across the whole scheme. */
  schemeFee: 0.18,
  /** Share of installments paid before the vehicle is released for delivery. */
  eligibilityThreshold: 0.6,
  tenures: [12, 18, 24],
} as const

export type Tenure = (typeof scheme.tenures)[number]
