/** Native <details> so it is keyboard-operable and open-by-URL without JavaScript. */
export function Accordion({
  items,
}: {
  items: { id: string; question: string; answer: string }[]
}) {
  return (
    <div className="divide-y divide-forest/12 overflow-hidden rounded-lg border border-forest/12 bg-surface">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-ink marker:hidden">
            {item.question}
            <span
              aria-hidden
              className="mt-1 shrink-0 text-forest transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-prose text-ink/80">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
