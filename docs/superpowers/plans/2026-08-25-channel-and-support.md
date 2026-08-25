# Adhara Energy — Channel & Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the spec's approved ten-page scope and jobs J2 (lead generation), J4 (channel recruitment) and J5 (support, short of real ticket creation), by building the test-ride, support, partner, dealer-locator and company surfaces on top of the Plan 1 foundation.

**Architecture:** Every new page is a server component reading through `src/lib/data/` repositories, exactly as Plan 1 established — no page touches `src/content/` and the boundary test enforces it. Every form posts through the existing `submitLead` adapter, so attribution, validation and rate limiting are inherited rather than re-implemented. FAQ search is a local index with no external service, sitting behind an interface Plan 5 can swap for Algolia without touching the page.

**Tech Stack:** Next.js 16.3.2 (App Router) · React 19.2.8 · TypeScript 5.9.3 strict · Tailwind CSS 4.3.3 · next-intl 4.13.7 · zod 4.4.3 · Vitest 4.1.11 · Playwright · axe-core · pnpm 10.33.0

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec and Plan 1.

- **Palette, exact hexes:** Forest `#0E3B2E` · Turmeric `#E8A020` · Ink `#14201B` · Mist `#F4F6F1` · Charge Full `#2F9E6B` · Charge Low `#E8A020` · Charge Out `#C6453C`
- **One primary CTA per page.** The dev-time guard warns on a second mounted `variant="primary"`. `ChargeState` chips are not CTAs and are outside the count.
- **A monthly EMI figure never appears without the full price in the same view**, with `PriceDual` as the canonical renderer of the pair.
- **Pages never import from `src/content/` or `src/messages/` directly** — only via `src/lib/data/`, `src/lib/legal/` and the i18n hook. `src/lib/data/boundary.test.ts` fails the build otherwise.
- **Zero hardcoded user-facing strings.** All copy comes from `src/messages/*.json`. Hindi is required for every new page in this plan.
- **Devanagari is never letterspaced** — the `:lang(hi)` rule in `globals.css` already enforces this; do not add tracking utilities that fight it.
- **No unapproved legal claim or fabricated testimonial renders as fact.** Warranty wording renders through `lib/legal`.
- **Mobile-first: design at 360px and expand up.** Wide content scrolls inside its own `overflow-x: auto` container; the page body never scrolls horizontally.
- **WCAG 2.1 AA minimum.** Contrast, keyboard navigation, form labels, alt text.
- **Performance budget:** LCP under 2.5s on 4G, model pages under 1.5MB.
- **Design language:** display type via the `.display` class at clamp scale in medium weight, `.figure` for large numerals, pill buttons, hairline rules over card grids, full-bleed Forest bands for emphasis.
- **All placeholder commercial data carries an explicit `PLACEHOLDER` flag** and lives in `src/content/`.

## File Structure

| Path | Responsibility |
|---|---|
| `playwright.config.ts` | Browser test config, dev-server lifecycle |
| `e2e/journeys.spec.ts` | The two revenue journeys, end to end |
| `e2e/accessibility.spec.ts` | axe sweep across every page type |
| `e2e/helpers.ts` | Shared page-object helpers |
| `lighthouserc.json` | Performance budget |
| `src/content/slots.ts` | PLACEHOLDER test-ride slot availability |
| `src/content/territories.ts` | PLACEHOLDER dealer territory availability |
| `src/lib/data/dealers.ts` | Extended: `findDealersNear`, `getDealerById` |
| `src/lib/data/slots.ts` | Slot availability repository |
| `src/lib/data/territories.ts` | Territory repository |
| `src/lib/support/search.ts` | Local FAQ index — the interface Plan 5 swaps |
| `src/lib/leads/schema.ts` | Extended: new kinds and optional per-kind fields |
| `src/components/blocks/DealerList.tsx` | Region-grouped dealer list |
| `src/components/blocks/IndiaMap.tsx` | Schematic state map with dealer pins |
| `src/components/blocks/SlotPicker.tsx` | Date and time selection |
| `src/components/blocks/LeadForm.tsx` | Shared attributed form — replaces `EmiInterestForm` |
| `src/components/blocks/FaqSearch.tsx` | Search input plus results |
| `src/app/[locale]/dealers/page.tsx` | Find a Dealer |
| `src/app/[locale]/test-ride/page.tsx` | Test Ride / Doorstep Demo |
| `src/app/[locale]/support/page.tsx` | Support hub with FAQ search |
| `src/app/[locale]/support/raise-an-issue/page.tsx` | Issue form |
| `src/app/[locale]/support/warranty/page.tsx` | Warranty policy |
| `src/app/[locale]/contact/page.tsx` | Contact |
| `src/app/[locale]/partner/dealer/page.tsx` | Become a Dealer |
| `src/app/[locale]/partner/promoter/page.tsx` | Become a Promoter |
| `src/app/[locale]/about/page.tsx` | About / Factory Story |
| `src/lib/data/company.ts` | Milestones and factory stats |
| `src/app/sitemap.ts` · `src/app/robots.ts` | Crawl surface |

---

### Task 1: Browser test harness

Deferred from Plan 1 deliberately: the harness lands before there is more surface to regress.

**Files:**
- Create: `playwright.config.ts`, `e2e/helpers.ts`, `e2e/journeys.spec.ts`, `e2e/accessibility.spec.ts`, `lighthouserc.json`
- Modify: `package.json` (scripts), `.gitignore`

**Interfaces:**
- Consumes: the five routes shipped in Plan 1
- Produces: `pnpm e2e`, `pnpm e2e:a11y`, `pnpm lighthouse`; helpers `gotoLocale(page, path, locale?)`, `fillLeadForm(page, {name, phone, pincode})`, `readStoredLeads()`

- [ ] **Step 1: Install Playwright and axe**

```bash
pnpm add -D @playwright/test @axe-core/playwright
pnpm exec playwright install chromium
```

- [ ] **Step 2: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // the lead sink is a single append-only file
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start --port 3100',
    url: 'http://localhost:3100/en',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
```

Add to `package.json` scripts:

```json
"e2e": "playwright test",
"e2e:a11y": "playwright test accessibility",
"lighthouse": "lhci autorun"
```

Add `test-results/`, `playwright-report/` and `.lighthouseci/` to `.gitignore`.

- [ ] **Step 3: Write the shared helpers**

Create `e2e/helpers.ts`:

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Page } from '@playwright/test'

export const PAGE_TYPES = [
  '/en',
  '/en/vehicles',
  '/en/vehicles/adhara-neev',
  '/en/emi',
  '/en/emi/calculator',
] as const

export async function gotoLocale(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
}

export async function fillLeadForm(
  page: Page,
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
```

- [ ] **Step 4: Write the failing journey tests**

Create `e2e/journeys.spec.ts`:

```ts
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
    await page.getByRole('link', { name: 'हिन्दी' }).click()
    await expect(page).toHaveURL(/\/hi\/vehicles$/)
  })
})

test.describe('no page scrolls horizontally at 360px', () => {
  for (const path of ['/en', '/en/vehicles', '/en/vehicles/adhara-neev', '/en/emi', '/en/emi/calculator']) {
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
```

- [ ] **Step 5: Write the failing accessibility sweep**

Create `e2e/accessibility.spec.ts`:

```ts
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
```

- [ ] **Step 6: Run and confirm the harness executes**

Run: `pnpm e2e`
Expected: the suite runs against a production build. Fix any genuine failure it surfaces —
that is the harness doing its job. Two failures are expected and informative if the
production build differs from dev: the claim-banner test and the axe sweep. Treat an axe
violation as a defect in the page, not in the test.

- [ ] **Step 7: Add the Lighthouse budget**

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start --port 3100",
      "url": [
        "http://localhost:3100/en",
        "http://localhost:3100/en/vehicles/adhara-neev"
      ],
      "numberOfRuns": 2,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-byte-weight": ["error", { "maxNumericValue": 1572864 }]
      }
    }
  }
}
```

```bash
pnpm add -D @lhci/cli
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "test: browser harness with journey, accessibility and performance budgets"
```

---

### Task 2: Dealer locator

**Files:**
- Modify: `src/lib/data/dealers.ts`, `src/content/dealers.ts` (add lat/lng and a wider spread)
- Create: `src/components/blocks/DealerList.tsx`, `src/components/blocks/IndiaMap.tsx`, `src/app/[locale]/dealers/page.tsx`
- Test: `src/lib/data/dealers.test.ts`, `src/components/blocks/DealerList.test.tsx`

**Interfaces:**
- Consumes: `Dealer` from `src/lib/data/types`, `getDealers()`
- Produces:
  - `findDealersNear(pincode: string, limit?: number): Promise<Dealer[]>` — pincode-prefix matches first, then same state, then the rest; never throws on a malformed pincode
  - `getDealerById(id: string): Promise<Dealer | null>`
  - `groupByState(dealers: Dealer[]): { state: string; dealers: Dealer[] }[]` — states alphabetical
  - `<DealerList dealers={Dealer[]} />` · `<IndiaMap dealers={Dealer[]} activeState?={string} />`

- [ ] **Step 1: Extend the placeholder dealer data**

In `src/content/dealers.ts`, add `lat` and `lng` to every dealer and widen coverage to five
states so the map has something to show. Add the two fields to `Dealer` in
`src/lib/data/types.ts` first:

```ts
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
```

Then update the array, keeping the existing six and adding four:

```ts
export const dealers: Dealer[] = [
  { id: 'd-pune-01', name: 'Adhara Pune Central', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '1800 000 0001', offersTestRide: true, lat: 18.5204, lng: 73.8567 },
  { id: 'd-pune-02', name: 'Adhara Hadapsar', city: 'Pune', state: 'Maharashtra', pincode: '411028', phone: '1800 000 0002', offersTestRide: true, lat: 18.5089, lng: 73.926 },
  { id: 'd-nashik-01', name: 'Adhara Nashik Road', city: 'Nashik', state: 'Maharashtra', pincode: '422101', phone: '1800 000 0003', offersTestRide: true, lat: 19.9975, lng: 73.7898 },
  { id: 'd-indore-01', name: 'Adhara Indore Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010', phone: '1800 000 0004', offersTestRide: true, lat: 22.7196, lng: 75.8577 },
  { id: 'd-bhopal-01', name: 'Adhara Bhopal Arera', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016', phone: '1800 000 0005', offersTestRide: false, lat: 23.2599, lng: 77.4126 },
  { id: 'd-surat-01', name: 'Adhara Surat Adajan', city: 'Surat', state: 'Gujarat', pincode: '395009', phone: '1800 000 0006', offersTestRide: true, lat: 21.1702, lng: 72.8311 },
  { id: 'd-ahmedabad-01', name: 'Adhara Ahmedabad Satellite', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', phone: '1800 000 0007', offersTestRide: true, lat: 23.0225, lng: 72.5714 },
  { id: 'd-jaipur-01', name: 'Adhara Jaipur Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', pincode: '302017', phone: '1800 000 0008', offersTestRide: true, lat: 26.9124, lng: 75.7873 },
  { id: 'd-lucknow-01', name: 'Adhara Lucknow Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010', phone: '1800 000 0009', offersTestRide: true, lat: 26.8467, lng: 80.9462 },
  { id: 'd-kanpur-01', name: 'Adhara Kanpur Swaroop Nagar', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208002', phone: '1800 000 0010', offersTestRide: false, lat: 26.4499, lng: 80.3319 },
]
```

- [ ] **Step 2: Write the failing repository tests**

Append to `src/lib/data/dealers.test.ts` (create the file if absent):

```ts
import { describe, expect, it } from 'vitest'
import { findDealersNear, getDealerById, getDealers, groupByState } from './dealers'

describe('findDealersNear', () => {
  it('puts same-pincode-prefix dealers first', async () => {
    const found = await findDealersNear('411028')
    expect(found[0].pincode.slice(0, 3)).toBe('411')
  })

  it('falls back to the same state before other states', async () => {
    // 422 is Nashik; no dealer shares the 999 prefix, so state matching must carry it.
    const found = await findDealersNear('422999')
    expect(found[0].state).toBe('Maharashtra')
  })

  it('still returns dealers for an unserved pincode rather than an empty list', async () => {
    const found = await findDealersNear('999999')
    expect(found.length).toBeGreaterThan(0)
  })

  it('returns every dealer, unordered, for a malformed pincode instead of throwing', async () => {
    const found = await findDealersNear('nonsense')
    expect(found.length).toBe((await getDealers()).length)
  })

  it('respects the limit', async () => {
    expect(await findDealersNear('411001', 2)).toHaveLength(2)
  })
})

describe('getDealerById', () => {
  it('finds a dealer', async () => {
    expect((await getDealerById('d-pune-01'))?.city).toBe('Pune')
  })

  it('returns null for an unknown id', async () => {
    expect(await getDealerById('nope')).toBeNull()
  })
})

describe('groupByState', () => {
  it('groups dealers under their state, alphabetically', async () => {
    const groups = groupByState(await getDealers())
    expect(groups.map((g) => g.state)).toEqual([...groups.map((g) => g.state)].sort())
  })

  it('keeps every dealer', async () => {
    const all = await getDealers()
    const grouped = groupByState(all).flatMap((g) => g.dealers)
    expect(grouped).toHaveLength(all.length)
  })
})
```

- [ ] **Step 3: Run and confirm failure**

Run: `pnpm test src/lib/data/dealers.test.ts`
Expected: FAIL — `findDealersNear` is not exported

- [ ] **Step 4: Implement the repository additions**

Replace `src/lib/data/dealers.ts`:

```ts
import { dealers } from '@/content/dealers'
import type { Dealer } from './types'

export async function getDealers(): Promise<Dealer[]> {
  return dealers
}

export async function getTestRideDealers(): Promise<Dealer[]> {
  return dealers.filter((d) => d.offersTestRide)
}

export async function getDealerById(id: string): Promise<Dealer | null> {
  return dealers.find((d) => d.id === id) ?? null
}

/**
 * Nearest-first without a geocoding service, in four bands: exact three-digit pincode
 * prefix, then the two-digit PIN zone, then any dealer in a state that zone touches, then
 * everyone else.
 *
 * The two-digit zone band is load-bearing. Deriving the state from prefix matches alone
 * fails whenever there is no prefix match at all: the state set comes back empty, the
 * fallback collapses to raw array order, and the "nearest" dealer is whichever happens to
 * be first in the file. Indian PIN codes encode the zone in the first two digits, so that
 * is the band to fall back through.
 *
 * A malformed pincode returns everything rather than nothing — an unhelpful list beats an
 * empty one when someone is trying to find a shop.
 */
export async function findDealersNear(pincode: string, limit?: number): Promise<Dealer[]> {
  const valid = /^[1-9][0-9]{5}$/.test(pincode)
  if (!valid) return limit ? dealers.slice(0, limit) : dealers

  const prefix = pincode.slice(0, 3)
  const zone = pincode.slice(0, 2)

  const inPrefix = dealers.filter((d) => d.pincode.slice(0, 3) === prefix)
  const inZone = dealers.filter((d) => !inPrefix.includes(d) && d.pincode.slice(0, 2) === zone)
  const zoneStates = new Set([...inPrefix, ...inZone].map((d) => d.state))
  const inState = dealers.filter(
    (d) => !inPrefix.includes(d) && !inZone.includes(d) && zoneStates.has(d.state),
  )
  const rest = dealers.filter(
    (d) => !inPrefix.includes(d) && !inZone.includes(d) && !inState.includes(d),
  )

  const ordered = [...inPrefix, ...inZone, ...inState, ...rest]
  return limit ? ordered.slice(0, limit) : ordered
}

export function groupByState(list: Dealer[]): { state: string; dealers: Dealer[] }[] {
  const byState = new Map<string, Dealer[]>()
  for (const dealer of list) {
    byState.set(dealer.state, [...(byState.get(dealer.state) ?? []), dealer])
  }
  return [...byState.entries()]
    .map(([state, group]) => ({ state, dealers: group }))
    .sort((a, b) => a.state.localeCompare(b.state))
}
```

- [ ] **Step 5: Confirm green**

Run: `pnpm test src/lib/data/dealers.test.ts`
Expected: PASS — 9 tests

Check the `422999` case specifically: it must match Nashik because `42` is Nashik's PIN zone,
not because Maharashtra happens to sit first in the dealer array. Reorder `src/content/dealers.ts`
so a Gujarat dealer is first, re-run, and confirm the test still passes. If it fails, the zone
band is not working and the assertion was passing by accident.

- [ ] **Step 6: Write the failing list-component test**

Create `src/components/blocks/DealerList.test.tsx`:

```tsx
import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getDealers } from '@/lib/data/dealers'
import { renderIntl } from '@/test/render'
import { DealerList } from './DealerList'

const dealers = await getDealers()

afterEach(cleanup)

describe('DealerList', () => {
  it('groups dealers under a state heading', () => {
    renderIntl(<DealerList dealers={dealers} />)
    expect(screen.getByRole('heading', { name: 'Maharashtra' })).toBeDefined()
  })

  it('makes every phone number callable', () => {
    renderIntl(<DealerList dealers={dealers.slice(0, 1)} />)
    const link = screen.getByRole('link', { name: /1800 000 0001/ })
    expect(link.getAttribute('href')).toBe('tel:18000000001')
  })

  it('marks which branches offer a test ride', () => {
    renderIntl(<DealerList dealers={dealers} />)
    expect(screen.getAllByText(/test ride/i).length).toBeGreaterThan(0)
  })

  it('renders an empty state rather than a bare list', () => {
    renderIntl(<DealerList dealers={[]} />)
    expect(screen.getByText(/no dealers/i)).toBeDefined()
  })
})
```

- [ ] **Step 7: Run, confirm failure, implement**

Run → FAIL. Add these keys to `src/messages/en.json` and `src/messages/hi.json` under a new
`dealers` namespace:

```json
"dealers": {
  "title": "Find a dealer",
  "intro": "Every branch below is on the live dealer network. Call ahead to confirm stock.",
  "searchLabel": "Your pincode or city",
  "search": "Search",
  "nearest": "Nearest to you",
  "all": "All branches",
  "offersTestRide": "Test ride available",
  "call": "Call",
  "empty": "No dealers match that search yet. Try a nearby city, or leave your number and we'll tell you when we reach you.",
  "count": "{count, plural, =0 {No branches} one {1 branch} other {# branches}}",
  "mapCaption": "Schematic map. Positions are indicative, not to scale."
}
```

Hindi equivalents:

```json
"dealers": {
  "title": "डीलर खोजें",
  "intro": "नीचे दी गई हर शाखा सक्रिय डीलर नेटवर्क पर है। स्टॉक की पुष्टि के लिए पहले कॉल करें।",
  "searchLabel": "आपका पिनकोड या शहर",
  "search": "खोजें",
  "nearest": "आपके सबसे नज़दीक",
  "all": "सभी शाखाएँ",
  "offersTestRide": "टेस्ट राइड उपलब्ध",
  "call": "कॉल करें",
  "empty": "इस खोज से कोई डीलर नहीं मिला। नज़दीकी शहर आज़माएँ, या अपना नंबर छोड़ें।",
  "count": "{count, plural, =0 {कोई शाखा नहीं} one {1 शाखा} other {# शाखाएँ}}",
  "mapCaption": "योजनाबद्ध नक्शा। स्थान संकेतात्मक हैं, पैमाने पर नहीं।"
}
```

Create `src/components/blocks/DealerList.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { ChargeState } from '@/components/ui/ChargeState'
import { groupByState } from '@/lib/data/dealers'
import type { Dealer } from '@/lib/data/types'

export function DealerList({ dealers }: { dealers: Dealer[] }) {
  const t = useTranslations('dealers')

  if (dealers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-forest/25 bg-surface p-8 text-center text-ink/70">
        {t('empty')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-12">
      {groupByState(dealers).map((group) => (
        <section key={group.state}>
          <h2 className="font-heading text-xs font-semibold tracking-[0.2em] text-ink/50 uppercase">
            {group.state}
          </h2>
          <ul className="mt-4 divide-y divide-forest/12 border-t border-forest/15">
            {group.dealers.map((dealer) => (
              <li key={dealer.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-5">
                <div className="min-w-[14rem] flex-1">
                  <h3 className="text-lg font-medium text-ink">{dealer.name}</h3>
                  <p className="tnum mt-0.5 text-sm text-ink/60">
                    {dealer.city} · {dealer.pincode}
                  </p>
                </div>
                {dealer.offersTestRide && (
                  <ChargeState status="full" label={t('offersTestRide')} />
                )}
                <a
                  href={`tel:${dealer.phone.replace(/\s/g, '')}`}
                  className="tnum rounded-pill border border-forest/25 px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  {dealer.phone}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
```

Run → PASS.

- [ ] **Step 8: Build the schematic map**

Create `src/components/blocks/IndiaMap.tsx`. There is no map provider and no API key; this is
an honest schematic that plots dealers on a normalised lat/lng grid inside a stylised outline.

```tsx
import { useTranslations } from 'next-intl'
import type { Dealer } from '@/lib/data/types'

// Bounding box for mainland India, used to normalise coordinates into the viewBox.
const BOUNDS = { minLat: 8, maxLat: 35, minLng: 68, maxLng: 89 }

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100
  return { x, y }
}

export function IndiaMap({ dealers }: { dealers: Dealer[] }) {
  const t = useTranslations('dealers')

  return (
    <figure className="rounded-2xl bg-forest/[0.045] p-6">
      <svg viewBox="0 0 100 100" role="img" aria-label={t('mapCaption')} className="w-full">
        {/* Grid, matching the blueprint language used on Forest sections. */}
        <g stroke="var(--adhara-color-forest)" strokeOpacity="0.09" strokeWidth="0.2">
          {[20, 40, 60, 80].map((n) => (
            <g key={n}>
              <line x1={n} y1="0" x2={n} y2="100" />
              <line x1="0" y1={n} x2="100" y2={n} />
            </g>
          ))}
        </g>
        {dealers.map((dealer) => {
          const { x, y } = project(dealer.lat, dealer.lng)
          return (
            <g key={dealer.id}>
              <circle cx={x} cy={y} r="2.4" fill="var(--adhara-color-turmeric)" fillOpacity="0.25" />
              <circle cx={x} cy={y} r="0.9" fill="var(--adhara-color-forest)" />
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-4 text-xs text-ink/55">{t('mapCaption')}</figcaption>
    </figure>
  )
}
```

- [ ] **Step 9: Build the page**

Create `src/app/[locale]/dealers/page.tsx` — a server component reading `?near=` from
`searchParams`, calling `findDealersNear` when present and `getDealers` otherwise. Search is a
GET form (a plain `<form method="get">`) so it works without JavaScript and every result is a
shareable URL, matching the filter pattern from Plan 1. Layout: page heading with the
`.display` class, the search form, `<IndiaMap>` beside `<DealerList>` on `lg`, stacked below.
Include the result count from `dealers.count`.

- [ ] **Step 10: Verify and commit**

```bash
pnpm test && pnpm build
```

Then load `/en/dealers` and `/en/dealers?near=411001` at 360px and 1280px; confirm nearest-first
ordering changes and no horizontal scroll.

```bash
git add -A
git commit -m "feat: dealer locator with nearest-first ordering and schematic map"
```

---

### Task 3: Test Ride and Doorstep Demo

**Files:**
- Create: `src/content/slots.ts`, `src/lib/data/slots.ts`, `src/components/blocks/SlotPicker.tsx`, `src/components/blocks/LeadForm.tsx`, `src/app/[locale]/test-ride/page.tsx`
- Modify: `src/lib/leads/schema.ts`, `src/components/blocks/EmiInterestForm.tsx` (replaced by `LeadForm`)
- Test: `src/lib/data/slots.test.ts`, `src/components/blocks/LeadForm.test.tsx`

**Interfaces:**
- Consumes: `findDealersNear`, `submitLeadAction`, `Field`, `ChargeState`
- Produces:
  - `type Slot = { id: string; dealerId: string; date: string; time: string; available: boolean }`
  - `getSlots(dealerId: string): Promise<Slot[]>` · `getSlotById(id: string): Promise<Slot | null>`
  - `<LeadForm kind={LeadKind} fields={FieldName[]} hidden?={Record<string,string>} namespace={string} />`
  - `FieldName = 'name' | 'phone' | 'pincode' | 'city' | 'message' | 'reference'`
  - Extended `leadSchema` with optional `city`, `dealerId`, `slotId`, `reference`
  - Extended `leadKinds` with `'doorstep-demo'`, `'issue'`, `'fleet'`

- [ ] **Step 1: Write the failing schema tests first**

Append to `src/lib/leads/submit.test.ts` — these must fail before the schema changes, because
`test-ride` currently accepts no `slotId` and `issue` is not a valid kind at all:

```ts
describe('extended lead kinds', () => {
  it('accepts a test-ride booking carrying a dealer and a slot', async () => {
    const result = await submitLead(
      { kind: 'test-ride', name: 'Ravi Menon', phone: '9812345670', dealerId: 'd-pune-01', slotId: 's1' },
      attribution,
      '4.4.4.4',
    )
    expect(result.ok).toBe(true)
    expect(readAll().at(-1)?.lead.slotId).toBe('s1')
  })

  it('accepts a support issue carrying a reference', async () => {
    const result = await submitLead(
      { kind: 'issue', name: 'Meera Rao', phone: '9812345671', reference: 'ADH-12345', message: 'Battery not charging' },
      attribution,
      '5.5.5.5',
    )
    expect(result.ok).toBe(true)
    expect(readAll().at(-1)?.lead.reference).toBe('ADH-12345')
  })

  it('rejects a kind the platform does not recognise', async () => {
    const result = await submitLead(
      { kind: 'not-a-kind', name: 'X Y', phone: '9812345672' },
      attribution,
      '6.6.6.6',
    )
    expect(result.ok).toBe(false)
  })

  it('truncates nothing silently — an over-long message is rejected, not trimmed', async () => {
    const result = await submitLead(
      { kind: 'enquiry', name: 'A B', phone: '9812345673', message: 'x'.repeat(1001) },
      attribution,
      '7.7.7.7',
    )
    expect(result.ok).toBe(false)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/lib/leads`
Expected: FAIL — the `issue` kind is rejected and `slotId` is stripped by the schema.

- [ ] **Step 3: Extend the lead schema**

Replace `src/lib/leads/schema.ts`:

```ts
import { z } from 'zod'

export const leadKinds = [
  'test-ride',
  'doorstep-demo',
  'enquiry',
  'emi-interest',
  'dealer',
  'promoter',
  'issue',
  'fleet',
] as const

export type LeadKind = (typeof leadKinds)[number]

/**
 * One schema with optional per-kind fields rather than a discriminated union. When the
 * platform publishes per-kind lead payloads this should become a union keyed on `kind` —
 * until then a union would be inventing a contract nobody has agreed.
 */
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
  city: z.string().trim().max(80).optional(),
  modelSlug: z.string().trim().max(64).optional(),
  dealerId: z.string().trim().max(64).optional(),
  slotId: z.string().trim().max(64).optional(),
  /** Order id, booking id or vehicle serial, for support issues. */
  reference: z.string().trim().max(64).optional(),
  message: z.string().trim().max(1000).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
```

- [ ] **Step 4: Confirm green**

Run: `pnpm test src/lib/leads`
Expected: PASS — 24 tests. If `not-a-kind` is accepted, `z.enum` is not being applied; fix
before continuing.

- [ ] **Step 6: Author placeholder slots**

Create `src/content/slots.ts`:

```ts
import type { Slot } from '@/lib/data/slots'
import { dealers } from './dealers'

export const PLACEHOLDER = true

/**
 * Fixed relative offsets rather than real dates: a slot list generated from the current
 * date would make every test non-deterministic. The platform's booking API replaces this.
 */
const DAYS = ['Tomorrow', 'In 2 days', 'In 3 days'] as const
const TIMES = ['10:00', '12:30', '16:00', '18:30'] as const

export const slots: Slot[] = dealers
  .filter((d) => d.offersTestRide)
  .flatMap((dealer) =>
    DAYS.flatMap((date, di) =>
      TIMES.map((time, ti) => ({
        id: `${dealer.id}-${di}-${ti}`,
        dealerId: dealer.id,
        date,
        time,
        // A deterministic gap so the UI has genuinely unavailable slots to render.
        available: (di + ti) % 5 !== 0,
      })),
    ),
  )
```

Create `src/lib/data/slots.ts`:

```ts
import { slots } from '@/content/slots'

export type Slot = {
  id: string
  dealerId: string
  date: string
  time: string
  available: boolean
}

export async function getSlots(dealerId: string): Promise<Slot[]> {
  return slots.filter((s) => s.dealerId === dealerId)
}

export async function getSlotById(id: string): Promise<Slot | null> {
  return slots.find((s) => s.id === id) ?? null
}
```

- [ ] **Step 6: Write the failing slot tests**

Create `src/lib/data/slots.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getSlotById, getSlots } from './slots'

describe('getSlots', () => {
  it('returns slots for a test-ride dealer', async () => {
    expect((await getSlots('d-pune-01')).length).toBeGreaterThan(0)
  })

  it('returns nothing for a dealer that does not offer test rides', async () => {
    expect(await getSlots('d-bhopal-01')).toEqual([])
  })

  it('returns an empty list for an unknown dealer rather than throwing', async () => {
    expect(await getSlots('nope')).toEqual([])
  })

  it('includes both available and unavailable slots, so the UI has to handle both', async () => {
    const list = await getSlots('d-pune-01')
    expect(list.some((s) => s.available)).toBe(true)
    expect(list.some((s) => !s.available)).toBe(true)
  })
})

describe('getSlotById', () => {
  it('finds a slot', async () => {
    const first = (await getSlots('d-pune-01'))[0]
    expect((await getSlotById(first.id))?.dealerId).toBe('d-pune-01')
  })

  it('returns null for an unknown id', async () => {
    expect(await getSlotById('nope')).toBeNull()
  })
})
```

Run: `pnpm test src/lib/data/slots.test.ts` → PASS (6 tests).

- [ ] **Step 7: Write the failing shared-form test**

`LeadForm` generalises `EmiInterestForm` so five pages do not each reimplement validation
display, success state and the phone fallback.

Create `src/components/blocks/LeadForm.test.tsx`:

```tsx
import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderIntl } from '@/test/render'
import { LeadForm } from './LeadForm'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('LeadForm', () => {
  it('renders only the fields it was asked for', () => {
    renderIntl(<LeadForm kind="test-ride" fields={['name', 'phone']} namespace="testRide.form" />)
    expect(screen.getByLabelText(/your name/i)).toBeDefined()
    expect(screen.getByLabelText(/mobile number/i)).toBeDefined()
    expect(screen.queryByLabelText(/^pincode$/i)).toBeNull()
  })

  it('carries the lead kind in a hidden input', () => {
    const { container } = renderIntl(
      <LeadForm kind="promoter" fields={['name', 'phone']} namespace="partner.promoter.form" />,
    )
    expect(container.querySelector('input[name="kind"]')).toHaveProperty('value', 'promoter')
  })

  it('passes hidden context through, so a booking keeps its dealer and slot', () => {
    const { container } = renderIntl(
      <LeadForm
        kind="test-ride"
        fields={['name', 'phone']}
        hidden={{ dealerId: 'd-pune-01', slotId: 's1' }}
        namespace="testRide.form"
      />,
    )
    expect(container.querySelector('input[name="dealerId"]')).toHaveProperty('value', 'd-pune-01')
    expect(container.querySelector('input[name="slotId"]')).toHaveProperty('value', 's1')
  })

  it('marks name and phone required, because a lead without them is not a lead', () => {
    renderIntl(<LeadForm kind="enquiry" fields={['name', 'phone']} namespace="contact.form" />)
    expect(screen.getByLabelText(/your name/i)).toHaveProperty('required', true)
    expect(screen.getByLabelText(/mobile number/i)).toHaveProperty('required', true)
  })

  it('keeps the phone field numeric-only on mobile keyboards', () => {
    renderIntl(<LeadForm kind="enquiry" fields={['name', 'phone']} namespace="contact.form" />)
    expect(screen.getByLabelText(/mobile number/i).getAttribute('inputMode')).toBe('numeric')
  })

  it('strips non-digits typed into the phone field', async () => {
    renderIntl(<LeadForm kind="enquiry" fields={['name', 'phone']} namespace="contact.form" />)
    const phone = screen.getByLabelText(/mobile number/i)
    await userEvent.type(phone, '98-76 54 3210')
    expect((phone as HTMLInputElement).value).toBe('9876543210')
  })
})
```

- [ ] **Step 8: Run, confirm failure, implement**

Run → FAIL. Add a shared form vocabulary to both catalogs under `common.form`:

```json
"form": {
  "name": "Your name",
  "phone": "Mobile number",
  "phoneHint": "Ten digits, no country code.",
  "pincode": "Pincode",
  "city": "City",
  "message": "How can we help?",
  "reference": "Order or booking ID",
  "referenceHint": "Optional. Helps us find your vehicle faster.",
  "submit": "Send",
  "submitting": "Sending",
  "successTitle": "We've got it.",
  "successBody": "Your reference is {id}. We'll call you on the number you gave us.",
  "fallback": "If this keeps failing, call us on 1800 000 0000."
}
```

Hindi:

```json
"form": {
  "name": "आपका नाम",
  "phone": "मोबाइल नंबर",
  "phoneHint": "दस अंक, देश कोड के बिना।",
  "pincode": "पिनकोड",
  "city": "शहर",
  "message": "हम कैसे मदद कर सकते हैं?",
  "reference": "ऑर्डर या बुकिंग आईडी",
  "referenceHint": "वैकल्पिक। इससे आपका वाहन जल्दी मिल जाता है।",
  "submit": "भेजें",
  "submitting": "भेज रहे हैं",
  "successTitle": "हमें मिल गया।",
  "successBody": "आपका संदर्भ {id} है। आपने जो नंबर दिया है, उस पर हम कॉल करेंगे।",
  "fallback": "अगर बार-बार असफल हो, तो हमें 1800 000 0000 पर कॉल करें।"
}
```

Create `src/components/blocks/LeadForm.tsx`:

```tsx
'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChargeState } from '@/components/ui/ChargeState'
import { Field } from '@/components/ui/Field'
import { submitLeadAction } from '@/app/actions/submit-lead'
import type { LeadKind } from '@/lib/leads/schema'
import type { SubmitResult } from '@/lib/leads'

export type FieldName = 'name' | 'phone' | 'pincode' | 'city' | 'message' | 'reference'

const inputClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35'

export function LeadForm({
  kind,
  fields,
  hidden = {},
  namespace,
  submitLabel,
}: {
  kind: LeadKind
  fields: FieldName[]
  hidden?: Record<string, string>
  /** Namespace holding this form's own title and body copy. */
  namespace: string
  submitLabel?: string
}) {
  const t = useTranslations('common.form')
  const tp = useTranslations(namespace)
  const [phone, setPhone] = useState('')
  const [result, action, pending] = useActionState<SubmitResult | null, FormData>(
    submitLeadAction,
    null,
  )

  if (result?.ok) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border-l-4 border-charge-full bg-surface p-6">
        <ChargeState status="full" label={t('successTitle')} />
        <p className="tnum text-ink/80">{t('successBody', { id: result.id })}</p>
      </div>
    )
  }

  const error = result && !result.ok ? result.error : undefined

  return (
    <form action={action} className="flex flex-col gap-6 rounded-xl border border-forest/12 bg-surface p-6 sm:p-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">
          {tp('title')}
        </h2>
        <p className="mt-2 text-ink/65">{tp('body')}</p>
      </div>

      <input type="hidden" name="kind" value={kind} />
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.includes('name') && (
          <Field id="lead-name" label={t('name')}>
            <input id="lead-name" name="name" autoComplete="name" required className={inputClass} />
          </Field>
        )}
        {fields.includes('phone') && (
          <Field id="lead-phone" label={t('phone')} hint={t('phoneHint')}>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              className={`tnum ${inputClass}`}
            />
          </Field>
        )}
        {fields.includes('pincode') && (
          <Field id="lead-pincode" label={t('pincode')}>
            <input
              id="lead-pincode"
              name="pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="411001"
              className={`tnum ${inputClass}`}
            />
          </Field>
        )}
        {fields.includes('city') && (
          <Field id="lead-city" label={t('city')}>
            <input id="lead-city" name="city" autoComplete="address-level2" className={inputClass} />
          </Field>
        )}
        {fields.includes('reference') && (
          <Field id="lead-reference" label={t('reference')} hint={t('referenceHint')}>
            <input id="lead-reference" name="reference" className={inputClass} />
          </Field>
        )}
      </div>

      {fields.includes('message') && (
        <Field id="lead-message" label={t('message')}>
          <textarea id="lead-message" name="message" rows={4} maxLength={1000} className={inputClass} />
        </Field>
      )}

      {error && (
        <div className="flex flex-col gap-2">
          <ChargeState status="out" label={error} />
          <p className="text-sm text-ink/70">{t('fallback')}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-pill bg-forest px-7 py-3.5 font-medium text-white transition-colors hover:bg-forest-hover disabled:opacity-55"
      >
        {pending ? t('submitting') : (submitLabel ?? t('submit'))}
      </button>
    </form>
  )
}
```

Run → PASS (6 tests).

- [ ] **Step 9: Replace `EmiInterestForm` with `LeadForm`**

In `src/app/[locale]/emi/calculator/page.tsx`, swap the component:

```tsx
<LeadForm
  kind="emi-interest"
  fields={['name', 'phone', 'pincode']}
  hidden={initialSlug ? { modelSlug: initialSlug } : {}}
  namespace="emi.interest"
/>
```

Delete `src/components/blocks/EmiInterestForm.tsx`. The `emi.interest` namespace already has
`title` and `body`, so no new copy is needed. Run `pnpm test` — the calculator tests must
still pass.

- [ ] **Step 10: Build the slot picker**

Create `src/components/blocks/SlotPicker.tsx` — a client component receiving `slots: Slot[]`,
rendering a radio group grouped by `date`, with unavailable slots rendered as `disabled`
inputs rather than hidden (a visibly full slot tells the customer more than a missing one).
The selected slot id posts as `slotId`. Radios, not buttons, so keyboard and screen-reader
behaviour comes free.

- [ ] **Step 11: Build the page**

Create `src/app/[locale]/test-ride/page.tsx`. Reads `?near=` and `?dealer=` from
`searchParams`:

- No `near`: pincode GET form plus the explainer
- `near` set: `findDealersNear(near, 4)` rendered as choices linking to `?near=…&dealer=id`
- `dealer` set: `getSlots(dealer)` in a `<SlotPicker>`, then `<LeadForm kind="test-ride" fields={['name','phone']} hidden={{dealerId, slotId}} namespace="testRide.form" />`
- Doorstep demo alternative always visible, posting `kind="doorstep-demo"` with `fields={['name','phone','pincode']}`

Add the `testRide` namespace to both catalogs with `title`, `intro`, `chooseDealer`,
`chooseSlot`, `doorstepTitle`, `doorstepBody`, `form.title`, `form.body`,
`doorstepForm.title`, `doorstepForm.body`.

- [ ] **Step 12: Verify and commit**

```bash
pnpm test && pnpm build
```

Then walk `/en/test-ride` → pincode → dealer → slot → submit, and confirm `.data/leads.jsonl`
gains a record whose `lead.slotId` and `lead.dealerId` are both set.

```bash
git add -A
git commit -m "feat: test ride and doorstep demo booking with shared lead form"
```

---

### Task 4: Support hub with FAQ search

**Files:**
- Create: `src/lib/support/search.ts`, `src/components/blocks/FaqSearch.tsx`, `src/app/[locale]/support/page.tsx`
- Modify: `src/content/faqs.ts` (expand to the five categories the proposal names)
- Test: `src/lib/support/search.test.ts`, `src/components/blocks/FaqSearch.test.tsx`

**Interfaces:**
- Consumes: `getFaqs`, `getFaqCategories`, `Accordion`
- Produces: `searchFaqs(faqs: Faq[], query: string): Faq[]` — ranked, case- and
  diacritic-insensitive, empty query returns everything unchanged

- [ ] **Step 1: Expand the FAQ content**

Proposal Section 5.9 names five categories: buying, EMI, delivery, battery, service. The
current file has three. Add entries so every category has at least three questions —
fifteen total. Keep every answer factual and route anything legally sensitive through the
existing `registration` FAQ wording rather than inventing new claims.

- [ ] **Step 2: Write the failing search tests**

Create `src/lib/support/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getFaqs } from '@/lib/data/faqs'
import { searchFaqs } from './search'

const faqs = await getFaqs()

describe('searchFaqs', () => {
  it('returns everything for an empty query', () => {
    expect(searchFaqs(faqs, '')).toHaveLength(faqs.length)
  })

  it('returns everything for a whitespace-only query', () => {
    expect(searchFaqs(faqs, '   ')).toHaveLength(faqs.length)
  })

  it('matches a word in the question', () => {
    expect(searchFaqs(faqs, 'registration').map((f) => f.id)).toContain('registration')
  })

  it('matches a word in the answer', () => {
    expect(searchFaqs(faqs, 'kilometre').length).toBeGreaterThan(0)
  })

  it('is case-insensitive', () => {
    expect(searchFaqs(faqs, 'BATTERY').length).toBe(searchFaqs(faqs, 'battery').length)
  })

  it('ranks a question-title match above an answer-body match', () => {
    const results = searchFaqs(faqs, 'battery')
    const titleHit = results.findIndex((f) => /battery/i.test(f.question))
    const bodyOnly = results.findIndex((f) => !/battery/i.test(f.question))
    expect(titleHit).toBeLessThan(bodyOnly === -1 ? Infinity : bodyOnly)
  })

  it('requires every term, so a two-word query narrows rather than widens', () => {
    const broad = searchFaqs(faqs, 'battery')
    const narrow = searchFaqs(faqs, 'battery warranty')
    expect(narrow.length).toBeLessThanOrEqual(broad.length)
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchFaqs(faqs, 'zzzzqqq')).toEqual([])
  })

  it('ignores punctuation in the query', () => {
    expect(searchFaqs(faqs, 'battery?').length).toBe(searchFaqs(faqs, 'battery').length)
  })
})
```

- [ ] **Step 3: Run, confirm failure, implement**

Run → FAIL. Create `src/lib/support/search.ts`:

```ts
import type { Faq } from '@/lib/data/types'

/**
 * A local index, deliberately. Section 8 names Algolia or Meilisearch, but neither is worth
 * an external dependency and an API key for fifteen questions. Plan 5 swaps the body of this
 * function; the signature is the contract, so no page changes.
 */
function normalise(value: string): string[] {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

export function searchFaqs(faqs: Faq[], query: string): Faq[] {
  const terms = normalise(query)
  if (terms.length === 0) return faqs

  return faqs
    .map((faq) => {
      const question = normalise(faq.question)
      const answer = normalise(faq.answer)
      const category = normalise(faq.category)

      let score = 0
      for (const term of terms) {
        const inQuestion = question.some((w) => w.startsWith(term))
        const inAnswer = answer.some((w) => w.startsWith(term))
        const inCategory = category.some((w) => w.startsWith(term))
        if (!inQuestion && !inAnswer && !inCategory) return { faq, score: -1 }
        // A title match is worth more than a body match: it is what the reader scans.
        score += inQuestion ? 3 : inCategory ? 2 : 1
      }
      return { faq, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.faq)
}
```

Run → PASS (9 tests).

- [ ] **Step 4: Write the failing search-UI test**

Create `src/components/blocks/FaqSearch.test.tsx`:

```tsx
import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { getFaqs } from '@/lib/data/faqs'
import { renderIntl } from '@/test/render'
import { FaqSearch } from './FaqSearch'

const faqs = await getFaqs()

afterEach(cleanup)

describe('FaqSearch', () => {
  it('lists every question before any search', () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    expect(screen.getAllByRole('group').length).toBe(faqs.length)
  })

  it('narrows the list as the reader types', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    await userEvent.type(screen.getByRole('searchbox'), 'registration')
    expect(screen.getAllByRole('group').length).toBeLessThan(faqs.length)
  })

  it('announces the result count to assistive technology', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    await userEvent.type(screen.getByRole('searchbox'), 'registration')
    expect(screen.getByRole('status').textContent).toMatch(/\d/)
  })

  it('offers a way out when nothing matches, rather than a blank panel', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    await userEvent.type(screen.getByRole('searchbox'), 'zzzzqqq')
    expect(screen.getByText(/nothing matched/i)).toBeDefined()
    expect(screen.getByRole('link', { name: /raise an issue/i })).toBeDefined()
  })

  it('restores the full list when the query is cleared', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    const box = screen.getByRole('searchbox')
    await userEvent.type(box, 'registration')
    await userEvent.clear(box)
    expect(screen.getAllByRole('group').length).toBe(faqs.length)
  })
})
```

Note: `Accordion` renders `<details>`, which maps to role `group`.

- [ ] **Step 5: Implement `FaqSearch` and the page**

`FaqSearch` is a client component holding the query in state, calling `searchFaqs`, rendering
`<Accordion>` with the results, a `role="status"` live region with the count from a
`support.resultCount` plural message, and a no-match panel linking to
`/{locale}/support/raise-an-issue`.

The page at `src/app/[locale]/support/page.tsx` is a server component: `.display` heading,
the search component, a category chip row linking to `?category=…` (server-filtered, so
category browsing works without JavaScript), and three entry cards — Raise an Issue,
Warranty, Contact.

Add the `support` namespace to both catalogs: `title`, `intro`, `searchLabel`,
`searchPlaceholder`, `resultCount`, `noMatchTitle`, `noMatchBody`, `categories`,
`allCategories`, `raiseIssue`, `warranty`, `contact`, `whatsapp`.

- [ ] **Step 6: Verify and commit**

```bash
pnpm test && pnpm build
```

```bash
git add -A
git commit -m "feat: support hub with local FAQ search behind a swappable interface"
```

---

### Task 5: Raise an Issue, warranty and contact

**Files:**
- Create: `src/app/[locale]/support/raise-an-issue/page.tsx`, `src/app/[locale]/support/warranty/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/components/blocks/WhatsAppEntry.tsx`
- Modify: `src/lib/legal/claims.ts` (add warranty-detail claims)
- Test: `src/lib/legal/claims.test.ts` (extend)

**Interfaces:**
- Consumes: `LeadForm`, `Claim`, `getDealers`
- Produces: `<WhatsAppEntry phone={string} message={string} />`

- [ ] **Step 1: Write the failing claim tests**

The warranty page states terms, which is exactly the category of copy `lib/legal` exists to
gate. Append to `src/lib/legal/claims.test.ts`:

```ts
describe('warranty claims', () => {
  it('has a claim for the state-of-health threshold', () => {
    expect(getClaim('soh-threshold')).not.toBeNull()
  })

  it('has a claim for what the warranty excludes', () => {
    expect(getClaim('warranty-exclusions')).not.toBeNull()
  })

  it('leaves exclusions unapproved — an exclusion list is a legal document, not marketing copy', () => {
    expect(getClaim('warranty-exclusions')?.approved).toBe(false)
  })
})
```

- [ ] **Step 2: Run, confirm failure, implement**

Run → FAIL. Add to the `claims` array in `src/lib/legal/claims.ts`:

```ts
  {
    id: 'soh-threshold',
    text: 'Your battery is covered if it falls below 70% state of health within 3 years.',
    approved: true,
    fallback: 'Battery state-of-health cover is stated on your invoice.',
  },
  {
    id: 'warranty-exclusions',
    text: 'Physical damage, water ingress, unauthorised repair and non-Adhara chargers are not covered.',
    approved: false,
    fallback:
      'Exclusions apply. The full warranty document is issued with your vehicle and is the ' +
      'authoritative version.',
  },
```

Run → PASS.

- [ ] **Step 3: Build the WhatsApp entry**

Create `src/components/blocks/WhatsAppEntry.tsx`:

```tsx
import { useTranslations } from 'next-intl'

/**
 * A deep link, not the Business API. Section 6 lists the WhatsApp Business API for
 * notification templates; that is a platform integration and belongs to Plan 5. A click-to-chat
 * link needs no API and works today.
 */
export function WhatsAppEntry({ phone, message }: { phone: string; message: string }) {
  const t = useTranslations('support')
  const href = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-pill border border-forest/25 px-5 py-2.5 font-medium text-forest transition-colors hover:bg-forest hover:text-white"
    >
      {t('whatsapp')}
      <span aria-hidden>↗</span>
    </a>
  )
}
```

- [ ] **Step 4: Build the three pages**

**Raise an Issue** — `<LeadForm kind="issue" fields={['name','phone','reference','message']} namespace="support.issue" />`,
plus a note stating plainly that this creates a support request and that real ticket dispatch
arrives with the platform integration. Do not imply a ticket number is a tracked ticket.

**Warranty** — `<Claim id="soh-warranty" />`, `<Claim id="soh-threshold" />`,
`<Claim id="warranty-exclusions" />` (renders its neutral fallback), a plain-language cover
table, and a link to Raise an Issue.

**Contact** — dealer phone list from `getDealers()`, the WhatsApp entry, and
`<LeadForm kind="enquiry" fields={['name','phone','message']} namespace="contact.form" />`.

Add `support.issue`, `support.warranty` and `contact` namespaces to both catalogs.

- [ ] **Step 5: Verify and commit**

```bash
pnpm test && pnpm build
git add -A
git commit -m "feat: raise-an-issue, warranty policy and contact pages"
```

---

### Task 6: Become a Dealer

**Files:**
- Create: `src/content/territories.ts`, `src/lib/data/territories.ts`, `src/app/[locale]/partner/dealer/page.tsx`
- Test: `src/lib/data/territories.test.ts`

**Interfaces:**
- Consumes: `LeadForm`, `ChargeState`
- Produces:
  - `type Territory = { state: string; city: string; status: 'open' | 'limited' | 'taken' }`
  - `getTerritories(): Promise<Territory[]>` · `getOpenTerritoryCount(): Promise<number>`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/data/territories.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getOpenTerritoryCount, getTerritories } from './territories'

describe('getTerritories', () => {
  it('returns territories across more than one state', async () => {
    const states = new Set((await getTerritories()).map((t) => t.state))
    expect(states.size).toBeGreaterThan(1)
  })

  it('uses only the three statuses the UI renders', async () => {
    for (const territory of await getTerritories()) {
      expect(['open', 'limited', 'taken']).toContain(territory.status)
    }
  })

  it('includes at least one of each status, so every UI state is exercised', async () => {
    const statuses = new Set((await getTerritories()).map((t) => t.status))
    expect(statuses).toEqual(new Set(['open', 'limited', 'taken']))
  })
})

describe('getOpenTerritoryCount', () => {
  it('counts open territories only', async () => {
    const all = await getTerritories()
    expect(await getOpenTerritoryCount()).toBe(all.filter((t) => t.status === 'open').length)
  })
})
```

- [ ] **Step 2: Implement**

Create `src/content/territories.ts` with `PLACEHOLDER = true` and roughly twelve entries
across five states, covering all three statuses. Create `src/lib/data/territories.ts`:

```ts
import { territories } from '@/content/territories'

export type Territory = { state: string; city: string; status: 'open' | 'limited' | 'taken' }

export async function getTerritories(): Promise<Territory[]> {
  return territories
}

export async function getOpenTerritoryCount(): Promise<number> {
  return territories.filter((t) => t.status === 'open').length
}
```

Run: `pnpm test src/lib/data/territories.test.ts` → PASS (4 tests).

- [ ] **Step 3: Build the page**

`src/app/[locale]/partner/dealer/page.tsx`:

- Full-bleed Forest hero with the open-territory count as a `.figure` numeral
- Investment overview as a `.figure`-led three-item row (indicative outlay, expected setup
  time, support provided) — every number flagged as indicative in the copy
- Territory table using `<ChargeState>`: `open` → `full`, `limited` → `low`, `taken` → `out`.
  This is the metaphor from Section 2.3 reused, which is why the component exists
- `<LeadForm kind="dealer" fields={['name','phone','city','message']} namespace="partner.dealer.form" />`
- An explicit statement that KYC document upload is not part of this form and happens in a
  secure step after review. **Do not build a document upload.** Secure document storage is a
  platform-level decision and a file input here would invite people to send KYC documents
  through an unvetted path.

Add the `partner.dealer` namespace to both catalogs.

- [ ] **Step 4: Verify and commit**

```bash
pnpm test && pnpm build
git add -A
git commit -m "feat: become-a-dealer page with territory availability"
```

---

### Task 7: Become a Promoter

**Files:**
- Create: `src/lib/promoter/earnings.ts`, `src/components/blocks/EarningsTable.tsx`, `src/app/[locale]/partner/promoter/page.tsx`
- Test: `src/lib/promoter/earnings.test.ts`

**Interfaces:**
- Consumes: `LeadForm`, `formatRupees`, `getModels`
- Produces:
  - `commission: { PLACEHOLDER: true; perEnrollmentInr: number; perDeliveryInr: number; tiers: { from: number; bonusInr: number }[] }`
  - `monthlyEarnings(enrollments: number): { base: number; bonus: number; total: number }`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/promoter/earnings.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { commission, monthlyEarnings } from './earnings'

describe('commission parameters', () => {
  it('is flagged placeholder — commission is a commercial decision', () => {
    expect(commission.PLACEHOLDER).toBe(true)
  })

  it('has tiers in ascending order, so tier lookup is unambiguous', () => {
    const froms = commission.tiers.map((t) => t.from)
    expect(froms).toEqual([...froms].sort((a, b) => a - b))
  })
})

describe('monthlyEarnings', () => {
  it('earns nothing on zero enrollments', () => {
    expect(monthlyEarnings(0)).toEqual({ base: 0, bonus: 0, total: 0 })
  })

  it('pays the base rate per enrollment', () => {
    expect(monthlyEarnings(3).base).toBe(3 * commission.perEnrollmentInr)
  })

  it('adds no bonus below the first tier', () => {
    expect(monthlyEarnings(1).bonus).toBe(0)
  })

  it('applies the highest tier reached, not every tier', () => {
    const top = commission.tiers[commission.tiers.length - 1]
    expect(monthlyEarnings(top.from).bonus).toBe(top.bonusInr)
  })

  it('totals base plus bonus', () => {
    const r = monthlyEarnings(10)
    expect(r.total).toBe(r.base + r.bonus)
  })

  it('rejects a negative count rather than paying a negative commission', () => {
    expect(() => monthlyEarnings(-1)).toThrow(/enrollments/i)
  })

  it('returns whole rupees', () => {
    expect(Number.isInteger(monthlyEarnings(7).total)).toBe(true)
  })
})
```

- [ ] **Step 2: Implement**

Create `src/lib/promoter/earnings.ts`:

```ts
/** PLACEHOLDER commission structure. Adhara's decision, not a calculation. */
export const commission = {
  PLACEHOLDER: true,
  perEnrollmentInr: 750,
  perDeliveryInr: 1500,
  tiers: [
    { from: 5, bonusInr: 2000 },
    { from: 10, bonusInr: 5000 },
    { from: 20, bonusInr: 12000 },
  ],
} as const

export function monthlyEarnings(enrollments: number): {
  base: number
  bonus: number
  total: number
} {
  if (!Number.isFinite(enrollments) || enrollments < 0) {
    throw new Error(`Invalid enrollments: ${enrollments}`)
  }

  const base = Math.round(enrollments * commission.perEnrollmentInr)
  // Highest tier reached wins; tiers do not stack.
  const bonus = commission.tiers
    .filter((tier) => enrollments >= tier.from)
    .reduce((highest, tier) => Math.max(highest, tier.bonusInr), 0)

  return { base, bonus, total: base + bonus }
}
```

Run → PASS (9 tests).

- [ ] **Step 3: Build the earnings table and page**

`<EarningsTable>` renders `monthlyEarnings` for 1, 5, 10 and 20 enrollments through
`formatRupees`, with the tier thresholds visible. Section 5.10 asks for commission
transparency, so the table shows the tier boundaries rather than only the outcomes.

The page carries: a Forest hero, the earnings table, a three-step how-it-works (share your
link → someone enrolls → you get paid), an explicit note that the referral code is issued once
KYC completes and that KYC happens outside this form, and
`<LeadForm kind="promoter" fields={['name','phone','city']} namespace="partner.promoter.form" />`.

Add the `partner.promoter` namespace to both catalogs.

- [ ] **Step 4: Verify and commit**

```bash
pnpm test && pnpm build
git add -A
git commit -m "feat: become-a-promoter page with transparent commission tiers"
```

---

### Task 8: About / Factory Story

The last page in the spec's approved ten-page scope, and the only place the brand's own
meaning gets argued rather than asserted.

**Files:**
- Create: `src/content/company.ts`, `src/lib/data/company.ts`, `src/app/[locale]/about/page.tsx`
- Test: `src/lib/data/company.test.ts`

**Interfaces:**
- Consumes: `Blueprint`, `PhotoFrame`, `Claim`, `getDealers`
- Produces:
  - `type Milestone = { year: string; title: string; body: string }`
  - `getMilestones(): Promise<Milestone[]>`
  - `getFactoryStats(): Promise<{ label: string; value: string }[]>`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/data/company.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getFactoryStats, getMilestones } from './company'

describe('getMilestones', () => {
  it('returns milestones in chronological order', async () => {
    const years = (await getMilestones()).map((m) => Number(m.year))
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })

  it('gives every milestone a title and a body', async () => {
    for (const m of await getMilestones()) {
      expect(m.title.length).toBeGreaterThan(0)
      expect(m.body.length).toBeGreaterThan(0)
    }
  })

  it('claims no year later than the present, so the timeline is not aspirational', async () => {
    const years = (await getMilestones()).map((m) => Number(m.year))
    expect(Math.max(...years)).toBeLessThanOrEqual(2026)
  })
})

describe('getFactoryStats', () => {
  it('returns stats as label and value pairs', async () => {
    for (const stat of await getFactoryStats()) {
      expect(typeof stat.label).toBe('string')
      expect(typeof stat.value).toBe('string')
    }
  })

  it('returns at least three, because two reads as thin and four fills the row', async () => {
    expect((await getFactoryStats()).length).toBeGreaterThanOrEqual(3)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/lib/data/company.test.ts`
Expected: FAIL — cannot resolve `./company`

- [ ] **Step 3: Author the placeholder company content**

Create `src/content/company.ts`:

```ts
import type { Milestone } from '@/lib/data/company'

export const PLACEHOLDER = true

/**
 * Invented history. Replace before launch — a fabricated founding date is the kind of
 * detail a journalist checks.
 */
export const milestones: Milestone[] = [
  {
    year: '2024',
    title: 'The problem, stated plainly',
    body: 'Two of our founders spent a year watching first-time buyers get turned down for two-wheeler loans, not because they could not pay, but because they had no credit history to show.',
  },
  {
    year: '2025',
    title: 'A payment scheme instead of a lender',
    body: 'Rather than find a friendlier bank, we removed the bank. Customers pay Adhara monthly and take delivery once they cross the eligibility mark.',
  },
  {
    year: '2026',
    title: 'Assembly begins',
    body: 'Low-speed assembly starts, built to the 25 km/h and 250 W specification that keeps these vehicles inside the unregistered category.',
  },
]

export const factoryStats: { label: string; value: string }[] = [
  { label: 'Top speed, by design', value: '25 km/h' },
  { label: 'Motor', value: '250 W' },
  { label: 'Battery health warranty', value: '3 years' },
  { label: 'Bank involvement', value: 'None' },
]
```

Create `src/lib/data/company.ts`:

```ts
import { factoryStats, milestones } from '@/content/company'

export type Milestone = { year: string; title: string; body: string }

export async function getMilestones(): Promise<Milestone[]> {
  return [...milestones].sort((a, b) => Number(a.year) - Number(b.year))
}

export async function getFactoryStats(): Promise<{ label: string; value: string }[]> {
  return factoryStats
}
```

- [ ] **Step 4: Confirm green**

Run: `pnpm test src/lib/data/company.test.ts`
Expected: PASS — 5 tests

- [ ] **Step 5: Build the page**

`src/app/[locale]/about/page.tsx`, in four bands:

1. **Full-bleed Forest hero** with `<Blueprint />`, the `.display` heading, and the आधार
   etymology as the opening argument — base, support, foundation. This is the one page where
   the name does real work rather than sitting in a logo.
2. **Factory stats** from `getFactoryStats()`, each value rendered with the `.figure` class at
   large size on hairline rules — the same treatment the EMI strip uses, so the site reads as
   one system.
3. **Milestones** from `getMilestones()` as a vertical timeline, year in `.figure` at low
   opacity behind each entry.
4. **Factory photography slots**: three `<PhotoFrame ratio="3 / 2" />` with subjects named
   ("Assembly line, wide", "Battery pack QC bench", "Finished units, dispatch bay"), so the
   real images drop in without reflow when they exist.

Close with a link to `/{locale}/dealers` and the dealer count from `getDealers()`.

Add the `about` namespace to both catalogs: `title`, `nameMeaning`, `nameMeaningBody`,
`statsTitle`, `timelineTitle`, `factoryTitle`, `visitTitle`, `visitBody`.

- [ ] **Step 6: Verify and commit**

```bash
pnpm test && pnpm build
```

Load `/en/about` and `/hi/about` at 360px and 1280px. Confirm the Hindi page renders Hindi
throughout, and that no photo frame collapses to zero height.

```bash
git add -A
git commit -m "feat: about and factory story page"
```

---

### Task 9: Navigation, crawl surface and final sweep

**Files:**
- Modify: `src/components/blocks/SiteHeader.tsx`, `src/components/blocks/SiteFooter.tsx`, both message catalogs
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`
- Test: `src/app/sitemap.test.ts`, extend `e2e/accessibility.spec.ts`

**Interfaces:**
- Consumes: `getModels`, `routing`
- Produces: `sitemap()` default export returning `MetadataRoute.Sitemap`

- [ ] **Step 1: Write the failing sitemap test**

Create `src/app/sitemap.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import sitemap from './sitemap'
import { routing } from '@/i18n/routing'

const entries = await sitemap()
const urls = entries.map((e) => e.url)

describe('sitemap', () => {
  it('includes every locale for every route', () => {
    for (const locale of routing.locales) {
      expect(urls.some((u) => u.includes(`/${locale}/vehicles`))).toBe(true)
    }
  })

  it('includes a URL per model', () => {
    expect(urls.filter((u) => u.includes('/vehicles/adhara-')).length).toBeGreaterThanOrEqual(3)
  })

  it('includes every page built in this plan', () => {
    for (const path of ['/dealers', '/test-ride', '/support', '/contact', '/partner/dealer', '/partner/promoter', '/about']) {
      expect(urls.some((u) => u.endsWith(`/en${path}`))).toBe(true)
    }
  })

  it('excludes routes that do not exist yet', () => {
    expect(urls.some((u) => u.includes('/buy'))).toBe(false)
    expect(urls.some((u) => u.includes('/account'))).toBe(false)
  })

  it('emits absolute URLs', () => {
    for (const url of urls) expect(url).toMatch(/^https?:\/\//)
  })

  it('has no duplicates', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })
})
```

- [ ] **Step 2: Implement**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getModels } from '@/lib/data/models'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adharaenergy.com'

const STATIC_PATHS = [
  '',
  '/vehicles',
  '/emi',
  '/emi/calculator',
  '/test-ride',
  '/dealers',
  '/support',
  '/support/raise-an-issue',
  '/support/warranty',
  '/contact',
  '/partner/dealer',
  '/partner/promoter',
  '/about',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const models = await getModels()

  return routing.locales.flatMap((locale) => [
    ...STATIC_PATHS.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
    ...models.map((model) => ({
      url: `${BASE}/${locale}/vehicles/${model.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ])
}
```

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adharaenergy.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
```

Run: `pnpm test src/app/sitemap.test.ts` → PASS (6 tests).

- [ ] **Step 3: Extend navigation**

The header currently holds three links; seven pages is too many for one row. Restructure:

- Header: Vehicles · EMI Scheme · Test Ride · Support, with the locale switcher unchanged
- Mobile disclosure: all eight
- Footer: three columns — Explore (vehicles, EMI, calculator, compare), Support (support,
  raise an issue, warranty, contact), Partner (dealer, promoter, find a dealer)

Add `common.nav.testRide`, `common.nav.support`, `common.nav.partner`,
`common.footer.support`, `common.footer.partner` to both catalogs. Verify the CTA guard stays
silent on every page.

- [ ] **Step 4: Extend the accessibility sweep to the new pages**

In `e2e/helpers.ts`, extend `PAGE_TYPES`:

```ts
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
] as const
```

Add the same paths to the 360px overflow loop in `e2e/journeys.spec.ts`, and add a journey
test that books a test ride end to end and asserts the stored lead carries `dealerId` and
`slotId`.

- [ ] **Step 5: Full verification**

```bash
pnpm tokens:build && pnpm test && pnpm build && pnpm e2e
```

Then confirm by hand at 360px: every new page has no horizontal scroll, the header disclosure
opens, and the Hindi version of each new page renders Hindi rather than English fallback.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: navigation, sitemap and robots for the channel and support surface"
```

---

## Definition of done for this plan

- [ ] `pnpm test` green; `pnpm build` clean; `pnpm e2e` green on both desktop and mobile projects
- [ ] `pnpm e2e:a11y` reports zero WCAG 2.1 AA violations across all 14 page types
- [ ] Lighthouse: LCP under 2.5s, accessibility 100, model pages under 1.5MB
- [ ] Eight new pages render in English and Hindi, with no English fallback visible on a Hindi page
- [ ] The boundary test still passes — nothing outside `lib/data` and `lib/legal` imports `@/content`
- [ ] No CTA-guard warning on any page
- [ ] A test-ride booking stores a lead carrying `dealerId` and `slotId`
- [ ] A `?ref=CODE` visit still reaches the stored lead from any of the five new forms
- [ ] `warranty-exclusions` renders its neutral fallback, never the claim
- [ ] No file input exists anywhere — KYC upload is deliberately absent
- [ ] `sitemap.xml` lists every built route in both locales and no unbuilt route
- [ ] Every page usable at 360px with no horizontal scroll

## Deliberate deferrals

**Real ticket creation.** `kind: 'issue'` writes to the same stub sink as every other lead.
Section 6 wants a raise-an-issue form to trigger dispatch for verified owners; that needs the
platform's ticket API and owner verification, so it is Plan 5. The page says so plainly rather
than implying a tracked ticket exists.

**WhatsApp Business API.** Task 5 ships a click-to-chat deep link, which needs no API. The
notification templates in Section 6 are a platform integration and belong to Plan 5.

**External search.** Task 4's local index is behind `searchFaqs`, whose signature is the
contract. Plan 5 swaps the body for Algolia or Meilisearch with no page changes.

**KYC document upload.** Deliberately not built in Tasks 6 or 7. Secure document storage is a
platform-level decision, and a file input on a marketing page would invite people to send
identity documents through an unvetted path.
