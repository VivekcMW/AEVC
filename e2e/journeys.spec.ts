import { expect, test } from '@playwright/test'
import { fillLeadForm, gotoLocale, readStoredLeads } from './helpers'

test.describe('calculator to lead', () => {
  test('a monthly figure never appears without its full price', async ({ page }) => {
    await gotoLocale(page, '/en/emi/calculator')
    await expect(page.getByTestId('emi-monthly')).toBeVisible()
    await expect(page.getByTestId('emi-total')).toBeVisible()
    await expect(page.getByTestId('emi-premium')).toBeVisible()
  })

  test('a longer tenure lowers the monthly figure', async ({ page }) => {
    await gotoLocale(page, '/en/emi/calculator')
    const monthly = page.getByTestId('emi-monthly')
    const before = Number((await monthly.innerText()).replace(/\D/g, ''))
    await page.getByLabel(/tenure/i).selectOption('24')
    await expect
      .poll(async () => Number((await monthly.innerText()).replace(/\D/g, '')))
      .toBeLessThan(before)
  })

  test('registering interest stores a lead', async ({ page }) => {
    const before = readStoredLeads().length
    await gotoLocale(page, '/en/emi/calculator')
    await fillLeadForm(page, { name: 'Asha Kulkarni', phone: '9876543210', pincode: '411001' })
    await page.getByRole('button', { name: /register my interest/i }).click()
    await expect(page.getByText(/we've got it/i)).toBeVisible()
    expect(readStoredLeads().length).toBe(before + 1)
  })
})

test.describe('referral attribution survives the funnel', () => {
  test('a ?ref= code reaches the stored lead', async ({ page }) => {
    await gotoLocale(page, '/en?ref=E2ETEST1&utm_source=playwright')
    await page.getByRole('link', { name: /book now/i }).click()
    await expect(page).toHaveURL(/emi\/calculator/)

    await fillLeadForm(page, { name: 'Referral Rider', phone: '9800000001' })
    await page.getByRole('button', { name: /register my interest/i }).click()
    await expect(page.getByText(/we've got it/i)).toBeVisible()

    const latest = readStoredLeads().at(-1)
    expect(latest?.attribution.referralCode).toBe('E2ETEST1')
    expect(latest?.attribution.source).toBe('playwright')
  })
})

test.describe('test ride booking', () => {
  test('booking a slot stores a lead carrying dealer and slot', async ({ page }) => {
    const before = readStoredLeads().length
    await gotoLocale(page, '/en/test-ride?near=411001&dealer=d-pune-01')
    // First available radio; unavailable ones are disabled.
    await page.locator('input[name="slot"]:not([disabled])').first().check({ force: true })
    // The page also renders an always-visible doorstep-demo form, so scope to this one.
    const bookingForm = page.locator('form', { has: page.locator('input[name="slotId"]') })
    await fillLeadForm(bookingForm, { name: 'Slot Booker', phone: '9811111111' })
    await bookingForm.getByRole('button', { name: /send/i }).click()
    await expect(page.getByText(/we've got it/i)).toBeVisible()

    const latest = readStoredLeads().at(-1)
    expect(readStoredLeads().length).toBe(before + 1)
    expect(latest?.lead.dealerId).toBe('d-pune-01')
    expect(latest?.lead.slotId).toBeTruthy()
  })
})

test.describe('legal gating in a production build', () => {
  test('the unapproved no-registration claim never renders as fact', async ({ page }) => {
    await gotoLocale(page, '/en')
    await expect(page.getByText(/No licence or registration is required/i)).toHaveCount(0)
    await expect(page.getByText(/low-speed specification/i).first()).toBeVisible()
  })

  test('the development-only claim banner is absent in a production build', async ({ page }) => {
    await gotoLocale(page, '/en')
    await expect(page.getByText(/awaiting legal sign-off/i)).toHaveCount(0)
  })

  test('no testimonial renders, because none is approved', async ({ page }) => {
    await gotoLocale(page, '/en')
    await expect(page.locator('blockquote')).toHaveCount(0)
  })
})

test.describe('locale', () => {
  test('the root redirects to English', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/en$/)
  })

  test('the Hindi page renders Hindi and sets lang', async ({ page }) => {
    await gotoLocale(page, '/hi')
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('इलेक्ट्रिक')
  })

  test('switching language holds the current path', async ({ page }) => {
    await gotoLocale(page, '/en/vehicles')
    await page.getByLabel('Language').click()
    await page.getByRole('link', { name: 'हिन्दी' }).click()
    await expect(page).toHaveURL(/\/hi\/vehicles$/)
  })
})

test.describe('no page scrolls horizontally at 360px', () => {
  for (const path of [
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
  ]) {
    test(`${path} fits the viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 780 })
      await gotoLocale(page, path)
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      )
      expect(overflows).toBe(false)
    })
  }
})
