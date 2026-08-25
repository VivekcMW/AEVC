import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount between tests so component state never leaks across cases.
afterEach(cleanup)
