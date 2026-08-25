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
]
