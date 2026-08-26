/**
 * The brand mark: two interlocked rings reading "ae" — Adhara Energy's icon. Drawn in a
 * single uniform stroke, fill: none, colour: currentColor, so callers set colour with
 * text-* utilities the same way VehicleGlyph does.
 */
export function AdharaMark({
  className = '',
  ...rest
}: { className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 132 84" fill="none" className={className} {...rest}>
      <circle cx="38" cy="42" r="27" stroke="currentColor" strokeWidth="15" />
      <circle
        cx="94"
        cy="42"
        r="27"
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray="127.06 48.87"
        strokeDashoffset="24.44"
      />
      <path d="M90 68 Q72 86 52 74" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
    </svg>
  )
}
