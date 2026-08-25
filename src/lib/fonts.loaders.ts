import { Anek_Devanagari, Anek_Latin, Inter } from 'next/font/google'
import { FONT_VARIABLES, fontVariableNames } from './fonts'

// next/font is a build-time transform and requires literal argument values —
// FONT_VARIABLES stays the single source of truth for everything downstream.
export const anekLatin = Anek_Latin({
  subsets: ['latin'],
  variable: '--font-anek-latin',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const anekDevanagari = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: '--font-anek-devanagari',
  display: 'swap',
})

const byVariable: Record<string, string> = {
  [FONT_VARIABLES.anekLatin]: anekLatin.variable,
  [FONT_VARIABLES.inter]: inter.variable,
  [FONT_VARIABLES.anekDevanagari]: anekDevanagari.variable,
}

/** The className that declares this locale's font variables on <html>. */
export function fontClassNames(locale: string): string {
  return fontVariableNames(locale)
    .map((name) => byVariable[name])
    .join(' ')
}
