import { territories } from '@/content/territories'

export type Territory = { state: string; city: string; status: 'open' | 'limited' | 'taken' }

export async function getTerritories(): Promise<Territory[]> {
  return territories
}

export async function getOpenTerritoryCount(): Promise<number> {
  return territories.filter((t) => t.status === 'open').length
}
