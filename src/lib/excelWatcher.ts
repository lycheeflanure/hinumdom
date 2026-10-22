// src/lib/excelWatcher.ts
// Background file watcher service for automatic Excel-to-Database synchronization
// Supports Microsoft Excel Ctrl+S saves with file-lock retries and hash deduplication.

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { importRecordsFromExcel, getRegistryRecords } from './registryService'

export interface ExcelSyncStatus {
  isActive: boolean
  targetFile: string
  exists: boolean
  lastChecked: string | null
  lastSynced: string | null
  lastHash: string | null
  status: 'idle' | 'watching' | 'syncing' | 'error'
  lastError: string | null
  lastResult: {
    added: number
    updated: number
    unchanged: number
    total: number
    errors?: string[]
  } | null
}

// Global singleton holder to prevent duplicate watchers across Next.js reloads
declare global {
  // eslint-disable-next-line no-var
  var __hinumdomExcelWatcher:
    | {
        status: ExcelSyncStatus
        watcher: fs.FSWatcher | null
        timer: NodeJS.Timeout | null
        pollInterval: NodeJS.Timeout | null
        debounceTimer: NodeJS.Timeout | null
      }
    | undefined
}

const DEFAULT_FILE_NAME = 'RECORDS TEMPLATE.xlsx'

export function getExcelFilePath(): string {
  if (process.env.EXCEL_SYNC_PATH && process.env.EXCEL_SYNC_PATH.trim()) {
    const custom = process.env.EXCEL_SYNC_PATH.trim()
    return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom)
  }
  return path.join(process.cwd(), DEFAULT_FILE_NAME)
}

function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

// Initialize global state container
if (!globalThis.__hinumdomExcelWatcher) {
  globalThis.__hinumdomExcelWatcher = {
    status: {
      isActive: false,
      targetFile: getExcelFilePath(),
      exists: false,
      lastChecked: null,
      lastSynced: null,
      lastHash: null,
      status: 'idle',
      lastError: null,
      lastResult: null,
    },
    watcher: null,
    timer: null,
    pollInterval: null,
    debounceTimer: null,
  }
}

const state = globalThis.__hinumdomExcelWatcher!

/**
 * Safely reads the Excel file with retries in case Excel has an active write lock
 */
async function safeReadExcelFile(filePath: string, maxAttempts = 6): Promise<Buffer> {
  let attempt = 0
  while (attempt < maxAttempts) {
    try {
      const buffer = fs.readFileSync(filePath)
      return buffer
    } catch (err: any) {
      if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') {
        attempt++
        // Exponential-ish backoff to let Excel release lock
        await new Promise((resolve) => setTimeout(resolve, 200 * attempt))
      } else {
        throw err
      }
    }
  }
  throw new Error(`Could not access "${path.basename(filePath)}" after ${maxAttempts} attempts. The file may be exclusively locked by Excel.`)
}

/**
 * Executes a sync operation from the target Excel file into the registry
 */
export async function syncExcelNow(filePath?: string, force = false): Promise<{
  success: boolean
  skipped?: boolean
  message: string
  added: number
  updated: number
  unchanged: number
  total: number
  errors?: string[]
}> {
  const target = filePath || getExcelFilePath()
  state.status.targetFile = target
  state.status.exists = fs.existsSync(target)
  state.status.lastChecked = new Date().toISOString()

  if (!state.status.exists) {
    state.status.status = 'error'
    state.status.lastError = `Target spreadsheet not found at: ${target}`
    return {
      success: false,
      message: state.status.lastError,
      added: 0,
      updated: 0,
      unchanged: 0,
      total: getRegistryRecords().length,
    }
  }

  try {
    state.status.status = 'syncing'
    const buffer = await safeReadExcelFile(target)
    const currentHash = calculateFileHash(buffer)

    // Deduplication check: If file content hasn't changed at all, skip processing
    if (!force && state.status.lastHash && state.status.lastHash === currentHash) {
      state.status.status = 'watching'
      return {
        success: true,
        skipped: true,
        message: 'No changes detected in Excel spreadsheet (content hash identical).',
        added: 0,
        updated: 0,
        unchanged: state.status.lastResult?.total || getRegistryRecords().length,
        total: state.status.lastResult?.total || getRegistryRecords().length,
      }
    }

    // Process rows through registryService (applies deterministic upsert & duplicate prevention)
    const result = importRecordsFromExcel(buffer)

    state.status.lastHash = currentHash
    state.status.lastSynced = new Date().toISOString()
    state.status.status = 'watching'
    state.status.lastError = null
    state.status.lastResult = {
      added: result.added,
      updated: result.updated,
      unchanged: (result as any).unchanged || 0,
      total: result.total,
      errors: result.errors,
    }

    const timeStr = new Date().toLocaleTimeString()
    console.log(
      `\x1b[32m[Excel Auto-Sync]\x1b[0m 🟢 \x1b[1m${path.basename(target)}\x1b[0m saved at ${timeStr}. Synced to Registry: ` +
        `\x1b[32m+${result.added} added\x1b[0m, \x1b[34m${result.updated} updated\x1b[0m, \x1b[36m${result.total} total\x1b[0m records.`
    )

    return {
      success: true,
      message: `Successfully synced Excel records. Added: ${result.added}, Updated: ${result.updated}, Total: ${result.total}.`,
      added: result.added,
      updated: result.updated,
      unchanged: (result as any).unchanged || 0,
      total: result.total,
      errors: result.errors,
    }
  } catch (error: any) {
    console.error(`\x1b[31m[Excel Auto-Sync Error]\x1b[0m Failed to sync "${path.basename(target)}":`, error.message)
    state.status.status = 'error'
    state.status.lastError = error.message || 'Error processing Excel file'
    return {
      success: false,
      message: error.message || 'Error processing Excel file',
      added: 0,
      updated: 0,
      unchanged: 0,
      total: getRegistryRecords().length,
      errors: [error.message],
    }
  }
}

/**
 * Starts watching the Excel file and its directory for save events
 */
export function startExcelWatcher(customPath?: string): ExcelSyncStatus {
  const target = customPath || getExcelFilePath()
  state.status.targetFile = target
  state.status.exists = fs.existsSync(target)

  if (state.status.isActive) {
    return getExcelSyncStatus()
  }

  state.status.isActive = true
  state.status.status = 'watching'

  console.log(`\x1b[34m[Excel Auto-Sync]\x1b[0m Watching \x1b[1m${path.basename(target)}\x1b[0m for Ctrl+S automatic synchronization...`)

  // Run initial baseline check on startup
  if (state.status.exists) {
    syncExcelNow(target, false).catch((e) => {
      console.warn('[Excel Auto-Sync] Initial baseline sync skipped/deferred:', e.message)
    })
  }

  // Helper to trigger debounced sync
  let lastMtime = state.status.exists ? fs.statSync(target).mtimeMs : 0
  const triggerDebouncedSync = () => {
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer)
    }
    // 600ms debounce window to let Excel finish atomic save/rename
    state.debounceTimer = setTimeout(async () => {
      try {
        if (fs.existsSync(target)) {
          const currentMtime = fs.statSync(target).mtimeMs
          if (currentMtime !== lastMtime) {
            lastMtime = currentMtime
            await syncExcelNow(target, false)
          }
        }
      } catch (err: any) {
        console.warn('[Excel Auto-Sync] Debounce check error:', err.message)
      }
    }, 600)
  }

  // 1. Directory & File watcher
  const watchDir = path.dirname(target)
  const targetFileName = path.basename(target).toLowerCase()

  try {
    state.watcher = fs.watch(watchDir, { persistent: false }, (eventType, filename) => {
      if (!filename) return
      const fn = String(filename).toLowerCase()

      // Ignore temporary office lock files like ~$RECORDS TEMPLATE.xlsx
      if (fn.startsWith('~$') || fn.startsWith('.~') || fn.endsWith('.tmp')) {
        return
      }

      if (fn === targetFileName || fn.includes('records template')) {
        triggerDebouncedSync()
      }
    })

    state.watcher.on('error', (err) => {
      console.warn('[Excel Auto-Sync Watcher Warning]', err.message)
    })
  } catch (err: any) {
    console.warn('[Excel Auto-Sync] fs.watch setup notice:', err.message)
  }

  // 2. Secondary fallback poll (every 2.5s) to guarantee zero missed saves on Windows
  state.pollInterval = setInterval(() => {
    try {
      if (fs.existsSync(target)) {
        const currentMtime = fs.statSync(target).mtimeMs
        if (currentMtime > lastMtime) {
          lastMtime = currentMtime
          triggerDebouncedSync()
        }
      }
    } catch {
      // transient stat error during Excel rewrite, ignored
    }
  }, 2500)

  return getExcelSyncStatus()
}

/**
 * Stops the active Excel file watcher
 */
export function stopExcelWatcher(): void {
  if (state.watcher) {
    try {
      state.watcher.close()
    } catch {
      // ignore
    }
    state.watcher = null
  }
  if (state.pollInterval) {
    clearInterval(state.pollInterval)
    state.pollInterval = null
  }
  if (state.debounceTimer) {
    clearTimeout(state.debounceTimer)
    state.debounceTimer = null
  }
  state.status.isActive = false
  state.status.status = 'idle'
  console.log('[Excel Auto-Sync] Watcher stopped.')
}

/**
 * Returns the current auto-sync status for APIs and admin dashboards
 */
export function getExcelSyncStatus(): ExcelSyncStatus {
  state.status.exists = fs.existsSync(state.status.targetFile)
  return { ...state.status }
}
