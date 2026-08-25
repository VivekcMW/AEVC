import { getClaim } from './claims'

/**
 * Renders an approved claim as copy. Renders an unapproved one as its neutral fallback,
 * plus a development-only banner so the gap is impossible to overlook.
 */
export function Claim({ id, className = '' }: { id: string; className?: string }) {
  const claim = getClaim(id)
  if (!claim) return null

  if (claim.approved) return <span className={className}>{claim.text}</span>

  return (
    <span className={className} data-testid="unapproved-claim">
      {claim.fallback}
      {process.env.NODE_ENV !== 'production' && (
        <span className="ml-2 inline-block rounded bg-charge-low/30 px-2 py-0.5 text-xs font-semibold text-ink">
          claim “{claim.id}” awaiting legal sign-off
        </span>
      )}
    </span>
  )
}
