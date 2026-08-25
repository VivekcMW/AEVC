import { dealers } from '@/content/dealers'

export type ServiceabilityResult =
  | { status: 'serviceable'; days: number }
  | { status: 'unserviceable' }
  | { status: 'failed' }

/**
 * Three states, deliberately. Telling a buyer in a live pincode that we do not deliver
 * there — because a lookup blipped — is a lost sale caused by infrastructure.
 * 'failed' is what the UI retries; 'unserviceable' is what it believes.
 */
export async function checkServiceability(pincode: string): Promise<ServiceabilityResult> {
  if (!/^[1-9][0-9]{5}$/.test(pincode)) return { status: 'failed' }

  const prefix = pincode.slice(0, 3)
  const nearest = dealers.find((d) => d.pincode.slice(0, 3) === prefix)
  if (!nearest) return { status: 'unserviceable' }

  return { status: 'serviceable', days: 5 }
}
