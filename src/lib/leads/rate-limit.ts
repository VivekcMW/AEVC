const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

/**
 * In-memory and per-instance — adequate for a stub sink, inadequate for production.
 * Replace with a shared store when the platform lead API lands.
 */
export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    const oldest = Math.min(...recent)
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) }
  }

  recent.push(now)
  hits.set(key, recent)
  return { allowed: true }
}

export function resetRateLimit(): void {
  hits.clear()
}
