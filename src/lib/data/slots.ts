import { slots } from '@/content/slots'

export type Slot = {
  id: string
  dealerId: string
  date: string
  time: string
  available: boolean
}

export async function getSlots(dealerId: string): Promise<Slot[]> {
  return slots.filter((s) => s.dealerId === dealerId)
}

export async function getSlotById(id: string): Promise<Slot | null> {
  return slots.find((s) => s.id === id) ?? null
}
