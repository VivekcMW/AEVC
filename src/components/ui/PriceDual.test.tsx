import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderIntl } from '@/test/render'
import { PriceDual } from './PriceDual'

afterEach(cleanup)

describe('PriceDual', () => {
  it('renders the full price and the monthly figure together, always', () => {
    renderIntl(<PriceDual full={54990} monthly={5407} tenure={12} />)
    expect(screen.getByText('₹54,990')).toBeDefined()
    expect(screen.getByText(/₹5,407/)).toBeDefined()
  })

  it('states the tenure, so a monthly figure is never context-free', () => {
    renderIntl(<PriceDual full={54990} monthly={5407} tenure={12} />)
    expect(screen.getByText(/12 months/)).toBeDefined()
  })

  it('applies tabular numerals so columns of prices align', () => {
    const { container } = renderIntl(<PriceDual full={54990} monthly={5407} tenure={12} />)
    expect(container.querySelector('.tnum')).not.toBeNull()
  })

  it('renders its copy from the catalog, so a Hindi page shows Hindi', () => {
    renderIntl(<PriceDual full={54990} monthly={5407} tenure={12} />, 'hi')
    expect(screen.getByText(/महीना/)).toBeDefined()
    expect(screen.queryByText(/\/month/)).toBeNull()
  })
})
