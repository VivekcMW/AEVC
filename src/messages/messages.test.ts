import { describe, expect, it } from 'vitest'
import en from './en.json'
import hi from './hi.json'

function leafKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([k, v]) =>
    leafKeys(v, prefix ? `${prefix}.${k}` : k),
  )
}

describe('message catalogs', () => {
  it('gives English a key for every namespace the five core pages need', () => {
    const keys = leafKeys(en)
    for (const ns of ['common', 'home', 'vehicles', 'model', 'emi']) {
      expect(keys.some((k) => k.startsWith(`${ns}.`))).toBe(true)
    }
  })

  it('never leaves a Hindi value empty — an empty string defeats the fallback', () => {
    const empties = leafKeys(hi).filter((k) => {
      const value = k
        .split('.')
        .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], hi)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(empties).toEqual([])
  })

  it('only contains Hindi keys that exist in English', () => {
    const enKeys = new Set(leafKeys(en))
    const orphans = leafKeys(hi)
      .filter((k) => !k.startsWith('$'))
      .filter((k) => !enKeys.has(k))
    expect(orphans).toEqual([])
  })
})
