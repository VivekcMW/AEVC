'use client'

import Link from 'next/link'
import { useEffect } from 'react'
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

  useEffect(() => {
    if (!isPrimary) return
    return registerPrimaryCta(typeof children === 'string' ? children : 'unnamed')
  }, [isPrimary, children])

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
