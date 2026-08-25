'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { Field } from '@/components/ui/Field'
import { ChargeState } from '@/components/ui/ChargeState'
import { submitLeadAction } from '@/app/actions/submit-lead'
import type { SubmitResult } from '@/lib/leads'

const inputClass =
  'w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35'

export function EmiInterestForm({ modelSlug }: { modelSlug?: string }) {
  const t = useTranslations('emi.interest')
  const [result, action, pending] = useActionState<SubmitResult | null, FormData>(
    submitLeadAction,
    null,
  )

  if (result?.ok) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border-l-4 border-charge-full bg-surface p-6">
        <ChargeState status="full" label={t('successTitle')} />
        <p className="tnum text-ink/80">{t('successBody', { id: result.id })}</p>
      </div>
    )
  }

  const error = result && !result.ok ? result.error : undefined

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-lg border border-forest/12 bg-surface p-5 sm:p-6"
    >
      <div>
        <h2 className="font-heading text-xl font-semibold text-ink">{t('title')}</h2>
        <p className="mt-1.5 text-sm text-ink/70">{t('body')}</p>
      </div>

      <input type="hidden" name="kind" value="emi-interest" />
      {modelSlug && <input type="hidden" name="modelSlug" value={modelSlug} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="lead-name" label={t('name')}>
          {/* defaultValue is absent deliberately: an uncontrolled input keeps the user's
              text through a failed submission, which is the whole point of not losing a lead. */}
          <input id="lead-name" name="name" autoComplete="name" required className={inputClass} />
        </Field>

        <Field id="lead-phone" label={t('phone')} hint={t('phoneHint')}>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            required
            placeholder="9876543210"
            className={`tnum ${inputClass}`}
          />
        </Field>
      </div>

      <Field id="lead-pincode" label={t('pincode')}>
        <input
          id="lead-pincode"
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="411001"
          className={`tnum ${inputClass} sm:max-w-[12rem]`}
        />
      </Field>

      {error && (
        <div className="flex flex-col gap-2">
          <ChargeState status="out" label={error} />
          <p className="text-sm text-ink/70">{t('fallback')}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-forest px-6 py-3 font-medium text-white transition-colors hover:bg-forest-hover disabled:opacity-60"
      >
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
