import type { Spec } from '@/lib/data/types'

/** Reads as a specification sheet, because spec transparency is the product's argument. */
export function SpecTable({ specs, title }: { specs: Spec[]; title: string }) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold text-ink">{title}</h2>
      <span aria-hidden className="mt-3 block h-0.5 w-12 bg-turmeric" />
      <dl className="tnum mt-4 divide-y divide-forest/10 overflow-hidden rounded-lg border border-forest/12 bg-surface">
        {specs.map((spec) => (
          <div key={spec.label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
            <dt className="min-w-[9rem] text-sm text-ink/60">{spec.label}</dt>
            <dd className="font-medium text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
