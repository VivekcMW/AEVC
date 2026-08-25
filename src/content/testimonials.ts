import type { Testimonial } from '@/lib/data/types'

export const PLACEHOLDER = true

/**
 * Every entry is approved: false. These are illustrative, not real customers —
 * src/lib/legal gates them so no fabricated quote can render as genuine.
 */
export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Sample rider', city: 'Pune', quote: 'Placeholder testimonial copy.', approved: false },
  { id: 't2', name: 'Sample rider', city: 'Nashik', quote: 'Placeholder testimonial copy.', approved: false },
  { id: 't3', name: 'Sample rider', city: 'Indore', quote: 'Placeholder testimonial copy.', approved: false },
]
