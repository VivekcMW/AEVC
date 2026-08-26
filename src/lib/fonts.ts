/**
 * Pure font policy. Deliberately free of next/font, which is a build-time SWC
 * transform and cannot be imported by a unit test.
 */
export const FONT_VARIABLES = {
  comfortaa: '--font-comfortaa',
  poppins: '--font-poppins',
  anekDevanagari: '--font-anek-devanagari',
  anekKannada: '--font-anek-kannada',
} as const

/** Which font CSS variables a locale needs. Keeps script-specific faces off pages that don't need them. */
export function fontVariableNames(locale: string): string[] {
  const base = [FONT_VARIABLES.comfortaa, FONT_VARIABLES.poppins]
  if (locale === 'hi') return [...base, FONT_VARIABLES.anekDevanagari]
  if (locale === 'kn') return [...base, FONT_VARIABLES.anekKannada]
  return base
}
