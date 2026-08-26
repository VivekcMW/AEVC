export type CreateOrderInput = { amount: number; modelSlug: string }
export type CreateOrderResult = { orderId: string; amount: number }
export type ConfirmPaymentResult = { status: 'success' | 'failed'; bookingId?: string }

/**
 * The seam Plan 4 is blocked on (payment gateway choice — Razorpay/Cashfree/PayU
 * differ in SDK shape, webhook signature scheme and UPI Autopay mandates). Callers
 * only ever see this interface, so swapping in a real gateway later is a one-file change.
 */
export type PaymentAdapter = {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>
  confirmPayment(orderId: string): Promise<ConfirmPaymentResult>
}
