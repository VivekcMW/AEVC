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
