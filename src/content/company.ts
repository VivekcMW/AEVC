import type { Milestone } from '@/lib/data/company'

export const PLACEHOLDER = true

/**
 * Invented history. Replace before launch — a fabricated founding date is the kind of
 * detail a journalist checks.
 */
export const milestones: Milestone[] = [
  {
    year: '2024',
    title: 'The problem, stated plainly',
    body: 'Two of our founders spent a year watching first-time buyers get turned down for two-wheeler loans, not because they could not pay, but because they had no credit history to show.',
  },
  {
    year: '2025',
    title: 'A payment scheme instead of a lender',
    body: 'Rather than find a friendlier bank, we removed the bank. Customers pay Adhara monthly and take delivery once they cross the eligibility mark.',
  },
  {
    year: '2026',
    title: 'Assembly begins',
    body: 'Low-speed assembly starts, built to the 25 km/h and 250 W specification that keeps these vehicles inside the unregistered category.',
  },
]

export const factoryStats: { label: string; value: string }[] = [
  { label: 'Top speed, by design', value: '25 km/h' },
  { label: 'Motor', value: '250 W' },
  { label: 'Battery health warranty', value: '3 years' },
  { label: 'Bank involvement', value: 'None' },
]
