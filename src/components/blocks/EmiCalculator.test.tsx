import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, describe, expect, it } from 'vitest'
import messages from '@/messages/en.json'
import { getModels } from '@/lib/data/models'
import { EmiCalculator } from './EmiCalculator'

const models = await getModels()

afterEach(cleanup)

function renderCalculator() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <EmiCalculator models={models} />
    </NextIntlClientProvider>,
  )
}

describe('EmiCalculator', () => {
  it('shows a monthly figure for the default selection', () => {
    renderCalculator()
    expect(screen.getByTestId('emi-monthly').textContent).toMatch(/₹[\d,]+/)
  })

  it('always shows the total and the premium over paying in full', () => {
    renderCalculator()
    expect(screen.getByTestId('emi-total').textContent).toMatch(/₹[\d,]+/)
    expect(screen.getByTestId('emi-premium').textContent).toMatch(/₹[\d,]+/)
  })

  it('recalculates when the tenure changes, and a longer tenure lowers the monthly', async () => {
    renderCalculator()
    const before = screen.getByTestId('emi-monthly').textContent
    await userEvent.selectOptions(screen.getByLabelText(/tenure/i), '24')
    const after = screen.getByTestId('emi-monthly').textContent
    expect(after).not.toBe(before)
    const num = (s: string | null) => Number((s ?? '').replace(/[^\d]/g, ''))
    expect(num(after)).toBeLessThan(num(before))
  })

  it('recalculates when the model changes', async () => {
    renderCalculator()
    const before = screen.getByTestId('emi-monthly').textContent
    await userEvent.selectOptions(screen.getByLabelText(/model/i), 'adhara-bhaar')
    expect(screen.getByTestId('emi-monthly').textContent).not.toBe(before)
  })

  it('states how many payments unlock delivery', () => {
    renderCalculator()
    expect(screen.getByTestId('emi-eligibility').textContent).toMatch(/\d+/)
  })

  it('offers only the tenures the scheme actually supports', () => {
    renderCalculator()
    const values = screen
      .getAllByRole('option')
      .map((o) => o.getAttribute('value'))
      .filter((v) => /^\d+$/.test(v ?? ''))
    expect(values).toEqual(['12', '18', '24'])
  })

  it('honours a preselected model from the URL, so a model-page link lands correctly', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <EmiCalculator models={models} initialSlug="adhara-bhaar" />
      </NextIntlClientProvider>,
    )
    expect((screen.getByLabelText(/model/i) as HTMLSelectElement).value).toBe('adhara-bhaar')
  })

  it('shows the premium as a real number, never zero or blank', () => {
    renderCalculator()
    const premium = Number(screen.getByTestId('emi-premium').textContent?.replace(/[^\d]/g, ''))
    expect(premium).toBeGreaterThan(0)
  })
})
