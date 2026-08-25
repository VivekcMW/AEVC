let mounted = 0

/** Section 7 allows one primary CTA per viewport. This makes the rule outlive the meeting. */
export function registerPrimaryCta(label: string): () => void {
  if (process.env.NODE_ENV === 'production') return () => {}

  mounted += 1
  if (mounted > 1) {
    console.warn(
      `[adhara] Section 7 allows one primary CTA per page — "${label}" is number ${mounted}. ` +
        'Demote the others to variant="secondary".',
    )
  }
  return () => {
    mounted = Math.max(0, mounted - 1)
  }
}

export function resetCtaGuard(): void {
  mounted = 0
}
