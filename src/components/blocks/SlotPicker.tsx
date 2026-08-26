'use client'

import { useTranslations } from 'next-intl'
import type { Slot } from '@/lib/data/slots'

/**
 * Radios, not buttons: keyboard and screen-reader grouping behaviour comes free.
 * Unavailable slots render disabled rather than hidden — a visibly full slot tells the
 * customer more than a missing one.
 */
export function SlotPicker({
  slots,
  selected,
  onSelect,
}: {
  slots: Slot[]
  selected: string | null
  onSelect: (slotId: string) => void
}) {
  const t = useTranslations('testRide')

  const byDate = new Map<string, Slot[]>()
  for (const slot of slots) {
    byDate.set(slot.date, [...(byDate.get(slot.date) ?? []), slot])
  }

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="text-sm font-medium text-ink">{t('chooseSlot')}</legend>
      {[...byDate.entries()].map(([date, daySlots]) => (
        <div key={date}>
          <p className="text-sm font-semibold text-ink/70">{date}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <label
                key={slot.id}
                className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                  !slot.available
                    ? 'cursor-not-allowed border-forest/10 text-ink/30'
                    : selected === slot.id
                      ? 'cursor-pointer border-turmeric bg-turmeric/12 text-ink'
                      : 'cursor-pointer border-forest/25 text-ink/80 hover:border-forest/45'
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  value={slot.id}
                  disabled={!slot.available}
                  checked={selected === slot.id}
                  onChange={() => onSelect(slot.id)}
                  className="sr-only"
                />
                {slot.time}
                {!slot.available && <span className="ml-1.5">· {t('unavailable')}</span>}
              </label>
            ))}
          </div>
        </div>
      ))}
    </fieldset>
  )
}
