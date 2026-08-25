import { appendFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { Attribution } from './attribution'
import type { LeadInput } from './schema'

export type StoredLead = {
  id: string
  receivedAt: string
  lead: LeadInput
  attribution: Attribution
}

const file = resolve(process.cwd(), '.data/leads.jsonl')

/**
 * The stub sink. Swapping this one function for the platform's lead API is the whole
 * migration — validation, rate limiting and attribution above it stay untouched.
 */
export function writeLead(record: StoredLead): void {
  mkdirSync(dirname(file), { recursive: true })
  appendFileSync(file, `${JSON.stringify(record)}\n`, 'utf8')
}

export function readAll(): StoredLead[] {
  try {
    return readFileSync(file, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredLead)
  } catch {
    return []
  }
}

export function resetSink(): void {
  try {
    rmSync(file)
  } catch {
    /* nothing to remove */
  }
}
