/**
 * Route-level loading placeholders. Sized to the real content they stand in for, so the
 * arriving page does not shift the layout — a skeleton that causes CLS is worse than no
 * skeleton at all.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-md ${className}`} />
}

export function SkeletonPage({ cards = 0 }: { cards?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28"
    >
      <span className="sr-only">Loading</span>
      <Skeleton className="h-12 w-2/3 max-w-lg sm:h-16" />
      <Skeleton className="mt-4 h-0.5 w-16" />
      <Skeleton className="mt-6 h-5 w-full max-w-xl" />

      {cards > 0 && (
        <div className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="flex flex-col gap-6">
              <Skeleton className="aspect-4/3 w-full rounded-2xl" />
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
