import Link from 'next/link'
import { PriceDual } from '@/components/ui/PriceDual'

/**
 * Mobile-only. Section 7 asks for a sticky CTA bar on model pages. It carries the full
 * price alongside the monthly figure: when the page is scrolled this bar *is* the visible
 * price, and a monthly figure shown alone is the thing Section 7 forbids.
 */
export function StickyCtaBar({
  full,
  monthly,
  tenure,
  href,
  label,
}: {
  full: number
  monthly: number
  tenure: number
  href: string
  label: string
}) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-forest/15 bg-surface/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <PriceDual full={full} monthly={monthly} tenure={tenure} size="sm" />
        <Link
          href={href}
          className="shrink-0 rounded-md bg-forest px-4 py-2.5 text-sm font-medium text-white"
        >
          {label}
        </Link>
      </div>
    </div>
  )
}
