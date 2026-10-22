import { NextResponse } from 'next/server'
import { getRegistryRecords } from '@/lib/registryService'
import { isAdminRequest } from '@/lib/adminAuth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const isAdmin = isAdminRequest(request)

    let records = getRegistryRecords()

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      records = records.filter((r) => {
        const full = `${r.first_name} ${r.middle_name || ''} ${r.last_name} ${r.suffix || ''}`.toLowerCase()
        return full.includes(q) || (r.section_name && r.section_name.toLowerCase().includes(q))
      })
    }

    // Sanitize confidential contact information for non-admin users
    const sanitizedRecords = records.map((r) => {
      if (isAdmin) return r
      const { contact_information, ...publicData } = r
      return publicData
    })

    return NextResponse.json({
      records: sanitizedRecords,
      total: sanitizedRecords.length,
      isAdmin,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve records', details: String(error) },
      { status: 500 }
    )
  }
}
