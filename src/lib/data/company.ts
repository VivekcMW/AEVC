import { factoryStats, milestones } from '@/content/company'

export type Milestone = { year: string; title: string; body: string }

export async function getMilestones(): Promise<Milestone[]> {
  return [...milestones].sort((a, b) => Number(a.year) - Number(b.year))
}

export async function getFactoryStats(): Promise<{ label: string; value: string }[]> {
  return factoryStats
}
