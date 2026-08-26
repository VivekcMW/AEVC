'use client'

import { useEffect, useRef, useState } from 'react'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Odometer-style digit roll. The real value renders instantly and normally — screen
 * readers and tests always see the correct final text with no animation lag — while a
 * decorative, aria-hidden twin tweens on top of it. Reinforces "these are numbers you
 * can trust": the figure never lies, it just enjoys arriving.
 */
export function RollingNumber({
  value,
  format,
  className = '',
  dataTestId,
}: {
  value: number
  format: (n: number) => string
  className?: string
  dataTestId?: string
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to || reduceMotion()) {
      fromRef.current = to
      setDisplay(to)
      return
    }

    const start = performance.now()
    const duration = 500

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <span className={`relative inline-block ${className}`}>
      {/* opacity, not visibility/display: stays in the accessibility tree and keeps its own
          textContent scoped to this element, so the real, final value is what gets announced
          and asserted on — the twin below is purely paint and lives outside this element. */}
      <span data-testid={dataTestId} className="opacity-0">
        {format(value)}
      </span>
      <span aria-hidden className="absolute inset-0">
        {format(display)}
      </span>
    </span>
  )
}
