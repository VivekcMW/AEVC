import { testimonials } from '@/content/testimonials'
import type { Testimonial } from '@/lib/data/types'

/**
 * A fabricated customer quote presented as genuine is a lie, not a placeholder.
 * Only approved entries are returned; the home page renders nothing where there are none.
 */
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  return testimonials.filter((t) => t.approved)
}
