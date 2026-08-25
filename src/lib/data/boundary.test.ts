import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walk(path)
    return /\.tsx?$/.test(path) ? [path] : []
  })
}

/** Only these folders may read src/content. Everything else goes through a repository. */
const ALLOWED = [join('src', 'lib', 'data'), join('src', 'lib', 'legal'), join('src', 'content')]

describe('import boundary', () => {
  it('lets nothing outside src/lib/data or src/lib/legal import from src/content', () => {
    const offenders = walk('src')
      .filter((f) => !ALLOWED.some((prefix) => f.startsWith(prefix)))
      .filter((f) => /from ['"]@\/content\//.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('lets no page import a message catalog directly', () => {
    const offenders = walk(join('src', 'app')).filter((f) =>
      /from ['"].*messages\/(en|hi)\.json/.test(readFileSync(f, 'utf8')),
    )
    expect(offenders).toEqual([])
  })
})
