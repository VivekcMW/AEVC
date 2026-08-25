import type { Spec } from '@/lib/data/types'

/** Reads as a specification sheet, because spec transparency is the product's argument. */
export function SpecTable({ specs, title }: { specs: Spec[]; title: string }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      <span aria-hidden className="mt-3 block h-0.5 w-12 bg-turmeric" />
      <dl className="tnum mt-6 divide-y divide-forest/12">
        {specs.map((spec) => (
          <div key={spec.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
            <dt className="text-sm text-ink/55">{spec.label}</dt>
            <dd className="text-lg font-medium text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
