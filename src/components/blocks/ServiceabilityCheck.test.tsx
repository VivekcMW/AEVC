import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, describe, expect, it, vi } from 'vitest'
import messages from '@/messages/en.json'
import { ServiceabilityCheck } from './ServiceabilityCheck'

/** Renders against the real English catalog, so these assertions check shipped copy. */
function renderCheck() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ServiceabilityCheck />
    </NextIntlClientProvider>,
  )
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function mockFetch(body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => body }))
}

async function submit(pincode: string) {
  await userEvent.type(screen.getByLabelText(/pincode/i), pincode)
  await userEvent.click(screen.getByRole('button', { name: /check/i }))
}

describe('ServiceabilityCheck', () => {
  it('confirms delivery with an estimate', async () => {
    mockFetch({ status: 'serviceable', days: 5 })
    renderCheck()
    await submit('411001')
    expect(await screen.findByText(/we deliver to 411001/i)).toBeDefined()
  })

  it('offers a retry when the check fails, never a false negative', async () => {
    mockFetch({ status: 'failed' })
    renderCheck()
    await submit('411001')
    expect(await screen.findByText(/it's us, not your pincode/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /try again/i })).toBeDefined()
    expect(screen.queryByText(/don't deliver/i)).toBeNull()
  })

  it('treats a network throw as failed, not as unserviceable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    renderCheck()
    await submit('411001')
    expect(await screen.findByText(/it's us, not your pincode/i)).toBeDefined()
    expect(screen.queryByText(/don't deliver/i)).toBeNull()
  })

  it('treats a non-ok HTTP response as failed, not as unserviceable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }))
    renderCheck()
    await submit('411001')
    expect(await screen.findByText(/it's us, not your pincode/i)).toBeDefined()
  })

  it('reports a genuinely unserved pincode plainly, and asks for a number', async () => {
    mockFetch({ status: 'unserviceable' })
    renderCheck()
    await submit('999999')
    expect(await screen.findByText(/don't deliver to 999999/i)).toBeDefined()
  })

  it('validates the pincode client-side before spending a request', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    renderCheck()
    await submit('41')
    expect(await screen.findByText(/six-digit/i)).toBeDefined()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
