export type LegalClaim = {
  id: string
  /** The claim as marketing would like to state it. Renders only when approved. */
  text: string
  approved: boolean
  /** Populated only once counsel has confirmed the claim state by state. */
  states?: string[]
  /** What renders until approval — factual, defensible, and not a claim. */
  fallback: string
}

/**
 * Section 12, open question 3: whether the "no licence / no registration" position is
 * uniform across launch states is unresolved. Storing approval as data means someone has
 * to consciously flip a boolean, rather than a sentence quietly reaching a hero headline.
 */
export const claims: LegalClaim[] = [
  {
    id: 'no-registration',
    text: 'No licence or registration is required to ride an Adhara vehicle.',
    approved: false,
    fallback:
      'Built to low-speed specification: 25 km/h top speed, 250 W motor. ' +
      'Requirements vary by state — we confirm your state before delivery.',
  },
  {
    id: 'no-credit-check',
    text: 'No bank, no credit check, and no effect on your credit record either way.',
    approved: true,
    fallback: 'Monthly payments are made directly to Adhara Energy.',
  },
  {
    id: 'soh-warranty',
    text: 'Battery warranted for 3 years or 70% state of health, whichever comes first.',
    approved: true,
    fallback: 'Battery warranty terms are stated on your invoice.',
  },
  {
    id: 'home-delivery',
    text: 'Free home delivery anywhere we serve.',
    approved: false,
    fallback: 'Home delivery is available in serviceable pincodes. Check yours above.',
  },
]

export function getClaim(id: string): LegalClaim | null {
  return claims.find((c) => c.id === id) ?? null
}
