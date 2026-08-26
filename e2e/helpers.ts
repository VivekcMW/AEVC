import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Locator, Page } from '@playwright/test'

export const PAGE_TYPES = [
  '/en',
  '/en/vehicles',
  '/en/vehicles/adhara-neev',
  '/en/emi',
  '/en/emi/calculator',
  '/en/test-ride',
  '/en/dealers',
  '/en/support',
  '/en/support/raise-an-issue',
  '/en/support/warranty',
  '/en/contact',
  '/en/partner/dealer',
  '/en/partner/promoter',
  '/en/about',
] as const

export async function gotoLocale(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
}

/**
 * Fills a lead form's shared fields. Pass `scope` (e.g. the form/section locator) when a
 * page renders more than one LeadForm at once — the test-ride page has both a booking
 * form and an always-visible doorstep-demo form, so unscoped label lookups are ambiguous.
 */
export async function fillLeadForm(
  page: Page | Locator,
  values: { name: string; phone: string; pincode?: string },
) {
  await page.getByLabel(/your name/i).fill(values.name)
  await page.getByLabel(/mobile number/i).fill(values.phone)
  if (values.pincode) await page.getByLabel(/^pincode$/i).fill(values.pincode)
}

/** Reads the stub sink directly — the assertion that attribution actually persisted. */
export function readStoredLeads(): {
  id: string
  lead: Record<string, string>
  attribution: { referralCode: string | null; source: string }
}[] {
  try {
    return readFileSync(resolve(process.cwd(), '.data/leads.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
  } catch {
    return []
  }
}
