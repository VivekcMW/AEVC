import { Skeleton, SkeletonPage } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28"
    >
      <span className="sr-only">Loading</span>
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-4/3 w-full rounded-2xl" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-14 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-pill" />
        </div>
      </div>
    </div>
  )
}
