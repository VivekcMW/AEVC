import Link from 'next/link'
import { formatRupees } from '@/lib/format'

/**
 * Mobile-only. Section 7 asks for a sticky CTA bar on model pages; it carries the monthly
 * figure because that, not the sticker price, is what this category is decided on.
 */
export function StickyCtaBar({
  monthly,
  tenure,
  href,
  label,
}: {
  monthly: number
  tenure: number
  href: string
  label: string
}) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-forest/15 bg-surface/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="tnum text-sm leading-tight">
          <span className="font-semibold text-ink">{formatRupees(monthly)}</span>
          <span className="text-ink/60">/month · {tenure} mo</span>
        </p>
        <Link
          href={href}
          className="rounded-md bg-forest px-4 py-2.5 text-sm font-medium text-white"
        >
          {label}
        </Link>
      </div>
    </div>
  )
}
