import { z } from 'zod'

export const leadKinds = ['test-ride', 'enquiry', 'emi-interest', 'dealer', 'promoter'] as const

export const leadSchema = z.object({
  kind: z.enum(leadKinds),
  name: z.string().trim().min(2, 'Enter your name').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, 'Enter a ten-digit Indian mobile phone number'),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, 'Enter a six-digit pincode')
    .optional(),
  modelSlug: z.string().trim().max(64).optional(),
  message: z.string().trim().max(1000).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
