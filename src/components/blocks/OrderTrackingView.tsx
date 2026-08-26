'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ChargeState } from '@/components/ui/ChargeState'
import { Field } from '@/components/ui/Field'

const inputClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35'
const REFERENCE = /^ADH-\d{6}$/i
const PHONE = /^[6-9][0-9]{9}$/

type Status = 'enrolled' | 'paying' | 'eligible' | 'delivered'
const STATUSES: Status[] = ['enrolled', 'paying', 'eligible', 'delivered']

/** Deterministic mock lookup — the same reference always resolves to the same status. */
function mockStatus(reference: string): Status {
  const digits = reference.replace(/\D/g, '')
  const sum = digits.split('').reduce((total, d) => total + Number(d), 0)
  return STATUSES[sum % STATUSES.length]
}

/** Previews the My Account order-status view with mock data, ahead of the platform API. */
export function OrderTrackingView() {
  const t = useTranslations('orders')
  const [reference, setReference] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState<'idle' | 'checking' | 'notFound' | Status>('idle')

  async function check(event: React.FormEvent) {
    event.preventDefault()
    if (!REFERENCE.test(reference) || !PHONE.test(phone)) {
      setState('notFound')
      return
    }
    setState('checking')
    await new Promise((resolve) => setTimeout(resolve, 500))
    setState(mockStatus(reference))
  }

  const statusLabel: Record<Status, string> = {
    enrolled: t('statusEnrolled'),
    paying: t('statusPaying'),
    eligible: t('statusEligible'),
    delivered: t('statusDelivered'),
  }
  const statusTone: Record<Status, 'full' | 'low' | 'out'> = {
    enrolled: 'low',
    paying: 'low',
    eligible: 'full',
    delivered: 'full',
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={check}
        className="flex flex-col gap-4 rounded-lg border border-forest/12 bg-surface p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="order-reference" label={t('referenceLabel')}>
            <input
              id="order-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder={t('referencePlaceholder')}
              className={`tnum ${inputClass}`}
            />
          </Field>
          <Field id="order-phone" label={t('phoneLabel')}>
            <input
              id="order-phone"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder={t('phonePlaceholder')}
              className={`tnum ${inputClass}`}
            />
          </Field>
        </div>
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={state === 'checking'}
          className="self-start"
        >
          {state === 'checking' ? t('checking') : t('checkCta')}
        </Button>
      </form>

      {state === 'notFound' && <ChargeState status="out" label={t('notFound')} />}
      {STATUSES.includes(state as Status) && (
        <ChargeState status={statusTone[state as Status]} label={statusLabel[state as Status]} />
      )}
    </div>
  )
}
