// src/lib/utils.ts
// Utility functions

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { VerificationStatus } from '@/types/database'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format dates consistently
export function formatDate(dateStr: string | null | undefined, fallback = 'Not recorded'): string {
  if (!dateStr) return fallback
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return fallback
    return d.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return fallback
  }
}

// Build full name
export function buildFullName(
  firstName: string,
  middleName: string | null,
  lastName: string,
  suffix: string | null
): string {
  const parts = [firstName, middleName, lastName].filter(Boolean)
  const name = parts.join(' ')
  return suffix ? `${name}, ${suffix}` : name
}

// Build location display string
export function buildLocationString(opts: {
  section_name?: string | null
  section_code?: string | null
  block?: string | null
  row_number?: string | null
  lot_number?: string | null
  grave_number?: string | null
}): string {
  const parts: string[] = []
  if (opts.section_name || opts.section_code) {
    parts.push(`Section ${opts.section_name ?? opts.section_code}`)
  }
  if (opts.block) parts.push(`Block ${opts.block}`)
  if (opts.row_number) parts.push(`Row ${opts.row_number}`)
  if (opts.lot_number) parts.push(`Lot ${opts.lot_number}`)
  if (opts.grave_number) parts.push(`Grave ${opts.grave_number}`)
  return parts.join(', ') || 'Location not recorded'
}

// Verification status display
export function getStatusBadgeClass(status: VerificationStatus): string {
  switch (status) {
    case 'verified': return 'badge badge-verified'
    case 'pending': return 'badge badge-pending'
    case 'needs_review': return 'badge badge-unverified'
    default: return 'badge badge-unmapped'
  }
}

export function getStatusLabel(status: VerificationStatus): string {
  switch (status) {
    case 'verified': return 'Verified'
    case 'pending': return 'Pending'
    case 'needs_review': return 'Needs Review'
    default: return 'Unverified'
  }
}

// Paginate arrays (client-side)
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize)
}

// Safe JSON parse
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}

// Sanitize search query
export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[<>]/g, '').slice(0, 200)
}

// Capitalize name parts
export function capitalizeName(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-'])\S/g, (c) => c.toUpperCase())
}

// Generate year range for filters
export function getYearRange(start = 1900): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let y = currentYear; y >= start; y--) {
    years.push(y)
  }
  return years
}

// 6 Official Memorial Facility Types
export const MEMORIAL_FACILITY_LIST = [
  'columbarium',
  'crypt',
  'panteon',
  'roofed tomb',
  'family mausoleum',
  'in-ground burial plot',
] as const

export type MemorialFacilityName = (typeof MEMORIAL_FACILITY_LIST)[number]

/**
 * Format Memorial Facility names into standard title casing
 */
export function formatMemorialFacility(type?: string | null): string {
  if (!type) return 'In-Ground Burial Plot'
  const lower = type.toLowerCase().trim()
  switch (lower) {
    case 'columbarium':
      return 'Columbarium'
    case 'crypt':
      return 'Crypt'
    case 'panteon':
      return 'Panteon'
    case 'roofed tomb':
    case 'roofed_tomb':
      return 'Roofed Tomb'
    case 'family mausoleum':
    case 'family_mausoleum':
    case 'mausoleum':
      return 'Family Mausoleum'
    case 'in-ground burial plot':
    case 'in ground burial plot':
    case 'in_ground_burial_plot':
    case 'in-ground':
    case 'in ground':
    case 'grave':
      return 'In-Ground Burial Plot'
    case 'niche':
      return 'Columbarium'
    case 'tomb':
      return 'Roofed Tomb'
    default:
      return type
        .split(/[\s_-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
  }
}

/**
 * Compute the official rent cost for contract term:
 * 5 years = 300 pesos (₱300)
 * 20 years = 20,000 pesos (₱20,000)
 */
export function getCostForTerm(term?: string | null): string {
  if (!term) return '₱300'
  const clean = term.toLowerCase().trim()
  if (clean.includes('20')) {
    return '₱20,000'
  }
  return '₱300'
}

