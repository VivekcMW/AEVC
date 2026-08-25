type Status = 'full' | 'low' | 'out'

/**
 * The battery-state metaphor from Section 2.3, as one component.
 * Reused for EMI status, order status, stock and serviceability so the metaphor stays
 * consistent under maintenance. Not a CTA — the accent guard deliberately ignores it.
 */
const styles: Record<Status, string> = {
  full: 'bg-charge-full/12 text-charge-full border-charge-full/35',
  low: 'bg-charge-low/15 text-ink border-charge-low/45',
  out: 'bg-charge-out/12 text-charge-out border-charge-out/35',
}

export function ChargeState({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {label}
    </span>
  )
}
