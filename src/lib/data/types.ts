export type Colour = { name: string; hex: string }
export type Spec = { label: string; value: string }

export type VehicleModel = {
  slug: string
  name: string
  tagline: string
  priceInr: number
  rangeKm: number
  topSpeedKmph: number
  batteryKwh: number
  chargeHours: number
  loadKg: number
  motorW: number
  sohWarrantyYears: number
  colours: Colour[]
  specs: Spec[]
  faqIds: string[]
}

export type Dealer = {
  id: string
  name: string
  city: string
  state: string
  pincode: string
  phone: string
  offersTestRide: boolean
  lat: number
  lng: number
}

export type Faq = { id: string; category: string; question: string; answer: string }

export type Testimonial = {
  id: string
  name: string
  city: string
  quote: string
  approved: boolean
}
