# Adhara Energy — Marketing Site

D2C web platform for a low-speed EV sold on a no-bank, no-credit-check EMI scheme.

This repository covers **sub-projects A and B** of the proposal: the design system and the
five-page conversion core. Checkout, EMI enrollment and My Account are deliberately out of
scope — see [the spec](docs/superpowers/specs/2026-08-25-adhara-energy-website-design.md).

## Getting started

```bash
pnpm install
pnpm tokens:build   # emits tokens.css, figma-variables.json, app-tokens.json
pnpm dev            # http://localhost:3000 → redirects to /en
pnpm test           # 144 tests
pnpm build
```

## What is here

| Route | Purpose |
|---|---|
| `/[locale]` | Home — hero, scheme explainer, model grid, gated trust claims |
| `/[locale]/vehicles` | Listing with URL-state filters (works without JavaScript) |
| `/[locale]/vehicles/[slug]` | Model detail — specs, colours, pincode serviceability |
| `/[locale]/emi` | How the no-bank scheme works |
| `/[locale]/emi/calculator` | Monthly, total, premium, eligibility + interest capture |

Locales: `en` complete, `hi` complete for these five pages.

## Four rules the code enforces

These are the constraints most likely to erode under maintenance, so each is a test rather
than a convention.

1. **Nothing outside `src/lib/data/` and `src/lib/legal/` may import `src/content/`.**
   Pages read through repository functions, so repointing at the platform's catalog API is a
   one-folder change. Enforced by `src/lib/data/boundary.test.ts`.

2. **A monthly EMI figure never appears without the full price in the same view.**
   `PriceDual` is the canonical renderer. Enforced by
   `src/components/blocks/price-invariant.test.tsx`.

3. **One primary CTA per page.** A dev-time guard warns on a second `variant="primary"`.

4. **No unapproved legal claim or fabricated testimonial renders as fact.**
   `src/lib/legal/claims.ts` stores approval as data; unapproved claims render a neutral
   fallback plus a loud dev banner. The "no licence / no registration" claim is currently
   **unapproved** pending state-wise legal vetting.

## Placeholder data

Everything in `src/content/` and `src/lib/emi/emi-scheme.placeholder.ts` is invented for
development and is **not an Adhara commitment**. Scheme placeholders: `schemeFee 0.18`,
`eligibilityThreshold 0.6`, tenures `[12, 18, 24]`. Replacing them is a one-file edit.

## Design system

Tokens live in `tokens/*.json` as the single source of truth. `pnpm tokens:build` emits CSS
custom properties for the web, a Figma variable import, and flat JSON for the customer app,
so web and app cannot drift. The build fails if the palette drops below WCAG AA.

Forest `#0E3B2E` · Turmeric `#E8A020` · Ink `#14201B` · Mist `#F4F6F1` ·
charge states `#2F9E6B` / `#E8A020` / `#C6453C`

There is no photography. Photo slots are labelled frames; vehicles are drawn as technical
illustrations, which suits a product sold on spec transparency.

## Docs

- [Design spec](docs/superpowers/specs/2026-08-25-adhara-energy-website-design.md) — decisions, scope, open questions
- [Implementation plan](docs/superpowers/plans/2026-08-25-foundation-and-core-journey.md) — the 13 tasks this was built from

## Open questions owned by Adhara

National vs per-state pricing · state-wise vetting of the low-speed classification claim ·
confirmed launch language set · real specs, prices and scheme parameters · domain confirmation
