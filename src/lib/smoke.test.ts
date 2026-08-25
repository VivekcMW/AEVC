import { describe, expect, it } from 'vitest'
import { projectName } from './smoke'

describe('smoke', () => {
  it('confirms the toolchain runs TypeScript from src', () => {
    expect(projectName()).toBe('Adhara Energy')
  })
})
