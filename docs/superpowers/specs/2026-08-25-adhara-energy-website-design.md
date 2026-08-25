# Adhara Energy Website — Design Spec

**Date:** 2026-08-25
**Status:** Approved for planning
**Source:** *Adhara Energy — Website Design & Management Proposal v1.0* (August 2026)
**Scope:** Sub-projects A (design system) + B (marketing site) only

---

## 1. Context and decomposition

The source proposal describes a programme, not a project: roughly 25 page types, ten
integrations into an operating platform that does not yet exist, and transactional flows
gated on payment-gateway certification and EMI legal sign-off that Section 12 of the
proposal records as unresolved.

It decomposes into four sub-projects:

| Sub-project | Depends on | Status |
|---|---|---|
| A. Design system and brand foundation | nothing | **in this spec** |
| B. Marketing site | A + catalog content | **in this spec** |
| C. Transactional layer (checkout, EMI enrollment, My Account) | B + platform APIs + payment cert + legal sign-off | blocked, later spec |
| D. Support and scale (ticketing, wider i18n, fleet) | C | later spec |

Only A and B are unblocked. This spec covers those two.

## 2. Decisions taken

| # | Decision | Rationale |
|---|---|---|
| D1 | Real Next.js codebase, not a prototype | Largest unblocked unit of durable value |
| D2 | Ten page types: the core conversion set | Covers jobs J2–J6 and the no-bank EMI differentiator; J1 is the deliberate gap |
| D3 | Typed local content behind a repository seam | Honours proposal Section 6 before the platform exists |
| D4 | Placeholder product and scheme data, flag-isolated | Unblocks the catalog and calculator without inventing commitments |
| D5 | No photography; design-system-native visual language | Section 7 rules out generic EV stock and no real assets exist |
| D6 | Real server-side lead pipeline, stubbed sink | Builds the attribution and anti-abuse logic Section 8 calls for |
| D7 | Full i18n architecture; English complete, Hindi proof locale | Section 7 forbids a bolted-on translation layer |
| D8 | Single Next.js app plus a token build pipeline | Section 2.3 needs CSS + Figma + app-JSON token exports; a monorepo is not yet earned |

## 3. Brand foundation

### 3.1 Colour tokens

Carried over from proposal Section 2.3 without reinterpretation.

| Token | Hex | Role |
|---|---|---|
| Forest (primary) | `#0E3B2E` | Headers, nav, secondary buttons, hero grounds |
| Turmeric (accent) | `#E8A020` | One primary CTA per screen; never body text |
| Ink (text) | `#14201B` | All body copy |
| Mist (surface) | `#F4F6F1` | Page background; white reserved for cards |
| Charge Full | `#2F9E6B` | On-track |
| Charge Low | `#E8A020` | Due soon |
| Charge Out | `#C6453C` | Lapsed or failed |

Hover, border and disabled variants are **derived by the token build**, not hand-authored,
each asserted to WCAG AA contrast against its intended ground. The palette stays five
decisions wide.

### 3.2 Accent discipline as code

Section 7's "one primary CTA per viewport" is the rule most likely to erode across a year
of marketing edits. A development-time guard warns when a second `variant="primary"`
button mounts within a page. The rule outlives the people who agreed to it.

The guard counts primary buttons only. `ChargeState` chips also use Turmeric for the "low"
status — proposal Section 2.3 makes that hue-sharing deliberate — and status chips are not
calls to action, so they are outside the count.

### 3.3 Wordmark

Three SVG options built on the device proposed in Section 2.2 — the "A" of Adhara treated
as a foundation beam, not a battery cell:

1. **Crossbar-A** — the A's crossbar extended in Turmeric
2. **Baseline underline** — a Turmeric support line beneath the wordmark
3. **Stacked lockup** — "ADHARA / ENERGY" with the beam separating the two words

Each uses the accent exactly once. These are a commissionable starting point for the design
team, not a replacement for the brief in Section 9.

### 3.4 Typography

| Role | Face | Reason |
|---|---|---|
| Headings | Anek Latin | Variable, wide weight range, Indian foundry |
| Body and UI | Inter | Best-in-class small-size legibility |
| Hindi locale | Anek Devanagari | Script-matched sibling of the heading face |

Anek's Latin and Devanagari cuts are designed as a family, so the Hindi site reads as the
same brand rather than as a translation of another one. **All monetary figures use tabular
numerals** — misaligned rupee columns in an EMI table undercut precisely the credibility the
Forest palette is buying.

### 3.5 Battery-state metaphor as one component

`<ChargeState status="full" | "low" | "out">` serves EMI status, order status, stock, and
pincode serviceability alike. Section 2.3 requires the metaphor be reused everywhere; a
single component is the only way that stays true under maintenance.

## 4. Architecture

```
tokens/                    color.json · type.json · space.json      ← source of truth
scripts/build-tokens.ts    emits three artefacts (see 4.1)
src/
  app/[locale]/            routes; middleware for locale + attribution capture
  components/ui/           primitives — Button, Field, Accordion, ChargeState, PriceDual
  components/blocks/       composed sections — Hero, ModelCard, EMIStrip, SpecTable
  lib/data/                repositories — getModels, getModel, getDealers, getFaqs
  lib/emi/                 scheme maths, pure and unit-tested
  lib/leads/               submitLead adapter, zod schemas, rate limit, attribution
  lib/legal/               gated claims module
  content/                 typed placeholder data, PLACEHOLDER-flagged
  messages/                en.json · hi.json
```

### 4.1 Token pipeline

`pnpm tokens:build` reads `tokens/*.json` and emits:

1. `src/styles/tokens.css` — CSS custom properties consumed by the Tailwind theme
2. `exports/figma-variables.json` — Figma variable import
3. `exports/app-tokens.json` — flat JSON for the customer mobile app

This satisfies Section 2.3's stated export requirement and Section 7's "tokens shared with
the customer app so web and app never drift" without introducing a monorepo for consumers
that do not yet exist.

### 4.2 The load-bearing rule

**Pages never import from `content/` or `messages/` directly.** All catalog, dealer and FAQ
reads go through `lib/data/` repository functions returning domain types; all copy goes
through the i18n hook. This single constraint is what makes a later swap to Strapi, Sanity
or platform APIs a change inside one folder rather than across every page — which is how
proposal Section 6's single-source-of-truth rule is honoured before the platform exists.

A second, narrower rule: `PriceDual` is the **only** component that renders a price. Section
5.2 requires the full price and the monthly EMI figure to appear side by side "always", and a
single renderer is what makes that structurally true rather than a habit.

### 4.3 Unit boundaries

| Unit | Does | Depends on |
|---|---|---|
| `tokens/` + build script | Defines and exports the visual system | nothing |
| `components/ui/` | Renders primitives from tokens | tokens |
| `components/blocks/` | Composes primitives into page sections | ui, i18n |
| `lib/data/` | Returns domain objects for catalog, dealers, FAQs | content (swappable) |
| `lib/emi/` | Computes monthly, total, eligibility date | scheme params only |
| `lib/leads/` | Validates, rate-limits, attributes, persists leads | zod, store adapter |
| `lib/legal/` | Gates unapproved claims | claims data |

Each is independently testable and replaceable. `lib/emi/` in particular takes no I/O so the
money maths can be tested exhaustively.

### 4.4 Legal claim gating

`lib/legal/claims.ts` stores each claim as `{ id, text, approved, states? }`. An unapproved
claim renders as a neutral placeholder in production builds and a loud amber banner in
development. Section 12's open question 3 — whether "no licence / no registration" needs
state-wise vetting before becoming headline messaging — becomes a flag someone must
consciously flip, rather than a sentence that quietly ends up in a hero headline.

Testimonials are gated by the same mechanism. Fabricated customer quotes are not rendered
as genuine; sample content is visibly labelled until real testimonials exist.

## 5. Page plan

| # | Page | Build detail |
|---|---|---|
| 1 | Home | Hero + single Turmeric CTA, model carousel, four-step EMI strip (Enroll → Pay Monthly → Eligibility Alert → Ride Home), calculator teaser, SoH and warranty trust badges, test-ride CTA, locator entry, gated testimonials |
| 2 | Model Listing | Filters on price, range, top speed, battery — held in URL state so results are shareable and indexable |
| 3 | Model Detail | Gallery frame with working colour switcher, full spec table, pincode serviceability, dual pricing via `PriceDual`, three CTAs, FAQ accordion, gated state-classification note, sticky mobile CTA bar |
| 4 | EMI How It Works | Plain-language enroll → pay → eligibility alert → delivery, explicitly answering "why no bank, no credit check" |
| 5 | EMI Calculator | Model × tenure → monthly, total cost, eligibility timeline |
| 6 | Test Ride / Doorstep Demo | Pincode → nearest dealer and slots, or doorstep request; lead created with source attribution |
| 7 | Support / FAQ | Client-side search index over FAQ content, category browse, raise-an-issue form, WhatsApp and phone entry |
| 8 | Partner With Us | Dealer investment overview, territory availability and application; promoter earnings, commission transparency and signup |
| 9 | Dealer Locator | Pincode and city filter over `getDealers()`, region-grouped list plus schematic India map |
| 10 | About / Factory Story | The आधार meaning — base, support, foundation — as company narrative |

### 5.1 Deliberate gaps, stated on the page

- **Enrollment deep-link.** Section 5.4 wants the calculator to deep-link into enrollment.
  Enrollment is sub-project C. The calculator captures a lead and states that enrollment
  opens soon, rather than presenting a flow that dead-ends.
- **Locator map.** Schematic SVG, not a map provider — there is no API key and one will not
  be invented.
- **Dealer KYC upload.** Not built. Secure document storage is a platform-level decision;
  the form completes the application and says so.

## 6. EMI calculation

Pure functions in `lib/emi/`, with every parameter isolated in
`emi-scheme.placeholder.ts` behind an explicit `PLACEHOLDER` flag:

```
monthly         = round(price × (1 + schemeFee) / tenure)
eligibilityDate = enrollmentDate + ceil(tenure × eligibilityThreshold) months
totalCost       = monthly × tenure
premium         = totalCost − price
```

Placeholder values, all flagged and all commercial decisions Adhara must supply — the file
exists so that supplying them is a one-file edit:

| Parameter | Placeholder | Meaning |
|---|---|---|
| `schemeFee` | `0.18` | 18% premium over cash price across the scheme |
| `eligibilityThreshold` | `0.6` | Delivery unlocks once 60% of installments are paid |
| `tenures` | `[12, 18, 24]` | Selectable months |

**The calculator always displays total cost and premium against the full cash price.**
Job J3 sells transparent monthly terms; a calculator that conceals what the scheme costs
versus paying outright would be the most brand-damaging thing this site could ship.

Unit tests are table-driven and cover rounding behaviour and both boundary tenures.

## 7. Error handling

| Case | Behaviour |
|---|---|
| Unknown model slug | `notFound()` — 404, never a crash |
| Pincode serviceability | **Three** states: serviceable, not serviceable, check-failed-with-retry |
| Form validation | Server-side zod is the authority; the client mirrors it for UX only |
| Rate limit hit | Explicit human message, not a silent rejection |
| Submission failure | User input preserved, phone fallback offered |
| Missing Hindi key | Falls back to English, logged in development, never a raw key on screen |
| Unapproved claim or testimonial | Neutral placeholder in production, amber banner in development |

The three-state serviceability check matters commercially: telling a buyer in a live pincode
that Adhara does not deliver there is a lost sale caused by a network blip.

## 8. Testing

**Vitest (unit)**
- `lib/emi` — monthly, total, premium, eligibility date; rounding and boundary tenures
- `lib/leads` — schema validation, attribution parsing, rate limiting
- token build — output shape and WCAG AA contrast assertions
- `lib/legal` — approved and unapproved claims render correctly per environment

**Playwright (end-to-end)**
- Calculator → lead capture
- Test-ride booking entered via a `?ref=CODE` link, asserting the referral code survives into
  the submitted record — the attribution requirement in Section 6 verified rather than assumed

**Accessibility** — axe run against each page type, targeting WCAG 2.1 AA per Section 7.

**Performance** — Lighthouse budget: LCP under 2.5s, model pages under 1.5MB.

## 9. Out of scope

Named explicitly so no reader assumes otherwise.

- Buy Online flow and payment gateway (job J1, proposal Section 5.3)
- EMI enrollment, versioned T&C acceptance, UPI Autopay mandates (Section 5.4)
- My Account, order status, EMI ledger (Section 5.11)
- Real ticket creation, WhatsApp Business API templates, KYC document upload
- CMS provisioning, Algolia or Meilisearch, GA4 property setup, map provider integration
- Sitemap pages dropped by the chosen scope: Compare Models, Savings Calculator, Technology,
  Charging Guide, Fleet/Business, News & Blog, and the five Legal pages

## 10. Open questions owned by Adhara

Carried from proposal Section 12; each blocks something specific here.

| Question | Blocks |
|---|---|
| Is pricing uniform nationally or per city/state? | Pricing display logic and the `getModels` return type |
| Is the "no licence / no registration" claim uniform across launch states? | Whether `lib/legal` claims carry a `states` array in production |
| Confirmed launch language set | Which message catalogs follow Hindi |
| Real model specs, prices, tenure options, scheme fee | Every placeholder in `content/` and `emi-scheme.placeholder.ts` |
| Domain confirmation | Canonical URLs, sitemap, metadata |

## 11. Definition of done

- Ten page types render at 360px and scale up, complete in English
- Hindi catalog covers five pages: Home, Model Listing, Model Detail, EMI How It Works, EMI Calculator
- `pnpm tokens:build` emits all three token artefacts
- Every unit and end-to-end test passes; axe reports no AA violations on any page type
- No page imports from `content/` or `messages/` directly
- No unapproved legal claim or testimonial renders as fact in a production build
- The EMI calculator shows total cost and premium alongside every monthly figure
