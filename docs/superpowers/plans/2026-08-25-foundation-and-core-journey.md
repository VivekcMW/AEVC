# Adhara Energy — Foundation & Core Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Adhara Energy design system and the five-page conversion core — Home, Model Listing, Model Detail, EMI How It Works, EMI Calculator — as a working, tested Next.js site.

**Architecture:** One Next.js App Router application. Design tokens live in `tokens/*.json` as the single source of truth and are compiled to three artefacts by a build script. All catalog and copy reads pass through `src/lib/data/` repositories and the i18n hook, never through direct imports, so a later swap to platform APIs or a CMS touches one folder. Business rules that carry money or legal risk — EMI maths, claim approval, lead attribution — are pure modules with exhaustive unit tests.

**Tech Stack:** Next.js 16.3.2 (App Router) · React 19.2.8 · TypeScript 5.9.3 strict · Tailwind CSS 4.3.3 (CSS-first `@theme`) · next-intl 4.13.7 · zod 4.4.3 · Vitest 4.1.11 + Testing Library · pnpm 10.33.0

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- **Palette, exact hexes:** Forest `#0E3B2E` · Turmeric `#E8A020` · Ink `#14201B` · Mist `#F4F6F1` · Charge Full `#2F9E6B` · Charge Low `#E8A020` · Charge Out `#C6453C`
- **Hover, border and disabled variants are derived by the token build, never hand-authored.** Each is asserted to WCAG AA contrast against its intended ground.
- **One primary CTA per page.** A dev-time guard warns on a second mounted `variant="primary"` button. The guard counts primary buttons only — `ChargeState` chips share the Turmeric hue deliberately and are not CTAs.
- **A monthly EMI figure never appears without the full price in the same view**, with `PriceDual` as the canonical renderer of the pair. Filter thresholds and the calculator's own full-price cell are outside the rule. (Corrected during execution: the original absolute phrasing enforced nothing and let the hero ship a bare monthly figure.)
- **Pages never import from `src/content/` or `src/messages/` directly** — only via `src/lib/data/` and the i18n hook.
- **No unapproved legal claim or testimonial renders as fact in a production build.**
- **The EMI calculator always displays total cost and premium alongside every monthly figure.**
- **EMI placeholder parameters:** `schemeFee = 0.18`, `eligibilityThreshold = 0.6`, `tenures = [12, 18, 24]`
- **Hindi catalog covers five pages:** Home, Model Listing, Model Detail, EMI How It Works, EMI Calculator. Legal copy stays English-only.
- **Mobile-first: design at 360px and expand up.** Sticky mobile CTA bar on model pages.
- **WCAG 2.1 AA minimum.** Contrast, keyboard navigation, form labels, alt text.
- **Performance budget:** LCP under 2.5s on 4G, model pages under 1.5MB.
- **All monetary figures use tabular numerals.**
- **No photography.** Photo slots are labelled frames carrying aspect ratio and intended subject.
- **Typography:** Anek Latin (headings) · Inter (body/UI) · Anek Devanagari (Hindi locale).
- **All placeholder commercial data carries an explicit `PLACEHOLDER` flag.**

## File Structure

| Path | Responsibility |
|---|---|
| `tokens/color.json` · `type.json` · `space.json` | Design token source of truth |
| `scripts/build-tokens.ts` | Emits CSS custom properties, Figma variables, app JSON |
| `scripts/lib/derive.ts` | Tint/shade derivation and WCAG contrast maths |
| `src/app/[locale]/layout.tsx` | Locale shell, fonts, header, footer |
| `src/app/[locale]/page.tsx` | Home |
| `src/app/[locale]/vehicles/page.tsx` | Model listing |
| `src/app/[locale]/vehicles/[slug]/page.tsx` | Model detail |
| `src/app/[locale]/emi/page.tsx` | EMI How It Works |
| `src/app/[locale]/emi/calculator/page.tsx` | EMI calculator |
| `src/middleware.ts` | Locale negotiation and attribution capture |
| `src/components/ui/*` | Primitives: Button, ChargeState, PriceDual, Field, Accordion, PhotoFrame |
| `src/components/blocks/*` | Composed sections: Hero, ModelCard, EmiStrip, SpecTable, Wordmark |
| `src/lib/data/*` | Repositories returning domain types |
| `src/lib/emi/*` | Scheme maths, pure |
| `src/lib/leads/*` | Validation, rate limit, attribution, sink adapter |
| `src/lib/legal/*` | Claim and testimonial gating |
| `src/content/*` | PLACEHOLDER-flagged catalog, dealers, FAQs, testimonials |
| `src/messages/en.json` · `hi.json` | Message catalogs |

---

### Task 1: Scaffold the application

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `src/app/layout.tsx`, `src/lib/smoke.ts`
- Test: `src/lib/smoke.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: a working `pnpm dev`, `pnpm test`, `pnpm build`; TypeScript strict mode; path alias `@/*` → `src/*`

- [ ] **Step 1: Scaffold with create-next-app**

```bash
cd /Users/vivekanandchoudhari/adhara-energy
pnpm create next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --eslint --no-turbopack --yes
```

If the directory-not-empty prompt appears, accept keeping existing files — `docs/` and `.git` must survive.

- [ ] **Step 2: Record the installed versions**

```bash
node -e "const p=require('./package.json');console.log('next',p.dependencies.next,'| react',p.dependencies.react,'| tailwind',p.devDependencies.tailwindcss)"
```

Paste the output into this plan's Tech Stack line. Later tasks assume Tailwind v4 CSS-first config (`@theme`); if v3 was installed, use `tailwind.config.ts` instead and note it here.

- [ ] **Step 3: Install test and runtime dependencies**

```bash
pnpm add zod next-intl
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event tsx
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/react'
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"tokens:build": "tsx scripts/build-tokens.ts"
```

- [ ] **Step 5: Write the failing smoke test**

Create `src/lib/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projectName } from './smoke'

describe('smoke', () => {
  it('confirms the toolchain runs TypeScript from src', () => {
    expect(projectName()).toBe('Adhara Energy')
  })
})
```

- [ ] **Step 6: Run it and confirm it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./smoke`

- [ ] **Step 7: Minimal implementation**

Create `src/lib/smoke.ts`:

```ts
export function projectName(): string {
  return 'Adhara Energy'
}
```

- [ ] **Step 8: Confirm green, then confirm the app builds**

```bash
pnpm test && pnpm build
```

Expected: 1 test passing, build succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest"
```

---

### Task 2: Token source of truth and build pipeline

**Files:**
- Create: `tokens/color.json`, `tokens/type.json`, `tokens/space.json`, `scripts/lib/derive.ts`, `scripts/build-tokens.ts`
- Test: `scripts/lib/derive.test.ts`, `scripts/build-tokens.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `contrastRatio(hexA: string, hexB: string): number`
  - `shift(hex: string, amount: number): string` — positive lightens, negative darkens, amount in `-1..1`
  - `buildTokens(): { css: string; figma: Record<string, unknown>; app: Record<string, string> }`
  - Emitted files `src/styles/tokens.css`, `exports/figma-variables.json`, `exports/app-tokens.json`
  - CSS variable naming: `--color-forest`, `--color-forest-hover`, `--color-turmeric`, `--color-charge-full`, `--space-4`, `--radius-md`, `--font-heading`

- [ ] **Step 1: Author the token sources**

Create `tokens/color.json`:

```json
{
  "$comment": "Source of truth. Hexes verbatim from proposal Section 2.3 — do not reinterpret.",
  "base": {
    "forest": { "value": "#0E3B2E", "role": "Headers, nav, secondary buttons, hero grounds" },
    "turmeric": { "value": "#E8A020", "role": "One primary CTA per screen; never body text" },
    "ink": { "value": "#14201B", "role": "All body copy" },
    "mist": { "value": "#F4F6F1", "role": "Page background; white reserved for cards" },
    "surface": { "value": "#FFFFFF", "role": "Cards only" }
  },
  "charge": {
    "full": { "value": "#2F9E6B", "role": "On-track" },
    "low": { "value": "#E8A020", "role": "Due soon" },
    "out": { "value": "#C6453C", "role": "Lapsed or failed" }
  },
  "derive": {
    "hover": -0.08,
    "active": -0.14,
    "border": 0.55,
    "disabled": 0.72
  }
}
```

Create `tokens/type.json`:

```json
{
  "families": {
    "heading": "'Anek Latin', system-ui, sans-serif",
    "body": "'Inter', system-ui, sans-serif",
    "devanagari": "'Anek Devanagari', system-ui, sans-serif"
  },
  "scale": {
    "xs": "0.8125rem", "sm": "0.9375rem", "base": "1rem", "lg": "1.125rem",
    "xl": "1.375rem", "2xl": "1.75rem", "3xl": "2.25rem", "4xl": "3rem", "5xl": "3.75rem"
  },
  "weight": { "regular": "400", "medium": "500", "semibold": "600", "bold": "700" },
  "leading": { "tight": "1.1", "snug": "1.3", "normal": "1.55" }
}
```

Create `tokens/space.json`:

```json
{
  "space": {
    "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "5": "1.5rem",
    "6": "2rem", "7": "3rem", "8": "4rem", "9": "6rem", "10": "8rem"
  },
  "radius": { "sm": "0.25rem", "md": "0.5rem", "lg": "0.875rem", "full": "999px" }
}
```

- [ ] **Step 2: Write the failing derivation tests**

Create `scripts/lib/derive.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { contrastRatio, shift } from './derive'

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1)
  })

  it('returns 1 for identical colours', () => {
    expect(contrastRatio('#0E3B2E', '#0E3B2E')).toBeCloseTo(1, 2)
  })

  it('accepts hexes in either order', () => {
    expect(contrastRatio('#14201B', '#F4F6F1')).toBeCloseTo(
      contrastRatio('#F4F6F1', '#14201B'), 4,
    )
  })
})

describe('shift', () => {
  it('darkens on a negative amount', () => {
    expect(contrastRatio(shift('#E8A020', -0.2), '#FFFFFF')).toBeGreaterThan(
      contrastRatio('#E8A020', '#FFFFFF'),
    )
  })

  it('lightens on a positive amount', () => {
    expect(shift('#0E3B2E', 0.5)).not.toBe('#0E3B2E')
    expect(contrastRatio(shift('#0E3B2E', 0.5), '#FFFFFF')).toBeLessThan(
      contrastRatio('#0E3B2E', '#FFFFFF'),
    )
  })

  it('clamps rather than wrapping at the extremes', () => {
    expect(shift('#FFFFFF', 0.9)).toBe('#ffffff')
    expect(shift('#000000', -0.9)).toBe('#000000')
  })

  it('returns a six-digit lowercase hex', () => {
    expect(shift('#E8A020', -0.08)).toMatch(/^#[0-9a-f]{6}$/)
  })
})
```

- [ ] **Step 3: Run and confirm failure**

Run: `pnpm test scripts/lib/derive.test.ts`
Expected: FAIL — cannot resolve `./derive`

- [ ] **Step 4: Implement the derivation maths**

Create `scripts/lib/derive.ts`:

```ts
type Rgb = { r: number; g: number; b: number }

function parse(hex: string): Rgb {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function toHex({ r, g, b }: Rgb): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = parse(hex)
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA)
  const b = relativeLuminance(hexB)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

/** Mixes toward white on a positive amount, toward black on a negative one. */
export function shift(hex: string, amount: number): string {
  const { r, g, b } = parse(hex)
  const target = amount >= 0 ? 255 : 0
  const t = Math.abs(amount)
  return toHex({
    r: r + (target - r) * t,
    g: g + (target - g) * t,
    b: b + (target - b) * t,
  })
}
```

- [ ] **Step 5: Confirm green**

Run: `pnpm test scripts/lib/derive.test.ts`
Expected: PASS — 5 tests

- [ ] **Step 6: Write the failing build-tokens test**

Create `scripts/build-tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildTokens } from './build-tokens'
import { contrastRatio } from './lib/derive'

const { css, figma, app } = buildTokens()

describe('buildTokens css output', () => {
  it('emits the base palette verbatim', () => {
    expect(css).toContain('--color-forest: #0E3B2E;')
    expect(css).toContain('--color-turmeric: #E8A020;')
    expect(css).toContain('--color-ink: #14201B;')
    expect(css).toContain('--color-mist: #F4F6F1;')
  })

  it('emits all three charge states', () => {
    expect(css).toContain('--color-charge-full: #2F9E6B;')
    expect(css).toContain('--color-charge-low: #E8A020;')
    expect(css).toContain('--color-charge-out: #C6453C;')
  })

  it('emits derived interaction variants rather than hand-authored ones', () => {
    expect(css).toContain('--color-forest-hover:')
    expect(css).toContain('--color-turmeric-hover:')
    expect(css).toContain('--color-turmeric-disabled:')
  })

  it('emits spacing, radius and font families', () => {
    expect(css).toContain('--space-4: 1rem;')
    expect(css).toContain('--radius-md: 0.5rem;')
    expect(css).toContain('--font-heading:')
  })
})

describe('accessibility assertions', () => {
  it('keeps body ink on the page surface above AA for normal text', () => {
    expect(contrastRatio('#14201B', '#F4F6F1')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps white on forest above AA', () => {
    expect(contrastRatio('#FFFFFF', '#0E3B2E')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps ink on turmeric above AA, which is why CTA text is ink and not white', () => {
    expect(contrastRatio('#14201B', '#E8A020')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps every charge state legible as ink-on-tint at large-text AA', () => {
    for (const hex of ['#2F9E6B', '#E8A020', '#C6453C']) {
      expect(contrastRatio('#14201B', hex)).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('export artefacts', () => {
  it('produces a flat string map for the customer app', () => {
    expect(app['color.forest']).toBe('#0E3B2E')
    expect(app['color.charge.out']).toBe('#C6453C')
    expect(Object.values(app).every((v) => typeof v === 'string')).toBe(true)
  })

  it('produces Figma variable collections', () => {
    expect(figma).toHaveProperty('collections')
  })
})
```

- [ ] **Step 7: Run and confirm failure**

Run: `pnpm test scripts/build-tokens.test.ts`
Expected: FAIL — cannot resolve `./build-tokens`

- [ ] **Step 8: Implement the build script**

Create `scripts/build-tokens.ts`. It must export `buildTokens()` for the test and write files only when executed directly, so importing it in a test does no I/O:

```ts
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import color from '../tokens/color.json'
import type_ from '../tokens/type.json'
import space from '../tokens/space.json'
import { contrastRatio, shift } from './lib/derive'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function buildTokens() {
  const app: Record<string, string> = {}
  const lines: string[] = []

  for (const [name, def] of Object.entries(color.base)) {
    lines.push(`  --color-${name}: ${def.value};`)
    app[`color.${name}`] = def.value
    for (const [variant, amount] of Object.entries(color.derive)) {
      lines.push(`  --color-${name}-${variant}: ${shift(def.value, amount)};`)
    }
  }

  for (const [state, def] of Object.entries(color.charge)) {
    lines.push(`  --color-charge-${state}: ${def.value};`)
    lines.push(`  --color-charge-${state}-border: ${shift(def.value, color.derive.border)};`)
    app[`color.charge.${state}`] = def.value
  }

  for (const [key, value] of Object.entries(type_.families)) {
    lines.push(`  --font-${key}: ${value};`)
    app[`font.${key}`] = value
  }
  for (const [key, value] of Object.entries(type_.scale)) {
    lines.push(`  --text-${key}: ${value};`)
    app[`text.${key}`] = value
  }
  for (const [key, value] of Object.entries(type_.weight)) {
    lines.push(`  --weight-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(type_.leading)) {
    lines.push(`  --leading-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(space.space)) {
    lines.push(`  --space-${key}: ${value};`)
    app[`space.${key}`] = value
  }
  for (const [key, value] of Object.entries(space.radius)) {
    lines.push(`  --radius-${key}: ${value};`)
    app[`radius.${key}`] = value
  }

  const css = [
    '/* GENERATED by scripts/build-tokens.ts — do not edit. Edit tokens/*.json. */',
    ':root {',
    ...lines,
    '}',
    '',
  ].join('\n')

  const figma = {
    collections: [
      {
        name: 'Adhara Colour',
        modes: ['Light'],
        variables: Object.entries(app)
          .filter(([k]) => k.startsWith('color.'))
          .map(([k, v]) => ({ name: k, type: 'COLOR', valuesByMode: { Light: v } })),
      },
      {
        name: 'Adhara Space',
        modes: ['Default'],
        variables: Object.entries(app)
          .filter(([k]) => k.startsWith('space.') || k.startsWith('radius.'))
          .map(([k, v]) => ({ name: k, type: 'FLOAT', valuesByMode: { Default: v } })),
      },
    ],
  }

  return { css, figma, app }
}

/** Fails the build rather than shipping an inaccessible palette. */
function assertContrast() {
  const checks: [string, string, number, string][] = [
    ['#14201B', '#F4F6F1', 4.5, 'ink on mist'],
    ['#FFFFFF', '#0E3B2E', 4.5, 'white on forest'],
    ['#14201B', '#E8A020', 4.5, 'ink on turmeric'],
  ]
  for (const [a, b, min, label] of checks) {
    const ratio = contrastRatio(a, b)
    if (ratio < min) {
      throw new Error(`Contrast failure: ${label} is ${ratio.toFixed(2)}:1, needs ${min}:1`)
    }
  }
}

function main() {
  assertContrast()
  const { css, figma, app } = buildTokens()
  mkdirSync(resolve(root, 'src/styles'), { recursive: true })
  mkdirSync(resolve(root, 'exports'), { recursive: true })
  writeFileSync(resolve(root, 'src/styles/tokens.css'), css)
  writeFileSync(resolve(root, 'exports/figma-variables.json'), JSON.stringify(figma, null, 2))
  writeFileSync(resolve(root, 'exports/app-tokens.json'), JSON.stringify(app, null, 2))
  console.log('tokens: wrote tokens.css, figma-variables.json, app-tokens.json')
}

if (process.argv[1] && process.argv[1].includes('build-tokens')) main()
```

Enable JSON imports in `tsconfig.json` under `compilerOptions`: `"resolveJsonModule": true`.

- [ ] **Step 9: Confirm green and generate the artefacts**

```bash
pnpm test scripts/
pnpm tokens:build
ls -1 src/styles/tokens.css exports/
```

Expected: all tests pass; three files exist.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: token source of truth with CSS, Figma and app exports"
```

---

### Task 3: Tailwind theme, fonts and the page shell

**Files:**
- Create: `src/app/globals.css` (replace scaffold content), `src/lib/fonts.ts`
- Modify: `src/app/layout.tsx`
- Test: `src/lib/fonts.test.ts`

**Interfaces:**
- Consumes: `src/styles/tokens.css` from Task 2
- Produces: Tailwind utilities `bg-forest`, `text-ink`, `bg-mist`, `bg-turmeric`, `font-heading`, `font-body`, `rounded-md`; `fontVariableNames(locale)` in `src/lib/fonts.ts` (pure) and `fontClassNames(locale)` in `src/lib/fonts.loaders.ts` (next/font)

> **Deviation from plan as written, applied during execution:** the emitted CSS custom
> properties are namespaced `--adhara-*` — `@theme inline { --color-forest: var(--color-forest) }`
> is self-referential and resolves to nothing. And `next/font/google` is a build-time SWC
> transform that throws under Vitest, so the pure locale policy lives in `fonts.ts` and the
> loaders in `fonts.loaders.ts`.

- [ ] **Step 1: Wire tokens into the Tailwind theme**

Replace `src/app/globals.css`:

```css
@import 'tailwindcss';
@import '../styles/tokens.css';

@theme inline {
  --color-forest: var(--color-forest);
  --color-forest-hover: var(--color-forest-hover);
  --color-turmeric: var(--color-turmeric);
  --color-turmeric-hover: var(--color-turmeric-hover);
  --color-turmeric-disabled: var(--color-turmeric-disabled);
  --color-ink: var(--color-ink);
  --color-mist: var(--color-mist);
  --color-surface: var(--color-surface);
  --color-charge-full: var(--color-charge-full);
  --color-charge-low: var(--color-charge-low);
  --color-charge-out: var(--color-charge-out);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
}

body {
  background: var(--color-mist);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: var(--leading-normal);
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  line-height: var(--leading-tight);
}

/* Every rupee figure aligns in a column. */
.tnum {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}

:where(a, button, input, select, textarea):focus-visible {
  outline: 3px solid var(--color-turmeric);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Write the failing font test**

Create `src/lib/fonts.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { fontVariableNames } from './fonts'

describe('fontVariableNames', () => {
  it('loads Anek Latin and Inter for English', () => {
    const names = fontVariableNames('en')
    expect(names).toContain('--font-anek-latin')
    expect(names).toContain('--font-inter')
  })

  it('adds Anek Devanagari for Hindi so the script is matched, not substituted', () => {
    expect(fontVariableNames('hi')).toContain('--font-anek-devanagari')
  })

  it('does not ship the Devanagari face to English readers', () => {
    expect(fontVariableNames('en')).not.toContain('--font-anek-devanagari')
  })
})
```

- [ ] **Step 3: Run and confirm failure**

Run: `pnpm test src/lib/fonts.test.ts`
Expected: FAIL — cannot resolve `./fonts`

- [ ] **Step 4: Implement**

Create `src/lib/fonts.ts`:

```ts
import { Anek_Devanagari, Anek_Latin, Inter } from 'next/font/google'

export const anekLatin = Anek_Latin({
  subsets: ['latin'],
  variable: '--font-anek-latin',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const anekDevanagari = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: '--font-anek-devanagari',
  display: 'swap',
})

/** Which font CSS variables a locale needs. Keeps the Devanagari face off English pages. */
export function fontVariableNames(locale: string): string[] {
  const base = ['--font-anek-latin', '--font-inter']
  return locale === 'hi' ? [...base, '--font-anek-devanagari'] : base
}

export function fontClassNames(locale: string): string {
  const base = [anekLatin.variable, inter.variable]
  if (locale === 'hi') base.push(anekDevanagari.variable)
  return base.join(' ')
}
```

- [ ] **Step 5: Confirm green**

Run: `pnpm test src/lib/fonts.test.ts`
Expected: PASS — 3 tests

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: wire design tokens into Tailwind theme and load type families"
```

---

### Task 4: i18n architecture

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `src/messages/en.json`, `src/messages/hi.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Delete: `src/app/page.tsx`, `src/app/layout.tsx` (replaced by the locale segment)
- Test: `src/i18n/routing.test.ts`, `src/messages/messages.test.ts`

**Interfaces:**
- Consumes: `fontClassNames` from Task 3
- Produces: `routing` (next-intl config, locales `['en','hi']`, default `en`); message keys namespaced per page — `home.*`, `vehicles.*`, `model.*`, `emi.*`, `common.*`

- [ ] **Step 1: Write the failing tests**

Create `src/i18n/routing.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { routing } from './routing'

describe('routing', () => {
  it('ships English and Hindi only, per the unconfirmed launch language set', () => {
    expect(routing.locales).toEqual(['en', 'hi'])
  })

  it('defaults to English', () => {
    expect(routing.defaultLocale).toBe('en')
  })
})
```

Create `src/messages/messages.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import en from './en.json'
import hi from './hi.json'

function leafKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([k, v]) =>
    leafKeys(v, prefix ? `${prefix}.${k}` : k),
  )
}

describe('message catalogs', () => {
  it('gives English a key for every namespace the five core pages need', () => {
    const keys = leafKeys(en)
    for (const ns of ['common', 'home', 'vehicles', 'model', 'emi']) {
      expect(keys.some((k) => k.startsWith(`${ns}.`))).toBe(true)
    }
  })

  it('never leaves a Hindi value empty — an empty string defeats the fallback', () => {
    const empties = leafKeys(hi).filter((k) => {
      const value = k.split('.').reduce<any>((acc, part) => acc?.[part], hi)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(empties).toEqual([])
  })

  it('only contains Hindi keys that exist in English', () => {
    const enKeys = new Set(leafKeys(en))
    const orphans = leafKeys(hi).filter((k) => !enKeys.has(k))
    expect(orphans).toEqual([])
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/i18n src/messages`
Expected: FAIL — modules not found

- [ ] **Step 3: Implement routing and request config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'hi'],
  defaultLocale: 'en',
})

export type Locale = (typeof routing.locales)[number]
```

Create `src/i18n/request.ts`:

```ts
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  // Hindi is a partial catalog by design. Merging over English guarantees a
  // missing key renders real copy instead of a raw key.
  const en = (await import('../messages/en.json')).default
  const messages =
    locale === 'en' ? en : { ...en, ...(await import('../messages/hi.json')).default }

  return {
    locale,
    messages,
    onError(error) {
      if (process.env.NODE_ENV !== 'production') console.warn('[i18n]', error.message)
    },
  }
})
```

Create `src/middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
```

Add the plugin in `next.config.ts`:

```ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl({})
```

- [ ] **Step 4: Author the English catalog with the copy the core pages need**

Create `src/messages/en.json`. Seed it with the real strings — no lorem:

```json
{
  "common": {
    "brand": "Adhara Energy",
    "tagline": "Ride on solid ground.",
    "nav": {
      "vehicles": "Vehicles",
      "emi": "EMI Scheme",
      "calculator": "Calculator",
      "testRide": "Book a Test Ride",
      "dealers": "Find a Dealer",
      "support": "Support"
    },
    "cta": { "bookNow": "Book Now", "viewModel": "View details", "calculate": "Calculate my EMI" },
    "price": { "full": "Full price", "monthly": "or {amount}/month", "perMonth": "/month" },
    "skipToContent": "Skip to content"
  },
  "home": {
    "heroTitle": "The electric ride a bank can't say no to.",
    "heroBody": "Adhara means foundation. Pay monthly, no bank, no credit check — and ride home once you're eligible.",
    "emiStripTitle": "How the Adhara scheme works",
    "steps": {
      "enroll": "Enroll",
      "enrollBody": "Pick a model and a tenure. OTP is all the identity we need.",
      "pay": "Pay monthly",
      "payBody": "A fixed amount every month. No bank, no credit check, no hidden charge.",
      "alert": "Get your eligibility alert",
      "alertBody": "We tell you the moment your vehicle is unlocked for delivery.",
      "ride": "Ride home",
      "rideBody": "Home delivery, or collect from your nearest dealer."
    },
    "modelsTitle": "Choose your ride",
    "trustTitle": "What we put in writing"
  },
  "vehicles": {
    "title": "Vehicles",
    "intro": "Low-speed electric two-wheelers built for Indian streets.",
    "filters": { "heading": "Filter", "price": "Price", "range": "Range", "topSpeed": "Top speed", "battery": "Battery", "clear": "Clear filters", "results": "{count, plural, =0 {No models match} one {1 model} other {# models}}" }
  },
  "model": {
    "specsTitle": "Specifications",
    "colourTitle": "Colour",
    "faqTitle": "Common questions",
    "serviceability": {
      "heading": "Check delivery at your pincode",
      "label": "Pincode",
      "check": "Check",
      "yes": "We deliver to {pincode}. Estimated delivery in {days} days.",
      "no": "We don't deliver to {pincode} yet. Leave your number and we'll tell you when we do.",
      "failed": "We couldn't check that just now. Try again — it's us, not your pincode.",
      "invalid": "Enter a six-digit Indian pincode."
    },
    "cta": { "buy": "Buy online", "emi": "Enroll in EMI", "testRide": "Book a test ride" }
  },
  "emi": {
    "title": "The Adhara EMI scheme",
    "subtitle": "No bank. No credit check. No surprises.",
    "whyNoBank": "Why there's no bank involved",
    "whyNoBankBody": "A bank loan needs a credit history that most first-time riders don't have. Adhara carries that risk instead: you pay us monthly, and your vehicle is released for delivery once you cross the eligibility mark.",
    "calculator": {
      "title": "EMI calculator",
      "model": "Model",
      "tenure": "Tenure",
      "months": "{count} months",
      "monthly": "Monthly payment",
      "total": "Total you'll pay",
      "premium": "Premium over paying in full",
      "eligibility": "Delivery unlocked after",
      "eligibilityValue": "{count} monthly payments",
      "transparencyNote": "This is what the scheme costs compared with paying the full price today. We show it because you should be able to choose with your eyes open.",
      "startEnrollment": "Start my enrollment"
    }
  }
}
```

- [ ] **Step 5: Author the Hindi catalog for the five core pages**

Create `src/messages/hi.json`. This is machine-authored Hindi requiring native review before publication — mark it so:

```json
{
  "$review": "MACHINE-AUTHORED. Requires native review before publication. Legal and scheme-terms copy stays English-only.",
  "common": {
    "brand": "अधारा एनर्जी",
    "tagline": "मजबूत नींव पर चलें।",
    "nav": {
      "vehicles": "वाहन",
      "emi": "ईएमआई योजना",
      "calculator": "कैलकुलेटर",
      "testRide": "टेस्ट राइड बुक करें",
      "dealers": "डीलर खोजें",
      "support": "सहायता"
    },
    "cta": { "bookNow": "अभी बुक करें", "viewModel": "विवरण देखें", "calculate": "मेरी ईएमआई निकालें" },
    "price": { "full": "पूरी कीमत", "monthly": "या {amount}/महीना", "perMonth": "/महीना" },
    "skipToContent": "मुख्य सामग्री पर जाएँ"
  },
  "home": {
    "heroTitle": "वह इलेक्ट्रिक सवारी, जिसके लिए बैंक की मंज़ूरी नहीं चाहिए।",
    "heroBody": "अधारा का अर्थ है नींव। हर महीने भुगतान करें — कोई बैंक नहीं, कोई क्रेडिट जाँच नहीं।",
    "emiStripTitle": "अधारा योजना कैसे काम करती है",
    "modelsTitle": "अपनी सवारी चुनें",
    "trustTitle": "जो हम लिखकर देते हैं"
  },
  "vehicles": { "title": "वाहन", "intro": "भारतीय सड़कों के लिए बनी कम-गति इलेक्ट्रिक दोपहिया।" },
  "model": { "specsTitle": "विशेषताएँ", "colourTitle": "रंग", "faqTitle": "आम सवाल" },
  "emi": { "title": "अधारा ईएमआई योजना", "subtitle": "कोई बैंक नहीं। कोई क्रेडिट जाँच नहीं।" }
}
```

Note: the merge in `request.ts` is shallow, so a partially-translated namespace would drop English siblings. Deepen the merge:

```ts
function deepMerge(base: any, over: any): any {
  const out = { ...base }
  for (const [k, v] of Object.entries(over)) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? deepMerge(base?.[k] ?? {}, v) : v
  }
  return out
}
```

Use `deepMerge(en, hi)` in place of the spread.

- [ ] **Step 6: Move the app under the locale segment**

Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { fontClassNames } from '@/lib/fonts'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return { title: { default: t('brand'), template: `%s · ${t('brand')}` }, description: t('tagline') }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={fontClassNames(locale)}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
```

Delete `src/app/layout.tsx` and `src/app/page.tsx`. Create a temporary `src/app/[locale]/page.tsx` that renders the hero title from the catalog so the route is provably live:

```tsx
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')
  return <h1>{t('heroTitle')}</h1>
}
```

- [ ] **Step 7: Confirm green and both locales render**

```bash
pnpm test src/i18n src/messages && pnpm build
```

Then `pnpm dev` and confirm `/en` and `/hi` both render their own hero title, and `/` redirects to `/en`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: locale-segmented routing with English and Hindi catalogs"
```

---

### Task 5: UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/cta-guard.ts`, `src/components/ui/ChargeState.tsx`, `src/components/ui/PriceDual.tsx`, `src/components/ui/Field.tsx`, `src/components/ui/Accordion.tsx`, `src/components/ui/PhotoFrame.tsx`, `src/lib/format.ts`
- Test: `src/components/ui/Button.test.tsx`, `src/components/ui/PriceDual.test.tsx`, `src/components/ui/ChargeState.test.tsx`, `src/lib/format.test.ts`

**Interfaces:**
- Consumes: Tailwind theme from Task 3
- Produces:
  - `<Button variant="primary" | "secondary" | "ghost" size="md" | "lg" asChild? href?>`
  - `<ChargeState status="full" | "low" | "out" label={string} />`
  - `<PriceDual full={number} monthly={number} tenure={number} />`
  - `<Field label id error? hint?>` wrapping an input
  - `<Accordion items={{ id, question, answer }[]} />`
  - `<PhotoFrame ratio="16/9" subject="Assembly line, Pune factory" />`
  - `formatRupees(paise: number): string` — takes whole rupees, returns `₹54,990`
  - `resetCtaGuard()` for tests

- [ ] **Step 1: Write the failing formatter test**

Create `src/lib/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatRupees } from './format'

describe('formatRupees', () => {
  it('groups in the Indian system, not thousands', () => {
    expect(formatRupees(154990)).toBe('₹1,54,990')
  })

  it('formats a five-figure price', () => {
    expect(formatRupees(54990)).toBe('₹54,990')
  })

  it('shows no decimals — paise never appear in a price', () => {
    expect(formatRupees(54990.4)).toBe('₹54,990')
  })

  it('handles zero', () => {
    expect(formatRupees(0)).toBe('₹0')
  })
})
```

- [ ] **Step 2: Run, confirm failure, implement**

Run: `pnpm test src/lib/format.test.ts` → FAIL.

Create `src/lib/format.ts`:

```ts
const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Indian digit grouping. Pair with the .tnum class so columns of these align. */
export function formatRupees(amount: number): string {
  return rupees.format(Math.trunc(amount))
}
```

Run again → PASS.

- [ ] **Step 3: Write the failing Button and CTA-guard test**

Create `src/components/ui/Button.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { resetCtaGuard } from './cta-guard'

afterEach(() => {
  cleanup()
  resetCtaGuard()
})

describe('Button', () => {
  it('renders a real button element with its label', () => {
    render(<Button variant="primary">Book Now</Button>)
    expect(screen.getByRole('button', { name: 'Book Now' })).toBeDefined()
  })

  it('renders an anchor when given an href, so navigation stays navigable', () => {
    render(<Button variant="primary" href="/en/emi">Enroll</Button>)
    expect(screen.getByRole('link', { name: 'Enroll' }).getAttribute('href')).toBe('/en/emi')
  })

  it('puts ink on turmeric for the primary variant, never white', () => {
    render(<Button variant="primary">Book Now</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).toContain('bg-turmeric')
    expect(cls).toContain('text-ink')
  })
})

describe('one-primary-CTA guard', () => {
  beforeEach(() => resetCtaGuard())

  it('stays silent for a single primary button', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Button variant="primary">Book Now</Button>)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('warns when a second primary CTA mounts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <>
        <Button variant="primary">Book Now</Button>
        <Button variant="primary">Enroll</Button>
      </>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('one primary CTA'))
    warn.mockRestore()
  })

  it('does not count secondary or ghost buttons', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <>
        <Button variant="primary">Book Now</Button>
        <Button variant="secondary">Test ride</Button>
        <Button variant="ghost">Compare</Button>
      </>,
    )
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})
```

- [ ] **Step 4: Run and confirm failure**

Run: `pnpm test src/components/ui/Button.test.tsx`
Expected: FAIL — cannot resolve `./Button`

- [ ] **Step 5: Implement the guard and the Button**

Create `src/components/ui/cta-guard.ts`:

```ts
let mounted = 0

/** Section 7 allows one primary CTA per viewport. This makes the rule outlive the meeting. */
export function registerPrimaryCta(label: string): () => void {
  if (process.env.NODE_ENV !== 'production') {
    mounted += 1
    if (mounted > 1) {
      console.warn(
        `[adhara] Section 7 allows one primary CTA per page — "${label}" is number ${mounted}. ` +
          'Demote the others to variant="secondary".',
      )
    }
    return () => {
      mounted = Math.max(0, mounted - 1)
    }
  }
  return () => {}
}

export function resetCtaGuard(): void {
  mounted = 0
}
```

Create `src/components/ui/Button.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { registerPrimaryCta } from './cta-guard'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-turmeric text-ink hover:bg-turmeric-hover',
  secondary: 'bg-forest text-white hover:bg-forest-hover',
  ghost: 'bg-transparent text-forest underline underline-offset-4 hover:text-ink',
}

const sizes = { md: 'text-base px-5 py-2.5', lg: 'text-lg px-7 py-3.5' } as const

export function Button({
  variant = 'secondary',
  size = 'md',
  href,
  children,
  className = '',
  ...rest
}: {
  variant?: Variant
  size?: keyof typeof sizes
  href?: string
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isPrimary = variant === 'primary'

  useEffect(() => {
    if (!isPrimary) return
    return registerPrimaryCta(typeof children === 'string' ? children : 'unnamed')
  }, [isPrimary, children])

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
```

- [ ] **Step 6: Confirm green**

Run: `pnpm test src/components/ui/Button.test.tsx`
Expected: PASS — 6 tests

- [ ] **Step 7: Write the failing PriceDual test — the constraint that matters most**

Create `src/components/ui/PriceDual.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PriceDual } from './PriceDual'

afterEach(cleanup)

describe('PriceDual', () => {
  it('renders the full price and the monthly figure together, always', () => {
    render(<PriceDual full={54990} monthly={5407} tenure={12} />)
    expect(screen.getByText('₹54,990')).toBeDefined()
    expect(screen.getByText(/₹5,407/)).toBeDefined()
  })

  it('states the tenure, so a monthly figure is never context-free', () => {
    render(<PriceDual full={54990} monthly={5407} tenure={12} />)
    expect(screen.getByText(/12 months/)).toBeDefined()
  })

  it('applies tabular numerals so columns of prices align', () => {
    const { container } = render(<PriceDual full={54990} monthly={5407} tenure={12} />)
    expect(container.querySelector('.tnum')).not.toBeNull()
  })
})
```

- [ ] **Step 8: Run, confirm failure, implement**

Run → FAIL. Create `src/components/ui/PriceDual.tsx`:

```tsx
import { formatRupees } from '@/lib/format'

/**
 * The only component permitted to render a price.
 * Section 5.2 requires the full price and the monthly EMI figure side by side, always —
 * a single renderer is what makes that structurally true instead of a habit.
 */
export function PriceDual({
  full,
  monthly,
  tenure,
  size = 'md',
}: {
  full: number
  monthly: number
  tenure: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const fullSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }[size]
  return (
    <div className="tnum flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`${fullSize} font-semibold text-ink`}>{formatRupees(full)}</span>
      <span className="text-sm text-ink/70">
        or <strong className="font-semibold text-forest">{formatRupees(monthly)}</strong>/month
        {' · '}
        {tenure} months
      </span>
    </div>
  )
}
```

Run → PASS.

- [ ] **Step 9: Write the failing ChargeState test**

Create `src/components/ui/ChargeState.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ChargeState } from './ChargeState'

afterEach(cleanup)

describe('ChargeState', () => {
  it('renders its label as text, not colour alone', () => {
    render(<ChargeState status="out" label="Payment failed" />)
    expect(screen.getByText('Payment failed')).toBeDefined()
  })

  it('maps each status to its charge token', () => {
    const { container: full } = render(<ChargeState status="full" label="On track" />)
    expect(full.firstElementChild?.className).toContain('charge-full')
    cleanup()
    const { container: low } = render(<ChargeState status="low" label="Due soon" />)
    expect(low.firstElementChild?.className).toContain('charge-low')
  })

  it('never conveys state by colour alone — WCAG 1.4.1', () => {
    render(<ChargeState status="low" label="Due soon" />)
    expect(screen.getByText('Due soon').textContent).toBeTruthy()
  })
})
```

- [ ] **Step 10: Run, confirm failure, implement**

Run → FAIL. Create `src/components/ui/ChargeState.tsx`:

```tsx
type Status = 'full' | 'low' | 'out'

/**
 * The battery-state metaphor from Section 2.3, as one component.
 * Reused for EMI status, order status, stock and serviceability so the metaphor
 * stays consistent under maintenance. Not a CTA — the accent guard ignores it.
 */
const styles: Record<Status, string> = {
  full: 'bg-charge-full/12 text-charge-full border-charge-full/35',
  low: 'bg-charge-low/12 text-ink border-charge-low/45',
  out: 'bg-charge-out/12 text-charge-out border-charge-out/35',
}

export function ChargeState({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {label}
    </span>
  )
}
```

Run → PASS.

- [ ] **Step 11: Implement the remaining primitives**

Create `src/components/ui/Field.tsx`:

```tsx
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink/65">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-charge-out">
          {error}
        </p>
      )}
      <span hidden data-described-by={describedBy} />
    </div>
  )
}
```

Create `src/components/ui/Accordion.tsx` using native `<details>` so it is keyboard-accessible without JavaScript:

```tsx
export function Accordion({
  items,
}: {
  items: { id: string; question: string; answer: string }[]
}) {
  return (
    <div className="divide-y divide-forest/12 rounded-lg border border-forest/12 bg-surface">
      {items.map((item) => (
        <details key={item.id} className="group px-5 py-4">
          <summary className="cursor-pointer list-none font-medium text-ink marker:hidden">
            {item.question}
          </summary>
          <p className="mt-3 text-ink/80">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
```

Create `src/components/ui/PhotoFrame.tsx` — the honest stand-in for photography that does not exist:

```tsx
/**
 * Section 7 asks for real factory and street photography and rules out generic EV stock.
 * Until those assets exist, a photo slot states its own aspect ratio and intended subject,
 * so the real image drops in without reflow and nobody mistakes the gap for a design.
 */
export function PhotoFrame({
  ratio = '16/9',
  subject,
  className = '',
}: {
  ratio?: string
  subject: string
  className?: string
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Photography placeholder: ${subject}`}
      className={`relative overflow-hidden rounded-lg border border-dashed border-forest/25 bg-forest/[0.04] ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, var(--color-forest) 0 1px, transparent 1px 9px)',
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest/70">
          Photography · {ratio}
        </span>
        <span className="text-sm text-ink/70">{subject}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 12: Run the whole suite and commit**

```bash
pnpm test
git add -A
git commit -m "feat: UI primitives with CTA guard, dual pricing and charge-state metaphor"
```

---

### Task 6: Content layer and data repositories

**Files:**
- Create: `src/content/PLACEHOLDER.md`, `src/content/models.ts`, `src/content/dealers.ts`, `src/content/faqs.ts`, `src/content/testimonials.ts`, `src/lib/data/types.ts`, `src/lib/data/models.ts`, `src/lib/data/dealers.ts`, `src/lib/data/faqs.ts`, `src/lib/data/serviceability.ts`
- Test: `src/lib/data/models.test.ts`, `src/lib/data/serviceability.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type VehicleModel = { slug, name, tagline, priceInr, rangeKm, topSpeedKmph, batteryKwh, chargeHours, loadKg, motorW, sohWarrantyYears, colours: { name, hex }[], specs: { label, value }[], faqIds: string[] }`
  - `getModels(): Promise<VehicleModel[]>` · `getModel(slug: string): Promise<VehicleModel | null>`
  - `getDealers(): Promise<Dealer[]>` · `getFaqs(ids?: string[]): Promise<Faq[]>`
  - `checkServiceability(pincode: string): Promise<{ status: 'serviceable'; days: number } | { status: 'unserviceable' } | { status: 'failed' }>`

- [ ] **Step 1: Write the failing repository tests**

Create `src/lib/data/models.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getModel, getModels } from './models'

describe('getModels', () => {
  it('returns the placeholder catalog', async () => {
    const models = await getModels()
    expect(models.length).toBeGreaterThanOrEqual(3)
  })

  it('keeps every model within low-speed EV limits, which is what exempts registration', async () => {
    for (const m of await getModels()) {
      expect(m.topSpeedKmph).toBeLessThanOrEqual(25)
      expect(m.motorW).toBeLessThanOrEqual(250)
    }
  })

  it('gives every model a slug, a price and at least one colour', async () => {
    for (const m of await getModels()) {
      expect(m.slug).toMatch(/^[a-z0-9-]+$/)
      expect(m.priceInr).toBeGreaterThan(0)
      expect(m.colours.length).toBeGreaterThan(0)
    }
  })

  it('has unique slugs', async () => {
    const slugs = (await getModels()).map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('getModel', () => {
  it('finds a model by slug', async () => {
    const first = (await getModels())[0]
    expect((await getModel(first.slug))?.name).toBe(first.name)
  })

  it('returns null for an unknown slug rather than throwing', async () => {
    expect(await getModel('does-not-exist')).toBeNull()
  })
})
```

Create `src/lib/data/serviceability.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { checkServiceability } from './serviceability'

describe('checkServiceability', () => {
  it('confirms a serviceable pincode with a delivery estimate', async () => {
    const result = await checkServiceability('411001')
    expect(result.status).toBe('serviceable')
    if (result.status === 'serviceable') expect(result.days).toBeGreaterThan(0)
  })

  it('reports an unserved pincode as unserviceable, not as an error', async () => {
    expect((await checkServiceability('999999')).status).toBe('unserviceable')
  })

  it('rejects a malformed pincode as failed rather than guessing', async () => {
    expect((await checkServiceability('41')).status).toBe('failed')
    expect((await checkServiceability('abcdef')).status).toBe('failed')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/lib/data`
Expected: FAIL — modules not found

- [ ] **Step 3: Write the placeholder-data warning file**

Create `src/content/PLACEHOLDER.md`:

```markdown
# PLACEHOLDER CONTENT

Everything in this folder is invented for development. None of it is an Adhara Energy
commitment. Model names, prices, specifications, dealer addresses and testimonials must all
be replaced before any public launch.

Replacing them is a change confined to this folder — `src/lib/data/` is the only consumer,
and it will be repointed at platform APIs when those exist. Nothing outside `src/lib/data/`
imports from here.

Open questions blocking real data: national vs per-state pricing, and the state-wise legal
vetting of the low-speed classification claim.
```

- [ ] **Step 4: Author the placeholder catalog**

Create `src/lib/data/types.ts`:

```ts
export type Colour = { name: string; hex: string }
export type Spec = { label: string; value: string }

export type VehicleModel = {
  slug: string
  name: string
  tagline: string
  priceInr: number
  rangeKm: number
  topSpeedKmph: number
  batteryKwh: number
  chargeHours: number
  loadKg: number
  motorW: number
  sohWarrantyYears: number
  colours: Colour[]
  specs: Spec[]
  faqIds: string[]
}

export type Dealer = {
  id: string
  name: string
  city: string
  state: string
  pincode: string
  phone: string
  offersTestRide: boolean
}

export type Faq = { id: string; category: string; question: string; answer: string }

export type Testimonial = { id: string; name: string; city: string; quote: string; approved: boolean }
```

Create `src/content/models.ts`. Specs sit inside low-speed limits — under 25 km/h and 250 W — because that is what makes the no-registration position arguable at all:

```ts
import type { VehicleModel } from '@/lib/data/types'

/** PLACEHOLDER — see src/content/PLACEHOLDER.md. Not an Adhara commitment. */
export const PLACEHOLDER = true

export const models: VehicleModel[] = [
  {
    slug: 'adhara-neev',
    name: 'Neev',
    tagline: 'The daily commute, settled.',
    priceInr: 54990,
    rangeKm: 65,
    topSpeedKmph: 25,
    batteryKwh: 1.5,
    chargeHours: 4,
    loadKg: 150,
    motorW: 250,
    sohWarrantyYears: 3,
    colours: [
      { name: 'Forest', hex: '#0E3B2E' },
      { name: 'Turmeric', hex: '#E8A020' },
      { name: 'Mist', hex: '#F4F6F1' },
    ],
    specs: [
      { label: 'Motor', value: '250 W BLDC hub' },
      { label: 'Battery', value: '1.5 kWh LFP, removable' },
      { label: 'Range', value: '65 km per full charge' },
      { label: 'Top speed', value: '25 km/h' },
      { label: 'Charge time', value: '4 hours, 5 A socket' },
      { label: 'Load capacity', value: '150 kg' },
      { label: 'Battery health warranty', value: '3 years or 70% state of health' },
    ],
    faqIds: ['registration', 'battery-life', 'charging-cost'],
  },
  {
    slug: 'adhara-sthir',
    name: 'Sthir',
    tagline: 'Longer legs, same monthly.',
    priceInr: 68990,
    rangeKm: 85,
    topSpeedKmph: 25,
    batteryKwh: 2,
    chargeHours: 5,
    loadKg: 170,
    motorW: 250,
    sohWarrantyYears: 3,
    colours: [
      { name: 'Forest', hex: '#0E3B2E' },
      { name: 'Ink', hex: '#14201B' },
    ],
    specs: [
      { label: 'Motor', value: '250 W BLDC hub' },
      { label: 'Battery', value: '2.0 kWh LFP, removable' },
      { label: 'Range', value: '85 km per full charge' },
      { label: 'Top speed', value: '25 km/h' },
      { label: 'Charge time', value: '5 hours, 5 A socket' },
      { label: 'Load capacity', value: '170 kg' },
      { label: 'Battery health warranty', value: '3 years or 70% state of health' },
    ],
    faqIds: ['registration', 'battery-life', 'range-real-world'],
  },
  {
    slug: 'adhara-bhaar',
    name: 'Bhaar',
    tagline: 'Built to carry the shop.',
    priceInr: 79990,
    rangeKm: 70,
    topSpeedKmph: 25,
    batteryKwh: 2.2,
    chargeHours: 5,
    loadKg: 220,
    motorW: 250,
    sohWarrantyYears: 3,
    colours: [
      { name: 'Turmeric', hex: '#E8A020' },
      { name: 'Forest', hex: '#0E3B2E' },
    ],
    specs: [
      { label: 'Motor', value: '250 W BLDC hub' },
      { label: 'Battery', value: '2.2 kWh LFP, removable' },
      { label: 'Range', value: '70 km loaded' },
      { label: 'Top speed', value: '25 km/h' },
      { label: 'Charge time', value: '5 hours, 5 A socket' },
      { label: 'Load capacity', value: '220 kg including rider' },
      { label: 'Battery health warranty', value: '3 years or 70% state of health' },
    ],
    faqIds: ['registration', 'fleet', 'battery-life'],
  },
]
```

Create `src/content/faqs.ts`:

```ts
import type { Faq } from '@/lib/data/types'

export const PLACEHOLDER = true

export const faqs: Faq[] = [
  {
    id: 'registration',
    category: 'Buying',
    question: 'Does this vehicle need registration or a licence?',
    answer:
      'Adhara vehicles are built to low-speed specification — 25 km/h and a 250 W motor. ' +
      'Requirements vary by state, and the exact position for your state is being confirmed ' +
      'with counsel before we state it here.',
  },
  {
    id: 'battery-life',
    category: 'Battery',
    question: 'What happens as the battery ages?',
    answer:
      'Every pack is warranted for 3 years or 70% state of health, whichever comes first. ' +
      'Capacity fades gradually rather than failing suddenly; expect roughly 8–12% loss in year one.',
  },
  {
    id: 'charging-cost',
    category: 'Battery',
    question: 'What does a full charge cost?',
    answer:
      'A 1.5 kWh pack drawn from a domestic socket costs roughly ₹12 to fill at ₹8 per unit — ' +
      'about ₹0.18 per kilometre against ₹2.20 or so for a petrol two-wheeler.',
  },
  {
    id: 'range-real-world',
    category: 'Battery',
    question: 'Is the stated range realistic?',
    answer:
      'Stated range assumes one rider, level ground and moderate weather. Two riders, ' +
      'gradients or a hot afternoon typically cost 15–20%.',
  },
  {
    id: 'fleet',
    category: 'Buying',
    question: 'Can I buy several for a business?',
    answer:
      'Yes. Bulk enquiries route to our fleet team, who quote on total cost of ownership ' +
      'rather than sticker price.',
  },
  {
    id: 'emi-no-bank',
    category: 'EMI',
    question: 'How can there be EMI without a bank?',
    answer:
      'Adhara carries the risk instead of a lender. You pay us a fixed amount monthly and ' +
      'your vehicle is released for delivery once you cross the eligibility mark. ' +
      'No credit check, and no credit record either way.',
  },
]
```

Create `src/content/dealers.ts` with at least six dealers across three states, each with a real-format pincode, and `src/content/testimonials.ts` with three entries all carrying `approved: false`:

```ts
import type { Testimonial } from '@/lib/data/types'

export const PLACEHOLDER = true

/**
 * Every entry is approved: false. These are illustrative, not real customers —
 * src/lib/legal gates them so no fabricated quote can render as genuine.
 */
export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Sample rider', city: 'Pune', quote: 'Placeholder testimonial copy.', approved: false },
  { id: 't2', name: 'Sample rider', city: 'Nashik', quote: 'Placeholder testimonial copy.', approved: false },
  { id: 't3', name: 'Sample rider', city: 'Indore', quote: 'Placeholder testimonial copy.', approved: false },
]
```

- [ ] **Step 5: Implement the repositories**

Create `src/lib/data/models.ts`:

```ts
import { models } from '@/content/models'
import type { VehicleModel } from './types'

/**
 * The seam. Pages call these functions and never touch src/content.
 * When the platform's catalog API exists, only this file changes — proposal Section 6.
 */
export async function getModels(): Promise<VehicleModel[]> {
  return models
}

export async function getModel(slug: string): Promise<VehicleModel | null> {
  return models.find((m) => m.slug === slug) ?? null
}
```

Create `src/lib/data/faqs.ts` and `src/lib/data/dealers.ts` on the same pattern — `getFaqs(ids?: string[])` filters by id when given, returns all otherwise; `getDealers()` returns the full list.

Create `src/lib/data/serviceability.ts`:

```ts
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
  const served = dealers.some((d) => d.pincode.slice(0, 3) === prefix)
  if (!served) return { status: 'unserviceable' }

  return { status: 'serviceable', days: 5 }
}
```

Ensure at least one dealer has a pincode beginning `411` so the test's `411001` resolves.

- [ ] **Step 6: Confirm green**

Run: `pnpm test src/lib/data`
Expected: PASS — 9 tests

- [ ] **Step 7: Add the import-boundary guard test**

Create `src/lib/data/boundary.test.ts` — this enforces the plan's load-bearing rule mechanically:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : path.match(/\.tsx?$/) ? [path] : []
  })
}

describe('import boundary', () => {
  it('lets nothing outside src/lib/data import from src/content', () => {
    const offenders = walk('src')
      .filter((f) => !f.startsWith(join('src', 'lib', 'data')) && !f.startsWith(join('src', 'content')))
      .filter((f) => /from ['"]@\/content\//.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('lets no page import a message catalog directly', () => {
    const offenders = walk(join('src', 'app')).filter((f) =>
      /from ['"].*messages\/(en|hi)\.json/.test(readFileSync(f, 'utf8')),
    )
    expect(offenders).toEqual([])
  })
})
```

`src/lib/legal` will need an exemption when it reads testimonials — add `src/lib/legal` to the allowed list in Task 8 if that is how it reads them.

- [ ] **Step 8: Commit**

```bash
pnpm test
git add -A
git commit -m "feat: placeholder catalog behind data repositories with an import-boundary test"
```

---

### Task 7: EMI engine

**Files:**
- Create: `src/lib/emi/emi-scheme.placeholder.ts`, `src/lib/emi/calculate.ts`, `src/lib/emi/index.ts`
- Test: `src/lib/emi/calculate.test.ts`

**Interfaces:**
- Consumes: nothing — pure, no I/O
- Produces:
  - `scheme: { PLACEHOLDER: true; schemeFee: 0.18; eligibilityThreshold: 0.6; tenures: [12, 18, 24] }`
  - `calculateEmi(input: { priceInr: number; tenureMonths: number }): { monthly, total, premium, eligibilityAfterPayments, tenureMonths }`
  - `eligibilityDate(start: Date, tenureMonths: number): Date`

- [ ] **Step 1: Write the failing tests, table-driven**

Create `src/lib/emi/calculate.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { calculateEmi, eligibilityDate, scheme } from './index'

describe('scheme parameters', () => {
  it('is flagged as placeholder so nobody mistakes it for a commercial decision', () => {
    expect(scheme.PLACEHOLDER).toBe(true)
  })

  it('holds the spec values', () => {
    expect(scheme.schemeFee).toBe(0.18)
    expect(scheme.eligibilityThreshold).toBe(0.6)
    expect(scheme.tenures).toEqual([12, 18, 24])
  })
})

describe('calculateEmi', () => {
  const cases = [
    { priceInr: 54990, tenureMonths: 12, monthly: 5407, total: 64884 },
    { priceInr: 54990, tenureMonths: 18, monthly: 3605, total: 64890 },
    { priceInr: 54990, tenureMonths: 24, monthly: 2704, total: 64896 },
    { priceInr: 68990, tenureMonths: 12, monthly: 6784, total: 81408 },
    { priceInr: 79990, tenureMonths: 24, monthly: 3933, total: 94392 },
  ]

  for (const c of cases) {
    it(`gives ₹${c.monthly}/month on ₹${c.priceInr} over ${c.tenureMonths} months`, () => {
      const result = calculateEmi({ priceInr: c.priceInr, tenureMonths: c.tenureMonths })
      expect(result.monthly).toBe(c.monthly)
      expect(result.total).toBe(c.total)
    })
  }

  it('reports the premium over paying in full — the number the scheme must never hide', () => {
    const { total, premium } = calculateEmi({ priceInr: 54990, tenureMonths: 12 })
    expect(premium).toBe(total - 54990)
    expect(premium).toBeGreaterThan(0)
  })

  it('rounds the monthly figure to whole rupees', () => {
    const { monthly } = calculateEmi({ priceInr: 54990, tenureMonths: 18 })
    expect(Number.isInteger(monthly)).toBe(true)
  })

  it('derives total from the rounded monthly, so the displayed sum is the sum displayed', () => {
    const r = calculateEmi({ priceInr: 54990, tenureMonths: 18 })
    expect(r.total).toBe(r.monthly * 18)
  })

  it('unlocks delivery after 60% of payments, rounded up', () => {
    expect(calculateEmi({ priceInr: 54990, tenureMonths: 12 }).eligibilityAfterPayments).toBe(8)
    expect(calculateEmi({ priceInr: 54990, tenureMonths: 18 }).eligibilityAfterPayments).toBe(11)
    expect(calculateEmi({ priceInr: 54990, tenureMonths: 24 }).eligibilityAfterPayments).toBe(15)
  })

  it('rejects a tenure the scheme does not offer', () => {
    expect(() => calculateEmi({ priceInr: 54990, tenureMonths: 9 })).toThrow(/tenure/i)
  })

  it('rejects a non-positive price', () => {
    expect(() => calculateEmi({ priceInr: 0, tenureMonths: 12 })).toThrow(/price/i)
  })
})

describe('eligibilityDate', () => {
  it('adds the eligibility months to the enrollment date', () => {
    expect(eligibilityDate(new Date('2026-09-15'), 12).toISOString().slice(0, 7)).toBe('2027-05')
  })

  it('rolls the year over correctly', () => {
    expect(eligibilityDate(new Date('2026-11-01'), 24).toISOString().slice(0, 7)).toBe('2028-02')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/lib/emi`
Expected: FAIL — cannot resolve `./index`

- [ ] **Step 3: Implement**

Create `src/lib/emi/emi-scheme.placeholder.ts`:

```ts
/**
 * PLACEHOLDER commercial parameters. Every value here is Adhara's decision to make,
 * not a calculation. Replacing them is a one-file edit by design.
 */
export const scheme = {
  PLACEHOLDER: true,
  /** Premium charged over the cash price across the whole scheme. */
  schemeFee: 0.18,
  /** Share of installments paid before the vehicle is released for delivery. */
  eligibilityThreshold: 0.6,
  tenures: [12, 18, 24],
} as const
```

Create `src/lib/emi/calculate.ts`:

```ts
import { scheme } from './emi-scheme.placeholder'

export type EmiInput = { priceInr: number; tenureMonths: number }

export type EmiResult = {
  monthly: number
  total: number
  premium: number
  eligibilityAfterPayments: number
  tenureMonths: number
}

export function calculateEmi({ priceInr, tenureMonths }: EmiInput): EmiResult {
  if (!(priceInr > 0)) throw new Error(`Invalid price: ${priceInr}`)
  if (!scheme.tenures.includes(tenureMonths as (typeof scheme.tenures)[number])) {
    throw new Error(`Unsupported tenure: ${tenureMonths}. Offered: ${scheme.tenures.join(', ')}`)
  }

  const monthly = Math.round((priceInr * (1 + scheme.schemeFee)) / tenureMonths)
  // Total is derived from the rounded monthly, so what a customer adds up on paper
  // matches what we tell them the scheme costs.
  const total = monthly * tenureMonths

  return {
    monthly,
    total,
    premium: total - priceInr,
    eligibilityAfterPayments: Math.ceil(tenureMonths * scheme.eligibilityThreshold),
    tenureMonths,
  }
}

export function eligibilityDate(start: Date, tenureMonths: number): Date {
  const months = Math.ceil(tenureMonths * scheme.eligibilityThreshold)
  const d = new Date(start)
  d.setMonth(d.getMonth() + months)
  return d
}
```

Create `src/lib/emi/index.ts`:

```ts
export { calculateEmi, eligibilityDate } from './calculate'
export type { EmiInput, EmiResult } from './calculate'
export { scheme } from './emi-scheme.placeholder'
```

- [ ] **Step 4: Confirm green**

Run: `pnpm test src/lib/emi`
Expected: PASS — 15 tests. If a table case disagrees, recompute by hand from `round(price × 1.18 / tenure)` and correct the expectation, not the formula.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: EMI engine with placeholder scheme parameters and premium transparency"
```

---

### Task 8: Legal and testimonial gating

**Files:**
- Create: `src/lib/legal/claims.ts`, `src/lib/legal/Claim.tsx`, `src/lib/legal/testimonials.ts`
- Test: `src/lib/legal/claims.test.ts`, `src/lib/legal/Claim.test.tsx`
- Modify: `src/lib/data/boundary.test.ts` (allow `src/lib/legal` to read content)

**Interfaces:**
- Consumes: `src/content/testimonials.ts`
- Produces:
  - `type LegalClaim = { id: string; text: string; approved: boolean; states?: string[]; fallback: string }`
  - `getClaim(id: string): LegalClaim | null`
  - `<Claim id="no-registration" />`
  - `getApprovedTestimonials(): Promise<Testimonial[]>`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/legal/claims.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { claims, getClaim } from './claims'

describe('claims registry', () => {
  it('holds the no-registration claim as unapproved, per Section 12 question 3', () => {
    expect(getClaim('no-registration')?.approved).toBe(false)
  })

  it('gives every claim a neutral fallback to render while unapproved', () => {
    for (const c of claims) {
      expect(c.fallback.length).toBeGreaterThan(0)
      expect(c.fallback).not.toBe(c.text)
    }
  })

  it('returns null for an unknown claim id rather than an empty string', () => {
    expect(getClaim('nonexistent')).toBeNull()
  })

  it('never lets an unapproved claim carry a states array implying it was vetted', () => {
    for (const c of claims) {
      if (!c.approved) expect(c.states).toBeUndefined()
    }
  })
})
```

Create `src/lib/legal/Claim.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Claim } from './Claim'

afterEach(cleanup)

describe('Claim', () => {
  it('renders the neutral fallback for an unapproved claim, never the claim itself', () => {
    render(<Claim id="no-registration" />)
    const claimText = 'No licence or registration is required'
    expect(screen.queryByText(new RegExp(claimText, 'i'))).toBeNull()
  })

  it('flags the gap visibly in development so it cannot be forgotten', () => {
    render(<Claim id="no-registration" />)
    expect(screen.getByTestId('unapproved-claim')).toBeDefined()
  })

  it('renders nothing at all for an unknown id', () => {
    const { container } = render(<Claim id="nope" />)
    expect(container.textContent).toBe('')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/lib/legal`
Expected: FAIL — modules not found

- [ ] **Step 3: Implement**

Create `src/lib/legal/claims.ts`:

```ts
export type LegalClaim = {
  id: string
  /** The claim as marketing would like to state it. Renders only when approved. */
  text: string
  approved: boolean
  /** Populated only once counsel has confirmed the claim state by state. */
  states?: string[]
  /** What renders until approval — factual, defensible, and not a claim. */
  fallback: string
}

/**
 * Section 12, open question 3: whether the "no licence / no registration" position is
 * uniform across launch states is unresolved. Storing approval as data means someone has
 * to consciously flip a boolean, rather than a sentence quietly reaching a hero headline.
 */
export const claims: LegalClaim[] = [
  {
    id: 'no-registration',
    text: 'No licence or registration is required to ride an Adhara vehicle.',
    approved: false,
    fallback:
      'Built to low-speed specification: 25 km/h top speed, 250 W motor. ' +
      'Requirements vary by state — we confirm your state before delivery.',
  },
  {
    id: 'no-credit-check',
    text: 'No bank, no credit check, and no effect on your credit record either way.',
    approved: true,
    fallback: 'Monthly payments are made directly to Adhara Energy.',
  },
  {
    id: 'soh-warranty',
    text: 'Battery warranted for 3 years or 70% state of health, whichever comes first.',
    approved: true,
    fallback: 'Battery warranty terms are stated on your invoice.',
  },
]

export function getClaim(id: string): LegalClaim | null {
  return claims.find((c) => c.id === id) ?? null
}
```

Create `src/lib/legal/Claim.tsx`:

```tsx
import { getClaim } from './claims'

/**
 * Renders an approved claim as copy. Renders an unapproved one as its neutral fallback,
 * plus a development-only banner so the gap is impossible to overlook.
 */
export function Claim({ id, className = '' }: { id: string; className?: string }) {
  const claim = getClaim(id)
  if (!claim) return null

  if (claim.approved) return <span className={className}>{claim.text}</span>

  return (
    <span className={className} data-testid="unapproved-claim">
      {claim.fallback}
      {process.env.NODE_ENV !== 'production' && (
        <span className="ml-2 rounded bg-charge-low/25 px-2 py-0.5 text-xs font-semibold text-ink">
          claim “{claim.id}” awaiting legal sign-off
        </span>
      )}
    </span>
  )
}
```

Create `src/lib/legal/testimonials.ts`:

```ts
import { testimonials } from '@/content/testimonials'
import type { Testimonial } from '@/lib/data/types'

/**
 * A fabricated customer quote presented as genuine is a lie, not a placeholder.
 * Only approved entries are returned; the home page renders nothing where there are none.
 */
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  return testimonials.filter((t) => t.approved)
}
```

- [ ] **Step 4: Widen the boundary test's allow-list**

In `src/lib/data/boundary.test.ts`, change the filter to permit `src/lib/legal` alongside `src/lib/data`:

```ts
.filter((f) =>
  !f.startsWith(join('src', 'lib', 'data')) &&
  !f.startsWith(join('src', 'lib', 'legal')) &&
  !f.startsWith(join('src', 'content')),
)
```

- [ ] **Step 5: Confirm green and commit**

```bash
pnpm test
git add -A
git commit -m "feat: gate unapproved legal claims and fabricated testimonials"
```

---

### Task 9: Lead pipeline with attribution

**Files:**
- Create: `src/lib/leads/schema.ts`, `src/lib/leads/attribution.ts`, `src/lib/leads/rate-limit.ts`, `src/lib/leads/sink.ts`, `src/lib/leads/submit.ts`, `src/lib/leads/index.ts`
- Modify: `src/middleware.ts` (attribution capture alongside locale negotiation)
- Test: `src/lib/leads/attribution.test.ts`, `src/lib/leads/rate-limit.test.ts`, `src/lib/leads/submit.test.ts`

**Interfaces:**
- Consumes: zod
- Produces:
  - `leadSchema` — zod object: `{ kind: 'test-ride' | 'enquiry' | 'emi-interest' | 'dealer' | 'promoter', name, phone, pincode?, modelSlug?, message? }`
  - `parseAttribution(searchParams: URLSearchParams): Attribution` where `Attribution = { source, medium, campaign, referralCode, landedAt }`
  - `ATTRIBUTION_COOKIE = 'adhara_attr'`
  - `checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number }`
  - `submitLead(input, attribution): Promise<{ ok: true; id: string } | { ok: false; error: string }>`

- [ ] **Step 1: Write the failing attribution tests**

Create `src/lib/leads/attribution.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parseAttribution } from './attribution'

describe('parseAttribution', () => {
  it('captures a promoter referral code, which is the whole point of ?ref=', () => {
    const a = parseAttribution(new URLSearchParams('?ref=PROMO123'))
    expect(a.referralCode).toBe('PROMO123')
  })

  it('uppercases referral codes so PROMO123 and promo123 are one code', () => {
    expect(parseAttribution(new URLSearchParams('?ref=promo123')).referralCode).toBe('PROMO123')
  })

  it('captures utm parameters', () => {
    const a = parseAttribution(new URLSearchParams('?utm_source=meta&utm_medium=cpc&utm_campaign=diwali'))
    expect(a.source).toBe('meta')
    expect(a.medium).toBe('cpc')
    expect(a.campaign).toBe('diwali')
  })

  it('falls back to direct when nothing is present', () => {
    const a = parseAttribution(new URLSearchParams(''))
    expect(a.source).toBe('direct')
    expect(a.referralCode).toBeNull()
  })

  it('rejects an over-long referral code rather than storing junk', () => {
    expect(parseAttribution(new URLSearchParams(`?ref=${'A'.repeat(64)}`)).referralCode).toBeNull()
  })

  it('strips anything that is not alphanumeric from the referral code', () => {
    expect(parseAttribution(new URLSearchParams('?ref=<script>')).referralCode).toBeNull()
  })

  it('stamps when the visitor landed', () => {
    expect(parseAttribution(new URLSearchParams('?ref=A1')).landedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
```

- [ ] **Step 2: Run, confirm failure, implement**

Run → FAIL. Create `src/lib/leads/attribution.ts`:

```ts
export type Attribution = {
  source: string
  medium: string | null
  campaign: string | null
  referralCode: string | null
  landedAt: string
}

export const ATTRIBUTION_COOKIE = 'adhara_attr'
/** Section 6 calls for attribution-window rules. 30 days is the placeholder. */
export const ATTRIBUTION_WINDOW_DAYS = 30

/** Referral codes are money — a malformed one is dropped, never stored optimistically. */
function cleanReferral(raw: string | null): string | null {
  if (!raw) return null
  const code = raw.trim().toUpperCase()
  return /^[A-Z0-9]{4,32}$/.test(code) ? code : null
}

export function parseAttribution(params: URLSearchParams): Attribution {
  return {
    source: params.get('utm_source')?.slice(0, 64) || 'direct',
    medium: params.get('utm_medium')?.slice(0, 64) || null,
    campaign: params.get('utm_campaign')?.slice(0, 64) || null,
    referralCode: cleanReferral(params.get('ref')),
    landedAt: new Date().toISOString(),
  }
}
```

Run → PASS (7 tests).

- [ ] **Step 3: Write the failing rate-limit tests**

Create `src/lib/leads/rate-limit.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { checkRateLimit, resetRateLimit } from './rate-limit'

beforeEach(resetRateLimit)

describe('checkRateLimit', () => {
  it('allows the first submissions from a key', () => {
    for (let i = 0; i < 5; i++) expect(checkRateLimit('1.2.3.4').allowed).toBe(true)
  })

  it('blocks the sixth within the window — the referral-fraud surface starts here', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('1.2.3.4')
    const result = checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks keys independently', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('1.2.3.4')
    expect(checkRateLimit('5.6.7.8').allowed).toBe(true)
  })
})
```

- [ ] **Step 4: Implement the rate limiter**

Create `src/lib/leads/rate-limit.ts`:

```ts
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

/**
 * In-memory and per-instance — adequate for a stub sink, inadequate for production.
 * Replace with a shared store when the platform lead API lands.
 */
export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    const oldest = Math.min(...recent)
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) }
  }

  recent.push(now)
  hits.set(key, recent)
  return { allowed: true }
}

export function resetRateLimit(): void {
  hits.clear()
}
```

Run → PASS.

- [ ] **Step 5: Write the failing submit tests**

Create `src/lib/leads/submit.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { parseAttribution } from './attribution'
import { resetRateLimit } from './rate-limit'
import { readAll, resetSink } from './sink'
import { submitLead } from './submit'

const attribution = parseAttribution(new URLSearchParams('?ref=PROMO123&utm_source=meta'))

const valid = {
  kind: 'test-ride' as const,
  name: 'Asha Kulkarni',
  phone: '9876543210',
  pincode: '411001',
  modelSlug: 'adhara-neev',
}

beforeEach(() => {
  resetSink()
  resetRateLimit()
})

describe('submitLead', () => {
  it('accepts a valid lead and returns an id', async () => {
    const result = await submitLead(valid, attribution, '1.2.3.4')
    expect(result.ok).toBe(true)
  })

  it('persists the referral code with the lead, so attribution survives the funnel', async () => {
    await submitLead(valid, attribution, '1.2.3.4')
    expect(readAll()[0].attribution.referralCode).toBe('PROMO123')
    expect(readAll()[0].attribution.source).toBe('meta')
  })

  it('rejects a phone number that is not ten digits', async () => {
    const result = await submitLead({ ...valid, phone: '123' }, attribution, '1.2.3.4')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/phone/i)
  })

  it('rejects an Indian mobile number that does not start 6-9', async () => {
    const result = await submitLead({ ...valid, phone: '1234567890' }, attribution, '1.2.3.4')
    expect(result.ok).toBe(false)
  })

  it('rejects an empty name', async () => {
    const result = await submitLead({ ...valid, name: '  ' }, attribution, '1.2.3.4')
    expect(result.ok).toBe(false)
  })

  it('stores nothing when validation fails', async () => {
    await submitLead({ ...valid, phone: 'x' }, attribution, '1.2.3.4')
    expect(readAll()).toHaveLength(0)
  })

  it('refuses once the rate limit is hit, with a human message', async () => {
    for (let i = 0; i < 5; i++) await submitLead(valid, attribution, '9.9.9.9')
    const result = await submitLead(valid, attribution, '9.9.9.9')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/too many|try again/i)
  })
})
```

- [ ] **Step 6: Implement schema, sink and submit**

Create `src/lib/leads/schema.ts`:

```ts
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
```

Create `src/lib/leads/sink.ts` — a JSONL file, deliberately trivial:

```ts
import { appendFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { Attribution } from './attribution'
import type { LeadInput } from './schema'

export type StoredLead = {
  id: string
  receivedAt: string
  lead: LeadInput
  attribution: Attribution
}

const file = resolve(process.cwd(), '.data/leads.jsonl')

/**
 * The stub sink. Swapping this one function for the platform's lead API is the whole
 * migration — validation, rate limiting and attribution above it stay untouched.
 */
export function writeLead(record: StoredLead): void {
  mkdirSync(dirname(file), { recursive: true })
  appendFileSync(file, `${JSON.stringify(record)}\n`, 'utf8')
}

export function readAll(): StoredLead[] {
  try {
    return readFileSync(file, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredLead)
  } catch {
    return []
  }
}

export function resetSink(): void {
  try {
    rmSync(file)
  } catch {
    /* nothing to remove */
  }
}
```

Add `.data/` to `.gitignore`.

Create `src/lib/leads/submit.ts`:

```ts
import type { Attribution } from './attribution'
import { checkRateLimit } from './rate-limit'
import { leadSchema, type LeadInput } from './schema'
import { writeLead } from './sink'

export type SubmitResult = { ok: true; id: string } | { ok: false; error: string }

let counter = 0

export async function submitLead(
  input: unknown,
  attribution: Attribution,
  clientKey: string,
): Promise<SubmitResult> {
  // Server-side validation is the authority. The client mirrors these rules for UX only.
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the form and try again' }
  }

  const limit = checkRateLimit(clientKey)
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many submissions from this connection. Try again in ${Math.ceil((limit.retryAfterSeconds ?? 60) / 60)} minutes, or call us.`,
    }
  }

  const id = `ADH-${Date.now().toString(36).toUpperCase()}-${(++counter).toString().padStart(3, '0')}`
  writeLead({ id, receivedAt: new Date().toISOString(), lead: parsed.data as LeadInput, attribution })
  return { ok: true, id }
}
```

Create `src/lib/leads/index.ts`:

```ts
export { parseAttribution, ATTRIBUTION_COOKIE, ATTRIBUTION_WINDOW_DAYS } from './attribution'
export type { Attribution } from './attribution'
export { leadSchema, leadKinds } from './schema'
export type { LeadInput } from './schema'
export { submitLead } from './submit'
export type { SubmitResult } from './submit'
export { readAll } from './sink'
export type { StoredLead } from './sink'
```

- [ ] **Step 7: Persist attribution in middleware**

Modify `src/middleware.ts` so the first-touch attribution survives the whole funnel:

```ts
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { ATTRIBUTION_COOKIE, ATTRIBUTION_WINDOW_DAYS, parseAttribution } from './lib/leads/attribution'

const intl = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = intl(request)

  // First touch wins. Overwriting on a later visit would credit the wrong promoter.
  const existing = request.cookies.get(ATTRIBUTION_COOKIE)
  const params = request.nextUrl.searchParams
  const hasNew = params.has('ref') || params.has('utm_source')

  if (!existing && hasNew) {
    response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(parseAttribution(params)), {
      maxAge: ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] }
```

- [ ] **Step 8: Confirm green and commit**

```bash
pnpm test
git add -A
git commit -m "feat: lead pipeline with validation, rate limiting and first-touch attribution"
```

---

### Task 10: Wordmark, header and footer

**Files:**
- Create: `src/components/blocks/Wordmark.tsx`, `src/components/blocks/SiteHeader.tsx`, `src/components/blocks/SiteFooter.tsx`, `src/components/blocks/LocaleSwitcher.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/components/blocks/Wordmark.test.tsx`

**Interfaces:**
- Consumes: `Button`, `routing`, i18n `common.*` keys
- Produces: `<Wordmark variant="crossbar" | "underline" | "stacked" />`, `<SiteHeader />`, `<SiteFooter />`

- [ ] **Step 1: Write the failing wordmark test**

Create `src/components/blocks/Wordmark.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Wordmark } from './Wordmark'

afterEach(cleanup)

describe('Wordmark', () => {
  it('exposes the brand name to assistive technology', () => {
    render(<Wordmark />)
    expect(screen.getByRole('img', { name: /adhara energy/i })).toBeDefined()
  })

  it('uses the accent exactly once, per Section 2.2', () => {
    const { container } = render(<Wordmark variant="crossbar" />)
    const accented = container.querySelectorAll('[data-accent="true"]')
    expect(accented).toHaveLength(1)
  })

  it('offers all three commissionable variants', () => {
    for (const variant of ['crossbar', 'underline', 'stacked'] as const) {
      cleanup()
      const { container } = render(<Wordmark variant={variant} />)
      expect(container.querySelector('svg')).not.toBeNull()
    }
  })
})
```

- [ ] **Step 2: Run, confirm failure, implement**

Run → FAIL. Create `src/components/blocks/Wordmark.tsx`. Each variant places one Turmeric element — a beam — and nothing else in the accent:

```tsx
type Variant = 'crossbar' | 'underline' | 'stacked'

/**
 * Section 2.2: keep the one-accent discipline, drop the battery charge-dot device
 * (which belonged to the word "urja") and replace it with a foundation beam — literal
 * to आधार, meaning base or support. Three options for the design team to choose between.
 */
export function Wordmark({
  variant = 'crossbar',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const beam = 'var(--color-turmeric)'
  const body = 'currentColor'

  if (variant === 'stacked') {
    return (
      <svg viewBox="0 0 148 56" role="img" aria-label="Adhara Energy" className={className}>
        <text x="0" y="24" fill={body} fontFamily="var(--font-heading)" fontSize="26" fontWeight="700" letterSpacing="0.02em">ADHARA</text>
        <rect data-accent="true" x="0" y="30" width="118" height="4" rx="2" fill={beam} />
        <text x="0" y="52" fill={body} fontFamily="var(--font-heading)" fontSize="15" fontWeight="500" letterSpacing="0.22em">ENERGY</text>
      </svg>
    )
  }

  if (variant === 'underline') {
    return (
      <svg viewBox="0 0 210 34" role="img" aria-label="Adhara Energy" className={className}>
        <text x="0" y="22" fill={body} fontFamily="var(--font-heading)" fontSize="24" fontWeight="700">Adhara<tspan fontWeight="400"> Energy</tspan></text>
        <rect data-accent="true" x="0" y="28" width="74" height="3.5" rx="1.75" fill={beam} />
      </svg>
    )
  }

  // crossbar: the A's crossbar extends past the letter as a support beam
  return (
    <svg viewBox="0 0 210 34" role="img" aria-label="Adhara Energy" className={className}>
      <text x="0" y="24" fill={body} fontFamily="var(--font-heading)" fontSize="24" fontWeight="700">Adhara<tspan fontWeight="400"> Energy</tspan></text>
      <rect data-accent="true" x="2.5" y="17" width="19" height="3.5" rx="1.75" fill={beam} />
    </svg>
  )
}
```

- [ ] **Step 3: Build the header, footer and locale switcher**

Create `src/components/blocks/SiteHeader.tsx` — Forest ground, white text, one secondary CTA (the primary is reserved for the page body), a skip link, and a mobile disclosure nav. Create `src/components/blocks/LocaleSwitcher.tsx` using `next-intl/navigation`'s `Link` to swap locale while preserving the path. Create `src/components/blocks/SiteFooter.tsx` with nav columns, the tagline, and a visible note that pricing and scheme terms are placeholders pending sign-off.

Wire both into `src/app/[locale]/layout.tsx` around `{children}`, with `<main id="main">` as the skip-link target.

- [ ] **Step 4: Confirm green and commit**

```bash
pnpm test && pnpm build
git add -A
git commit -m "feat: wordmark options, site header and footer"
```

---

### Task 11: Home page

**Files:**
- Create: `src/components/blocks/Hero.tsx`, `src/components/blocks/ModelCard.tsx`, `src/components/blocks/EmiStrip.tsx`, `src/components/blocks/TrustBadges.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Test: `src/app/[locale]/home.test.tsx`

**Interfaces:**
- Consumes: `getModels`, `calculateEmi`, `PriceDual`, `Button`, `Claim`, `getApprovedTestimonials`, `PhotoFrame`
- Produces: `<ModelCard model={VehicleModel} />` — used again by the listing page in Task 12

- [ ] **Step 1: Write the failing page test**

Create `src/app/[locale]/home.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ModelCard } from '@/components/blocks/ModelCard'
import { getModels } from '@/lib/data/models'
import { resetCtaGuard } from '@/components/ui/cta-guard'

afterEach(() => {
  cleanup()
  resetCtaGuard()
})

describe('ModelCard', () => {
  it('shows the monthly figure beside the full price, never alone', async () => {
    const model = (await getModels())[0]
    render(<ModelCard model={model} />)
    expect(screen.getByText('₹54,990')).toBeDefined()
    expect(screen.getByText(/month/)).toBeDefined()
  })

  it('names the model and links to its detail page', async () => {
    const model = (await getModels())[0]
    render(<ModelCard model={model} />)
    expect(screen.getByRole('link', { name: new RegExp(model.name, 'i') }).getAttribute('href'))
      .toContain(model.slug)
  })

  it('states range and top speed, the two specs that decide the category', async () => {
    const model = (await getModels())[0]
    render(<ModelCard model={model} />)
    expect(screen.getByText(/65 km/)).toBeDefined()
    expect(screen.getByText(/25 km\/h/)).toBeDefined()
  })

  it('uses no primary CTA, because a card is never the page CTA', async () => {
    const model = (await getModels())[0]
    const { container } = render(<ModelCard model={model} />)
    expect(container.querySelector('.bg-turmeric')).toBeNull()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/app`
Expected: FAIL — cannot resolve `@/components/blocks/ModelCard`

- [ ] **Step 3: Implement ModelCard**

Create `src/components/blocks/ModelCard.tsx`:

```tsx
import { Button } from '@/components/ui/Button'
import { PhotoFrame } from '@/components/ui/PhotoFrame'
import { PriceDual } from '@/components/ui/PriceDual'
import { calculateEmi, scheme } from '@/lib/emi'
import type { VehicleModel } from '@/lib/data/types'

export function ModelCard({ model, locale = 'en' }: { model: VehicleModel; locale?: string }) {
  const emi = calculateEmi({ priceInr: model.priceInr, tenureMonths: scheme.tenures.at(-1)! })

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-forest/12 bg-surface p-5">
      <PhotoFrame ratio="4/3" subject={`${model.name} three-quarter view, plain ground`} />
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-ink">
          <a href={`/${locale}/vehicles/${model.slug}`} className="hover:text-forest">
            {model.name}
          </a>
        </h3>
        <p className="text-sm text-ink/70">{model.tagline}</p>
      </div>
      <dl className="tnum flex gap-6 text-sm">
        <div>
          <dt className="text-ink/60">Range</dt>
          <dd className="font-medium text-ink">{model.rangeKm} km</dd>
        </div>
        <div>
          <dt className="text-ink/60">Top speed</dt>
          <dd className="font-medium text-ink">{model.topSpeedKmph} km/h</dd>
        </div>
      </dl>
      <PriceDual full={model.priceInr} monthly={emi.monthly} tenure={emi.tenureMonths} size="sm" />
      <Button variant="secondary" href={`/${locale}/vehicles/${model.slug}`}>
        View details
      </Button>
    </article>
  )
}
```

- [ ] **Step 4: Confirm green**

Run: `pnpm test src/app`
Expected: PASS — 4 tests

- [ ] **Step 5: Build the Hero, EmiStrip and TrustBadges blocks, then compose the page**

`Hero.tsx` — Forest ground, the `home.heroTitle` and `home.heroBody` strings, **the page's single `variant="primary"` CTA** reading `Book Now · EMI from {monthly}/month, no bank needed` where the figure is the cheapest model at the longest tenure, a secondary test-ride link, and a `PhotoFrame` at `3/2` with the subject `Rider in everyday clothes, Indian street, morning light`.

`EmiStrip.tsx` — the four steps from `home.steps.*` as an ordered list, numbered, each with a `ChargeState`-free numeric marker so the accent stays on the hero CTA.

`TrustBadges.tsx` — three `<Claim>` renders: `soh-warranty`, `no-credit-check`, `no-registration`. The third will render its neutral fallback plus the development banner, which is the point.

Compose `src/app/[locale]/page.tsx` as a server component: `setRequestLocale(locale)`, then Hero → EmiStrip → model grid from `getModels()` → calculator teaser linking `/{locale}/emi/calculator` → TrustBadges → testimonials section that renders only if `getApprovedTestimonials()` is non-empty.

- [ ] **Step 6: Verify the accent rule holds on the real page**

```bash
pnpm dev
```

Load `/en` with the console open. Expected: **no** CTA-guard warning. If one appears, demote the extra primary button — the guard is right and the page is wrong.

- [ ] **Step 7: Commit**

```bash
pnpm test && pnpm build
git add -A
git commit -m "feat: home page with hero, EMI strip, model grid and gated trust badges"
```

---

### Task 12: Model listing and model detail

**Files:**
- Create: `src/app/[locale]/vehicles/page.tsx`, `src/app/[locale]/vehicles/[slug]/page.tsx`, `src/components/blocks/ModelFilters.tsx`, `src/components/blocks/SpecTable.tsx`, `src/components/blocks/ColourSwitcher.tsx`, `src/components/blocks/ServiceabilityCheck.tsx`, `src/components/blocks/StickyCtaBar.tsx`, `src/app/api/serviceability/route.ts`
- Test: `src/components/blocks/ModelFilters.test.tsx`, `src/components/blocks/ServiceabilityCheck.test.tsx`, `src/lib/data/filter.test.ts`
- Create: `src/lib/data/filter.ts`

**Interfaces:**
- Consumes: `getModels`, `getModel`, `checkServiceability`, `getFaqs`, `Accordion`, `PriceDual`, `Claim`
- Produces: `filterModels(models, criteria): VehicleModel[]` where `criteria = { maxPrice?, minRange?, minTopSpeed?, minBatteryKwh? }`

- [ ] **Step 1: Write the failing filter test**

Create `src/lib/data/filter.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { filterModels, parseCriteria } from './filter'
import { getModels } from './models'

const all = await getModels()

describe('filterModels', () => {
  it('returns everything for empty criteria', () => {
    expect(filterModels(all, {})).toHaveLength(all.length)
  })

  it('filters by maximum price inclusively', () => {
    expect(filterModels(all, { maxPrice: 54990 }).map((m) => m.slug)).toEqual(['adhara-neev'])
  })

  it('filters by minimum range inclusively', () => {
    expect(filterModels(all, { minRange: 85 }).map((m) => m.slug)).toEqual(['adhara-sthir'])
  })

  it('combines criteria with AND', () => {
    expect(filterModels(all, { maxPrice: 70000, minRange: 80 }).map((m) => m.slug)).toEqual([
      'adhara-sthir',
    ])
  })

  it('returns an empty array rather than throwing when nothing matches', () => {
    expect(filterModels(all, { minRange: 500 })).toEqual([])
  })
})

describe('parseCriteria', () => {
  it('reads criteria from URL search params so results are shareable', () => {
    expect(parseCriteria(new URLSearchParams('?maxPrice=60000&minRange=60'))).toEqual({
      maxPrice: 60000,
      minRange: 60,
    })
  })

  it('ignores non-numeric junk instead of returning NaN', () => {
    expect(parseCriteria(new URLSearchParams('?maxPrice=abc'))).toEqual({})
  })
})
```

- [ ] **Step 2: Run, confirm failure, implement**

Run → FAIL. Create `src/lib/data/filter.ts`:

```ts
import type { VehicleModel } from './types'

export type Criteria = {
  maxPrice?: number
  minRange?: number
  minTopSpeed?: number
  minBatteryKwh?: number
}

export function filterModels(models: VehicleModel[], c: Criteria): VehicleModel[] {
  return models.filter(
    (m) =>
      (c.maxPrice === undefined || m.priceInr <= c.maxPrice) &&
      (c.minRange === undefined || m.rangeKm >= c.minRange) &&
      (c.minTopSpeed === undefined || m.topSpeedKmph >= c.minTopSpeed) &&
      (c.minBatteryKwh === undefined || m.batteryKwh >= c.minBatteryKwh),
  )
}

/** Criteria live in the URL so a filtered result is shareable and indexable. */
export function parseCriteria(params: URLSearchParams): Criteria {
  const num = (key: string): number | undefined => {
    const raw = params.get(key)
    if (raw === null) return undefined
    const n = Number(raw)
    return Number.isFinite(n) && n > 0 ? n : undefined
  }
  const c: Criteria = {}
  const maxPrice = num('maxPrice')
  const minRange = num('minRange')
  const minTopSpeed = num('minTopSpeed')
  const minBatteryKwh = num('minBatteryKwh')
  if (maxPrice !== undefined) c.maxPrice = maxPrice
  if (minRange !== undefined) c.minRange = minRange
  if (minTopSpeed !== undefined) c.minTopSpeed = minTopSpeed
  if (minBatteryKwh !== undefined) c.minBatteryKwh = minBatteryKwh
  return c
}
```

Run → PASS (7 tests).

- [ ] **Step 3: Write the failing serviceability-UI test**

Create `src/components/blocks/ServiceabilityCheck.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ServiceabilityCheck } from './ServiceabilityCheck'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function mockFetch(body: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, json: async () => body }))
}

describe('ServiceabilityCheck', () => {
  it('confirms delivery with an estimate', async () => {
    mockFetch({ status: 'serviceable', days: 5 })
    render(<ServiceabilityCheck />)
    await userEvent.type(screen.getByLabelText(/pincode/i), '411001')
    await userEvent.click(screen.getByRole('button', { name: /check/i }))
    expect(await screen.findByText(/we deliver to 411001/i)).toBeDefined()
  })

  it('offers a retry when the check fails, never a false negative', async () => {
    mockFetch({ status: 'failed' })
    render(<ServiceabilityCheck />)
    await userEvent.type(screen.getByLabelText(/pincode/i), '411001')
    await userEvent.click(screen.getByRole('button', { name: /check/i }))
    expect(await screen.findByText(/try again/i)).toBeDefined()
    expect(screen.queryByText(/don't deliver/i)).toBeNull()
  })

  it('treats a network throw as failed, not as unserviceable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<ServiceabilityCheck />)
    await userEvent.type(screen.getByLabelText(/pincode/i), '411001')
    await userEvent.click(screen.getByRole('button', { name: /check/i }))
    expect(await screen.findByText(/try again/i)).toBeDefined()
  })

  it('reports a genuinely unserved pincode plainly, and asks for a number', async () => {
    mockFetch({ status: 'unserviceable' })
    render(<ServiceabilityCheck />)
    await userEvent.type(screen.getByLabelText(/pincode/i), '999999')
    await userEvent.click(screen.getByRole('button', { name: /check/i }))
    expect(await screen.findByText(/don't deliver to 999999/i)).toBeDefined()
  })

  it('validates the pincode client-side before spending a request', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    render(<ServiceabilityCheck />)
    await userEvent.type(screen.getByLabelText(/pincode/i), '41')
    await userEvent.click(screen.getByRole('button', { name: /check/i }))
    expect(await screen.findByText(/six-digit/i)).toBeDefined()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 4: Implement the API route and the component**

Create `src/app/api/serviceability/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { checkServiceability } from '@/lib/data/serviceability'

export async function GET(request: Request) {
  const pincode = new URL(request.url).searchParams.get('pincode') ?? ''
  try {
    return NextResponse.json(await checkServiceability(pincode))
  } catch {
    // Never let an infrastructure failure masquerade as 'we don't deliver there'.
    return NextResponse.json({ status: 'failed' }, { status: 200 })
  }
}
```

Create `src/components/blocks/ServiceabilityCheck.tsx` as a client component holding
`state: 'idle' | 'checking' | ServiceabilityResult`, rendering the four messages from
`model.serviceability.*`, and using `<Field>` for the labelled input. On `failed`, the button
label becomes a retry. On `unserviceable`, show a phone-number capture posting an
`emi-interest` lead — an unserved pincode is a lead, not a dead end.

- [ ] **Step 5: Confirm green**

Run: `pnpm test src/components/blocks/ServiceabilityCheck.test.tsx`
Expected: PASS — 5 tests

- [ ] **Step 6: Build the listing and detail pages**

`src/app/[locale]/vehicles/page.tsx` — server component reading `searchParams`, calling
`parseCriteria` then `filterModels`, rendering `<ModelFilters>` (links that rewrite the query
string, so filtering works without JavaScript) and a `ModelCard` grid. Show the result count
from `vehicles.filters.results` and an empty state that clears filters.

`src/app/[locale]/vehicles/[slug]/page.tsx` — server component:
- `getModel(slug)`, `notFound()` when null
- `generateStaticParams` from `getModels()`
- `generateMetadata` with the model name and tagline
- `<ColourSwitcher>` client component tinting an SVG silhouette from `model.colours`
- `<PriceDual>` with `calculateEmi` at each tenure, tenure selectable
- `<SpecTable>` from `model.specs`
- `<ServiceabilityCheck>`
- Three CTAs: Buy online (`variant="primary"`, disabled with the note "Opens with checkout — book a test ride meanwhile"), Enroll in EMI (`secondary`, links to the calculator), Test ride (`ghost`)
- `<Accordion>` from `getFaqs(model.faqIds)`
- `<Claim id="no-registration" />` as the classification note
- `<StickyCtaBar>` fixed on viewports under `md`, carrying the monthly figure and the test-ride link

- [ ] **Step 7: Verify at 360px and commit**

```bash
pnpm dev
```

Check `/en/vehicles` and `/en/vehicles/adhara-neev` at 360px: no horizontal scroll, sticky bar visible, no CTA-guard warning.

```bash
pnpm test && pnpm build
git add -A
git commit -m "feat: model listing with URL-state filters and model detail with serviceability"
```

---

### Task 13: EMI hub and calculator

**Files:**
- Create: `src/app/[locale]/emi/page.tsx`, `src/app/[locale]/emi/calculator/page.tsx`, `src/components/blocks/EmiCalculator.tsx`, `src/components/blocks/EmiInterestForm.tsx`, `src/app/actions/submit-lead.ts`
- Test: `src/components/blocks/EmiCalculator.test.tsx`

**Interfaces:**
- Consumes: `calculateEmi`, `scheme`, `getModels`, `submitLead`, `PriceDual`, `Claim`
- Produces: `submitLeadAction(formData: FormData): Promise<SubmitResult>` server action

- [ ] **Step 1: Write the failing calculator test**

Create `src/components/blocks/EmiCalculator.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { EmiCalculator } from './EmiCalculator'
import { getModels } from '@/lib/data/models'

const models = await getModels()

afterEach(cleanup)

describe('EmiCalculator', () => {
  it('shows a monthly figure for the default selection', () => {
    render(<EmiCalculator models={models} />)
    expect(screen.getByTestId('emi-monthly').textContent).toMatch(/₹[\d,]+/)
  })

  it('always shows the total and the premium over paying in full', () => {
    render(<EmiCalculator models={models} />)
    expect(screen.getByTestId('emi-total').textContent).toMatch(/₹[\d,]+/)
    expect(screen.getByTestId('emi-premium').textContent).toMatch(/₹[\d,]+/)
  })

  it('recalculates when the tenure changes, and a longer tenure lowers the monthly', async () => {
    render(<EmiCalculator models={models} />)
    const before = screen.getByTestId('emi-monthly').textContent
    await userEvent.selectOptions(screen.getByLabelText(/tenure/i), '24')
    expect(screen.getByTestId('emi-monthly').textContent).not.toBe(before)
  })

  it('recalculates when the model changes', async () => {
    render(<EmiCalculator models={models} />)
    const before = screen.getByTestId('emi-monthly').textContent
    await userEvent.selectOptions(screen.getByLabelText(/model/i), 'adhara-bhaar')
    expect(screen.getByTestId('emi-monthly').textContent).not.toBe(before)
  })

  it('states how many payments unlock delivery', () => {
    render(<EmiCalculator models={models} />)
    expect(screen.getByTestId('emi-eligibility').textContent).toMatch(/\d+/)
  })

  it('offers only the tenures the scheme actually supports', () => {
    render(<EmiCalculator models={models} />)
    const options = screen.getAllByRole('option').map((o) => o.getAttribute('value'))
    expect(options).toContain('12')
    expect(options).toContain('24')
    expect(options).not.toContain('9')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm test src/components/blocks/EmiCalculator.test.tsx`
Expected: FAIL — cannot resolve `./EmiCalculator`

- [ ] **Step 3: Implement the calculator**

Create `src/components/blocks/EmiCalculator.tsx` as a client component. Non-negotiable
detail: `emi-total` and `emi-premium` render unconditionally next to `emi-monthly`, with the
`emi.calculator.transparencyNote` string beneath them. There is no state in which the monthly
figure appears without its total.

```tsx
'use client'

import { useState } from 'react'
import { Field } from '@/components/ui/Field'
import { formatRupees } from '@/lib/format'
import { calculateEmi, scheme } from '@/lib/emi'
import type { VehicleModel } from '@/lib/data/types'

export function EmiCalculator({ models }: { models: VehicleModel[] }) {
  const [slug, setSlug] = useState(models[0].slug)
  const [tenure, setTenure] = useState<number>(scheme.tenures[0])

  const model = models.find((m) => m.slug === slug) ?? models[0]
  const emi = calculateEmi({ priceInr: model.priceInr, tenureMonths: tenure })

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <Field id="emi-model" label="Model">
          <select
            id="emi-model"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-md border border-forest/25 bg-surface px-3 py-2.5 text-ink"
          >
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name} — {formatRupees(m.priceInr)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="emi-tenure" label="Tenure">
          <select
            id="emi-tenure"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="rounded-md border border-forest/25 bg-surface px-3 py-2.5 text-ink"
          >
            {scheme.tenures.map((t) => (
              <option key={t} value={t}>
                {t} months
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="tnum flex flex-col gap-4 rounded-lg bg-forest p-6 text-white">
        <div>
          <p className="text-sm text-white/70">Monthly payment</p>
          <p data-testid="emi-monthly" className="text-4xl font-semibold">
            {formatRupees(emi.monthly)}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-sm">
          <div>
            <dt className="text-white/70">Total you'll pay</dt>
            <dd data-testid="emi-total" className="text-lg font-medium">{formatRupees(emi.total)}</dd>
          </div>
          <div>
            <dt className="text-white/70">Premium over full price</dt>
            <dd data-testid="emi-premium" className="text-lg font-medium">
              {formatRupees(emi.premium)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-white/70">Delivery unlocked after</dt>
            <dd data-testid="emi-eligibility" className="text-lg font-medium">
              {emi.eligibilityAfterPayments} monthly payments
            </dd>
          </div>
        </dl>
        <p className="border-t border-white/15 pt-4 text-sm text-white/80">
          This is what the scheme costs compared with paying {formatRupees(model.priceInr)} today.
          We show it because you should be able to choose with your eyes open.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Confirm green**

Run: `pnpm test src/components/blocks/EmiCalculator.test.tsx`
Expected: PASS — 6 tests

- [ ] **Step 5: Add the server action and the interest form**

Create `src/app/actions/submit-lead.ts`:

```ts
'use server'

import { cookies, headers } from 'next/headers'
import { ATTRIBUTION_COOKIE, parseAttribution, submitLead, type SubmitResult } from '@/lib/leads'

export async function submitLeadAction(formData: FormData): Promise<SubmitResult> {
  const jar = await cookies()
  const stored = jar.get(ATTRIBUTION_COOKIE)?.value
  const attribution = stored
    ? JSON.parse(stored)
    : parseAttribution(new URLSearchParams())

  const h = await headers()
  const clientKey = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  return submitLead(
    {
      kind: formData.get('kind'),
      name: formData.get('name'),
      phone: formData.get('phone'),
      pincode: formData.get('pincode') || undefined,
      modelSlug: formData.get('modelSlug') || undefined,
      message: formData.get('message') || undefined,
    },
    attribution,
    clientKey,
  )
}
```

Create `src/components/blocks/EmiInterestForm.tsx` — a client component using `useActionState`
over `submitLeadAction`, with `kind="emi-interest"`, name and phone fields via `<Field>`, a
hidden `modelSlug`, inline errors from the returned message, a success state showing the lead
id, and **input preserved on failure** with a visible phone number as fallback.

- [ ] **Step 6: Build both pages**

`src/app/[locale]/emi/page.tsx` — How It Works. The four scheme steps in prose, the
`emi.whyNoBankBody` explainer, `<Claim id="no-credit-check" />`, a link to the calculator as
the page's single primary CTA, and an honest note that the versioned scheme T&C page publishes
once legal sign-off concludes.

`src/app/[locale]/emi/calculator/page.tsx` — `<EmiCalculator models={await getModels()} />`
followed by `<EmiInterestForm>`. Where Section 5.4 wanted a deep link into enrollment, the
copy states that enrollment opens with checkout and the form captures interest now.

- [ ] **Step 7: Full verification and commit**

```bash
pnpm test && pnpm build
```

Then `pnpm dev` and walk `/en` → `/en/vehicles` → a model → `/en/emi/calculator`, submitting the
interest form once. Confirm `.data/leads.jsonl` gained a record. Then load
`/en?ref=PROMO123`, submit again, and confirm the second record carries
`attribution.referralCode === "PROMO123"` — that is Section 6's attribution requirement
verified rather than assumed.

```bash
git add -A
git commit -m "feat: EMI hub and calculator with premium transparency and interest capture"
```

---

## Deliberate deferrals

Two things a reviewer might read as gaps are deferrals, recorded here so they are not
mistaken for oversights.

**`ChargeState` has no consumer in this plan.** Spec section 3.5 requires the battery-state
metaphor to exist as one component, and Task 5 builds and tests it. Its consumers — EMI
ledger status, order status, dealer-slot availability — all live in Plan 2 and sub-project C.
It is built now so those pages cannot invent a second version of the metaphor later.

**Playwright, axe and Lighthouse are Plan 2.** Spec section 8 specifies all three. This plan
carries the Vitest half — including the two highest-value suites, the EMI maths and the lead
pipeline — plus the manual verification steps in Tasks 11, 12 and 13. Automating the browser
journeys is the first task of Plan 2, before the five remaining pages are added, so the
harness exists before there is more surface to regress.

## Definition of done for this plan

- [ ] `pnpm test` green; `pnpm build` clean
- [ ] `pnpm tokens:build` emits `tokens.css`, `figma-variables.json`, `app-tokens.json`
- [ ] `/en` and `/hi` both render; `/` redirects to `/en`
- [ ] No CTA-guard warning on any of the five pages
- [ ] The boundary test passes — nothing outside `lib/data` and `lib/legal` imports `@/content`
- [ ] `no-registration` renders its neutral fallback, never the claim
- [ ] No testimonial renders, because none is approved
- [ ] Every monthly figure appears with its full price, total and premium
- [ ] `?ref=CODE` survives into a stored lead
- [ ] Every page usable at 360px with no horizontal scroll
