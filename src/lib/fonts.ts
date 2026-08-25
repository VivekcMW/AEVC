/**
 * Pure font policy. Deliberately free of next/font, which is a build-time SWC
 * transform and cannot be imported by a unit test.
 */
export const FONT_VARIABLES = {
  anekLatin: '--font-anek-latin',
  inter: '--font-inter',
  anekDevanagari: '--font-anek-devanagari',
} as const

/** Which font CSS variables a locale needs. Keeps the Devanagari face off English pages. */
export function fontVariableNames(locale: string): string[] {
  const base = [FONT_VARIABLES.anekLatin, FONT_VARIABLES.inter]
  return locale === 'hi' ? [...base, FONT_VARIABLES.anekDevanagari] : base
}
