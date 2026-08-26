import type { PaymentAdapter } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock implementation of PaymentAdapter — no real gateway is wired up. Always
 * succeeds, so the checkout step machine can be built and tested before the gateway
 * decision lands.
 */
export const mockPaymentAdapter: PaymentAdapter = {
  async createOrder({ amount, modelSlug }) {
    await delay(400)
    return { orderId: `MOCK-${modelSlug.toUpperCase()}-${Date.now()}`, amount }
  },

  async confirmPayment(orderId) {
    await delay(600)
    return { status: 'success', bookingId: `ADH-${orderId.slice(-6)}` }
  },
}
