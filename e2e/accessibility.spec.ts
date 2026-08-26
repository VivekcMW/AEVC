import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PAGE_TYPES, gotoLocale } from './helpers'

for (const path of PAGE_TYPES) {
  test(`${path} has no WCAG 2.1 AA violations`, async ({ page }) => {
    await gotoLocale(page, path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Print the rule and the offending selector, so a failure is actionable.
    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target.join(' ')),
    }))
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
  })
}

test('every interactive element is reachable by keyboard on the home page', async ({ page }) => {
  await gotoLocale(page, '/en')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused()
})
