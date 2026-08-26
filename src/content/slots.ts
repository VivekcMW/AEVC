import type { Slot } from '@/lib/data/slots'
import { dealers } from './dealers'

export const PLACEHOLDER = true

/**
 * Fixed relative offsets rather than real dates: a slot list generated from the current
 * date would make every test non-deterministic. The platform's booking API replaces this.
 */
const DAYS = ['Tomorrow', 'In 2 days', 'In 3 days'] as const
const TIMES = ['10:00', '12:30', '16:00', '18:30'] as const

export const slots: Slot[] = dealers
  .filter((d) => d.offersTestRide)
  .flatMap((dealer) =>
    DAYS.flatMap((date, di) =>
      TIMES.map((time, ti) => ({
        id: `${dealer.id}-${di}-${ti}`,
        dealerId: dealer.id,
        date,
        time,
        // A deterministic gap so the UI has genuinely unavailable slots to render.
        available: (di + ti) % 5 !== 0,
      })),
    ),
  )
