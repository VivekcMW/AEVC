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
