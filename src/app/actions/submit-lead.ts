'use server'

import { cookies, headers } from 'next/headers'
import {
  ATTRIBUTION_COOKIE,
  attributionFromCookie,
  submitLead,
  type SubmitResult,
} from '@/lib/leads'

export async function submitLeadAction(
  _previous: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  const jar = await cookies()
  const attribution = attributionFromCookie(jar.get(ATTRIBUTION_COOKIE)?.value)

  const requestHeaders = await headers()
  const clientKey =
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    requestHeaders.get('x-real-ip') ||
    'unknown'

  const text = (key: string) => {
    const value = formData.get(key)
    return typeof value === 'string' && value.trim() !== '' ? value : undefined
  }

  return submitLead(
    {
      kind: text('kind'),
      name: text('name'),
      phone: text('phone'),
      pincode: text('pincode'),
      modelSlug: text('modelSlug'),
      message: text('message'),
    },
    attribution,
    clientKey,
  )
}
