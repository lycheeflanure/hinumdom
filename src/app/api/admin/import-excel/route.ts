import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/adminAuth'
import { importRecordsFromExcel } from '@/lib/registryService'

export async function POST(request: Request) {
  // 1. Strict Admin Authentication Check
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      {
        error: 'Unauthorized: Access to the local cemetery registry backend is restricted to authenticated admin users.',
      },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = (formData.get('file') || formData.get('excel_file')) as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No Excel file provided. Please upload an .xlsx, .xls, or .csv file.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = importRecordsFromExcel(buffer)

    return NextResponse.json({
      success: true,
      message: `Successfully processed Excel spreadsheet. Added: ${result.added}, Updated: ${result.updated}. Total Registry Records: ${result.total}.`,
      added: result.added,
      updated: result.updated,
      total: result.total,
      errors: result.errors,
    })
  } catch (error: any) {
    console.error('Excel Import Error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to process Excel spreadsheet.',
      },
      { status: 400 }
    )
  }
}
