import { describe, expect, it } from 'vitest'
import { getApprovedTestimonials } from './testimonials'

describe('getApprovedTestimonials', () => {
  it('returns nothing while every placeholder testimonial is unapproved', async () => {
    expect(await getApprovedTestimonials()).toEqual([])
  })
})
