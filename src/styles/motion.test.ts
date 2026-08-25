import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const raw = readFileSync('src/styles/motion.css', 'utf8')

/**
 * Comments are stripped before asserting. These tests check declarations, and a comment
 * that merely mentions `scaleX(0)` while explaining why it is absent should not satisfy —
 * or fail — an assertion about the CSS itself.
 */
const css = raw.replace(/\/\*[\s\S]*?\*\//g, '')
const components = [
  'src/components/blocks/Hero.tsx',
  'src/components/blocks/ModelCard.tsx',
  'src/components/blocks/EmiCalculator.tsx',
  'src/components/ui/PriceDual.tsx',
]

describe('reduced motion is honoured', () => {
  it('resets animation-timeline, not just duration', () => {
    // A scroll-driven animation derives progress from scroll position and ignores
    // duration entirely, so zeroing the duration alone leaves every reveal running.
    const reduce = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduce).toContain('animation-timeline: none !important')
  })

  it('also resets duration and iteration count for time-based animations', () => {
    const reduce = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduce).toContain('animation-duration: 0.01ms !important')
    expect(reduce).toContain('animation-iteration-count: 1 !important')
  })

  it('stops the skeleton shimmer, which is a looping animation', () => {
    const reduce = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduce).toContain('.skeleton')
  })

  it('gates every entrance and hover animation behind no-preference', () => {
    const gated = ['.enter-rise', '.enter-stagger', '.beam-lay', '.ring-draw', '.route-enter']
    for (const selector of gated) {
      const index = css.indexOf(`${selector} {`) >= 0 ? css.indexOf(`${selector} {`) : css.indexOf(selector)
      const preceding = css.slice(0, index)
      const lastNoPref = preceding.lastIndexOf('prefers-reduced-motion: no-preference')
      const lastReduce = preceding.lastIndexOf('prefers-reduced-motion: reduce')
      expect(lastNoPref, `${selector} is not inside a no-preference block`).toBeGreaterThan(lastReduce)
    }
  })

  it('never hides a decorative mark outside a running animation', () => {
    // A mark that only appears via animation is invisible whenever the animation stalls.
    // The beam-rule segment learned this the hard way: a view() timeline on a 2px
    // absolutely-positioned pseudo-element never activates, pinning it at scaleX(0).
    const base = css.slice(
      css.indexOf('.beam-rule::before {'),
      css.indexOf('@supports (animation-timeline: view())', css.indexOf('.beam-rule::before {')),
    )
    expect(base).not.toContain('scaleX(0)')
    expect(base).not.toContain('opacity: 0')
  })

  it('drives the beam-rule from its parent box, not from the pseudo-element', () => {
    expect(css).toContain('view-timeline-name: --beam-rule')
    const scoped = css.slice(css.indexOf('.beam-rule::before {'))
    expect(scoped).toContain('animation-timeline: --beam-rule')
    expect(scoped).not.toMatch(/\.beam-rule::before\s*\{[^}]*animation-timeline:\s*view\(\)/)
  })
})

describe('scroll reveals degrade to visible', () => {
  it('declares no base styles for .reveal outside the supports block', () => {
    // If `.reveal { opacity: 0 }` existed at top level, an unsupported browser would
    // render a blank page. Every reveal must be additive.
    const supportsIndex = css.indexOf('@supports (animation-timeline: view())')
    const beforeSupports = css.slice(0, supportsIndex)
    expect(beforeSupports).not.toMatch(/^\s*\.reveal\s*\{/m)
    expect(beforeSupports).not.toMatch(/^\s*\.reveal-stagger\s*>/m)
  })
})

describe('money never animates', () => {
  it('applies no animation or transition class to a price renderer', () => {
    const priceDual = readFileSync('src/components/ui/PriceDual.tsx', 'utf8')
    for (const banned of ['enter-', 'reveal', 'beam-lay', 'transition-', 'animate-']) {
      expect(priceDual, `PriceDual must not use ${banned}`).not.toContain(banned)
    }
  })

  it('declares no counter or number-tween keyframes anywhere', () => {
    // A rupee figure that counts up is a figure that is briefly wrong.
    expect(css).not.toMatch(/@keyframes\s+(count|tick|tally|number)/i)
  })
})

describe('the LCP candidate is never faded', () => {
  it('animates the hero headline with transform only', () => {
    const enterRise = css.slice(css.indexOf('@keyframes enter-rise'), css.indexOf('@keyframes enter-fade-rise'))
    expect(enterRise).toContain('transform')
    expect(enterRise).not.toContain('opacity')
  })

  it('gives the hero h1 enter-rise rather than the fading variant', () => {
    const hero = readFileSync('src/components/blocks/Hero.tsx', 'utf8')
    const h1 = hero.slice(hero.indexOf('<h1'), hero.indexOf('</h1>'))
    expect(h1).toContain('enter-rise')
    expect(h1).not.toContain('enter-stagger')
  })

  it('does not animate the route wrapper on first paint', () => {
    const wrapper = readFileSync('src/components/blocks/RouteTransition.tsx', 'utf8')
    expect(wrapper).toContain('isFirstRender')
  })
})

describe('animations are compositor-friendly', () => {
  it('animates only transform and opacity in keyframes, never layout properties', () => {
    const layoutProps = ['width:', 'height:', 'margin', 'padding', 'top:', 'left:']
    const keyframeBlocks = css.match(/@keyframes[^}]*\{[\s\S]*?\n\}/g) ?? []
    expect(keyframeBlocks.length).toBeGreaterThan(5)
    for (const block of keyframeBlocks) {
      // header-condense and shimmer animate paint-only properties, which is fine.
      if (/header-condense|shimmer/.test(block)) continue
      for (const prop of layoutProps) {
        expect(block, `keyframe animates layout property ${prop}`).not.toContain(prop)
      }
    }
  })
})

describe('every component using a motion class exists in the layer', () => {
  it('defines every motion class the components reference', () => {
    const used = new Set<string>()
    for (const file of components) {
      const source = readFileSync(file, 'utf8')
      for (const match of source.matchAll(/\b(enter-rise|enter-stagger|enter-delay-\d|beam-lay|reveal|reveal-stagger|reveal-beam|beam-rule|lift|link-grow|route-enter)\b/g)) {
        used.add(match[1])
      }
    }
    expect(used.size).toBeGreaterThan(0)
    for (const cls of used) {
      expect(css, `.${cls} is used but not defined`).toContain(`.${cls}`)
    }
  })
})
