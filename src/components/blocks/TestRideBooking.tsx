'use client'

import { useState } from 'react'
import { LeadForm } from './LeadForm'
import { SlotPicker } from './SlotPicker'
import type { Slot } from '@/lib/data/slots'

export function TestRideBooking({ dealerId, slots }: { dealerId: string; slots: Slot[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-8">
      <SlotPicker slots={slots} selected={selected} onSelect={setSelected} />
      {selected && (
        <LeadForm
          kind="test-ride"
          fields={['name', 'phone']}
          hidden={{ dealerId, slotId: selected }}
          namespace="testRide.form"
        />
      )}
    </div>
  )
}
