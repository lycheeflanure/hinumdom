import { NextResponse } from 'next/server'
import { deleteRegistryRecord, getRegistryRecordById } from '@/lib/registryService'
import { isAdminRequest } from '@/lib/adminAuth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required to delete records.' },
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
      message: 'Burial record successfully removed from the registry.',
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
