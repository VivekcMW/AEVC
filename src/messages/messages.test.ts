import { describe, expect, it } from 'vitest'
import en from './en.json'
import hi from './hi.json'
import kn from './kn.json'

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

  it.each([
    ['Hindi', hi],
    ['Kannada', kn],
  ])('never leaves a %s value empty — an empty string defeats the fallback', (_name, catalog) => {
    const empties = leafKeys(catalog).filter((k) => {
      const value = k
        .split('.')
        .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], catalog)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(empties).toEqual([])
  })

  it.each([
    ['Hindi', hi],
    ['Kannada', kn],
  ])('only contains %s keys that exist in English', (_name, catalog) => {
    const enKeys = new Set(leafKeys(en))
    const orphans = leafKeys(catalog)
      .filter((k) => !k.startsWith('$'))
      .filter((k) => !enKeys.has(k))
    expect(orphans).toEqual([])
  })
})
