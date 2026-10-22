// src/types/api.ts
// API request/response types

import type { 
  BurialRecord, DeceasedPerson, BurialLocation, 
  Cemetery, Section, VerificationStatus 
} from './database'

// ─── Public Search ─────────────────────────────────

export interface SearchParams {
  query: string
  year_of_death?: number
  section_code?: string
  page?: number
  page_size?: number
}

export interface PublicBurialRecord {
  id: string
  full_name: string
  suffix: string | null
  birth_date: string | null
  death_date: string | null
  burial_date: string | null
  cemetery_name: string
  section_name: string | null
  section_code: string | null
  block: string | null
  row_number: string | null
  lot_number: string | null
  grave_number: string | null
  burial_structure_type: string
  record_verification_status: VerificationStatus
  is_mapped: boolean
}

export interface SearchResponse {
  results: PublicBurialRecord[]
  total: number
  page: number
  page_size: number
  total_pages: number
  query: string
}

// ─── Burial Detail (Public) ─────────────────────────

export interface PublicBurialDetail {
  record_id: string
  full_name: string
  first_name: string
  middle_name: string | null
  last_name: string
  suffix: string | null
  birth_date: string | null
  death_date: string | null
  burial_date: string | null
  burial_type: string
  cemetery: {
    id: string
    name: string
    official_name: string | null
    parish_name: string | null
    address: string | null
  }
  location: {
    id: string
    section_name: string | null
    section_code: string | null
    block: string | null
    row_number: string | null
    lot_number: string | null
    grave_number: string | null
    tile_number: string | null
    niche_number: string | null
    burial_structure_type: string
    latitude: number | null
    longitude: number | null
    map_geometry: unknown | null
    is_mapped: boolean
    location_verification_status: VerificationStatus
  } | null
  record_verification_status: VerificationStatus
  has_photo: boolean
  rental_information?: RentalInformation | null
  contact_information?: ContactInformation | null
}

export interface RentalInformation {
  date_of_renewal: string | null
  date_of_rent: string | null
  term_of_rent: string | null
  contract_term?: string | null
  cost_of_rent: string | null
}

export interface ContactInformation {
  contact_person_name: string | null
  address: string | null
  phone_number: string | null
}

// ─── Admin ──────────────────────────────────────────

export interface AdminSearchParams {
  query?: string
  status?: VerificationStatus | 'all'
  cemetery_id?: string
  section_id?: string
  page?: number
  page_size?: number
}

export interface AdminDashboardStats {
  total_records: number
  verified_records: number
  pending_records: number
  needs_review_records: number
  total_locations: number
  mapped_locations: number
  unmapped_locations: number
  occupied_locations: number
  available_locations: number
  recent_actions: RecentAction[]
}

export interface RecentAction {
  id: string
  action: string
  entity_type: string
  actor_name: string
  created_at: string
  summary: string
}

// ─── Import ─────────────────────────────────────────

export interface ImportRow {
  row_index: number
  data: Record<string, string>
  status: 'valid' | 'invalid' | 'duplicate_candidate' | 'missing_location'
  errors: string[]
  warnings: string[]
}

export interface ImportPreview {
  total_rows: number
  valid_rows: ImportRow[]
  invalid_rows: ImportRow[]
  duplicate_candidates: ImportRow[]
  missing_locations: ImportRow[]
  column_mapping: Record<string, string>
}

// ─── Forms ──────────────────────────────────────────

export interface DeceasedPersonFormData {
  first_name: string
  middle_name?: string
  last_name: string
  suffix?: string
  alternative_names?: string
  birth_date?: string
  death_date?: string
  public_visibility: 'public' | 'private' | 'family_only'
}

export interface BurialRecordFormData {
  deceased_person_id: string
  cemetery_id: string
  burial_location_id?: string
  burial_date?: string
  burial_type: 'interment' | 'entombment' | 'inurnment' | 'other'
  record_source?: string
}

export interface LocationFormData {
  cemetery_id: string
  section_id?: string
  block?: string
  row_number?: string
  lot_number?: string
  grave_number?: string
  tile_number?: string
  niche_number?: string
  burial_structure_type: string
  latitude?: number
  longitude?: number
}

// ─── API Responses ───────────────────────────────────

export interface ApiSuccess<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
