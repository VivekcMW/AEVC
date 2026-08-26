/**
 * Ambient battery-fill loop — the charge metaphor (Section 2.3) as pure atmosphere,
 * not a status (ChargeState still owns that job). Decorative only, colour: currentColor
 * for the outline, brand lime for the fill.
 */
export function ChargeFill({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 32" fill="none" className={className}>
      <rect x="1" y="1" width="54" height="30" rx="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <rect x="56" y="11" width="6" height="10" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="5" y="5" width="46" height="22" rx="3" fill="var(--adhara-color-turmeric)" className="charge-fill-bar" />
    </svg>
  )
}
