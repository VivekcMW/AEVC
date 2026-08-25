import type { VehicleModel } from './types'

export type Criteria = {
  maxPrice?: number
  minRange?: number
  minTopSpeed?: number
  minBatteryKwh?: number
}

export const CRITERIA_KEYS = ['maxPrice', 'minRange', 'minTopSpeed', 'minBatteryKwh'] as const

export function filterModels(models: VehicleModel[], c: Criteria): VehicleModel[] {
  return models.filter(
    (m) =>
      (c.maxPrice === undefined || m.priceInr <= c.maxPrice) &&
      (c.minRange === undefined || m.rangeKm >= c.minRange) &&
      (c.minTopSpeed === undefined || m.topSpeedKmph >= c.minTopSpeed) &&
      (c.minBatteryKwh === undefined || m.batteryKwh >= c.minBatteryKwh),
  )
}

/** Criteria live in the URL so a filtered result is shareable and indexable. */
export function parseCriteria(params: URLSearchParams): Criteria {
  const criteria: Criteria = {}
  for (const key of CRITERIA_KEYS) {
    const raw = params.get(key)
    if (raw === null) continue
    const value = Number(raw)
    if (Number.isFinite(value) && value > 0) criteria[key] = value
  }
  return criteria
}

/** Builds the query string for a filter link, dropping the key being cleared. */
export function toSearchParams(criteria: Criteria): string {
  const params = new URLSearchParams()
  for (const key of CRITERIA_KEYS) {
    const value = criteria[key]
    if (value !== undefined) params.set(key, String(value))
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}
