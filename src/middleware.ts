import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_WINDOW_DAYS,
  parseAttribution,
} from './lib/leads/attribution'

const intl = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = intl(request)

  // First touch wins. Overwriting on a later visit would credit the wrong promoter.
  const existing = request.cookies.get(ATTRIBUTION_COOKIE)
  const params = request.nextUrl.searchParams
  const hasNew = params.has('ref') || params.has('utm_source')

  if (!existing && hasNew) {
    response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(parseAttribution(params)), {
      maxAge: ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
