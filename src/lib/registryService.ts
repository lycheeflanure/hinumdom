// src/lib/registryService.ts
// Local backend data service that manages the burial registry and Excel updates

import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'
import { MockBurialEntity } from './mockData'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const REGISTRY_FILE = path.join(DATA_DIR, 'registry.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Convert Excel date serial number or raw string to formatted YYYY-MM-DD
function formatExcelDate(raw: any): string {
  if (!raw) return ''
  const rawStr = String(raw).trim()
  if (rawStr.startsWith('#') || rawStr.toLowerCase() === 'null' || rawStr.toLowerCase() === 'undefined') {
    return ''
  }
  if (typeof raw === 'number') {
    // Excel date serial
    try {
      const date = XLSX.SSF.parse_date_code(raw)
      if (date) {
        const y = String(date.y).padStart(4, '0')
        const m = String(date.m).padStart(2, '0')
        const d = String(date.d).padStart(2, '0')
        return `${y}-${m}-${d}`
      }
    } catch {
      // fallback
    }
  }

  const str = String(raw).trim()
  // Check if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str

  // Check if MM/DD/YYYY or M/D/YYYY
  const mdyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mdyMatch) {
    const [, m, d, y] = mdyMatch
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }

  // Attempt Date parsing
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear()
    const m = String(parsed.getMonth() + 1).padStart(2, '0')
    const d = String(parsed.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return str
}

// Add years to YYYY-MM-DD date string (matching Excel EDATE logic)
function addYearsToDate(dateStr: string, years: number): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return ''
  const parts = dateStr.split('-')
  const y = parseInt(parts[0], 10) + years
  return `${y}-${parts[1]}-${parts[2]}`
}

// Clean and normalize keys from Excel rows
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Loads all records from persistent local storage.
 * If registry.json doesn't exist yet, initializes it from base records.
 */
export function getRegistryRecords(): MockBurialEntity[] {
  ensureDataDir()

  if (fs.existsSync(REGISTRY_FILE)) {
    try {
      const content = fs.readFileSync(REGISTRY_FILE, 'utf-8')
      const records = JSON.parse(content)
      if (Array.isArray(records) && records.length > 0) {
        return records
      }
    } catch (err) {
      console.error('Error reading registry.json, re-initializing:', err)
    }
  }

  // Initialize with enriched mock dataset
  const initialRecords = getInitialEnrichedRecords()
  saveRegistryRecords(initialRecords)
  return initialRecords
}

/**
 * Saves all records to registry.json
 */
export function saveRegistryRecords(records: MockBurialEntity[]): void {
  ensureDataDir()
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(records, null, 2), 'utf-8')
}

/**
 * Resets registry to initial baseline 6 records
 */
export function resetRegistryToInitial(): MockBurialEntity[] {
  const initial = getInitialEnrichedRecords()
  saveRegistryRecords(initial)
  return initial
}

/**
 * Finds a single record by ID
 */
export function getRegistryRecordById(id: string): MockBurialEntity | null {
  const records = getRegistryRecords()
  return records.find((r) => r.id === id) || null
}

/**
 * Deletes a single record by ID from persistent storage.
 */
export function deleteRegistryRecord(id: string): {
  success: boolean
  deletedRecord?: MockBurialEntity
  remainingCount?: number
} {
  const records = getRegistryRecords()
  const index = records.findIndex((r) => r.id === id)

  if (index === -1) {
    return { success: false }
  }

  const [deletedRecord] = records.splice(index, 1)
  saveRegistryRecords(records)

  return {
    success: true,
    deletedRecord,
    remainingCount: records.length,
  }
}

/**
 * Updates or adds records from an uploaded Excel / CSV buffer
 */
export function importRecordsFromExcel(buffer: Buffer): {
  success: boolean
  added: number
  updated: number
  unchanged?: number
  total: number
  errors?: string[]
} {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const targetSheetName =
    workbook.SheetNames.find(
      (s) => s.toLowerCase().includes('burial') || s.toLowerCase().includes('registry')
    ) || workbook.SheetNames[0]
  if (!targetSheetName) {
    throw new Error('The uploaded Excel spreadsheet contains no worksheets.')
  }

  const worksheet = workbook.Sheets[targetSheetName]
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

  if (rows.length === 0) {
    throw new Error('The uploaded Excel sheet contains no data rows.')
  }

  const currentRecords = getRegistryRecords()
  let added = 0
  let updated = 0
  let unchanged = 0
  const errors: string[] = []

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]
    const rowMap: Record<string, any> = {}

    for (const [rawKey, val] of Object.entries(row)) {
      rowMap[normalizeKey(rawKey)] = val
    }

    // Extract names
    const firstName = String(
      rowMap['firstname'] ||
      rowMap['deceasedfirstname'] ||
      rowMap['first'] ||
      ''
    ).trim()

    const lastName = String(
      rowMap['lastname'] ||
      rowMap['deceasedlastname'] ||
      rowMap['last'] ||
      ''
    ).trim()

    // Full name fallback
    const rawFullName = String(
      rowMap['fullname'] ||
      rowMap['deceasedname'] ||
      rowMap['name'] ||
      ''
    ).trim()

    let fName = firstName
    let lName = lastName
    let mName = String(rowMap['middlename'] || rowMap['middle'] || '').trim() || null
    let sfx = String(rowMap['suffix'] || '').trim() || null

    if (!fName && !lName && rawFullName) {
      const parts = rawFullName.split(/\s+/)
      fName = parts[0] || 'Unknown'
      lName = parts.slice(1).join(' ') || ''
    }

    const hasAnyContent = Boolean(
      fName ||
      lName ||
      rawFullName ||
      mName ||
      rowMap['contactpersonname'] ||
      rowMap['address'] ||
      rowMap['section']
    )
    if (!hasAnyContent) {
      // Empty or placeholder formula template row - skip quietly
      continue
    }

    if (!fName && !lName) {
      errors.push(`Row ${index + 2}: Missing deceased person name.`)
      continue
    }

    // Dates
    const dobKey = Object.keys(rowMap).find(
      (k) => k.startsWith('dateofbirth') || k.includes('birthdate') || k === 'dob' || k === 'birth'
    )
    const dob = formatExcelDate(dobKey ? rowMap[dobKey] : '')
    const dod = formatExcelDate(
      rowMap['dateofdeath'] ||
      rowMap['deathdate'] ||
      rowMap['dod'] ||
      rowMap['death']
    )
    const burialDate = formatExcelDate(
      rowMap['dateofburial'] ||
      rowMap['burialdate'] ||
      rowMap['buried']
    )

    // Rental / Burial Info
    const dateOfRenewal = formatExcelDate(
      rowMap['dateofrenewal'] ||
      rowMap['renewaldate'] ||
      rowMap['renewal']
    )
    const dateOfRent = formatExcelDate(
      rowMap['dateofrent'] ||
      rowMap['rentdate'] ||
      rowMap['rent']
    )
    const contractTermKey = Object.keys(rowMap).find(
      (k) =>
        k.startsWith('contractterm') ||
        k.startsWith('termofrent') ||
        k.includes('rentterm') ||
        k === 'contract' ||
        k === 'term'
    )
    const contractTermRaw = String(contractTermKey ? rowMap[contractTermKey] : '5 years').trim()
    const contractTerm = contractTermRaw.includes('20') ? '20 years' : '5 years'

    // Template formula: Date of Rent = IF(G2="", "", G2) (where G is Date of Burial)
    let effectiveDateOfRent = dateOfRent
    if (!effectiveDateOfRent && burialDate) {
      effectiveDateOfRent = burialDate
    }

    // Template formula: Date of Renewal = EDATE(date_of_rent, term * 12)
    let effectiveDateOfRenewal = dateOfRenewal
    if (!effectiveDateOfRenewal && effectiveDateOfRent) {
      const termYears = contractTerm.includes('20') ? 20 : 5
      effectiveDateOfRenewal = addYearsToDate(effectiveDateOfRent, termYears)
    }

    let costOfRentRaw = String(
      rowMap['costofrent'] ||
      rowMap['rentcost'] ||
      rowMap['cost'] ||
      ''
    ).trim()

    if (!costOfRentRaw || costOfRentRaw === '0') {
      costOfRentRaw = contractTerm === '20 years' ? '₱20,000' : '₱300'
    } else {
      const num = Number(costOfRentRaw.replace(/[^0-9.]/g, ''))
      if (!isNaN(num) && num > 0) {
        costOfRentRaw = `₱${num.toLocaleString('en-US')}`
      } else if (!costOfRentRaw.startsWith('₱') && !costOfRentRaw.toLowerCase().includes('pesos')) {
        costOfRentRaw = `₱${costOfRentRaw}`
      }
    }

    // Contact Information (Confidential)
    const contactPerson = String(
      rowMap['contactpersonname'] ||
      rowMap['contactperson'] ||
      rowMap['contactname'] ||
      rowMap['representative'] ||
      ''
    ).trim() || null

    const contactAddress = String(
      rowMap['contactaddress'] ||
      rowMap['address'] ||
      rowMap['contactaddressline'] ||
      ''
    ).trim() || null

    const contactPhone = String(
      rowMap['contactphonenumber'] ||
      rowMap['contactphone'] ||
      rowMap['phonenumber'] ||
      rowMap['phone'] ||
      rowMap['mobile'] ||
      ''
    ).trim() || null

    // Location / Section
    const sectionRaw = String(
      rowMap['section'] ||
      rowMap['sectionname'] ||
      rowMap['sectioncode'] ||
      'SECTION A'
    ).trim().toUpperCase()

    const sectionName = sectionRaw.includes('SECTION') ? sectionRaw : `SECTION ${sectionRaw}`
    const sectionCode = sectionName.replace(/\s+/g, '-').toUpperCase()
    const sectionId = `sec-${sectionCode.toLowerCase().replace('section-', '') || 'a'}`

    const block = String(rowMap['block'] || '').trim() || null
    const rowNum = String(rowMap['row'] || rowMap['rownumber'] || '').trim() || null
    const lotNumber = String(rowMap['lot'] || rowMap['lotnumber'] || '').trim() || null
    const graveNumber = String(rowMap['grave'] || rowMap['gravenumber'] || '').trim() || null
    const nicheNumber = String(rowMap['niche'] || rowMap['nichenumber'] || '').trim() || null

    // Memorial Facility & Burial Type
    const burialType = (
      String(rowMap['burialtype'] || rowMap['type'] || 'interment').toLowerCase() as any
    )
    const facilityInput = String(
      rowMap['memorialfacility'] ||
      rowMap['facility'] ||
      rowMap['structure'] ||
      rowMap['burialstructuretype'] ||
      'in-ground burial plot'
    ).toLowerCase().trim()

    let facilityType = 'in-ground burial plot'
    if (facilityInput.includes('columbarium') || facilityInput.includes('niche')) {
      facilityType = 'columbarium'
    } else if (facilityInput.includes('crypt')) {
      facilityType = 'crypt'
    } else if (facilityInput.includes('panteon')) {
      facilityType = 'panteon'
    } else if (facilityInput.includes('roofed') || facilityInput.includes('tomb')) {
      facilityType = 'roofed tomb'
    } else if (facilityInput.includes('mausoleum')) {
      facilityType = 'family mausoleum'
    } else if (facilityInput.includes('in-ground') || facilityInput.includes('grave') || facilityInput.includes('plot')) {
      facilityType = 'in-ground burial plot'
    } else {
      facilityType = facilityInput || 'in-ground burial plot'
    }

    // ─── Deduplication Matching Strategy (Upsert) ───
    // 1. Match by explicit Record ID if provided
    const existingId = String(rowMap['id'] || rowMap['recordid'] || '').trim()
    let existingIndex = -1

    if (existingId) {
      existingIndex = currentRecords.findIndex((r) => r.id === existingId)
    }

    // 2. Match by Name + Section + Location (Lot / Grave / Niche)
    if (existingIndex === -1 && (lotNumber || graveNumber || nicheNumber)) {
      existingIndex = currentRecords.findIndex(
        (r) =>
          r.first_name.toLowerCase() === fName.toLowerCase() &&
          r.last_name.toLowerCase() === lName.toLowerCase() &&
          r.section_name.toUpperCase() === sectionName &&
          ((lotNumber && r.lot_number?.toLowerCase() === lotNumber.toLowerCase()) ||
            (graveNumber && r.grave_number?.toLowerCase() === graveNumber.toLowerCase()) ||
            (nicheNumber && r.niche_number?.toLowerCase() === nicheNumber.toLowerCase()))
      )
    }

    // 3. Match by Name + Section + Birth Date or Death Date
    if (existingIndex === -1 && (dob || dod)) {
      existingIndex = currentRecords.findIndex(
        (r) =>
          r.first_name.toLowerCase() === fName.toLowerCase() &&
          r.last_name.toLowerCase() === lName.toLowerCase() &&
          r.section_name.toUpperCase() === sectionName &&
          ((dob && r.birth_date === dob) || (dod && r.death_date === dod))
      )
    }

    // 4. Fallback match by Name + Section
    if (existingIndex === -1) {
      existingIndex = currentRecords.findIndex(
        (r) =>
          r.first_name.toLowerCase() === fName.toLowerCase() &&
          r.last_name.toLowerCase() === lName.toLowerCase() &&
          r.section_name.toUpperCase() === sectionName
      )
    }

    // Default coordinates within cemetery section
    const defaultCoords = getSectionCoordinates(sectionName)

    // Generate deterministic slug ID for new records to prevent duplicate IDs on re-save
    let assignedId = existingIndex >= 0 ? currentRecords[existingIndex].id : ''
    if (!assignedId) {
      const cleanF = fName.toLowerCase().replace(/[^a-z0-9]/g, '')
      const cleanL = lName.toLowerCase().replace(/[^a-z0-9]/g, '')
      const cleanSec = sectionCode.toLowerCase().replace(/[^a-z0-9]/g, '')
      const locTag = (lotNumber || graveNumber || nicheNumber || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      let candidateId = `rec-${cleanF}-${cleanL}-${cleanSec}${locTag ? `-${locTag}` : ''}`
      let counter = 1
      while (currentRecords.some((r) => r.id === candidateId)) {
        counter++
        candidateId = `rec-${cleanF}-${cleanL}-${cleanSec}${locTag ? `-${locTag}` : ''}-${counter}`
      }
      assignedId = candidateId
    }

    const updatedEntity: MockBurialEntity = {
      id: assignedId,
      first_name: fName,
      middle_name: mName,
      last_name: lName,
      suffix: sfx,
      birth_date: dob || '1960-01-01',
      death_date: dod || '2020-01-01',
      burial_date: burialDate || dod || '2020-01-05',
      burial_type: burialType || 'interment',
      burial_structure_type: facilityType as any,
      record_verification_status: 'verified',
      section_id: sectionId,
      section_name: sectionName,
      section_code: sectionCode,
      block,
      row_number: rowNum,
      lot_number: lotNumber,
      grave_number: graveNumber,
      tile_number: null,
      niche_number: nicheNumber,
      latitude: existingIndex >= 0 ? currentRecords[existingIndex].latitude : defaultCoords.lat,
      longitude: existingIndex >= 0 ? currentRecords[existingIndex].longitude : defaultCoords.lng,
      has_photo: existingIndex >= 0 ? currentRecords[existingIndex].has_photo : true,
      notes: `Imported via Admin Parish Excel Registry.`,
      rental_information: {
        date_of_renewal: effectiveDateOfRenewal || null,
        date_of_rent: effectiveDateOfRent || null,
        term_of_rent: contractTerm,
        cost_of_rent: costOfRentRaw,
      },
      contact_information: {
        contact_person_name: contactPerson,
        address: contactAddress,
        phone_number: contactPhone,
      },
    }

    if (existingIndex >= 0) {
      // Check if any field actually changed
      const prev = currentRecords[existingIndex]
      const isUnchanged =
        prev.first_name === updatedEntity.first_name &&
        prev.last_name === updatedEntity.last_name &&
        prev.middle_name === updatedEntity.middle_name &&
        prev.suffix === updatedEntity.suffix &&
        prev.birth_date === updatedEntity.birth_date &&
        prev.death_date === updatedEntity.death_date &&
        prev.burial_date === updatedEntity.burial_date &&
        prev.section_name === updatedEntity.section_name &&
        prev.lot_number === updatedEntity.lot_number &&
        prev.grave_number === updatedEntity.grave_number &&
        prev.niche_number === updatedEntity.niche_number &&
        prev.rental_information?.cost_of_rent === updatedEntity.rental_information?.cost_of_rent &&
        prev.rental_information?.date_of_renewal === updatedEntity.rental_information?.date_of_renewal

      currentRecords[existingIndex] = updatedEntity
      if (isUnchanged) {
        unchanged++
      } else {
        updated++
      }
    } else {
      currentRecords.push(updatedEntity)
      added++
    }
  }

  saveRegistryRecords(currentRecords)

  return {
    success: true,
    added,
    updated,
    unchanged,
    total: currentRecords.length,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Generates or loads the official Excel template (.xlsx) for parish administrators
 */
export function generateExcelTemplate(forceSampleData: boolean = false): Buffer {
  if (!forceSampleData) {
    const customTemplatePath = path.join(process.cwd(), 'RECORDS TEMPLATE.xlsx')
    if (fs.existsSync(customTemplatePath)) {
      return fs.readFileSync(customTemplatePath)
    }
  }

  const sampleData = [
    {
      'Deceased First Name': 'Juan',
      'Deceased Middle Name': 'Mercado',
      'Deceased Last Name': 'Dela Cruz',
      'Suffix': 'Sr.',
      'Date of Birth': '1945-05-12',
      'Date of Death': '2018-10-20',
      'Date of Burial': '2018-10-26',
      'Memorial Facility': 'In-Ground Burial Plot',
      'Section': 'SECTION A',
      'Block': '04',
      'Row': '02',
      'Lot Number': 'A-025',
      'Grave Number': 'G-08',
      'Niche Number': '',
      'Date of Renewal': '2023-10-26',
      'Date of Rent': '2018-10-26',
      'Contract Term': '5 years',
      'Cost of Rent': '₱300',
      'Contact Person Name': 'Maria Dela Cruz',
      'Address': 'Purok 3, Barangay Ampayon, Butuan City',
      'Phone Number': '0917-123-4567',
      'Verification Status': 'Verified',
    },
    {
      'Deceased First Name': 'Catalina',
      'Deceased Middle Name': 'Rosales',
      'Deceased Last Name': 'Villanueva',
      'Suffix': '',
      'Date of Birth': '1938-12-04',
      'Date of Death': '2015-08-11',
      'Date of Burial': '2015-08-17',
      'Memorial Facility': 'Columbarium',
      'Section': 'SECTION C',
      'Block': '02',
      'Row': '',
      'Lot Number': '',
      'Grave Number': '',
      'Niche Number': 'C-104',
      'Date of Renewal': '2020-08-17',
      'Date of Rent': '2015-08-17',
      'Contract Term': '5 years',
      'Cost of Rent': '₱300',
      'Contact Person Name': 'Roberto Villanueva',
      'Address': 'Ampayon National Highway, Butuan City',
      'Phone Number': '0918-987-6543',
      'Verification Status': 'Verified',
    },
    {
      'Deceased First Name': 'Antonio',
      'Deceased Middle Name': 'Ramos',
      'Deceased Last Name': 'Gonzales',
      'Suffix': '',
      'Date of Birth': '1950-02-14',
      'Date of Death': '2024-03-01',
      'Date of Burial': '2024-03-08',
      'Memorial Facility': 'Crypt',
      'Section': 'SECTION B',
      'Block': '07',
      'Row': '03',
      'Lot Number': 'B-015',
      'Grave Number': 'C-02',
      'Niche Number': '',
      'Date of Renewal': '2029-03-08',
      'Date of Rent': '2024-03-08',
      'Contract Term': '5 years',
      'Cost of Rent': '₱300',
      'Contact Person Name': 'Teresa Gonzales',
      'Address': 'Brgy. Baan, Butuan City',
      'Phone Number': '0920-555-1234',
      'Verification Status': 'Verified',
    },
    {
      'Deceased First Name': 'Esperanza',
      'Deceased Middle Name': 'Navarro',
      'Deceased Last Name': 'Salazar',
      'Suffix': '',
      'Date of Birth': '1962-09-18',
      'Date of Death': '2021-11-05',
      'Date of Burial': '2021-11-12',
      'Memorial Facility': 'Panteon',
      'Section': 'SECTION B',
      'Block': '03',
      'Row': '01',
      'Lot Number': 'B-008',
      'Grave Number': 'P-04',
      'Niche Number': '',
      'Date of Renewal': '2041-11-12',
      'Date of Rent': '2021-11-12',
      'Contract Term': '20 years',
      'Cost of Rent': '₱20,000',
      'Contact Person Name': 'Eduardo Salazar',
      'Address': 'Purok 4, Ampayon, Butuan City',
      'Phone Number': '0922-333-4455',
      'Verification Status': 'Verified',
    },
    {
      'Deceased First Name': 'Rodrigo',
      'Deceased Middle Name': 'Flores',
      'Deceased Last Name': 'Mendoza',
      'Suffix': 'Jr.',
      'Date of Birth': '1955-03-22',
      'Date of Death': '2023-05-10',
      'Date of Burial': '2023-05-16',
      'Memorial Facility': 'Roofed Tomb',
      'Section': 'SECTION D',
      'Block': '05',
      'Row': '02',
      'Lot Number': 'D-019',
      'Grave Number': 'T-01',
      'Niche Number': '',
      'Date of Renewal': '2028-05-16',
      'Date of Rent': '2023-05-16',
      'Contract Term': '5 years',
      'Cost of Rent': '₱300',
      'Contact Person Name': 'Luzviminda Mendoza',
      'Address': 'Montalban St., Butuan City',
      'Phone Number': '0917-888-9900',
      'Verification Status': 'Verified',
    },
    {
      'Deceased First Name': 'Claudio',
      'Deceased Middle Name': 'Villar',
      'Deceased Last Name': 'Soriano',
      'Suffix': '',
      'Date of Birth': '1940-08-30',
      'Date of Death': '2019-12-02',
      'Date of Burial': '2019-12-08',
      'Memorial Facility': 'Family Mausoleum',
      'Section': 'SECTION A',
      'Block': '01',
      'Row': '01',
      'Lot Number': 'A-001',
      'Grave Number': 'M-01',
      'Niche Number': '',
      'Date of Renewal': '2039-12-08',
      'Date of Rent': '2019-12-08',
      'Contract Term': '20 years',
      'Cost of Rent': '₱20,000',
      'Contact Person Name': 'Beatriz Soriano',
      'Address': 'Villa Kananga, Butuan City',
      'Phone Number': '0929-111-2233',
      'Verification Status': 'Verified',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(sampleData)
  // Set column widths
  worksheet['!cols'] = [
    { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 8 },
    { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 22 }, { wch: 14 },
    { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
    { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 16 },
    { wch: 22 }, { wch: 35 }, { wch: 18 }, { wch: 16 },
  ]

  const guidelinesData = [
    { 'Category': 'Memorial Facility Types (Options)', 'Details': 'Columbarium, Crypt, Panteon, Roofed Tomb, Family Mausoleum, In-Ground Burial Plot' },
    { 'Category': 'Contract Term: 5 years', 'Details': 'Cost of Rent = 300 pesos (₱300)' },
    { 'Category': 'Contract Term: 20 years', 'Details': 'Cost of Rent = 20,000 pesos (₱20,000)' },
    { 'Category': 'Dates Format', 'Details': 'YYYY-MM-DD (e.g. 2024-03-08)' },
    { 'Category': 'Verification Status', 'Details': 'Verified or Pending' },
  ]
  const guidelinesSheet = XLSX.utils.json_to_sheet(guidelinesData)
  guidelinesSheet['!cols'] = [{ wch: 32 }, { wch: 80 }]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Burial Records Registry')
  XLSX.utils.book_append_sheet(workbook, guidelinesSheet, 'Facility & Term Guidelines')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

function getSectionCoordinates(secName: string): { lat: number; lng: number } {
  const norm = secName.toUpperCase()
  if (norm.includes('SECTION B')) {
    return { lat: 8.95078 + (Math.random() - 0.5) * 0.0004, lng: 125.61700 + (Math.random() - 0.5) * 0.0003 }
  }
  if (norm.includes('SECTION C')) {
    return { lat: 8.95026 + (Math.random() - 0.5) * 0.0004, lng: 125.61695 + (Math.random() - 0.5) * 0.0003 }
  }
  if (norm.includes('SECTION D')) {
    return { lat: 8.95028 + (Math.random() - 0.5) * 0.0004, lng: 125.61642 + (Math.random() - 0.5) * 0.0003 }
  }
  // Default Section A
  return { lat: 8.95076 + (Math.random() - 0.5) * 0.0004, lng: 125.61642 + (Math.random() - 0.5) * 0.0003 }
}

function getInitialEnrichedRecords(): MockBurialEntity[] {
  return [
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
    {
      id: 'pedro-calungsod-tan',
      first_name: 'Pedro',
      middle_name: 'Calungsod',
      last_name: 'Tan',
      suffix: null,
      birth_date: '1935-06-29',
      death_date: '2015-11-12',
      burial_date: '2015-11-18',
      burial_type: 'interment',
      burial_structure_type: 'panteon',
      record_verification_status: 'verified',
      section_id: 'sec-a',
      section_name: 'SECTION A',
      section_code: 'SEC-A',
      block: '02',
      row_number: '01',
      lot_number: 'A-005',
      grave_number: 'G-01',
      tile_number: null,
      niche_number: null,
      latitude: 8.95085,
      longitude: 125.61625,
      has_photo: true,
      notes: 'Pioneer resident of Barangay Ampayon, farmer, and church choir member.',
      rental_information: {
        date_of_renewal: '2020-11-18',
        date_of_rent: '2015-11-18',
        term_of_rent: '5 years',
        cost_of_rent: '₱300',
      },
      contact_information: {
        contact_person_name: 'Lourdes Tan-Alvarez',
        address: 'National Highway, Brgy. Ampayon, Butuan City',
        phone_number: '0917-334-4556',
      },
    },
    {
      id: 'teresa-aquino-reyes',
      first_name: 'Teresa',
      middle_name: 'Aquino',
      last_name: 'Reyes',
      suffix: null,
      birth_date: '1960-10-15',
      death_date: '2022-04-03',
      burial_date: '2022-04-09',
      burial_type: 'inurnment',
      burial_structure_type: 'columbarium',
      record_verification_status: 'verified',
      section_id: 'sec-c',
      section_name: 'SECTION C',
      section_code: 'SEC-C',
      block: '01',
      row_number: '03',
      lot_number: null,
      grave_number: null,
      tile_number: 'T-108',
      niche_number: 'C-042',
      latitude: 8.95035,
      longitude: 125.61685,
      has_photo: true,
      notes: 'Inurned in Columbarium Niches, Section C.',
      rental_information: {
        date_of_renewal: '2027-04-09',
        date_of_rent: '2022-04-09',
        term_of_rent: '5 years',
        cost_of_rent: '₱300',
      },
      contact_information: {
        contact_person_name: 'Manuel Reyes Jr.',
        address: 'KM 3, Libertad, Butuan City',
        phone_number: '0939-556-6778',
      },
    },
    {
      id: 'francisco-baltazar-lopez',
      first_name: 'Francisco',
      middle_name: 'Baltazar',
      last_name: 'Lopez',
      suffix: null,
      birth_date: '1941-04-02',
      death_date: '2019-09-15',
      burial_date: '2019-09-22',
      burial_type: 'entombment',
      burial_structure_type: 'roofed tomb',
      record_verification_status: 'verified',
      section_id: 'sec-b',
      section_name: 'SECTION B',
      section_code: 'SEC-B',
      block: '06',
      row_number: '04',
      lot_number: 'B-028',
      grave_number: 'C-07',
      tile_number: null,
      niche_number: null,
      latitude: 8.95068,
      longitude: 125.61710,
      has_photo: true,
      notes: 'Family roofed tomb in Section B.',
      rental_information: {
        date_of_renewal: '2039-09-22',
        date_of_rent: '2019-09-22',
        term_of_rent: '20 years',
        cost_of_rent: '₱20,000',
      },
      contact_information: {
        contact_person_name: 'Rowena Lopez-Perez',
        address: 'Purok 5, Brgy. Ampayon, Butuan City',
        phone_number: '0917-778-8990',
      },
    },
  ]
}
