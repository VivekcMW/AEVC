import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28"
    >
      <span className="sr-only">Loading</span>
      <Skeleton className="h-12 w-2/3 max-w-md sm:h-16" />
      <Skeleton className="mt-4 h-0.5 w-16" />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}
