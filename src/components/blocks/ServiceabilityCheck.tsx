'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Field } from '@/components/ui/Field'
import { ChargeState } from '@/components/ui/ChargeState'
import type { ServiceabilityResult } from '@/lib/data/serviceability'

type State = { kind: 'idle' } | { kind: 'checking' } | { kind: 'invalid' } | ServiceabilityResult

const PINCODE = /^[1-9][0-9]{5}$/

export function ServiceabilityCheck({
  modelSlug,
  locale = 'en',
}: {
  modelSlug?: string
  locale?: string
}) {
  const t = useTranslations('model.serviceability')
  const tc = useTranslations('common.cta')
  const [pincode, setPincode] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  const status = 'kind' in state ? state.kind : state.status
  const busy = status === 'checking'

  async function check(event: React.FormEvent) {
    event.preventDefault()

    // Client-side first, so a typo never costs a round trip.
    if (!PINCODE.test(pincode)) {
      setState({ kind: 'invalid' })
      return
    }

    setState({ kind: 'checking' })
    try {
      const response = await fetch(`/api/serviceability?pincode=${encodeURIComponent(pincode)}`)
      if (!response.ok) {
        // An infrastructure failure must never read as "we don't deliver there".
        setState({ status: 'failed' })
        return
      }
      setState((await response.json()) as ServiceabilityResult)
    } catch {
      setState({ status: 'failed' })
    }
  }

  return (
    <div className="rounded-lg border border-forest/12 bg-surface p-5">
      <h3 className="font-heading text-lg font-semibold text-ink">{t('heading')}</h3>

      <form onSubmit={check} noValidate className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[10rem] flex-1">
          <Field
            id="pincode"
            label={t('label')}
            error={status === 'invalid' ? t('invalid') : undefined}
          >
            <input
              id="pincode"
              name="pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ''))
                setState({ kind: 'idle' })
              }}
              className="tnum w-full rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35"
              placeholder="411001"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-forest px-5 py-2.5 font-medium text-white transition-colors hover:bg-forest-hover disabled:opacity-60"
        >
          {busy ? t('checking') : status === 'failed' ? t('retry') : t('check')}
        </button>
      </form>

      <div aria-live="polite" className="mt-4 empty:mt-0">
        {status === 'serviceable' && 'days' in state && (
          <ChargeState status="full" label={t('yes', { pincode, days: state.days })} />
        )}
        {status === 'unserviceable' && (
          <div className="flex flex-col gap-3">
            <ChargeState status="low" label={t('no', { pincode })} />
            {/* An unserved pincode is a lead, not a dead end. */}
            <p className="text-sm text-ink/70">
              {t.rich('leadPrompt', {
                link: (chunks) => (
                  <a
                    href={`/${locale}/emi/calculator${modelSlug ? `?model=${modelSlug}` : ''}`}
                    className="font-semibold text-forest underline decoration-2 underline-offset-4 hover:decoration-turmeric"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        )}
        {status === 'failed' && <ChargeState status="out" label={t('failed')} />}
      </div>
    </div>
  )
}
