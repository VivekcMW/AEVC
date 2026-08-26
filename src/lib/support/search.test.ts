import { describe, expect, it } from 'vitest'
import { getFaqs } from '@/lib/data/faqs'
import { searchFaqs } from './search'

const faqs = await getFaqs()

describe('searchFaqs', () => {
  it('returns everything for an empty query', () => {
    expect(searchFaqs(faqs, '')).toHaveLength(faqs.length)
  })

  it('returns everything for a whitespace-only query', () => {
    expect(searchFaqs(faqs, '   ')).toHaveLength(faqs.length)
  })

  it('matches a word in the question', () => {
    expect(searchFaqs(faqs, 'registration').map((f) => f.id)).toContain('registration')
  })

  it('matches a word in the answer', () => {
    expect(searchFaqs(faqs, 'kilometre').length).toBeGreaterThan(0)
  })

  it('is case-insensitive', () => {
    expect(searchFaqs(faqs, 'BATTERY').length).toBe(searchFaqs(faqs, 'battery').length)
  })

  it('ranks a question-title match above an answer-body match', () => {
    const results = searchFaqs(faqs, 'battery')
    const titleHit = results.findIndex((f) => /battery/i.test(f.question))
    const bodyOnly = results.findIndex((f) => !/battery/i.test(f.question))
    expect(titleHit).toBeLessThan(bodyOnly === -1 ? Infinity : bodyOnly)
  })

  it('requires every term, so a two-word query narrows rather than widens', () => {
    const broad = searchFaqs(faqs, 'battery')
    const narrow = searchFaqs(faqs, 'battery warranty')
    expect(narrow.length).toBeLessThanOrEqual(broad.length)
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchFaqs(faqs, 'zzzzqqq')).toEqual([])
  })

  it('ignores punctuation in the query', () => {
    expect(searchFaqs(faqs, 'battery?').length).toBe(searchFaqs(faqs, 'battery').length)
  })
})
