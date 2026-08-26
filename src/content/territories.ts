import type { Territory } from '@/lib/data/territories'

export const PLACEHOLDER = true

/** Invented territory availability. Replaced once real dealer-network planning exists. */
export const territories: Territory[] = [
  { state: 'Maharashtra', city: 'Pune', status: 'taken' },
  { state: 'Maharashtra', city: 'Nashik', status: 'taken' },
  { state: 'Maharashtra', city: 'Nagpur', status: 'open' },
  { state: 'Maharashtra', city: 'Aurangabad', status: 'open' },
  { state: 'Madhya Pradesh', city: 'Indore', status: 'taken' },
  { state: 'Madhya Pradesh', city: 'Bhopal', status: 'taken' },
  { state: 'Madhya Pradesh', city: 'Gwalior', status: 'open' },
  { state: 'Gujarat', city: 'Surat', status: 'taken' },
  { state: 'Gujarat', city: 'Ahmedabad', status: 'taken' },
  { state: 'Gujarat', city: 'Vadodara', status: 'limited' },
  { state: 'Rajasthan', city: 'Jaipur', status: 'taken' },
  { state: 'Rajasthan', city: 'Udaipur', status: 'open' },
  { state: 'Uttar Pradesh', city: 'Lucknow', status: 'taken' },
  { state: 'Uttar Pradesh', city: 'Kanpur', status: 'taken' },
  { state: 'Uttar Pradesh', city: 'Varanasi', status: 'limited' },
]
