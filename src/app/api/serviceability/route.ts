import { NextResponse } from 'next/server'
import { checkServiceability } from '@/lib/data/serviceability'

export async function GET(request: Request) {
  const pincode = new URL(request.url).searchParams.get('pincode') ?? ''
  try {
    return NextResponse.json(await checkServiceability(pincode))
  } catch {
    // Never let an infrastructure failure masquerade as "we don't deliver there".
    return NextResponse.json({ status: 'failed' }, { status: 200 })
  }
}
