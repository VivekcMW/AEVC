# Adhara Energy Website — Full Roadmap

**Date:** 2026-08-25
**Status:** Plan 2 written and executable · Plans 3–5 scoped, two gated on decisions
**Source:** *Website Design & Management Proposal v1.0*, Section 4 sitemap and Section 11 roadmap
**Shipped so far:** [Plan 1 — Foundation & Core Journey](2026-08-25-foundation-and-core-journey.md)

---

## 1. Why this is four plans, not one

The remaining sitemap divides cleanly along one axis that matters more than page count:
**what is blocked and what is not.**

| Plan | Scope | Blocked on | Pages |
|---|---|---|---|
| **2 — Channel & Support** | Test ride, support, partner recruitment, dealer locator, contact, about | nothing | 8 |
| **3 — Category Education & Content** | Technology, charging, savings, compare, fleet, blog, legal set | legal review of two pages only | 10 |
| **4 — Transactional** | Buy Online, EMI enrollment, My Account, payments | payment gateway choice · platform APIs · EMI legal sign-off | 4 |
| **5 — Scale & Instrumentation** | Search, real ticketing, analytics, wider i18n, performance | CMS and search decisions | 0 new |

Plans 2 and 3 are executable today and cover **18 of the 22 remaining pages**. Plan 4 is the
one that genuinely cannot be written to step level yet, and Section 5 below says exactly why.

A note on sequencing: Plans 2 and 3 are independent of each other and of Plan 4. If more than
one person is working, 2 and 3 can run in parallel — they touch different routes and share
only the primitives Plan 1 already shipped.

## 2. Plan 2 — Channel & Support

**Written in full:** [2026-08-25-channel-and-support.md](2026-08-25-channel-and-support.md)

Nine tasks. Opens with the browser test harness deferred from Plan 1, so the automation
exists before there is more surface to regress. Completing it closes the spec's original
approved ten-page scope exactly — no page from that scope is left behind.

| Task | Deliverable |
|---|---|
| 1 | Playwright + axe + Lighthouse harness over the five shipped pages |
| 2 | Dealer locator — pincode and city filter, region-grouped list, schematic map |
| 3 | Test Ride / Doorstep Demo — nearest dealer, slot selection, attributed lead |
| 4 | Support hub — FAQ search and category browse, no external search service |
| 5 | Raise an Issue, warranty policy, contact, WhatsApp entry |
| 6 | Become a Dealer — investment overview, territory availability, application |
| 7 | Become a Promoter — earnings transparency, signup |
| 8 | About / Factory Story — the last page of the approved scope |
| 9 | Navigation, footer, `sitemap.xml`, `robots.txt` for every new route |

Jobs closed: **J2** (leads) fully, **J4** (channel recruitment) fully, **J5** (support) except
real ticket creation, which is Plan 5.

## 3. Plan 3 — Category Education & Content

Ten pages. This is the SEO and trust engine: the buyer in this category does not know the
category exists, which is job **J6**.

| Page | Why it earns its place |
|---|---|
| Technology — Battery & Range | Cell chemistry, SoH warranty, honest degradation curve |
| Technology — Why No Registration | The single most-asked question; state-by-state, gated by `lib/legal` |
| Charging Guide | Cost per km against petrol, socket requirements, charging time |
| Savings Calculator | EV vs petrol over ownership period — the second calculator in the funnel |
| Compare Models | Side-by-side spec table across the range |
| Fleet / Business | B2B value case, total cost of ownership, bulk enquiry to the sales queue |
| News & Blog | Content engine; MDX until a CMS exists |
| Privacy Policy | DPDP-aligned |
| Terms of Use | — |
| Refund & Cancellation · Shipping & Delivery | Required before any checkout ships |

**Partially gated:** "Why No Registration" and the Refund/Cancellation page need legal review
of wording, not of architecture. Both render through `lib/legal`, so they can be built now and
approved later by flipping a flag — the same mechanism Plan 1 established.

**Not gated:** the EMI Scheme T&C page stays out. It is versioned legal text that cannot exist
before the scheme structure is signed off, and a stub would read as though terms exist.

## 4. Plan 5 — Scale & Instrumentation

No new pages; makes the existing ones production-grade.

| Task | Note |
|---|---|
| Help-centre search upgrade | Algolia or Meilisearch, replacing Plan 2's local index behind the same interface |
| Real ticket creation | Replaces the stubbed sink for `kind: 'issue'` once the platform ticket API exists |
| Analytics | GA4 plus server-side conversion events for lead, booking and enrollment |
| Wider i18n | Marathi, Tamil, Telugu — a new catalog file each, once the launch set is confirmed |
| Performance hardening | Lighthouse budget enforced in CI; image pipeline once photography arrives |
| CMS migration | Repoint `lib/data` at Strapi or Sanity; the boundary test already guarantees this is one folder |

## 5. Plan 4 — Transactional, and exactly why it is not written yet

This plan covers Buy Online (job **J1**, the only job still entirely open), EMI enrollment,
My Account, and payments. Its shape is known; its steps are not writable yet.

**What is already decided and will not change:**

- The six-step checkout in proposal Section 5.3: model and colour → pincode serviceability
  and delivery estimate → accessories → payment path → gateway → confirmation with booking ID
- Guest checkout with the account auto-created via OTP
- Enrollment: OTP identity → plan selection → T&C acceptance with the accepted version
  captured → first installment → optional UPI Autopay
- My Account: OTP login, order and booking status, EMI ledger with pay-now, documents,
  issue raising, persistent app banner

**What blocks step-level detail — three decisions, in order of impact:**

1. **Payment gateway.** Razorpay, Cashfree and PayU differ in SDK shape, webhook signature
   scheme, and — critically — in how UPI Autopay mandates are created and debited. Writing
   idempotency keys, webhook verification and mandate code against the wrong one is largely
   wasted work, not a refactor. This is the single decision that unlocks the plan.
2. **Platform API status.** Section 6 says the website holds no business data. If the platform
   team has a contract, Plan 4 builds against it. If not, defining that contract becomes Plan
   4's first task — a real deliverable either way, but a different one.
3. **EMI legal sign-off.** The versioned T&C and the grace/lapse policy are not copy details:
   what a lapse does to a customer's paid balance determines the ledger's data model and the
   states the UI must render.

**What can be built before any of those land** — and should be, because none of it is
throwaway:

- The checkout flow's step machine, validation and error states, against a mock payment
  adapter behind the same `submitLead`-style seam Plan 1 proved
- OTP identity flow, with the provider stubbed
- The EMI ledger's read-only views, driven by the `ChargeState` component built in Plan 1 and
  still deliberately unused
- Idempotency and replay-safety tests, which are gateway-independent

If you want Plan 4 started now, that pre-work is a legitimate eighth-to-tenth task set. It is
listed here rather than hidden so the choice is yours, not implied.

## 6. Coverage against the Section 4 sitemap

| Sitemap item | Where |
|---|---|
| Vehicles → Listing, Detail | Shipped (Plan 1) |
| Vehicles → Compare Models | Plan 3 |
| Buy Online | Plan 4 |
| EMI → How It Works, Calculator | Shipped (Plan 1) |
| EMI → Scheme T&C | Blocked on legal sign-off; deliberately excluded |
| Book a Test Ride / Doorstep Demo | Plan 2 |
| Savings Calculator | Plan 3 |
| Technology → Battery & Range, Why No Registration | Plan 3 |
| Charging Guide | Plan 3 |
| Fleet / Business | Plan 3 |
| Partner With Us → Dealer, Promoter | Plan 2 |
| Find a Dealer | Plan 2 |
| Support → FAQs, Raise an Issue, Warranty, Contact | Plan 2 (real tickets in Plan 5) |
| Company → About | Plan 2 |
| Company → News & Blog | Plan 3 |
| My Account | Plan 4 |
| Legal → Privacy, Terms, Refund, Shipping | Plan 3 |
| Legal → EMI Scheme Terms | Blocked on legal sign-off |

Every sitemap item is accounted for. Two are deliberately excluded with a stated reason.

## 7. Jobs-to-be-done coverage

| Job | Status after Plan 2 + 3 | Closed by |
|---|---|---|
| J1 Sell vehicles online | Not started | Plan 4 |
| J2 Generate and attribute leads | Complete | Plan 2 |
| J3 Market the no-bank EMI scheme | Complete except enrollment | Plan 1, then Plan 4 |
| J4 Recruit the channel | Complete | Plan 2 |
| J5 Support customers | Complete except real tickets | Plan 2, then Plan 5 |
| J6 Build category trust | Complete | Plan 1 + Plan 3 |
