'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChargeState } from '@/components/ui/ChargeState'
import { Field } from '@/components/ui/Field'
import { submitLeadAction } from '@/app/actions/submit-lead'
import type { LeadKind } from '@/lib/leads/schema'
import type { SubmitResult } from '@/lib/leads'

export type FieldName = 'name' | 'phone' | 'pincode' | 'city' | 'message' | 'reference'

const inputClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35'

/**
 * Shared attributed lead form — a more general LeadForm.tsx alongside EnquiryForm.tsx:
 * this one supports arbitrary lead kinds, a configurable field set, and hidden context
 * (dealerId, slotId, modelSlug) that a booking flow needs to carry through the submit.
 */
export function LeadForm({
  kind,
  fields,
  hidden = {},
  namespace,
  submitLabel,
}: {
  kind: LeadKind
  fields: FieldName[]
  hidden?: Record<string, string>
  /** Namespace holding this form's own title and body copy. */
  namespace: string
  submitLabel?: string
}) {
  const t = useTranslations('common.form')
  const tp = useTranslations(namespace)
  const [phone, setPhone] = useState('')
  const [result, action, pending] = useActionState<SubmitResult | null, FormData>(
    submitLeadAction,
    null,
  )

  if (result?.ok) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border-l-4 border-charge-full bg-surface p-6">
        <ChargeState status="full" label={t('successTitle')} />
        <p className="tnum text-ink/80">{t('successBody', { id: result.id })}</p>
      </div>
    )
  }

  const error = result && !result.ok ? result.error : undefined

  return (
    <form
      action={action}
      className="flex flex-col gap-6 rounded-xl border border-forest/12 bg-surface p-6 sm:p-8"
    >
      <div>
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">
          {tp('title')}
        </h2>
        <p className="mt-2 text-ink/65">{tp('body')}</p>
      </div>

      <input type="hidden" name="kind" value={kind} />
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.includes('name') && (
          <Field id={`lead-${kind}-name`} label={t('name')}>
            <input
              id={`lead-${kind}-name`}
              name="name"
              autoComplete="name"
              required
              className={inputClass}
            />
          </Field>
        )}
        {fields.includes('phone') && (
          <Field id={`lead-${kind}-phone`} label={t('phone')} hint={t('phoneHint')}>
            <input
              id={`lead-${kind}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              className={`tnum ${inputClass}`}
            />
          </Field>
        )}
        {fields.includes('pincode') && (
          <Field id={`lead-${kind}-pincode`} label={t('pincode')}>
            <input
              id={`lead-${kind}-pincode`}
              name="pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="411001"
              className={`tnum ${inputClass}`}
            />
          </Field>
        )}
        {fields.includes('city') && (
          <Field id={`lead-${kind}-city`} label={t('city')}>
            <input
              id={`lead-${kind}-city`}
              name="city"
              autoComplete="address-level2"
              className={inputClass}
            />
          </Field>
        )}
        {fields.includes('reference') && (
          <Field id={`lead-${kind}-reference`} label={t('reference')} hint={t('referenceHint')}>
            <input id={`lead-${kind}-reference`} name="reference" className={inputClass} />
          </Field>
        )}
      </div>

      {fields.includes('message') && (
        <Field id={`lead-${kind}-message`} label={t('message')}>
          <textarea
            id={`lead-${kind}-message`}
            name="message"
            rows={4}
            maxLength={1000}
            className={inputClass}
          />
        </Field>
      )}

      {error && (
        <div className="flex flex-col gap-2">
          <ChargeState status="out" label={error} />
          <p className="text-sm text-ink/70">{t('fallback')}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-pill bg-forest px-7 py-3.5 font-medium text-white transition-colors hover:bg-forest-hover disabled:opacity-55"
      >
        {pending ? t('submitting') : (submitLabel ?? t('submit'))}
      </button>
    </form>
  )
}
