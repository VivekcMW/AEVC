import { useTranslations } from 'next-intl'
import { ChargeState } from '@/components/ui/ChargeState'
import { groupByState } from '@/lib/data/dealers'
import type { Dealer } from '@/lib/data/types'

export function DealerList({ dealers }: { dealers: Dealer[] }) {
  const t = useTranslations('dealers')

  if (dealers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-forest/25 bg-surface p-8 text-center text-ink/70">
        {t('empty')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-12">
      {groupByState(dealers).map((group) => (
        <section key={group.state}>
          <h2 className="font-heading text-xs font-semibold tracking-[0.2em] text-ink/70 uppercase">
            {group.state}
          </h2>
          <ul className="mt-4 divide-y divide-forest/12 border-t border-forest/15">
            {group.dealers.map((dealer) => (
              <li key={dealer.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-5">
                <div className="min-w-[14rem] flex-1">
                  <h3 className="text-lg font-medium text-ink">{dealer.name}</h3>
                  <p className="tnum mt-0.5 text-sm text-ink/60">
                    {dealer.city} · {dealer.pincode}
                  </p>
                </div>
                {dealer.offersTestRide && <ChargeState status="full" label={t('offersTestRide')} />}
                <a
                  href={`tel:${dealer.phone.replace(/\s/g, '')}`}
                  className="tnum rounded-pill border border-forest/25 px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  {dealer.phone}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
