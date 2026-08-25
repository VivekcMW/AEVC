'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Animates page content on client-side navigation.
 *
 * Next 16.3.2 has no stable view-transition support (`experimental.viewTransition` is not a
 * recognised key), so this does the job with one keyed wrapper and a CSS animation.
 *
 * The first render deliberately gets no animation class. Fading the whole page in on initial
 * load would delay the LCP paint and eat the 2.5s budget — the transition is only worth
 * anything between routes, where there is a previous page to transition from.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return (
    <div key={pathname} className={isFirstRender.current ? undefined : 'route-enter'}>
      {children}
    </div>
  )
}
