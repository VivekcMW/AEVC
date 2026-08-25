import type { Dealer } from '@/lib/data/types'

export const PLACEHOLDER = true

/** Invented dealers. Real ones sync from the platform's dealer master — Section 6. */
export const dealers: Dealer[] = [
  { id: 'd-pune-01', name: 'Adhara Pune Central', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '1800 000 0001', offersTestRide: true },
  { id: 'd-pune-02', name: 'Adhara Hadapsar', city: 'Pune', state: 'Maharashtra', pincode: '411028', phone: '1800 000 0002', offersTestRide: true },
  { id: 'd-nashik-01', name: 'Adhara Nashik Road', city: 'Nashik', state: 'Maharashtra', pincode: '422101', phone: '1800 000 0003', offersTestRide: true },
  { id: 'd-indore-01', name: 'Adhara Indore Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010', phone: '1800 000 0004', offersTestRide: true },
  { id: 'd-bhopal-01', name: 'Adhara Bhopal Arera', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016', phone: '1800 000 0005', offersTestRide: false },
  { id: 'd-surat-01', name: 'Adhara Surat Adajan', city: 'Surat', state: 'Gujarat', pincode: '395009', phone: '1800 000 0006', offersTestRide: true },
]
