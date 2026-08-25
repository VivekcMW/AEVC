import { models } from '@/content/models'
import type { VehicleModel } from './types'

/**
 * The seam. Pages call these functions and never touch src/content.
 * When the platform's catalog API exists, only this file changes — proposal Section 6.
 */
export async function getModels(): Promise<VehicleModel[]> {
  return models
}

export async function getModel(slug: string): Promise<VehicleModel | null> {
  return models.find((m) => m.slug === slug) ?? null
}
