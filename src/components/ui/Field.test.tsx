import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Field } from './Field'

afterEach(cleanup)

describe('Field', () => {
  it('associates the label with the control', () => {
    render(
      <Field id="pincode" label="Pincode">
        <input id="pincode" />
      </Field>,
    )
    expect(screen.getByLabelText('Pincode')).toBeDefined()
  })

  it('points the control at its hint via aria-describedby', () => {
    render(
      <Field id="phone" label="Mobile number" hint="Ten digits, no country code.">
        <input id="phone" />
      </Field>,
    )
    expect(screen.getByLabelText('Mobile number').getAttribute('aria-describedby')).toBe('phone-hint')
  })

  it('points the control at both hint and error when both are present', () => {
    render(
      <Field id="phone" label="Mobile number" hint="Ten digits." error="Too short">
        <input id="phone" />
      </Field>,
    )
    expect(screen.getByLabelText('Mobile number').getAttribute('aria-describedby')).toBe(
      'phone-hint phone-error',
    )
  })

  it('marks the control invalid so assistive tech announces the failure', () => {
    render(
      <Field id="phone" label="Mobile number" error="Too short">
        <input id="phone" />
      </Field>,
    )
    expect(screen.getByLabelText('Mobile number').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByRole('alert').textContent).toBe('Too short')
  })

  it('sets no aria-describedby when there is nothing to describe', () => {
    render(
      <Field id="name" label="Your name">
        <input id="name" />
      </Field>,
    )
    expect(screen.getByLabelText('Your name').getAttribute('aria-describedby')).toBeNull()
  })
})
