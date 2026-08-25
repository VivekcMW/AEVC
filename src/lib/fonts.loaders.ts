import { Anek_Devanagari, Anek_Latin, Inter } from 'next/font/google'
import { fontVariableNames, FONT_VARIABLES } from './fonts'

export const anekLatin = Anek_Latin({
  subsets: ['latin'],
  variable: FONT_VARIABLES.anekLatin,
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: FONT_VARIABLES.inter,
  display: 'swap',
})

export const anekDevanagari = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: FONT_VARIABLES.anekDevanagari,
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
