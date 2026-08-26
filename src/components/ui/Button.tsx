'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { registerPrimaryCta } from './cta-guard'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-medium ' +
  'transition-[background-color,color,transform] duration-200 active:scale-[0.98] ' +
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100'

const variants: Record<Variant, string> = {
  primary: 'bg-turmeric text-ink hover:bg-turmeric-hover',
  secondary: 'bg-forest text-white hover:bg-forest-hover',
  ghost: 'border border-current bg-transparent text-forest hover:bg-forest hover:text-white',
}

const sizes: Record<Size, string> = {
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

/** How far the one primary CTA per screen can be pulled toward the cursor, in pixels. */
const MAGNETIC_PULL = 10

type ButtonProps = {
  variant?: Variant
  size?: Size
  href?: string
  children: React.ReactNode
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>

export function Button({
  variant = 'secondary',
  size = 'md',
  href,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const isPrimary = variant === 'primary'
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isPrimary) return
    return registerPrimaryCta(typeof children === 'string' ? children : 'unnamed')
  }, [isPrimary, children])

  // The single primary CTA gets a little magnetic pull — never a second accent, just
  // more attention on the one that already carries it. Skipped on touch and when the
  // reader has asked for less motion.
  useEffect(() => {
    if (!isPrimary) return
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function handleMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      const pullX = Math.max(-MAGNETIC_PULL, Math.min(MAGNETIC_PULL, x * 0.25))
      const pullY = Math.max(-MAGNETIC_PULL, Math.min(MAGNETIC_PULL, y * 0.25))
      el!.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`
    }

    function reset() {
      el!.style.transform = ''
    }

    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerleave', reset)
    return () => {
      el.removeEventListener('pointermove', handleMove)
      el.removeEventListener('pointerleave', reset)
    }
  }, [isPrimary])

  const cls =
    `${base} ${variants[variant]} ${sizes[size]} ${isPrimary ? 'magnetic-cta' : ''} ${className}`.trim()

  if (href) {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
