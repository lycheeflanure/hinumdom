// src/types/database.ts
// Cemetery and memorial record domain types

export type CemeteryStatus = 'active' | 'inactive'
export type OccupancyStatus = 'occupied' | 'reserved' | 'available' | 'unknown'
export type VerificationStatus = 'verified' | 'pending' | 'needs_review' | 'unverified'
export type MemorialFacilityType = 
  | 'columbarium'
  | 'crypt'
  | 'panteon'
  | 'roofed tomb'
  | 'family mausoleum'
  | 'in-ground burial plot'
  | 'grave'
  | 'niche'
  | 'tomb'
  | 'other'
export type BurialStructureType = MemorialFacilityType
export type BurialType = 'interment' | 'entombment' | 'inurnment' | 'other'
export type AdminRole = 'super_admin' | 'cemetery_admin' | 'record_manager' | 'staff_readonly'
export type AdminAccountStatus = 'active' | 'suspended' | 'inactive'
export type RecordVisibility = 'public' | 'private' | 'family_only'
export type AuditAction = 
  | 'record_created' | 'record_updated' | 'record_deleted'
  | 'record_verified' | 'record_published' | 'record_archived'
  | 'location_created' | 'location_updated'
  | 'import_started' | 'import_completed'
  | 'login' | 'logout'

export interface Cemetery {
  id: string
  name: string
  official_name: string | null
  parish_name: string | null
  address: string | null
  contact_information: Record<string, string> | null
  timezone: string
  map_configuration: MapConfiguration | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MapConfiguration {
  center_lat: number
  center_lng: number
  default_zoom: number
  max_zoom: number
  min_zoom: number
  bounds?: [[number, number], [number, number]]
  is_demo: boolean
}

export interface Section {
  id: string
  cemetery_id: string
  name: string
  code: string
  display_order: number
  map_geometry: GeoJsonGeometry | null
  color?: string
  created_at: string
  updated_at: string
}

export interface BurialLocation {
  id: string
  cemetery_id: string
  section_id: string | null
  block: string | null
  row_number: string | null
  lot_number: string | null
  grave_number: string | null
  tile_number: string | null
  niche_number: string | null
  burial_structure_type: BurialStructureType
  occupancy_status: OccupancyStatus
  map_geometry: GeoJsonGeometry | null
  latitude: number | null
  longitude: number | null
  location_verification_status: VerificationStatus
  created_at: string
  updated_at: string
  // Joined
  section?: Section
  cemetery?: Cemetery
}

export interface DeceasedPerson {
  id: string
  first_name: string
  middle_name: string | null
  last_name: string
  suffix: string | null
  alternative_names: string[] | null
  birth_date: string | null
  death_date: string | null
  authorized_memorial_photo_path: string | null
  public_visibility: RecordVisibility
  created_at: string
  updated_at: string
}

export interface BurialRecord {
  id: string
  deceased_person_id: string
  cemetery_id: string
  burial_location_id: string | null
  burial_date: string | null
  burial_type: BurialType
  record_verification_status: VerificationStatus
  record_source: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
  // Joined
  deceased_person?: DeceasedPerson
  cemetery?: Cemetery
  burial_location?: BurialLocation
}

export interface AdministratorProfile {
  id: string
  display_name: string
  role: AdminRole
  account_status: AdminAccountStatus
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  actor_user_id: string | null
  action: AuditAction
  entity_type: string
  entity_id: string | null
  change_summary: Record<string, unknown> | null
  created_at: string
  // Joined
  actor?: AdministratorProfile
}

// ─── GeoJSON Types ──────────────────────────────────
export interface GeoJsonPoint {
  type: 'Point'
  coordinates: [number, number]
}

export interface GeoJsonPolygon {
  type: 'Polygon'
  coordinates: [number, number][][]
}

export type GeoJsonGeometry = GeoJsonPoint | GeoJsonPolygon
