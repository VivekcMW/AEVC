export type Attribution = {
  source: string
  medium: string | null
  campaign: string | null
  referralCode: string | null
  landedAt: string
}

export const ATTRIBUTION_COOKIE = 'adhara_attr'
/** Section 6 calls for attribution-window rules. 30 days is the placeholder. */
export const ATTRIBUTION_WINDOW_DAYS = 30

/** Referral codes are money — a malformed one is dropped, never stored optimistically. */
function cleanReferral(raw: string | null): string | null {
  if (!raw) return null
  const code = raw.trim().toUpperCase()
  return /^[A-Z0-9]{4,32}$/.test(code) ? code : null
}

export function parseAttribution(params: URLSearchParams): Attribution {
  return {
    source: params.get('utm_source')?.slice(0, 64) || 'direct',
    medium: params.get('utm_medium')?.slice(0, 64) || null,
    campaign: params.get('utm_campaign')?.slice(0, 64) || null,
    referralCode: cleanReferral(params.get('ref')),
    landedAt: new Date().toISOString(),
  }
}

/** Reads a cookie value written by middleware, falling back to a direct-visit record. */
export function attributionFromCookie(raw: string | undefined): Attribution {
  if (!raw) return parseAttribution(new URLSearchParams())
  try {
    const parsed = JSON.parse(raw) as Partial<Attribution>
    return {
      source: typeof parsed.source === 'string' ? parsed.source : 'direct',
      medium: typeof parsed.medium === 'string' ? parsed.medium : null,
      campaign: typeof parsed.campaign === 'string' ? parsed.campaign : null,
      referralCode: typeof parsed.referralCode === 'string' ? parsed.referralCode : null,
      landedAt: typeof parsed.landedAt === 'string' ? parsed.landedAt : new Date().toISOString(),
    }
  } catch {
    // A tampered cookie must not take down a form submission.
    return parseAttribution(new URLSearchParams())
  }
}
