/**
 * Section 7 asks for real factory and street photography and rules out generic EV stock.
 * Until those assets exist, a photo slot states its own aspect ratio and intended subject,
 * so the real image drops in without reflow and nobody mistakes the gap for a design.
 */
export function PhotoFrame({
  ratio = '16 / 9',
  subject,
  className = '',
}: {
  ratio?: string
  subject: string
  className?: string
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Photography placeholder: ${subject}`}
      className={`relative overflow-hidden rounded-lg border border-dashed border-forest/25 bg-forest/[0.04] ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, var(--adhara-color-forest) 0 1px, transparent 1px 9px)',
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end gap-1 p-4">
        <span className="text-xs font-semibold tracking-wider text-forest/70 uppercase">
          Photography · {ratio.replace(/\s/g, '')}
        </span>
        <span className="text-sm text-ink/70">{subject}</span>
      </div>
    </div>
  )
}
