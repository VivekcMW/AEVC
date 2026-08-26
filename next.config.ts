import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// No root app/layout.tsx exists — [locale]/layout.tsx is the de-facto root, so a plain
// root not-found.tsx double-wraps <html> against Next's implicit root document. This
// flag is exactly for that case: a top-level dynamic segment standing in for the root.
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
}

export default withNextIntl(nextConfig)
