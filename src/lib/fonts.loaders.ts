import { Anek_Devanagari, Anek_Kannada, Comfortaa, Poppins } from 'next/font/google'
import { FONT_VARIABLES, fontVariableNames } from './fonts'

// next/font is a build-time transform and requires literal argument values —
// FONT_VARIABLES stays the single source of truth for everything downstream.
export const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  display: 'swap',
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const anekDevanagari = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: '--font-anek-devanagari',
  display: 'swap',
})

export const anekKannada = Anek_Kannada({
  subsets: ['kannada', 'latin'],
  variable: '--font-anek-kannada',
  display: 'swap',
})

const byVariable: Record<string, string> = {
  [FONT_VARIABLES.comfortaa]: comfortaa.variable,
  [FONT_VARIABLES.poppins]: poppins.variable,
  [FONT_VARIABLES.anekDevanagari]: anekDevanagari.variable,
  [FONT_VARIABLES.anekKannada]: anekKannada.variable,
}

/** The className that declares this locale's font variables on <html>. */
export function fontClassNames(locale: string): string {
  return fontVariableNames(locale)
    .map((name) => byVariable[name])
    .join(' ')
}
