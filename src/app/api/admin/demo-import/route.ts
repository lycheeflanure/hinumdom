import { NextResponse } from 'next/server'
import { generateExcelTemplate, importRecordsFromExcel } from '@/lib/registryService'

export async function POST(request: Request) {
  try {
    const buffer = generateExcelTemplate(true)
    const result = importRecordsFromExcel(buffer)

    return NextResponse.json({
      success: true,
      message: `Demo Excel workbook imported successfully! Added: ${result.added}, Updated: ${result.updated}. Total Registry Records: ${result.total}.`,
      added: result.added,
      updated: result.updated,
      total: result.total,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to execute demo Excel import' },
      { status: 500 }
    )
  }
}
