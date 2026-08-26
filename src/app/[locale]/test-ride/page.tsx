import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LeadForm } from '@/components/blocks/LeadForm'
import { TestRideBooking } from '@/components/blocks/TestRideBooking'
import { findDealersNear } from '@/lib/data/dealers'
import { getSlots } from '@/lib/data/slots'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'testRide' })
  return { title: t('title'), description: t('intro') }
}

export default async function TestRidePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ near?: string; dealer?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { near, dealer } = await searchParams
  const t = await getTranslations({ locale, namespace: 'testRide' })

  const dealers = near ? await findDealersNear(near, 4) : []
  const slots = dealer ? await getSlots(dealer) : []

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pb-28">
      <h1 className="display text-display-sm text-ink">{t('title')}</h1>
      <span aria-hidden className="beam-lay mt-4 block h-0.5 w-16 bg-turmeric" />
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{t('intro')}</p>

      <div className="mt-10 rounded-xl border border-forest/12 bg-surface p-6 sm:p-8">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="near" className="text-sm font-medium text-ink">
              {t('pincodeLabel')}
            </label>
            <input
              id="near"
              name="near"
              defaultValue={near}
              placeholder="411001"
              className="tnum w-48 rounded-md border border-forest/25 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-forest px-5 py-2.5 font-medium text-white transition-colors hover:bg-forest-hover"
          >
            {t('search')}
          </button>
        </form>

        {near && !dealer && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-ink">{t('chooseDealer')}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {dealers.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`?near=${near}&dealer=${d.id}`}
                    className="block rounded-md border border-forest/20 px-4 py-3 text-ink transition-colors hover:border-forest/40"
                  >
                    <span className="font-medium">{d.name}</span>
                    <span className="tnum text-sm text-ink/60"> — {d.city}, {d.pincode}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dealer && slots.length > 0 && (
          <div className="mt-6">
            <TestRideBooking dealerId={dealer} slots={slots} />
          </div>
        )}
      </div>

      <div className="mt-10 rounded-xl border border-forest/12 bg-surface p-6 sm:p-8">
        <h2 className="font-heading text-xl font-semibold text-ink">{t('doorstepTitle')}</h2>
        <p className="mt-2 text-ink/70">{t('doorstepBody')}</p>
        <div className="mt-6">
          <LeadForm
            kind="doorstep-demo"
            fields={['name', 'phone', 'pincode']}
            namespace="testRide.doorstepForm"
          />
        </div>
      </div>
    </div>
  )
}
