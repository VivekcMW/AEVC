import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ModelCard } from './ModelCard'
import { resetCtaGuard } from '@/components/ui/cta-guard'
import { getModels } from '@/lib/data/models'

const models = await getModels()

afterEach(() => {
  cleanup()
  resetCtaGuard()
})

describe('ModelCard', () => {
  it('shows the monthly figure beside the full price, never alone', () => {
    render(<ModelCard model={models[0]} />)
    expect(screen.getByText('₹54,990')).toBeDefined()
    expect(screen.getByText(/month/)).toBeDefined()
  })

  it('names the model and links to its detail page', () => {
    render(<ModelCard model={models[0]} />)
    const link = screen.getByRole('link', { name: new RegExp(models[0].name, 'i') })
    expect(link.getAttribute('href')).toContain(models[0].slug)
  })

  it('states range and top speed, the two specs that decide the category', () => {
    render(<ModelCard model={models[0]} />)
    expect(screen.getByText(/65/)).toBeDefined()
    expect(screen.getByText(/25/)).toBeDefined()
  })

  it('uses no primary CTA, because a card is never the page CTA', () => {
    const { container } = render(<ModelCard model={models[0]} />)
    expect(container.querySelector('.bg-turmeric')).toBeNull()
  })

  it('respects the locale in the link it builds', () => {
    render(<ModelCard model={models[0]} locale="hi" />)
    expect(
      screen.getByRole('link', { name: new RegExp(models[0].name, 'i') }).getAttribute('href'),
    ).toBe('/hi/vehicles/adhara-neev')
  })
})
