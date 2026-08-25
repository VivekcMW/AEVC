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
    expect(container.querySelectorAll('[data-accent="true"]')).toHaveLength(1)
  })

  it('uses the accent exactly once in every variant', () => {
    for (const variant of ['crossbar', 'underline', 'stacked'] as const) {
      cleanup()
      const { container } = render(<Wordmark variant={variant} />)
      expect(container.querySelectorAll('[data-accent="true"]')).toHaveLength(1)
    }
  })

  it('hides the decorative beam from assistive technology', () => {
    const { container } = render(<Wordmark variant="underline" />)
    expect(container.querySelector('[data-accent="true"]')?.getAttribute('aria-hidden')).toBe('true')
  })
})
