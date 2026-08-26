import { describe, expect, it } from 'vitest'
import { mockPaymentAdapter } from './mock-adapter'

describe('mockPaymentAdapter', () => {
  it('creates an order carrying the requested amount and model', async () => {
    const order = await mockPaymentAdapter.createOrder({ amount: 54990, modelSlug: 'adhara-neev' })
    expect(order.amount).toBe(54990)
    expect(order.orderId).toContain('ADHARA-NEEV')
  })

  it('confirms payment with a booking id derived from the order', async () => {
    const order = await mockPaymentAdapter.createOrder({ amount: 1000, modelSlug: 'x' })
    const result = await mockPaymentAdapter.confirmPayment(order.orderId)
    expect(result.status).toBe('success')
    expect(result.bookingId).toMatch(/^ADH-/)
  })
})
