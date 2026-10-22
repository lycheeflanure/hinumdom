// src/instrumentation.ts
// Server startup hook that initializes background services such as the Excel Auto-Sync Watcher

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { startExcelWatcher } = await import('@/lib/excelWatcher')
      startExcelWatcher()
    } catch (err: any) {
      console.warn('[Server Startup] Could not start Excel Watcher in instrumentation:', err.message)
    }
  }
}
