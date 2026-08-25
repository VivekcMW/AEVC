'use client'

import { useState } from 'react'
import type { Colour } from '@/lib/data/types'
import { VehicleGlyph } from './VehicleGlyph'

export function ColourSwitcher({
  colours,
  modelName,
  title,
}: {
  colours: Colour[]
  modelName: string
  title: string
}) {
  const [selected, setSelected] = useState(colours[0])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-lg border border-forest/12 bg-mist px-5 py-8">
        <VehicleGlyph
          colour={selected.hex}
          label={`${modelName} in ${selected.name}, technical illustration`}
          className="mx-auto h-48 w-full text-forest sm:h-60"
        />
      </div>

      <fieldset className="flex flex-wrap items-center gap-3">
        <legend className="w-full pb-2 font-heading text-xs font-semibold tracking-[0.18em] text-ink/60 uppercase">
          {title}
        </legend>
        {colours.map((colour) => {
          const active = colour.name === selected.name
          return (
            <button
              key={colour.name}
              type="button"
              onClick={() => setSelected(colour)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? 'border-turmeric bg-turmeric/12 font-semibold text-ink'
                  : 'border-forest/20 text-ink/75 hover:border-forest/45'
              }`}
            >
              <span
                aria-hidden
                className="size-4 rounded-full border border-ink/15"
                style={{ backgroundColor: colour.hex }}
              />
              {colour.name}
            </button>
          )
        })}
      </fieldset>
    </div>
  )
}
