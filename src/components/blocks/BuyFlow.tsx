'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ChargeState } from '@/components/ui/ChargeState'
import { Field } from '@/components/ui/Field'
import { requestOtp, verifyOtp } from '@/lib/auth/otp'
import { formatRupees } from '@/lib/format'
import { mockPaymentAdapter } from '@/lib/payments'
import type { ServiceabilityResult } from '@/lib/data/serviceability'
import type { VehicleModel } from '@/lib/data/types'

const STEPS = ['colour', 'pincode', 'accessories', 'identity', 'payment', 'confirmation'] as const
type Step = (typeof STEPS)[number]

const ACCESSORIES = [
  { id: 'helmet', priceInr: 899 },
  { id: 'phoneHolder', priceInr: 349 },
  { id: 'sideBags', priceInr: 1499 },
] as const

const inputClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35'

type PincodeState = { kind: 'idle' } | { kind: 'checking' } | { kind: 'invalid' } | ServiceabilityResult
type IdentityState = 'idle' | 'sending' | 'sent' | 'verifying' | 'invalidPhone' | 'invalidCode' | 'verified'

/**
 * The six-step checkout from proposal Section 5.3, built against a mock payment
 * adapter and a stubbed OTP provider — Plan 4's pre-work, ahead of the gateway and
 * legal decisions the real Buy Online flow is blocked on.
 */
export function BuyFlow({ model, locale }: { model: VehicleModel; locale: string }) {
  const t = useTranslations('buy')
  const [stepIndex, setStepIndex] = useState(0)
  const step: Step = STEPS[stepIndex]

  const [colour, setColour] = useState(model.colours[0])

  const [pincode, setPincode] = useState('')
  const [pincodeState, setPincodeState] = useState<PincodeState>({ kind: 'idle' })

  const [accessoryIds, setAccessoryIds] = useState<string[]>([])

  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [code, setCode] = useState('')
  const [identityState, setIdentityState] = useState<IdentityState>('idle')

  const [paying, setPaying] = useState(false)
  const [booking, setBooking] = useState<{ bookingId: string } | null>(null)

  const accessoriesTotal = ACCESSORIES.filter((a) => accessoryIds.includes(a.id)).reduce(
    (sum, a) => sum + a.priceInr,
    0,
  )
  const amount = model.priceInr + accessoriesTotal
  const pincodeStatus = 'kind' in pincodeState ? pincodeState.kind : pincodeState.status

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  async function checkPincode(event: React.FormEvent) {
    event.preventDefault()
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeState({ kind: 'invalid' })
      return
    }
    setPincodeState({ kind: 'checking' })
    try {
      const response = await fetch(`/api/serviceability?pincode=${encodeURIComponent(pincode)}`)
      setPincodeState((await response.json()) as ServiceabilityResult)
    } catch {
      setPincodeState({ status: 'failed' })
    }
  }

  function toggleAccessory(id: string) {
    setAccessoryIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]))
  }

  async function sendOtp() {
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setIdentityState('invalidPhone')
      return
    }
    setIdentityState('sending')
    const result = await requestOtp(phone)
    setOtpSent(result.sent)
    setIdentityState(result.sent ? 'sent' : 'invalidPhone')
  }

  async function checkOtp(event: React.FormEvent) {
    event.preventDefault()
    setIdentityState('verifying')
    const result = await verifyOtp(phone, code)
    if (result.verified) {
      setIdentityState('verified')
      goNext()
    } else {
      setIdentityState('invalidCode')
    }
  }

  async function pay() {
    setPaying(true)
    const order = await mockPaymentAdapter.createOrder({ amount, modelSlug: model.slug })
    const result = await mockPaymentAdapter.confirmPayment(order.orderId)
    setPaying(false)
    if (result.status === 'success' && result.bookingId) {
      setBooking({ bookingId: result.bookingId })
      goNext()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-md border border-turmeric/40 bg-turmeric/10 px-4 py-3 text-sm text-ink/80">
        {t('notice')}
      </p>

      {step !== 'confirmation' && (
        <p className="font-heading text-xs font-semibold tracking-[0.18em] text-ink/70 uppercase">
          {t('stepLabel', { current: stepIndex + 1, total: STEPS.length - 1 })} · {t(`steps.${step}`)}
        </p>
      )}

      <div className="rounded-lg border border-forest/12 bg-surface p-5 sm:p-6">
        {step === 'colour' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-ink">{t('colour.heading')}</h2>
            <fieldset className="flex flex-wrap items-center gap-3">
              {model.colours.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColour(c)}
                  aria-pressed={c.name === colour.name}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    c.name === colour.name
                      ? 'border-turmeric bg-turmeric/12 font-semibold text-ink'
                      : 'border-forest/20 text-ink/75 hover:border-forest/45'
                  }`}
                >
                  <span
                    aria-hidden
                    className="size-4 rounded-full border border-ink/15"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </fieldset>
            <Button variant="primary" size="lg" onClick={goNext} className="self-start">
              {t('colour.next')}
            </Button>
          </div>
        )}

        {step === 'pincode' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-ink">{t('pincode.heading')}</h2>
            <form onSubmit={checkPincode} className="flex flex-wrap items-end gap-3">
              <div className="min-w-[10rem] flex-1">
                <Field
                  id="buy-pincode"
                  label={t('pincode.label')}
                  error={pincodeStatus === 'invalid' ? t('pincode.invalid') : undefined}
                >
                  <input
                    id="buy-pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''))
                      setPincodeState({ kind: 'idle' })
                    }}
                    className={`tnum ${inputClass}`}
                    placeholder="411001"
                  />
                </Field>
              </div>
              <Button variant="secondary" size="md" type="submit" disabled={pincodeStatus === 'checking'}>
                {pincodeStatus === 'checking' ? t('pincode.checking') : t('pincode.check')}
              </Button>
            </form>
            {pincodeStatus === 'serviceable' && 'days' in pincodeState && (
              <ChargeState status="full" label={t('pincode.yes', { pincode, days: pincodeState.days })} />
            )}
            {pincodeStatus === 'unserviceable' && (
              <ChargeState status="low" label={t('pincode.no', { pincode })} />
            )}
            {pincodeStatus === 'failed' && <ChargeState status="out" label={t('pincode.failed')} />}
            <div className="flex gap-3">
              <Button variant="ghost" size="md" onClick={goBack}>
                {t('pincode.back')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={goNext}
                disabled={pincodeStatus !== 'serviceable'}
              >
                {t('pincode.next')}
              </Button>
            </div>
          </div>
        )}

        {step === 'accessories' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-ink">{t('accessories.heading')}</h2>
            <fieldset className="flex flex-col gap-2">
              {ACCESSORIES.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-forest/15 px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-ink">
                    <input
                      type="checkbox"
                      checked={accessoryIds.includes(a.id)}
                      onChange={() => toggleAccessory(a.id)}
                    />
                    {t(`accessories.${a.id}`)}
                  </span>
                  <span className="tnum text-sm text-ink/70">{formatRupees(a.priceInr)}</span>
                </label>
              ))}
            </fieldset>
            <div className="flex gap-3">
              <Button variant="ghost" size="md" onClick={goBack}>
                {t('accessories.back')}
              </Button>
              <Button variant="primary" size="md" onClick={goNext}>
                {t('accessories.next')}
              </Button>
            </div>
          </div>
        )}

        {step === 'identity' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-ink">{t('identity.heading')}</h2>
            <Field
              id="buy-phone"
              label={t('identity.phoneLabel')}
              error={identityState === 'invalidPhone' ? t('identity.invalidPhone') : undefined}
            >
              <input
                id="buy-phone"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className={`tnum ${inputClass}`}
                placeholder="9876543210"
              />
            </Field>
            <Button
              variant="secondary"
              size="md"
              onClick={sendOtp}
              disabled={identityState === 'sending'}
              className="self-start"
            >
              {identityState === 'sending' ? t('identity.sending') : t('identity.requestCta')}
            </Button>

            {otpSent && (
              <form onSubmit={checkOtp} className="flex flex-col gap-3">
                <ChargeState status="full" label={t('identity.sentNotice', { phone })} />
                <Field
                  id="buy-otp"
                  label={t('identity.codeLabel')}
                  hint={t('identity.codeHint')}
                  error={identityState === 'invalidCode' ? t('identity.invalidCode') : undefined}
                >
                  <input
                    id="buy-otp"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className={`tnum ${inputClass}`}
                  />
                </Field>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={identityState === 'verifying'}
                  className="self-start"
                >
                  {identityState === 'verifying' ? t('identity.verifying') : t('identity.verifyCta')}
                </Button>
              </form>
            )}
            <Button variant="ghost" size="md" onClick={goBack} className="self-start">
              {t('identity.back')}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-ink">{t('payment.heading')}</h2>
            <dl className="flex items-center justify-between text-lg">
              <dt className="text-ink/70">{t('payment.summary')}</dt>
              <dd className="tnum font-semibold text-ink">{formatRupees(amount)}</dd>
            </dl>
            <p className="text-sm text-ink/60">{t('payment.notice')}</p>
            <div className="flex gap-3">
              <Button variant="ghost" size="md" onClick={goBack}>
                {t('payment.back')}
              </Button>
              <Button variant="primary" size="lg" onClick={pay} disabled={paying}>
                {paying ? t('payment.paying') : t('payment.payCta', { amount: formatRupees(amount) })}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && booking && (
          <div className="flex flex-col items-start gap-4">
            <ChargeState status="full" label={t('confirmation.heading')} />
            <p className="tnum text-ink/80">{t('confirmation.body', { bookingId: booking.bookingId })}</p>
            <Button variant="primary" size="lg" href={`/${locale}`}>
              {t('confirmation.backHome')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
