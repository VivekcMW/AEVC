import type { VehicleModel } from '@/lib/data/types'

/** PLACEHOLDER — see src/content/PLACEHOLDER.md. Not an Adhara commitment. */
export const PLACEHOLDER = true

/**
 * Every model sits inside low-speed limits — 25 km/h and a 250 W motor — because that
 * specification is what makes the no-registration position arguable in the first place.
 */
export const models: VehicleModel[] = [
  {
    slug: 'adhara-neev',
    name: 'Neev',
    tagline: 'The daily commute, settled.',
    priceInr: 54990,
    rangeKm: 65,
    topSpeedKmph: 25,
    batteryKwh: 1.5,
    chargeHours: 4,
    loadKg: 150,
    motorW: 250,
    sohWarrantyYears: 3,
    colours: [
      { name: 'Forest', hex: '#0E3B2E' },
      { name: 'Turmeric', hex: '#E8A020' },
      { name: 'Mist', hex: '#F4F6F1' },
    ],
    specs: [
      { label: 'Motor', value: '250 W BLDC hub' },
      { label: 'Battery', value: '1.5 kWh LFP, removable' },
      { label: 'Range', value: '65 km per full charge' },
      { label: 'Top speed', value: '25 km/h' },
      { label: 'Charge time', value: '4 hours, 5 A socket' },
      { label: 'Load capacity', value: '150 kg' },
      { label: 'Battery health warranty', value: '3 years or 70% state of health' },
    ],
    faqIds: ['registration', 'battery-life', 'charging-cost'],
  },
  {
    slug: 'adhara-sthir',
    name: 'Sthir',
    tagline: 'Longer legs, same monthly.',
    priceInr: 68990,
    rangeKm: 85,
    topSpeedKmph: 25,
    batteryKwh: 2,
    chargeHours: 5,
    loadKg: 170,
    motorW: 250,
    sohWarrantyYears: 3,
    colours: [
      { name: 'Forest', hex: '#0E3B2E' },
      { name: 'Ink', hex: '#14201B' },
    ],
    specs: [
      { label: 'Motor', value: '250 W BLDC hub' },
      { label: 'Battery', value: '2.0 kWh LFP, removable' },
      { label: 'Range', value: '85 km per full charge' },
      { label: 'Top speed', value: '25 km/h' },
      { label: 'Charge time', value: '5 hours, 5 A socket' },
      { label: 'Load capacity', value: '170 kg' },
      { label: 'Battery health warranty', value: '3 years or 70% state of health' },
    ],
    faqIds: ['registration', 'battery-life', 'range-real-world'],
  },
  {
    slug: 'adhara-bhaar',
    name: 'Bhaar',
    tagline: 'Built to carry the shop.',
    priceInr: 79990,
    rangeKm: 70,
    topSpeedKmph: 25,
    batteryKwh: 2.2,
    chargeHours: 5,
    loadKg: 220,
    motorW: 250,
    sohWarrantyYears: 3,
    colours: [
      { name: 'Turmeric', hex: '#E8A020' },
      { name: 'Forest', hex: '#0E3B2E' },
    ],
    specs: [
      { label: 'Motor', value: '250 W BLDC hub' },
      { label: 'Battery', value: '2.2 kWh LFP, removable' },
      { label: 'Range', value: '70 km loaded' },
      { label: 'Top speed', value: '25 km/h' },
      { label: 'Charge time', value: '5 hours, 5 A socket' },
      { label: 'Load capacity', value: '220 kg including rider' },
      { label: 'Battery health warranty', value: '3 years or 70% state of health' },
    ],
    faqIds: ['registration', 'fleet', 'battery-life'],
  },
]
