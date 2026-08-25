import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Claim } from './Claim'

afterEach(cleanup)

describe('Claim', () => {
  it('renders the neutral fallback for an unapproved claim, never the claim itself', () => {
    render(<Claim id="no-registration" />)
    expect(screen.queryByText(/No licence or registration is required/i)).toBeNull()
    expect(screen.getByText(/low-speed specification/i)).toBeDefined()
  })

  it('flags the gap visibly in development so it cannot be forgotten', () => {
    render(<Claim id="no-registration" />)
    expect(screen.getByTestId('unapproved-claim')).toBeDefined()
  })

  it('renders an approved claim as written', () => {
    render(<Claim id="no-credit-check" />)
    expect(screen.getByText(/no credit check/i)).toBeDefined()
    expect(screen.queryByTestId('unapproved-claim')).toBeNull()
  })

  it('renders nothing at all for an unknown id', () => {
    const { container } = render(<Claim id="nope" />)
    expect(container.textContent).toBe('')
  })
})
