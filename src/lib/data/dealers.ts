import { dealers } from '@/content/dealers'
import type { Dealer } from './types'

export async function getDealers(): Promise<Dealer[]> {
  return dealers
}

export async function getTestRideDealers(): Promise<Dealer[]> {
  return dealers.filter((d) => d.offersTestRide)
}

export async function getDealerById(id: string): Promise<Dealer | null> {
  return dealers.find((d) => d.id === id) ?? null
}

/**
 * Nearest-first without a geocoding service, in four bands: exact three-digit pincode
 * prefix, then the two-digit PIN zone, then any dealer in a state that zone touches, then
 * everyone else.
 *
 * The two-digit zone band is load-bearing. Deriving the state from prefix matches alone
 * fails whenever there is no prefix match at all: the state set comes back empty, the
 * fallback collapses to raw array order, and the "nearest" dealer is whichever happens to
 * be first in the file. Indian PIN codes encode the zone in the first two digits, so that
 * is the band to fall back through.
 *
 * A malformed pincode returns everything rather than nothing — an unhelpful list beats an
 * empty one when someone is trying to find a shop.
 */
export async function findDealersNear(pincode: string, limit?: number): Promise<Dealer[]> {
  const valid = /^[1-9][0-9]{5}$/.test(pincode)
  if (!valid) return limit ? dealers.slice(0, limit) : dealers

  const prefix = pincode.slice(0, 3)
  const zone = pincode.slice(0, 2)

  const inPrefix = dealers.filter((d) => d.pincode.slice(0, 3) === prefix)
  const inZone = dealers.filter((d) => !inPrefix.includes(d) && d.pincode.slice(0, 2) === zone)
  const zoneStates = new Set([...inPrefix, ...inZone].map((d) => d.state))
  const inState = dealers.filter(
    (d) => !inPrefix.includes(d) && !inZone.includes(d) && zoneStates.has(d.state),
  )
  const rest = dealers.filter(
    (d) => !inPrefix.includes(d) && !inZone.includes(d) && !inState.includes(d),
  )

  const ordered = [...inPrefix, ...inZone, ...inState, ...rest]
  return limit ? ordered.slice(0, limit) : ordered
}

export function groupByState(list: Dealer[]): { state: string; dealers: Dealer[] }[] {
  const byState = new Map<string, Dealer[]>()
  for (const dealer of list) {
    byState.set(dealer.state, [...(byState.get(dealer.state) ?? []), dealer])
  }
  return [...byState.entries()]
    .map(([state, group]) => ({ state, dealers: group }))
    .sort((a, b) => a.state.localeCompare(b.state))
}
