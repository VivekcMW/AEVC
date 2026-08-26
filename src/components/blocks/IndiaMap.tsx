import { useTranslations } from 'next-intl'
import type { Dealer } from '@/lib/data/types'

// Bounding box for mainland India, used to normalise coordinates into the viewBox.
const BOUNDS = { minLat: 8, maxLat: 35, minLng: 68, maxLng: 89 }

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100
  return { x, y }
}

/** No map provider, no API key: an honest schematic, not a substitute for a real map. */
export function IndiaMap({ dealers }: { dealers: Dealer[] }) {
  const t = useTranslations('dealers')

  return (
    <figure className="rounded-2xl bg-forest/[0.045] p-6">
      <svg viewBox="0 0 100 100" role="img" aria-label={t('mapCaption')} className="w-full">
        {/* Grid, matching the blueprint language used on Forest sections. */}
        <g stroke="var(--adhara-color-forest)" strokeOpacity="0.09" strokeWidth="0.2">
          {[20, 40, 60, 80].map((n) => (
            <g key={n}>
              <line x1={n} y1="0" x2={n} y2="100" />
              <line x1="0" y1={n} x2="100" y2={n} />
            </g>
          ))}
        </g>
        {dealers.map((dealer) => {
          const { x, y } = project(dealer.lat, dealer.lng)
          return (
            <g key={dealer.id}>
              <circle cx={x} cy={y} r="2.4" fill="var(--adhara-color-turmeric)" fillOpacity="0.25" />
              <circle cx={x} cy={y} r="0.9" fill="var(--adhara-color-forest)" />
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-4 text-xs text-ink/70">{t('mapCaption')}</figcaption>
    </figure>
  )
}
