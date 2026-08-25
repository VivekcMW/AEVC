import { cloneElement, isValidElement } from 'react'

/**
 * Labels a single control and wires the accessibility relationships onto the control
 * itself — a hint the input does not point at is decoration, not an accessible name.
 */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactElement<Record<string, unknown>>
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')

  const control = isValidElement(children)
    ? cloneElement(children, {
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
        ...(error ? { 'aria-invalid': 'true' } : {}),
      })
    : children

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {control}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink/65">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-charge-out">
          {error}
        </p>
      )}
    </div>
  )
}
