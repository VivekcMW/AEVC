import { faqs } from '@/content/faqs'
import type { Faq } from './types'

/** Given ids, returns them in the order asked for — a model page controls its own FAQ order. */
export async function getFaqs(ids?: string[]): Promise<Faq[]> {
  if (!ids) return faqs
  return ids.map((id) => faqs.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f))
}

export async function getFaqCategories(): Promise<string[]> {
  return [...new Set(faqs.map((f) => f.category))]
}
