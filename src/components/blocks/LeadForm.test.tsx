import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderIntl } from '@/test/render'
import { LeadForm } from './LeadForm'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('LeadForm', () => {
  it('renders only the fields it was asked for', () => {
    renderIntl(<LeadForm kind="test-ride" fields={['name', 'phone']} namespace="testRide.form" />)
    expect(screen.getByLabelText(/your name/i)).toBeDefined()
    expect(screen.getByLabelText(/mobile number/i)).toBeDefined()
    expect(screen.queryByLabelText(/^pincode$/i)).toBeNull()
  })

  it('carries the lead kind in a hidden input', () => {
    const { container } = renderIntl(
      <LeadForm kind="promoter" fields={['name', 'phone']} namespace="partner.promoter.form" />,
    )
    expect(container.querySelector('input[name="kind"]')).toHaveProperty('value', 'promoter')
  })

  it('passes hidden context through, so a booking keeps its dealer and slot', () => {
    const { container } = renderIntl(
      <LeadForm
        kind="test-ride"
        fields={['name', 'phone']}
        hidden={{ dealerId: 'd-pune-01', slotId: 's1' }}
        namespace="testRide.form"
      />,
    )
    expect(container.querySelector('input[name="dealerId"]')).toHaveProperty('value', 'd-pune-01')
    expect(container.querySelector('input[name="slotId"]')).toHaveProperty('value', 's1')
  })

  it('marks name and phone required, because a lead without them is not a lead', () => {
    renderIntl(<LeadForm kind="enquiry" fields={['name', 'phone']} namespace="contact.form" />)
    expect(screen.getByLabelText(/your name/i)).toHaveProperty('required', true)
    expect(screen.getByLabelText(/mobile number/i)).toHaveProperty('required', true)
  })

  it('keeps the phone field numeric-only on mobile keyboards', () => {
    renderIntl(<LeadForm kind="enquiry" fields={['name', 'phone']} namespace="contact.form" />)
    expect(screen.getByLabelText(/mobile number/i).getAttribute('inputMode')).toBe('numeric')
  })

  it('strips non-digits typed into the phone field', async () => {
    renderIntl(<LeadForm kind="enquiry" fields={['name', 'phone']} namespace="contact.form" />)
    const phone = screen.getByLabelText(/mobile number/i)
    await userEvent.type(phone, '98-76 54 3210')
    expect((phone as HTMLInputElement).value).toBe('9876543210')
  })
})
