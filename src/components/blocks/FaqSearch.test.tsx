import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { getFaqs } from '@/lib/data/faqs'
import { renderIntl } from '@/test/render'
import { FaqSearch } from './FaqSearch'

const faqs = await getFaqs()

afterEach(cleanup)

describe('FaqSearch', () => {
  it('lists every question before any search', () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    expect(screen.getAllByRole('group').length).toBe(faqs.length)
  })

  it('narrows the list as the reader types', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    await userEvent.type(screen.getByRole('searchbox'), 'registration')
    expect(screen.getAllByRole('group').length).toBeLessThan(faqs.length)
  })

  it('announces the result count to assistive technology', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    await userEvent.type(screen.getByRole('searchbox'), 'registration')
    expect(screen.getByRole('status').textContent).toMatch(/\d/)
  })

  it('offers a way out when nothing matches, rather than a blank panel', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    await userEvent.type(screen.getByRole('searchbox'), 'zzzzqqq')
    expect(screen.getByText(/nothing matched/i)).toBeDefined()
    expect(screen.getByRole('link', { name: /raise an issue/i })).toBeDefined()
  })

  it('restores the full list when the query is cleared', async () => {
    renderIntl(<FaqSearch faqs={faqs} />)
    const box = screen.getByRole('searchbox')
    await userEvent.type(box, 'registration')
    await userEvent.clear(box)
    expect(screen.getAllByRole('group').length).toBe(faqs.length)
  })
})
