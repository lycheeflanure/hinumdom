import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { generateExcelTemplate } from '@/lib/registryService'

export async function GET(request: Request) {
  try {
    const templatePath = path.join(process.cwd(), 'RECORDS TEMPLATE.xlsx')
    let buffer: Buffer
    if (fs.existsSync(templatePath)) {
      buffer = fs.readFileSync(templatePath)
    } else {
      buffer = generateExcelTemplate()
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="RECORDS TEMPLATE.xlsx"',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate Excel template', details: String(error) },
      { status: 500 }
    )
  }
}

