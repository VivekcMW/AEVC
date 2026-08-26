import type { Dealer } from '@/lib/data/types'

export const PLACEHOLDER = true

/** Invented dealers. Real ones sync from the platform's dealer master — Section 6. */
export const dealers: Dealer[] = [
  { id: 'd-pune-01', name: 'Adhara Pune Central', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '1800 000 0001', offersTestRide: true, lat: 18.5204, lng: 73.8567 },
  { id: 'd-pune-02', name: 'Adhara Hadapsar', city: 'Pune', state: 'Maharashtra', pincode: '411028', phone: '1800 000 0002', offersTestRide: true, lat: 18.5089, lng: 73.926 },
  { id: 'd-nashik-01', name: 'Adhara Nashik Road', city: 'Nashik', state: 'Maharashtra', pincode: '422101', phone: '1800 000 0003', offersTestRide: true, lat: 19.9975, lng: 73.7898 },
  { id: 'd-indore-01', name: 'Adhara Indore Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010', phone: '1800 000 0004', offersTestRide: true, lat: 22.7196, lng: 75.8577 },
  { id: 'd-bhopal-01', name: 'Adhara Bhopal Arera', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016', phone: '1800 000 0005', offersTestRide: false, lat: 23.2599, lng: 77.4126 },
  { id: 'd-surat-01', name: 'Adhara Surat Adajan', city: 'Surat', state: 'Gujarat', pincode: '395009', phone: '1800 000 0006', offersTestRide: true, lat: 21.1702, lng: 72.8311 },
  { id: 'd-ahmedabad-01', name: 'Adhara Ahmedabad Satellite', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', phone: '1800 000 0007', offersTestRide: true, lat: 23.0225, lng: 72.5714 },
  { id: 'd-jaipur-01', name: 'Adhara Jaipur Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', pincode: '302017', phone: '1800 000 0008', offersTestRide: true, lat: 26.9124, lng: 75.7873 },
  { id: 'd-lucknow-01', name: 'Adhara Lucknow Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010', phone: '1800 000 0009', offersTestRide: true, lat: 26.8467, lng: 80.9462 },
  { id: 'd-kanpur-01', name: 'Adhara Kanpur Swaroop Nagar', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208002', phone: '1800 000 0010', offersTestRide: false, lat: 26.4499, lng: 80.3319 },
]
