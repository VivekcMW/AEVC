'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ChargeState } from '@/components/ui/ChargeState'
import { Field } from '@/components/ui/Field'
import { requestOtp, verifyOtp } from '@/lib/auth/otp'
import { buildLedger } from '@/lib/emi'
import { formatRupees } from '@/lib/format'
import type { VehicleModel } from '@/lib/data/types'

const inputClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35'

// Demo account fixture — stands in until the platform API decision unblocks a real one.
const DEMO_TENURE = 12
const DEMO_MONTHS_PAID = 3

type OtpState = 'idle' | 'sending' | 'sent' | 'verifying' | 'invalidPhone' | 'invalidCode' | 'verified'

/**
 * My Account pre-work: OTP login (stubbed provider) gates a read-only EMI ledger view
 * driven by ChargeState — both buildable ahead of Plan 4's platform-API decision.
 */
export function AccountView({ demoModel }: { demoModel: VehicleModel }) {
  const t = useTranslations('account')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [state, setState] = useState<OtpState>('idle')

  const ledger = useMemo(
    () =>
      buildLedger({
        priceInr: demoModel.priceInr,
        tenureMonths: DEMO_TENURE,
        monthsPaid: DEMO_MONTHS_PAID,
      }),
    [demoModel],
  )

  async function sendOtp() {
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setState('invalidPhone')
      return
    }
    setState('sending')
    const result = await requestOtp(phone)
    setOtpSent(result.sent)
    setState(result.sent ? 'sent' : 'invalidPhone')
  }

  async function checkOtp(event: React.FormEvent) {
    event.preventDefault()
    setState('verifying')
    const result = await verifyOtp(phone, code)
    setState(result.verified ? 'verified' : 'invalidCode')
  }

  function logout() {
    setState('idle')
    setOtpSent(false)
    setPhone('')
    setCode('')
  }

  if (state !== 'verified') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="display text-display-sm text-ink">{t('title')}</h1>
          <p className="mt-3 max-w-lg text-ink/70">{t('subtitle')}</p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-forest/12 bg-surface p-5 sm:p-6">
          <Field
            id="account-phone"
            label={t('otp.phoneLabel')}
            error={state === 'invalidPhone' ? t('otp.invalidPhone') : undefined}
          >
            <input
              id="account-phone"
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
            disabled={state === 'sending'}
            className="self-start"
          >
            {state === 'sending' ? t('otp.sending') : t('otp.requestCta')}
          </Button>

          {otpSent && (
            <form onSubmit={checkOtp} className="flex flex-col gap-3">
              <ChargeState status="full" label={t('otp.sentNotice', { phone })} />
              <Field
                id="account-otp"
                label={t('otp.codeLabel')}
                hint={t('otp.codeHint')}
                error={state === 'invalidCode' ? t('otp.invalidCode') : undefined}
              >
                <input
                  id="account-otp"
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
                disabled={state === 'verifying'}
                className="self-start"
              >
                {state === 'verifying' ? t('otp.verifying') : t('otp.verifyCta')}
              </Button>
            </form>
          )}
        </div>
      </div>
    )
  }

  const paidCount = ledger.filter((i) => i.status === 'paid').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="display text-display-sm text-ink">{t('title')}</h1>
        <Button variant="ghost" size="md" onClick={logout}>
          {t('ledger.logout')}
        </Button>
      </div>

      <div className="rounded-lg border border-forest/12 bg-surface p-5 sm:p-6">
        <h2 className="font-heading text-xl font-semibold text-ink">{t('ledger.heading')}</h2>
        <p className="mt-1 text-sm text-ink/60">
          {t('ledger.model')}: {demoModel.name} ·{' '}
          {t('ledger.summaryPaid', { count: paidCount, total: ledger.length })}
        </p>

        <ul className="tnum mt-5 flex flex-col divide-y divide-forest/10">
          {ledger.map((installment) => (
            <li key={installment.month} className="flex items-center justify-between gap-4 py-3">
              <span className="text-ink/75">
                {t('ledger.monthColumn')} {installment.month}
              </span>
              <span className="font-medium text-ink">{formatRupees(installment.amount)}</span>
              {installment.status === 'paid' && <ChargeState status="full" label={t('ledger.statusPaid')} />}
              {installment.status === 'due' && <ChargeState status="low" label={t('ledger.statusDue')} />}
              {installment.status === 'upcoming' && (
                <span className="text-sm text-ink/45">{t('ledger.statusUpcoming')}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
