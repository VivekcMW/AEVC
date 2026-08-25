import { dealers } from '@/content/dealers'
import type { Dealer } from './types'

export async function getDealers(): Promise<Dealer[]> {
  return dealers
}

export async function getTestRideDealers(): Promise<Dealer[]> {
  return dealers.filter((d) => d.offersTestRide)
}
