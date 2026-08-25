import type { Attribution } from './attribution'
import { checkRateLimit } from './rate-limit'
import { leadSchema, type LeadInput } from './schema'
import { writeLead } from './sink'

export type SubmitResult = { ok: true; id: string } | { ok: false; error: string }

let counter = 0

export async function submitLead(
  input: unknown,
  attribution: Attribution,
  clientKey: string,
): Promise<SubmitResult> {
  // Server-side validation is the authority. The client mirrors these rules for UX only.
  // It runs before the rate limiter so a fat-fingered phone number does not burn a
  // genuine customer's remaining attempts.
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the form and try again' }
  }

  const limit = checkRateLimit(clientKey)
  if (!limit.allowed) {
    const minutes = Math.max(1, Math.ceil((limit.retryAfterSeconds ?? 60) / 60))
    return {
      ok: false,
      error: `Too many submissions from this connection. Try again in ${minutes} minutes, or call us.`,
    }
  }

  const id = `ADH-${Date.now().toString(36).toUpperCase()}-${(++counter).toString().padStart(3, '0')}`
  writeLead({
    id,
    receivedAt: new Date().toISOString(),
    lead: parsed.data as LeadInput,
    attribution,
  })
  return { ok: true, id }
}
