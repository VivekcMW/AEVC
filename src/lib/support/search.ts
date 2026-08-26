import type { Faq } from '@/lib/data/types'

/**
 * A local index, deliberately. Neither Algolia nor Meilisearch is worth an external
 * dependency and an API key for fifteen questions. The signature is the contract Plan 5
 * can swap the body of; no page changes when a real search service arrives.
 */
function normalise(value: string): string[] {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

export function searchFaqs(faqs: Faq[], query: string): Faq[] {
  const terms = normalise(query)
  if (terms.length === 0) return faqs

  return faqs
    .map((faq) => {
      const question = normalise(faq.question)
      const answer = normalise(faq.answer)
      const category = normalise(faq.category)

      let score = 0
      for (const term of terms) {
        const inQuestion = question.some((w) => w.startsWith(term))
        const inAnswer = answer.some((w) => w.startsWith(term))
        const inCategory = category.some((w) => w.startsWith(term))
        if (!inQuestion && !inAnswer && !inCategory) return { faq, score: -1 }
        // A title match is worth more than a body match: it is what the reader scans.
        score += inQuestion ? 3 : inCategory ? 2 : 1
      }
      return { faq, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.faq)
}
