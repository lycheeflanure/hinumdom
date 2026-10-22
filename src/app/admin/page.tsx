'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LogOut,
  Users,
  MapPin,
  Search,
  Plus,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  ExternalLink,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Phone,
  Calendar,
  Sparkles,
  Trash2,
  AlertTriangle,
  X,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  SlidersHorizontal,
  Layers,
  Info,
  RefreshCw,
} from 'lucide-react'
import { MockBurialEntity } from '@/lib/mockData'
import { useAdminAuth } from '@/lib/adminAuthContext'
import { formatMemorialFacility } from '@/lib/utils'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, loading: authLoading, logout } = useAdminAuth()

  const [records, setRecords] = useState<MockBurialEntity[]>([])
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success?: boolean
    message?: string
    added?: number
    updated?: number
    total?: number
    error?: string
  } | null>(null)

  // Deletion modal & management states
  const [recordToDelete, setRecordToDelete] = useState<MockBurialEntity | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmedCheckbox, setDeleteConfirmedCheckbox] = useState(false)
  const [deleteFeedback, setDeleteFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [tableSearchQuery, setTableSearchQuery] = useState('')

  // Section foldering states (collapsed as default)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  // Excel upload zone toggle so it doesn't take up screen space
  const [showUploadZone, setShowUploadZone] = useState<boolean>(false)

  // Auto-Sync state (Option 1: Background File Watcher)
  const [syncStatus, setSyncStatus] = useState<{
    isActive: boolean
    targetFile: string
    exists: boolean
    lastSynced: string | null
    status: string
    lastResult: {
      added: number
      updated: number
      unchanged: number
      total: number
    } | null
  } | null>(null)
  const [syncingNow, setSyncingNow] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch current registry records from local backend
  const fetchRecords = async () => {
    try {
      setLoadingRecords(true)
      const res = await fetch('/api/records')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.records)) {
          setRecords(data.records)
        }
      }
    } catch (err) {
      console.error('Failed to load registry records:', err)
    } finally {
      setLoadingRecords(false)
    }
  }

  const fetchSyncStatus = async () => {
    try {
      const res = await fetch('/api/admin/sync-status', {
        headers: { 'x-admin-token': 'hinumdom_authorized_admin_token_2026' },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.sync) {
          setSyncStatus(data.sync)
        }
      }
    } catch {
      // silently ignore transient network blips
    }
  }

  // Force sync right now from the local spreadsheet
  const handleSyncNow = async () => {
    setSyncingNow(true)
    try {
      const res = await fetch('/api/admin/sync-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'hinumdom_authorized_admin_token_2026',
        },
        body: JSON.stringify({ force: true }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUploadResult({
          success: true,
          message: data.message || 'Successfully synchronized spreadsheet.',
          added: data.added,
          updated: data.updated,
          total: data.total,
        })
        if (Array.isArray(data.records)) {
          setRecords(data.records)
        } else {
          await fetchRecords()
        }
        if (data.sync) setSyncStatus(data.sync)
      } else {
        setUploadResult({
          success: false,
          error: data.error || data.message || 'Failed to sync spreadsheet.',
        })
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: err.message || 'Network error while triggering synchronization.',
      })
    } finally {
      setSyncingNow(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    fetchRecords()
    fetchSyncStatus()

    // Background interval to refresh status and table
    const interval = setInterval(() => {
      fetchSyncStatus()
      fetchRecords()
    }, 8000)

    // Window focus listener: immediately update table when user returns from Excel!
    const onWindowFocus = () => {
      fetchSyncStatus()
      fetchRecords()
    }
    window.addEventListener('focus', onWindowFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onWindowFocus)
    }
  }, [isAdmin])

  // File upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    setUploadResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/import-excel', {
        method: 'POST',
        headers: {
          'x-admin-token': 'hinumdom_authorized_admin_token_2026',
        },
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setUploadResult({
          success: true,
          message: data.message,
          added: data.added,
          updated: data.updated,
          total: data.total,
        })
        // Refresh local table
        await fetchRecords()
      } else {
        setUploadResult({
          success: false,
          error: data.error || 'Failed to import Excel spreadsheet.',
        })
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: err.message || 'Network error while uploading spreadsheet.',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // 1-Click Demo Import for Proposal Demonstrations
  const handleDemoImport = async () => {
    setDemoLoading(true)
    setUploadResult(null)
    try {
      const res = await fetch('/api/admin/demo-import', {
        method: 'POST',
        headers: {
          'x-admin-token': 'hinumdom_authorized_admin_token_2026',
        },
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUploadResult({
          success: true,
          message: data.message,
          added: data.added,
          updated: data.updated,
          total: data.total,
        })
        await fetchRecords()
      } else {
        setUploadResult({
          success: false,
          error: data.error || 'Failed to execute demo import.',
        })
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: err.message || 'Error executing demo import.',
      })
    } finally {
      setDemoLoading(false)
    }
  }

  // Reset registry records to initial proposal baseline
  const handleResetRegistry = async () => {
    if (!window.confirm('Reset registry to baseline sample data? This clears imported demo records.')) {
      return
    }
    setResetLoading(true)
    setUploadResult(null)
    try {
      const res = await fetch('/api/admin/reset-registry', {
        method: 'POST',
        headers: {
          'x-admin-token': 'hinumdom_authorized_admin_token_2026',
        },
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUploadResult({
          success: true,
          message: 'Registry records reset to baseline proposal data.',
          added: 0,
          updated: 0,
          total: data.total,
        })
        await fetchRecords()
      } else {
        setUploadResult({
          success: false,
          error: data.error || 'Failed to reset registry.',
        })
      }
    } catch (err: any) {
      setUploadResult({
        success: false,
        error: err.message || 'Error resetting registry.',
      })
    } finally {
      setResetLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    window.location.href = '/api/admin/export-template'
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/admin/login')
  }

  // Handle permanent deletion of a record after double-check confirmation
  const handleConfirmDelete = async () => {
    if (!recordToDelete || !deleteConfirmedCheckbox) return

    setIsDeleting(true)
    setDeleteFeedback(null)

    try {
      const res = await fetch(`/api/records/${recordToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': 'hinumdom_authorized_admin_token_2026',
        },
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const deletedName = [
          recordToDelete.first_name,
          recordToDelete.middle_name,
          recordToDelete.last_name,
          recordToDelete.suffix,
        ]
          .filter(Boolean)
          .join(' ')

        setDeleteFeedback({
          type: 'success',
          message: `Record for "${deletedName}" was permanently removed from the cemetery registry.`,
        })
        setRecordToDelete(null)
        setDeleteConfirmedCheckbox(false)
        await fetchRecords()
      } else {
        setDeleteFeedback({
          type: 'error',
          message: data.error || 'Failed to delete record from registry.',
        })
      }
    } catch (err: any) {
      setDeleteFeedback({
        type: 'error',
        message: err.message || 'Network error while attempting to delete record.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && recordToDelete && !isDeleting) {
        setRecordToDelete(null)
        setDeleteConfirmedCheckbox(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recordToDelete, isDeleting])

  const totalRecords = records.length
  const verifiedRecords = records.filter(
    (r) => r.record_verification_status === 'verified'
  ).length
  const pendingRecords = totalRecords - verifiedRecords
  const mappedLocations = records.filter((r) => r.latitude && r.longitude).length

  // Unique sections with counts from current records
  const availableSections = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number; verified: number }>()
    records.forEach((r) => {
      const sName = (r.section_name || 'SECTION A').trim()
      const existing = map.get(sName) || { name: sName, count: 0, verified: 0 }
      existing.count += 1
      if (r.record_verification_status === 'verified') {
        existing.verified += 1
      }
      map.set(sName, existing)
    })
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [records])

  // Filter records based on search input
  const filteredRecords = React.useMemo(() => {
    if (!tableSearchQuery.trim()) return records
    const term = tableSearchQuery.toLowerCase().trim()
    return records.filter((r) => {
      const fullName = `${r.first_name} ${r.middle_name || ''} ${r.last_name} ${r.suffix || ''}`.toLowerCase()
      const loc = `${r.section_name} ${r.lot_number || ''} ${r.grave_number || ''} ${r.niche_number || ''} ${r.block || ''}`.toLowerCase()
      const contact = (r.contact_information?.contact_person_name || '').toLowerCase()
      const phone = (r.contact_information?.phone_number || '').toLowerCase()
      return (
        fullName.includes(term) ||
        loc.includes(term) ||
        contact.includes(term) ||
        phone.includes(term) ||
        r.id.toLowerCase().includes(term)
      )
    })
  }, [records, tableSearchQuery])

  // Group filtered records into section folders
  const recordsBySection = React.useMemo(() => {
    const groups: Record<string, MockBurialEntity[]> = {}
    filteredRecords.forEach((r) => {
      const sName = (r.section_name || 'SECTION A').trim()
      if (!groups[sName]) {
        groups[sName] = []
      }
      groups[sName].push(r)
    })
    return groups
  }, [filteredRecords])

  // Active section names present in current filtered view
  const visibleSectionNames = React.useMemo(() => {
    return Object.keys(recordsBySection).sort()
  }, [recordsBySection])

  const toggleSection = (secName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secName]: !prev[secName],
    }))
  }

  // If not authenticated as admin, show access guard
  if (!authLoading && !isAdmin) {
    return (
      <div className="flex-grow bg-surface-warm min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-md w-full text-center p-8 shadow-lg border border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <Lock size={32} />
          </div>
          <h2 className="heading-display text-2xl font-bold text-primary-dark mb-2">
            Admin Access Required
          </h2>
          <p className="text-text-muted text-sm mb-6">
            The local cemetery registry backend and confidential records are restricted to authorized parish personnel.
          </p>
          <Link href="/admin/login" className="btn btn-primary w-full py-3">
            Sign In to Admin Portal
          </Link>
          <div className="mt-4">
            <Link href="/" className="text-xs text-text-muted hover:underline">
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-grow bg-surface-warm min-h-screen">
      <div className="container-content py-8 max-w-7xl">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-primary-dark">Admin Dashboard</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Hinumdom Memorial Sanctuary • Local Parish Cemetery Management
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-red-600 hover:border-red-300 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
            title="Sign Out"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* 2-Column Responsive Layout: Left Side Panel + Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ─── Left Side Panel: Quick Navigation ───────────────────────── */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-5 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-primary-dark mb-4 pb-2 border-b border-border-light">
                Quick Navigation
              </h3>
              <nav className="flex flex-col gap-2.5">
                <Link
                  href="/search"
                  className="btn btn-primary w-full justify-start text-xs py-2.5 px-3.5 flex items-center gap-2.5 shadow-xs"
                >
                  <Search size={16} className="shrink-0" />
                  <span>Public Search Records</span>
                </Link>
                <Link
                  href="/map"
                  className="btn btn-outline w-full justify-start text-xs py-2.5 px-3.5 flex items-center gap-2.5 hover:border-primary hover:text-primary transition-colors"
                >
                  <MapPin size={16} className="shrink-0 text-primary" />
                  <span>Interactive Map</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadZone(true)
                    fileInputRef.current?.click()
                  }}
                  className="btn btn-outline w-full justify-start text-xs py-2.5 px-3.5 flex items-center gap-2.5 hover:border-primary hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <Upload size={16} className="shrink-0 text-primary" />
                  <span>Import Excel Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="btn btn-outline w-full justify-start text-xs py-2.5 px-3.5 flex items-center gap-2.5 hover:border-primary hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <Download size={16} className="shrink-0 text-primary" />
                  <span>Download Excel Template</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ─── Main Content Area ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0 w-full space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <div className="card border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-2 text-text-muted">
                  <Users size={20} />
                  <h3 className="font-semibold text-sm uppercase">Total Records</h3>
                </div>
                <p className="text-3xl font-bold text-text">{totalRecords}</p>
                <p className="text-2xs text-text-muted mt-1">Archived in Parish Registry</p>
              </div>

              <div className="card border-l-4 border-emerald-600">
                <div className="flex items-center gap-3 mb-2 text-text-muted">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <h3 className="font-semibold text-sm uppercase">Verified</h3>
                </div>
                <p className="text-3xl font-bold text-text">{verifiedRecords}</p>
                <p className="text-2xs text-text-muted mt-1">Confirmed with physical grave</p>
              </div>

              <div className="card border-l-4 border-accent">
                <div className="flex items-center gap-3 mb-2 text-text-muted">
                  <Search size={20} className="text-accent" />
                  <h3 className="font-semibold text-sm uppercase">Pending Review</h3>
                </div>
                <p className="text-3xl font-bold text-text">{pendingRecords}</p>
                <p className="text-2xs text-text-muted mt-1">Awaiting parish verification</p>
              </div>

              <div className="card border-l-4 border-primary-light">
                <div className="flex items-center gap-3 mb-2 text-text-muted">
                  <MapPin size={20} className="text-primary-light" />
                  <h3 className="font-semibold text-sm uppercase">Mapped Graves</h3>
                </div>
                <p className="text-3xl font-bold text-text">{mappedLocations}</p>
                <p className="text-2xs text-text-muted mt-1">GPS-located on digital map</p>
              </div>
            </div>

            {/* ─── Excel Spreadsheet Import Section ──────────────────────── */}
            <div className="bg-surface rounded-2xl border-2 border-primary/20 shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="text-primary" size={24} />
                    <h3 className="font-serif text-2xl font-bold text-primary-dark">
                      Burial Record Registry
                    </h3>
                  </div>
                  <p className="text-sm text-text-muted mt-1 max-w-2xl">
                    Automatic synchronization enabled: Simply save your Excel workbook (<code className="text-xs bg-surface-warm px-1 py-0.5 rounded">RECORDS TEMPLATE.xlsx</code>) with <kbd className="font-mono bg-surface border border-border px-1 py-0.5 rounded text-2xs">Ctrl + S</kbd>, and records automatically sync here without duplicates.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={handleSyncNow}
                    disabled={syncingNow}
                    className="btn btn-outline flex items-center gap-2 text-xs py-2 px-3.5 cursor-pointer"
                    title="Force sync spreadsheet records from disk right now"
                  >
                    <RefreshCw size={14} className={syncingNow ? 'animate-spin text-primary' : ''} />
                    {syncingNow ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    className="btn btn-outline flex items-center gap-2 text-xs py-2 px-3.5"
                    title="Download realistic Excel template with pre-filled sample rows"
                  >
                    <Download size={15} />
                    Download Template (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadZone(!showUploadZone)}
                    className="btn btn-primary flex items-center gap-2 text-xs py-2 px-3.5 cursor-pointer shadow-xs"
                    title={showUploadZone ? 'Hide Excel upload dropzone' : 'Open manual Excel upload dropzone'}
                  >
                    <Upload size={15} />
                    {showUploadZone ? 'Hide Upload Form' : 'Upload Spreadsheet'}
                  </button>
                </div>
              </div>

              {/* ─── Auto-Sync Live Status Banner ─── */}
              <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="relative flex h-3 w-3 shrink-0 mt-0.5 sm:mt-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <div className="font-semibold text-text flex items-center gap-2">
                      <span>Auto-Sync Active (Option 1)</span>
                      <span className="text-2xs font-mono font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        {syncStatus?.targetFile ? syncStatus.targetFile.split(/[\\/]/).pop() : 'RECORDS TEMPLATE.xlsx'}
                      </span>
                    </div>
                    <p className="text-text-muted mt-0.5">
                      Open the template in Excel and press <kbd className="font-mono bg-surface border border-border px-1 py-0.5 rounded text-2xs">Ctrl + S</kbd> — changes save directly to the registry. Deduplication engine prevents duplicate records.
                    </p>
                  </div>
                </div>

                {syncStatus?.lastSynced && (
                  <div className="text-left sm:text-right shrink-0 sm:self-center text-text-muted text-2xs">
                    <div>Last synced: <span className="font-medium text-text">{new Date(syncStatus.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
                    {syncStatus.lastResult && (
                      <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                        {syncStatus.lastResult.total} total records ({syncStatus.lastResult.added} added, {syncStatus.lastResult.updated} updated)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upload Drop Zone / Input (Toggleable) */}
              {showUploadZone && (
                <div className="grid md:grid-cols-3 gap-6 items-center animate-in fade-in duration-200">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="excel-upload"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                        isDragging
                          ? 'border-primary bg-primary-100/60 scale-[1.01] ring-4 ring-primary/20'
                          : 'border-primary/30 hover:border-primary bg-primary-50/20 hover:bg-primary-50/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary mb-3 group-hover:scale-105 transition-transform">
                        {uploading ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <Upload size={24} />
                        )}
                      </div>
                      <span className="font-semibold text-text text-base">
                        {uploading
                          ? 'Processing Excel file...'
                          : isDragging
                          ? 'Drop Excel file here to import'
                          : 'Choose Excel Sheet or drag and drop here'}
                      </span>
                      <span className="text-xs text-text-muted mt-1">
                        Supports .xlsx, .xls, and .csv with all registry columns
                      </span>
                      <input
                        id="excel-upload"
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                      />
                    </label>
                  </div>

                  {/* Column Guide */}
                  <div className="bg-surface-warm p-5 rounded-xl border border-border-light text-xs text-text-muted">
                    <h4 className="font-bold text-text uppercase tracking-wider mb-2 text-2xs">
                      Recognized Excel Columns:
                    </h4>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>Deceased Name:</strong> First, Middle, Last, Suffix</li>
                      <li><strong>Dates:</strong> Date of Birth, Date of Burial</li>
                      <li><strong>Location:</strong> Section (A-D), Block, Lot, Grave/Niche</li>
                      <li><strong>Burial Info:</strong> Renewal, Rent Date, Term, Cost</li>
                      <li><strong>Contact Info:</strong> Contact Name, Address, Phone</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Upload Results Alerts */}
              {uploadResult && (
                <div className="mt-6">
                  {uploadResult.success ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                      <div>
                        <h5 className="font-bold text-sm">Registry Successfully Updated!</h5>
                        <p className="text-xs mt-0.5">{uploadResult.message}</p>
                        <p className="text-2xs font-semibold mt-1">
                          Added: {uploadResult.added} • Updated: {uploadResult.updated} • Total in Registry: {uploadResult.total}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
                      <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                      <div>
                        <h5 className="font-bold text-sm">Upload Error</h5>
                        <p className="text-xs mt-0.5">{uploadResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delete Feedback Toast/Banner */}
            {deleteFeedback && (
              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  deleteFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  {deleteFeedback.type === 'success' ? (
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                  ) : (
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  )}
                  <div>
                    <h5 className="font-bold text-sm">
                      {deleteFeedback.type === 'success' ? 'Record Deleted' : 'Deletion Error'}
                    </h5>
                    <p className="text-xs mt-0.5">{deleteFeedback.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteFeedback(null)}
                  className="text-text-muted hover:text-text p-1 rounded-md transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Live Cemetery Registry (Foldered by Section) */}
            <div className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
              {/* Header: Title and Search Filter */}
              <div className="p-5 md:p-6 border-b border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary-dark">
                    Live Cemetery Registry ({filteredRecords.length} of {records.length} Records)
                  </h3>
                </div>

                {/* Filter Records Search (Non-overlapping search icon) */}
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-3 text-text-muted pointer-events-none z-10" />
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="Filter records..."
                    className="search-input text-xs rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48 sm:w-64"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2rem' }}
                  />
                  {tableSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTableSearchQuery('')}
                      className="absolute right-2.5 text-text-muted hover:text-text text-sm cursor-pointer z-10"
                      title="Clear filter"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {loadingRecords ? (
                <div className="p-12 text-center text-text-muted flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={20} />
                  <span>Loading registry records...</span>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="p-12 text-center text-text-muted">
                  {tableSearchQuery ? (
                    <>
                      <p className="text-sm font-medium">No records match the filter criteria &quot;{tableSearchQuery}&quot;.</p>
                      <button
                        onClick={() => setTableSearchQuery('')}
                        className="text-xs text-primary hover:underline mt-2 inline-block cursor-pointer font-semibold"
                      >
                        Reset filter & show all records
                      </button>
                    </>
                  ) : (
                    <p className="text-sm">No burial records found in the registry.</p>
                  )}
                </div>
              ) : (
                /* Foldered Section Accordions */
                <div className="divide-y divide-border-light">
                  {visibleSectionNames.map((secName) => {
                    const secRecords = recordsBySection[secName] || []
                    // Folder is collapsed as default unless clicked or search query is active
                    const isExpanded = !!expandedSections[secName] || !!tableSearchQuery.trim()

                    return (
                      <div key={secName} className="border-b border-border-light last:border-b-0">
                        {/* Section Folder Header / Accordion Bar */}
                        <button
                          type="button"
                          onClick={() => toggleSection(secName)}
                          className="w-full flex items-center justify-between p-4 bg-surface-warm/40 hover:bg-surface-warm/80 transition-colors text-left cursor-pointer select-none group"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg transition-colors ${
                                isExpanded
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-surface text-text-muted group-hover:text-primary border border-border-light'
                              }`}
                            >
                              {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif font-bold text-text text-base">
                                {secName}
                              </h4>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold bg-primary-50 text-primary border border-primary/20">
                                {secRecords.length} {secRecords.length === 1 ? 'Record' : 'Records'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-text-muted text-xs font-medium shrink-0">
                            <span className="hidden md:inline text-2xs text-text-light">
                              {isExpanded ? 'Click to collapse folder' : 'Click to expand records'}
                            </span>
                            <div className="p-1 rounded-md group-hover:bg-surface transition-colors">
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>
                          </div>
                        </button>

                        {/* Section Folder Content Table (when expanded) */}
                        {isExpanded && (
                          <div className="overflow-x-auto bg-surface animate-in fade-in duration-150">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-surface-warm/70 text-text-muted text-xs uppercase tracking-wider border-b border-border-light">
                                <tr>
                                  <th className="py-2.5 px-5">Deceased Name</th>
                                  <th className="py-2.5 px-5">Section / Plot</th>
                                  <th className="py-2.5 px-5">Dates (Birth / Burial)</th>
                                  <th className="py-2.5 px-5">Burial Rent / Term</th>
                                  <th className="py-2.5 px-5">Contact Person</th>
                                  <th className="py-2.5 px-5">Status</th>
                                  <th className="py-2.5 px-5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-light">
                                {secRecords.map((r) => {
                                  const fullName = [r.first_name, r.middle_name, r.last_name, r.suffix]
                                    .filter(Boolean)
                                    .join(' ')
                                  const locString = r.niche_number
                                    ? `Niche ${r.niche_number}`
                                    : `Lot ${r.lot_number || 'N/A'}${
                                        r.grave_number ? ` • Grave ${r.grave_number}` : ''
                                      }`

                                  return (
                                    <tr key={r.id} className="hover:bg-surface-warm/50 transition-colors">
                                      <td className="py-3 px-5">
                                        <div className="font-semibold text-text">{fullName}</div>
                                        <div className="text-2xs text-text-muted">
                                          {formatMemorialFacility(r.burial_structure_type)}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5 text-text-muted">
                                        <span className="font-medium text-text">{r.section_name}</span>
                                        <div className="text-xs text-text-muted">{locString}</div>
                                      </td>
                                      <td className="py-3 px-5 text-text-muted text-xs">
                                        <div>
                                          <span className="text-3xs uppercase tracking-wider text-text-muted">DOB:</span>{' '}
                                          {r.birth_date}
                                        </div>
                                        <div>
                                          <span className="text-3xs uppercase tracking-wider text-text-muted">Buried:</span>{' '}
                                          {r.burial_date}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5 text-text-muted text-xs">
                                        <div className="font-medium text-text">
                                          {r.rental_information?.cost_of_rent || '₱300'} (
                                          {r.rental_information?.term_of_rent || '5 years'})
                                        </div>
                                        <div className="text-2xs text-text-muted">
                                          Renewal: {r.rental_information?.date_of_renewal || '—'}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5 text-text-muted text-xs">
                                        <div className="font-medium text-text">
                                          {r.contact_information?.contact_person_name ||
                                            'Parish Representative'}
                                        </div>
                                        <div className="text-2xs font-mono text-primary flex items-center gap-1 mt-0.5">
                                          <Phone size={10} />
                                          <span>
                                            {r.contact_information?.phone_number || '(085) 341-2345'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-5">
                                        <span
                                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${
                                            r.record_verification_status === 'verified'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-amber-100 text-amber-800'
                                          }`}
                                        >
                                          {r.record_verification_status}
                                        </span>
                                      </td>
                                      <td className="py-3 px-5 text-right">
                                        <div className="inline-flex items-center gap-1.5 justify-end">
                                          <Link
                                            href={`/record/${r.id}`}
                                            className="p-1.5 rounded-md hover:bg-surface-warm text-text-muted hover:text-primary transition-colors"
                                            title="View Record Details"
                                          >
                                            <Eye size={16} />
                                          </Link>
                                          <Link
                                            href={`/map?record=${r.id}`}
                                            className="p-1.5 rounded-md hover:bg-surface-warm text-text-muted hover:text-primary transition-colors"
                                            title="Locate on Map"
                                          >
                                            <MapPin size={16} />
                                          </Link>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setRecordToDelete(r)
                                              setDeleteConfirmedCheckbox(false)
                                              setDeleteFeedback(null)
                                            }}
                                            className="p-1.5 rounded-md hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
                                            title="Delete Record"
                                            aria-label={`Delete record for ${fullName}`}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Delete Confirmation Modal (Double-Check Safeguard) ──────── */}
      {recordToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setRecordToDelete(null)
              setDeleteConfirmedCheckbox(false)
            }
          }}
        >
          <div className="bg-surface text-text w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden relative animate-in zoom-in-95 duration-150 my-6">
            {/* Modal Header */}
            <div className="p-6 border-b border-border-light flex items-start justify-between gap-4 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Trash2 size={22} />
                </div>
                <div>
                  <h3 id="delete-dialog-title" className="font-serif text-xl font-bold text-red-600 dark:text-red-400">
                    Confirm Record Deletion
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Permanent Parish Cemetery Registry Removal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isDeleting) {
                    setRecordToDelete(null)
                    setDeleteConfirmedCheckbox(false)
                  }
                }}
                disabled={isDeleting}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-warm transition-colors cursor-pointer"
                title="Cancel and close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Question & Double Check Warning Alert */}
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-900 dark:text-red-200">
                  <p className="font-bold text-sm text-red-700 dark:text-red-300">
                    Are you sure you want to permanently delete this burial record?
                  </p>
                  <p className="mt-1 leading-relaxed text-red-800/90 dark:text-red-300/80">
                    Please double-check the deceased details, plot location, and family records below before proceeding. Once deleted, this information will be permanently removed from the parish registry and interactive map.
                  </p>
                </div>
              </div>

              {/* Double Check Verification Details Card */}
              <div className="border border-border rounded-xl bg-surface-warm/50 p-4 space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-border-light flex-wrap gap-2">
                  <div>
                    <span className="text-3xs uppercase tracking-wider font-semibold text-text-muted">
                      Deceased Person
                    </span>
                    <h4 className="font-serif text-lg font-bold text-primary-dark">
                      {[
                        recordToDelete.first_name,
                        recordToDelete.middle_name,
                        recordToDelete.last_name,
                        recordToDelete.suffix,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${
                        recordToDelete.record_verification_status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {recordToDelete.record_verification_status}
                    </span>
                    <span className="text-2xs font-mono text-text-muted bg-surface px-2 py-0.5 rounded border border-border-light">
                      #{recordToDelete.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-3xs uppercase tracking-wider text-text-muted block">
                      Cemetery Plot / Location
                    </span>
                    <p className="font-semibold text-text mt-0.5">
                      {recordToDelete.section_name}
                    </p>
                    <p className="text-2xs text-text-muted">
                      {recordToDelete.niche_number
                        ? `Niche ${recordToDelete.niche_number}`
                        : `Lot ${recordToDelete.lot_number || 'N/A'}${
                            recordToDelete.grave_number
                              ? ` • Grave ${recordToDelete.grave_number}`
                              : ''
                          }`}
                      {recordToDelete.block ? ` • Block ${recordToDelete.block}` : ''}
                    </p>
                  </div>

                  <div>
                    <span className="text-3xs uppercase tracking-wider text-text-muted block">
                      Memorial Facility
                    </span>
                    <p className="font-semibold text-text mt-0.5">
                      {formatMemorialFacility(recordToDelete.burial_structure_type)}
                    </p>
                    <p className="text-2xs text-text-muted">
                      GPS: {recordToDelete.latitude?.toFixed(5)}, {recordToDelete.longitude?.toFixed(5)}
                    </p>
                  </div>

                  <div>
                    <span className="text-3xs uppercase tracking-wider text-text-muted block">
                      Dates (Life & Burial)
                    </span>
                    <p className="text-text mt-0.5">
                      <strong>DOB:</strong> {recordToDelete.birth_date || '—'}
                    </p>
                    <p className="text-text">
                      <strong>Buried:</strong> {recordToDelete.burial_date || '—'}
                    </p>
                  </div>

                  <div>
                    <span className="text-3xs uppercase tracking-wider text-text-muted block">
                      Burial Lease / Contract
                    </span>
                    <p className="text-text mt-0.5">
                      <strong>Cost:</strong> {recordToDelete.rental_information?.cost_of_rent || '₱300'} ({recordToDelete.rental_information?.term_of_rent || '5 years'})
                    </p>
                    <p className="text-text">
                      <strong>Renewal:</strong> {recordToDelete.rental_information?.date_of_renewal || '—'}
                    </p>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-border-light">
                    <span className="text-3xs uppercase tracking-wider text-text-muted block">
                      Family / Contact Person
                    </span>
                    <div className="flex items-center justify-between flex-wrap gap-2 mt-0.5">
                      <p className="font-medium text-text">
                        {recordToDelete.contact_information?.contact_person_name || 'Parish Representative'}
                      </p>
                      {recordToDelete.contact_information?.phone_number && (
                        <p className="font-mono text-2xs text-primary flex items-center gap-1">
                          <Phone size={10} />
                          {recordToDelete.contact_information.phone_number}
                        </p>
                      )}
                    </div>
                    {recordToDelete.contact_information?.address && (
                      <p className="text-2xs text-text-muted mt-0.5">
                        {recordToDelete.contact_information.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Double Check Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-warm/70 border border-border cursor-pointer select-none hover:bg-surface-warm transition-colors">
                <input
                  type="checkbox"
                  id="confirm-delete-checkbox"
                  checked={deleteConfirmedCheckbox}
                  onChange={(e) => setDeleteConfirmedCheckbox(e.target.checked)}
                  disabled={isDeleting}
                  className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-border cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-text">
                    I have double-checked the deceased information and plot above.
                  </span>
                  <p className="text-text-muted text-2xs mt-0.5">
                    Check this confirmation box to verify this is the intended record to delete and unlock the delete button.
                  </p>
                </div>
              </label>

              {deleteFeedback?.type === 'error' && (
                <div className="p-3 rounded-lg bg-red-100 text-red-900 border border-red-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{deleteFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-surface-warm/50 border-t border-border-light flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRecordToDelete(null)
                  setDeleteConfirmedCheckbox(false)
                }}
                disabled={isDeleting}
                className="btn btn-outline py-2 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel, Keep Record
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!deleteConfirmedCheckbox || isDeleting}
                className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={
                  !deleteConfirmedCheckbox
                    ? 'Please double-check the record and check the confirmation box above first'
                    : 'Permanently delete this record'
                }
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting Record...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
