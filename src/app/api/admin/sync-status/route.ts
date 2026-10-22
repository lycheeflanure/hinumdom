// src/app/api/admin/sync-status/route.ts
// API route to get auto-sync watcher status and trigger on-demand sync

import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/adminAuth'
import { getExcelSyncStatus, syncExcelNow, startExcelWatcher } from '@/lib/excelWatcher'
import { getRegistryRecords } from '@/lib/registryService'

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    )
  }

  // Ensure watcher is active if not already started
  const status = getExcelSyncStatus()
  if (!status.isActive) {
    startExcelWatcher()
  }

  const updatedStatus = getExcelSyncStatus()
  return NextResponse.json({
    success: true,
    sync: updatedStatus,
    totalRecords: getRegistryRecords().length,
  })
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    )
  }

  try {
    let force = false
    try {
      const body = await request.json()
      force = Boolean(body?.force)
    } catch {
      // no body passed, defaults to standard check
    }

    const result = await syncExcelNow(undefined, force)
    const currentStatus = getExcelSyncStatus()

    return NextResponse.json({
      success: result.success,
      message: result.message,
      added: result.added,
      updated: result.updated,
      unchanged: result.unchanged,
      total: result.total,
      errors: result.errors,
      sync: currentStatus,
      records: getRegistryRecords(),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sync Excel records.' },
      { status: 500 }
    )
  }
}
