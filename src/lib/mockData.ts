// src/lib/mockData.ts
// Comprehensive mock dataset for HINUMDOM
// Cemetery Location: Ampayon, Butuan City, Agusan del Norte, Philippines

import { PublicBurialRecord, PublicBurialDetail } from '@/types/api'

export interface MockCemeteryInfo {
  id: string
  name: string
  official_name: string
  parish_name: string
  address: string
  contact_information: {
    phone: string
    email: string
    visiting_hours: string
    office_hours: string
  }
  center: [number, number]
  default_zoom: number
  boundary?: [number, number][]
}

export interface MockSectionInfo {
  id: string
  name: string
  code: string
  color: string
  description: string
  bounds: [number, number][]
}

export interface MockBurialEntity {
  id: string
  first_name: string
  middle_name: string | null
  last_name: string
  suffix: string | null
  birth_date: string
  death_date: string
  burial_date: string
  burial_type: 'interment' | 'entombment' | 'inurnment' | 'other'
  burial_structure_type:
    | 'columbarium'
    | 'crypt'
    | 'panteon'
    | 'roofed tomb'
    | 'family mausoleum'
    | 'in-ground burial plot'
    | 'grave'
    | 'niche'
    | 'tomb'
    | string
  record_verification_status: 'verified' | 'pending' | 'needs_review'
  section_id: string
  section_name: string
  section_code: string
  block: string | null
  row_number: string | null
  lot_number: string | null
  grave_number: string | null
  tile_number: string | null
  niche_number: string | null
  latitude: number
  longitude: number
  has_photo: boolean
  notes?: string
  rental_information?: {
    date_of_renewal: string | null
    date_of_rent: string | null
    term_of_rent: string | null
    cost_of_rent: string | null
  } | null
  contact_information?: {
    contact_person_name: string | null
    address: string | null
    phone_number: string | null
  } | null
}

export const MOCK_CEMETERY: MockCemeteryInfo = {
  id: 'cem-ampayon-01',
  name: 'Holy Cross Catholic Cemetery',
  official_name: 'Holy Cross Catholic Cemetery',
  parish_name: 'Holy Cross Parish - Ampayon',
  address: 'National Highway, Barangay Ampayon, Butuan City, Agusan del Norte 8600',
  contact_information: {
    phone: '(085) 341-2345',
    email: 'holycross.parish.cemetery@hinumdom.ph',
    visiting_hours: 'Daily 6:00 AM – 6:00 PM',
    office_hours: 'Monday – Saturday 8:00 AM – 5:00 PM',
  },
  // Centered at Holy Cross Catholic Cemetery based on Google Maps block coordinates
  center: [8.95052, 125.61670],
  default_zoom: 19,
  boundary: [
    [8.951023555425953, 125.61614468887099],
    [8.951012957248931, 125.61730072084792],
    [8.94997980918976, 125.61714102318575],
    [8.95006176960369, 125.61620369746377],
  ],
}

export const MOCK_SECTIONS: MockSectionInfo[] = [
  {
    id: 'sec-a',
    name: 'SECTION A',
    code: 'SEC-A',
    color: '#1D70B8',
    description: 'Historical earth plots and traditional family burial plots',
    bounds: [
      [8.951024, 125.616145],
      [8.951018, 125.616723],
      [8.950520, 125.616698],
      [8.950543, 125.616174],
    ],
  },
  {
    id: 'sec-b',
    name: 'SECTION B',
    code: 'SEC-B',
    color: '#0EA5E9',
    description: 'Modern lawn crypts and above-ground interments',
    bounds: [
      [8.951018, 125.616723],
      [8.951013, 125.617301],
      [8.950496, 125.617221],
      [8.950520, 125.616698],
    ],
  },
  {
    id: 'sec-c',
    name: 'SECTION C',
    code: 'SEC-C',
    color: '#C2A46B',
    description: 'Indoor and covered wall columbarium niches for inurnment',
    bounds: [
      [8.950520, 125.616698],
      [8.950496, 125.617221],
      [8.949980, 125.617141],
      [8.950021, 125.616672],
    ],
  },
  {
    id: 'sec-d',
    name: 'SECTION D',
    code: 'SEC-D',
    color: '#38BDF8',
    description: 'Shaded memorial gardens with tree plots and pathways',
    bounds: [
      [8.950543, 125.616174],
      [8.950520, 125.616698],
      [8.950021, 125.616672],
      [8.950062, 125.616204],
    ],
  },
]

export const MOCK_BURIAL_RECORDS: MockBurialEntity[] = [
  // 1. Juan dela Cruz (Senior)
  {
    id: 'juan-dela-cruz-1',
    first_name: 'Juan',
    middle_name: 'Mercado',
    last_name: 'Dela Cruz',
    suffix: 'Sr.',
    birth_date: '1945-05-12',
    death_date: '2018-10-20',
    burial_date: '2018-10-26',
    burial_type: 'interment',
    burial_structure_type: 'in-ground burial plot',
    record_verification_status: 'verified',
    section_id: 'sec-a',
    section_name: 'SECTION A',
    section_code: 'SEC-A',
    block: '04',
    row_number: '02',
    lot_number: 'A-025',
    grave_number: 'G-08',
    tile_number: null,
    niche_number: null,
    latitude: 8.95078,
    longitude: 125.61642,
    has_photo: true,
    notes: 'Beloved father, grandfather, and long-time catechist in Ampayon.',
    rental_information: {
      date_of_renewal: '2023-10-26',
      date_of_rent: '2018-10-26',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
    contact_information: {
      contact_person_name: 'Maria Mercado Dela Cruz',
      address: 'Purok 3, Barangay Ampayon, Butuan City',
      phone_number: '0917-234-5678',
    },
  },

  // 2. Juan dela Cruz (Junior — same name, different birth and death dates)
  {
    id: 'juan-dela-cruz-2',
    first_name: 'Juan',
    middle_name: 'Santos',
    last_name: 'Dela Cruz',
    suffix: 'Jr.',
    birth_date: '1978-08-28',
    death_date: '2023-01-14',
    burial_date: '2023-01-21',
    burial_type: 'entombment',
    burial_structure_type: 'crypt',
    record_verification_status: 'verified',
    section_id: 'sec-b',
    section_name: 'SECTION B',
    section_code: 'SEC-B',
    block: '09',
    row_number: '05',
    lot_number: 'B-042',
    grave_number: 'C-14',
    tile_number: null,
    niche_number: null,
    latitude: 8.95082,
    longitude: 125.61694,
    has_photo: true,
    notes: 'Loving husband, civil engineer, remembered by his wife and three children.',
    rental_information: {
      date_of_renewal: '2028-01-21',
      date_of_rent: '2023-01-21',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
    contact_information: {
      contact_person_name: 'Elena Ramos Dela Cruz',
      address: 'Villa Kananga, Butuan City',
      phone_number: '0919-876-5432',
    },
  },

  // 3. Maria Santos Dela Cruz
  {
    id: 'maria-santos-3',
    first_name: 'Maria',
    middle_name: 'Santos',
    last_name: 'Dela Cruz',
    suffix: null,
    birth_date: '1952-11-03',
    death_date: '2020-06-18',
    burial_date: '2020-06-24',
    burial_type: 'interment',
    burial_structure_type: 'family mausoleum',
    record_verification_status: 'verified',
    section_id: 'sec-a',
    section_name: 'SECTION A',
    section_code: 'SEC-A',
    block: '04',
    row_number: '02',
    lot_number: 'A-012',
    grave_number: 'G-03',
    tile_number: null,
    niche_number: null,
    latitude: 8.95066,
    longitude: 125.61655,
    has_photo: true,
    notes: 'Devoted mother and teacher at Ampayon Central Elementary School.',
    rental_information: {
      date_of_renewal: '2040-06-24',
      date_of_rent: '2020-06-24',
      term_of_rent: '20 years',
      cost_of_rent: '₱20,000',
    },
    contact_information: {
      contact_person_name: 'Eduardo Dela Cruz',
      address: 'Purok 2-A, Brgy. Ampayon, Butuan City',
      phone_number: '0928-112-2334',
    },
  },

  // 4. Pedro Villanueva
  {
    id: 'pedro-villanueva-4',
    first_name: 'Pedro',
    middle_name: 'Alcantara',
    last_name: 'Villanueva',
    suffix: null,
    birth_date: '1938-03-15',
    death_date: '2015-09-09',
    burial_date: '2015-09-16',
    burial_type: 'interment',
    burial_structure_type: 'panteon',
    record_verification_status: 'verified',
    section_id: 'sec-b',
    section_name: 'SECTION B',
    section_code: 'SEC-B',
    block: '03',
    row_number: '01',
    lot_number: 'B-018',
    grave_number: 'G-05',
    tile_number: null,
    niche_number: null,
    latitude: 8.95068,
    longitude: 125.61710,
    has_photo: false,
    notes: 'Respected barangay elder and farmer leader in Ampayon.',
    rental_information: {
      date_of_renewal: '2020-09-16',
      date_of_rent: '2015-09-16',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
  },

  // 5. Rosario Garcia Hernandez
  {
    id: 'rosario-garcia-5',
    first_name: 'Rosario',
    middle_name: 'Garcia',
    last_name: 'Hernandez',
    suffix: null,
    birth_date: '1960-10-01',
    death_date: '2021-12-25',
    burial_date: '2021-12-30',
    burial_type: 'inurnment',
    burial_structure_type: 'columbarium',
    record_verification_status: 'verified',
    section_id: 'sec-c',
    section_name: 'SECTION C',
    section_code: 'SEC-C',
    block: 'COL-1',
    row_number: '03',
    lot_number: null,
    grave_number: null,
    tile_number: null,
    niche_number: 'C-104',
    latitude: 8.95028,
    longitude: 125.61690,
    has_photo: true,
    notes: 'In loving memory of Mommy Charo. Always in our hearts.',
    rental_information: {
      date_of_renewal: '2026-12-30',
      date_of_rent: '2021-12-30',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
  },

  // 6. Francisco "Kiko" Amora
  {
    id: 'francisco-amora-6',
    first_name: 'Francisco',
    middle_name: 'Dagohoy',
    last_name: 'Amora',
    suffix: null,
    birth_date: '1949-12-03',
    death_date: '2019-04-12',
    burial_date: '2019-04-18',
    burial_type: 'interment',
    burial_structure_type: 'roofed tomb',
    record_verification_status: 'verified',
    section_id: 'sec-d',
    section_name: 'SECTION D',
    section_code: 'SEC-D',
    block: '02',
    row_number: '04',
    lot_number: 'D-005',
    grave_number: 'G-02',
    tile_number: null,
    niche_number: null,
    latitude: 8.95025,
    longitude: 125.61640,
    has_photo: false,
    notes: 'Barangay peace officer and devout member of the Knights of Columbus.',
    rental_information: {
      date_of_renewal: '2039-04-18',
      date_of_rent: '2019-04-18',
      term_of_rent: '20 years',
      cost_of_rent: '₱20,000',
    },
  },

  // 7. Teresa Lim Montilla
  {
    id: 'teresa-montilla-7',
    first_name: 'Teresa',
    middle_name: 'Lim',
    last_name: 'Montilla',
    suffix: null,
    birth_date: '1975-02-14',
    death_date: '2022-07-30',
    burial_date: '2022-08-05',
    burial_type: 'entombment',
    burial_structure_type: 'crypt',
    record_verification_status: 'verified',
    section_id: 'sec-b',
    section_name: 'SECTION B',
    section_code: 'SEC-B',
    block: '07',
    row_number: '03',
    lot_number: 'B-027',
    grave_number: 'C-09',
    tile_number: null,
    niche_number: null,
    latitude: 8.95088,
    longitude: 125.61680,
    has_photo: true,
    notes: 'A registered nurse who touched countless lives at Butuan Medical Center.',
    rental_information: {
      date_of_renewal: '2027-08-05',
      date_of_rent: '2022-08-05',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
  },

  // 8. Antonio Jose Bautista
  {
    id: 'antonio-bautista-8',
    first_name: 'Antonio',
    middle_name: 'Jose',
    last_name: 'Bautista',
    suffix: null,
    birth_date: '1965-06-19',
    death_date: '2017-11-11',
    burial_date: '2017-11-17',
    burial_type: 'interment',
    burial_structure_type: 'in-ground burial plot',
    record_verification_status: 'verified',
    section_id: 'sec-a',
    section_name: 'SECTION A',
    section_code: 'SEC-A',
    block: '05',
    row_number: '01',
    lot_number: 'A-030',
    grave_number: 'G-11',
    tile_number: null,
    niche_number: null,
    latitude: 8.95086,
    longitude: 125.61630,
    has_photo: false,
    notes: 'Father, fisherman, and choir member of San Vicente Ferrer.',
    rental_information: {
      date_of_renewal: '2022-11-17',
      date_of_rent: '2017-11-17',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
  },

  // 9. Remedios "Nanay Meding" Ramos
  {
    id: 'remedios-ramos-9',
    first_name: 'Remedios',
    middle_name: 'Flores',
    last_name: 'Ramos',
    suffix: null,
    birth_date: '1930-01-05',
    death_date: '2012-08-14',
    burial_date: '2012-08-20',
    burial_type: 'interment',
    burial_structure_type: 'family mausoleum',
    record_verification_status: 'verified',
    section_id: 'sec-a',
    section_name: 'SECTION A',
    section_code: 'SEC-A',
    block: '01',
    row_number: '01',
    lot_number: 'A-002',
    grave_number: 'T-01',
    tile_number: null,
    niche_number: null,
    latitude: 8.95062,
    longitude: 125.61636,
    has_photo: true,
    notes: 'Family matriarch. Rest in perpetual peace in God’s loving embrace.',
    rental_information: {
      date_of_renewal: '2032-08-20',
      date_of_rent: '2012-08-20',
      term_of_rent: '20 years',
      cost_of_rent: '₱20,000',
    },
  },

  // 10. Gabriel Morales Tan
  {
    id: 'gabriel-tan-10',
    first_name: 'Gabriel',
    middle_name: 'Morales',
    last_name: 'Tan',
    suffix: null,
    birth_date: '1988-09-22',
    death_date: '2024-05-05',
    burial_date: '2024-05-11',
    burial_type: 'inurnment',
    burial_structure_type: 'columbarium',
    record_verification_status: 'verified',
    section_id: 'sec-c',
    section_name: 'SECTION C',
    section_code: 'SEC-C',
    block: 'COL-2',
    row_number: '04',
    lot_number: null,
    grave_number: null,
    tile_number: null,
    niche_number: 'C-215',
    latitude: 8.95015,
    longitude: 125.61702,
    has_photo: true,
    notes: 'Gone too soon. Forever young and forever cherished by the Tan family.',
    rental_information: {
      date_of_renewal: '2029-05-11',
      date_of_rent: '2024-05-11',
      term_of_rent: '5 years',
      cost_of_rent: '₱300',
    },
  },
]

// ─── Helpers to convert MockBurialEntity to PublicBurialRecord & PublicBurialDetail ───

export function entityToPublicRecord(entity: MockBurialEntity): PublicBurialRecord {
  const full_name = [entity.first_name, entity.middle_name, entity.last_name]
    .filter(Boolean)
    .join(' ')

  return {
    id: entity.id,
    full_name,
    suffix: entity.suffix,
    birth_date: entity.birth_date,
    death_date: entity.death_date,
    burial_date: entity.burial_date,
    cemetery_name: MOCK_CEMETERY.name,
    section_name: entity.section_name,
    section_code: entity.section_code,
    block: entity.block,
    row_number: entity.row_number,
    lot_number: entity.lot_number,
    grave_number: entity.grave_number,
    burial_structure_type: entity.burial_structure_type,
    record_verification_status: entity.record_verification_status,
    is_mapped: true,
  }
}

export function entityToPublicDetail(entity: MockBurialEntity): PublicBurialDetail {
  const full_name = [entity.first_name, entity.middle_name, entity.last_name]
    .filter(Boolean)
    .join(' ')

  return {
    record_id: entity.id,
    full_name,
    first_name: entity.first_name,
    middle_name: entity.middle_name,
    last_name: entity.last_name,
    suffix: entity.suffix,
    birth_date: entity.birth_date,
    death_date: entity.death_date,
    burial_date: entity.burial_date,
    burial_type: entity.burial_type,
    cemetery: {
      id: MOCK_CEMETERY.id,
      name: MOCK_CEMETERY.name,
      official_name: MOCK_CEMETERY.official_name,
      parish_name: MOCK_CEMETERY.parish_name,
      address: MOCK_CEMETERY.address,
    },
    location: {
      id: `loc-${entity.id}`,
      section_name: entity.section_name,
      section_code: entity.section_code,
      block: entity.block,
      row_number: entity.row_number,
      lot_number: entity.lot_number,
      grave_number: entity.grave_number,
      tile_number: entity.tile_number,
      niche_number: entity.niche_number,
      burial_structure_type: entity.burial_structure_type,
      latitude: entity.latitude,
      longitude: entity.longitude,
      map_geometry: {
        type: 'Point',
        coordinates: [entity.longitude, entity.latitude],
      },
      is_mapped: true,
      location_verification_status: entity.record_verification_status,
    },
    record_verification_status: entity.record_verification_status,
    has_photo: entity.has_photo,
    rental_information: entity.rental_information || null,
    contact_information: entity.contact_information || null,
  }
}

export function searchMockRecords(
  query: string,
  page: number = 1,
  pageSize: number = 10
): { results: PublicBurialRecord[]; total: number } {
  let records = MOCK_BURIAL_RECORDS
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getRegistryRecords } = require('./registryService')
      const reg = getRegistryRecords()
      if (Array.isArray(reg) && reg.length > 0) {
        records = reg
      }
    } catch {
      // Fallback to static mock data
    }
  }

  const q = query.trim().toLowerCase()

  if (!q) {
    // Return all records if no query is specified
    const start = (page - 1) * pageSize
    const paginated = records.slice(start, start + pageSize)
    return {
      results: paginated.map(entityToPublicRecord),
      total: records.length,
    }
  }

  const qTokens = q.split(/\s+/).filter(Boolean)

  const filtered = records.filter((entity) => {
    const fn = entity.first_name.toLowerCase()
    const mn = (entity.middle_name || '').toLowerCase()
    const ln = entity.last_name.toLowerCase()
    const sfx = (entity.suffix || '').toLowerCase()
    const fnLn = `${fn} ${ln}`
    const fnMnLn = `${fn} ${mn} ${ln} ${sfx}`.trim()
    const sec = (entity.section_name || '').toLowerCase()
    const lot = (entity.lot_number || '').toLowerCase()
    const niche = (entity.niche_number || '').toLowerCase()

    if (
      fnLn.includes(q) ||
      fnMnLn.includes(q) ||
      sec.includes(q) ||
      lot.includes(q) ||
      niche.includes(q)
    ) {
      return true
    }

    const allTokensMatch = qTokens.every(
      (token) =>
        fn.includes(token) ||
        mn.includes(token) ||
        ln.includes(token) ||
        sfx.includes(token) ||
        sec.includes(token) ||
        lot.includes(token) ||
        niche.includes(token)
    )

    return allTokensMatch
  })

  const start = (page - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)

  return {
    results: paginated.map(entityToPublicRecord),
    total: filtered.length,
  }
}

export function getMockRecordById(id: string): PublicBurialDetail | null {
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getRegistryRecordById } = require('./registryService')
      const reg = getRegistryRecordById(id)
      if (reg) return entityToPublicDetail(reg)
    } catch {
      // Fallback
    }
  }

  const entity = MOCK_BURIAL_RECORDS.find((r) => r.id === id)
  if (!entity) return null
  return entityToPublicDetail(entity)
}

export function getMockMapMarkers() {
  let records = MOCK_BURIAL_RECORDS
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getRegistryRecords } = require('./registryService')
      const reg = getRegistryRecords()
      if (Array.isArray(reg) && reg.length > 0) {
        records = reg
      }
    } catch {
      // Fallback
    }
  }

  return records.map((rec) => {
    const fullNameWithSuffix = [
      rec.first_name,
      rec.middle_name,
      rec.last_name,
      rec.suffix,
    ]
      .filter(Boolean)
      .join(' ')

    const locationDetail = rec.niche_number
      ? `Niche ${rec.niche_number}`
      : `Lot ${rec.lot_number || ''} ${rec.grave_number ? `(${rec.grave_number})` : ''}`.trim()

    return {
      id: rec.id,
      name: fullNameWithSuffix,
      birth_date: rec.birth_date,
      death_date: rec.death_date,
      loc: [rec.latitude, rec.longitude] as [number, number],
      detail: locationDetail,
      section: rec.section_name,
      structure: rec.burial_structure_type,
    }
  })
}
