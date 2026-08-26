import type { Faq } from '@/lib/data/types'

export const PLACEHOLDER = true

export const faqs: Faq[] = [
  {
    id: 'registration',
    category: 'Buying',
    question: 'Does this vehicle need registration or a licence?',
    answer:
      'Adhara vehicles are built to low-speed specification — 25 km/h and a 250 W motor. ' +
      'Requirements vary by state, and the exact position for your state is being confirmed ' +
      'with counsel before we state it here.',
  },
  {
    id: 'battery-life',
    category: 'Battery',
    question: 'What happens as the battery ages?',
    answer:
      'Every pack is warranted for 3 years or 70% state of health, whichever comes first. ' +
      'Capacity fades gradually rather than failing suddenly; expect roughly 8 to 12% loss in year one.',
  },
  {
    id: 'charging-cost',
    category: 'Battery',
    question: 'What does a full charge cost?',
    answer:
      'A 1.5 kWh pack drawn from a domestic socket costs roughly ₹12 to fill at ₹8 per unit — ' +
      'about ₹0.18 per kilometre against ₹2.20 or so for a petrol two-wheeler.',
  },
  {
    id: 'range-real-world',
    category: 'Battery',
    question: 'Is the stated range realistic?',
    answer:
      'Stated range assumes one rider, level ground and moderate weather. Two riders, ' +
      'gradients or a hot afternoon typically cost 15 to 20%.',
  },
  {
    id: 'fleet',
    category: 'Buying',
    question: 'Can I buy several for a business?',
    answer:
      'Yes. Bulk enquiries route to our fleet team, who quote on total cost of ownership ' +
      'rather than sticker price.',
  },
  {
    id: 'emi-no-bank',
    category: 'EMI',
    question: 'How can there be EMI without a bank?',
    answer:
      'Adhara carries the risk instead of a lender. You pay us a fixed amount monthly and ' +
      'your vehicle is released for delivery once you cross the eligibility mark. ' +
      'No credit check, and no credit record either way.',
  },
  {
    id: 'emi-late-payment',
    category: 'EMI',
    question: 'What happens if I miss a monthly payment?',
    answer:
      'Contact us before the due date if you expect to miss one — the grace period and lapse ' +
      'policy are stated in your enrollment agreement, which is the authoritative version.',
  },
  {
    id: 'emi-tenure-change',
    category: 'EMI',
    question: 'Can I change my tenure after enrolling?',
    answer:
      'Not mid-scheme today. If your circumstances change, raise it with support and we will ' +
      'look at what is possible on a case-by-case basis.',
  },
  {
    id: 'colours-availability',
    category: 'Buying',
    question: 'Are all colours always in stock?',
    answer:
      'Colour availability varies by model and by dealer. A dealer confirms current stock ' +
      'when you check delivery at your pincode or call ahead.',
  },
  {
    id: 'delivery-time',
    category: 'Delivery',
    question: 'How long does delivery take once I am eligible?',
    answer:
      'Once you cross the eligibility mark, delivery is typically arranged within 5 to 10 ' +
      'working days, depending on your pincode and current stock at the nearest dealer.',
  },
  {
    id: 'delivery-areas',
    category: 'Delivery',
    question: 'Do you deliver to my area?',
    answer:
      'Check your pincode on any model page or the dealer locator. Coverage expands as new ' +
      'dealers come online, so an unserved pincode today may change.',
  },
  {
    id: 'delivery-doorstep',
    category: 'Delivery',
    question: 'Is home delivery really free?',
    answer:
      'Yes, anywhere we currently serve. There is no separate delivery charge added at checkout.',
  },
  {
    id: 'service-centers',
    category: 'Service',
    question: 'Where do I get my vehicle serviced?',
    answer:
      'Any dealer on the network can service your vehicle. Use the dealer locator to find the ' +
      'nearest one, or book a service slot directly from the Service & Maintenance page.',
  },
  {
    id: 'service-cost',
    category: 'Service',
    question: 'What does a service visit cost?',
    answer:
      'Scheduled maintenance plan pricing is being finalised. Individual visit pricing is ' +
      'confirmed by the servicing dealer before any work begins.',
  },
  {
    id: 'service-warranty-claim',
    category: 'Service',
    question: 'How do I make a warranty claim?',
    answer:
      'Raise an issue with your order or vehicle reference through the support page, and ' +
      'we will guide you through the next step.',
  },
]
