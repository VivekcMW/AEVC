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
