'use client'

import { useEffect } from 'react'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }
type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

/**
 * Sets data-save-data on <html> after mount so motion.css's Save-Data reset applies.
 * A Client Component + effect rather than an inline <script>: the inline-script route
 * (Next's own preventing-flash-before-hydration pattern) still warns here because this
 * runs inside a Server Component boundary that dev-mode re-renders — this trades a
 * few hundred ms before the attribute lands for zero console noise, an acceptable cost
 * for a progressive enhancement rather than a correctness requirement.
 */
export function SaveDataDetector() {
  useEffect(() => {
    try {
      const nav = navigator as NavigatorWithConnection
      const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection
      const slow = !!(connection && (connection.saveData || /2g/.test(connection.effectiveType ?? '')))
      if (slow) document.documentElement.setAttribute('data-save-data', 'true')
    } catch {
      // Feature not supported in this browser — nothing to do.
    }
  }, [])

  return null
}
