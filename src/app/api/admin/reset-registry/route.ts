import { NextResponse } from 'next/server'
import { resetRegistryToInitial } from '@/lib/registryService'

export async function POST(request: Request) {
  try {
    const records = resetRegistryToInitial()
    return NextResponse.json({
      success: true,
      message: 'Registry reset to initial 6 baseline records.',
      total: records.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reset registry' },
      { status: 500 }
    )
  }
}
