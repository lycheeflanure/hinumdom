import { NextResponse } from 'next/server'
import { getRegistryRecordById, deleteRegistryRecord } from '@/lib/registryService'
import { isAdminRequest } from '@/lib/adminAuth'
import { entityToPublicDetail } from '@/lib/mockData'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entity = getRegistryRecordById(id)

    if (!entity) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    const isAdmin = isAdminRequest(request)
    const detail = entityToPublicDetail(entity)

    // Strictly enforce confidentiality: strip contact_information for non-admin requests
    if (!isAdmin) {
      detail.contact_information = null
    }

    return NextResponse.json({
      record: detail,
      isAdmin,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve record', details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin authentication required to delete records.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = deleteRegistryRecord(id)

    if (!result.success) {
      return NextResponse.json(
        { error: `Burial record with ID "${id}" was not found in the registry.` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Burial record successfully removed from the registry.`,
      deletedRecord: result.deletedRecord,
      remainingCount: result.remainingCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete record', details: String(error) },
      { status: 500 }
    )
  }
}
