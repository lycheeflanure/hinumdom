// scripts/watch-excel.mjs
// Standalone CLI file watcher for HINUMDOM Burial Records Registry
// Run via: npm run sync:watch

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const EXCEL_FILE = process.env.EXCEL_SYNC_PATH
  ? (path.isAbsolute(process.env.EXCEL_SYNC_PATH) ? process.env.EXCEL_SYNC_PATH : path.join(rootDir, process.env.EXCEL_SYNC_PATH))
  : path.join(rootDir, 'RECORDS TEMPLATE.xlsx')

const DATA_DIR = path.join(rootDir, 'src', 'data')
const REGISTRY_FILE = path.join(DATA_DIR, 'registry.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function calculateHash(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex')
}

function formatExcelDate(raw) {
  if (!raw) return ''
  const rawStr = String(raw).trim()
  if (rawStr.startsWith('#') || rawStr.toLowerCase() === 'null') return ''
  if (typeof raw === 'number') {
    try {
      const date = XLSX.SSF.parse_date_code(raw)
      if (date) {
        const y = String(date.y).padStart(4, '0')
        const m = String(date.m).padStart(2, '0')
        const d = String(date.d).padStart(2, '0')
        return `${y}-${m}-${d}`
      }
    } catch {}
  }
  const str = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  const mdyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mdyMatch) {
    const [, m, d, y] = mdyMatch
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear()
    const m = String(parsed.getMonth() + 1).padStart(2, '0')
    const d = String(parsed.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return str
}

function addYearsToDate(dateStr, years) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return ''
  const parts = dateStr.split('-')
  const y = parseInt(parts[0], 10) + years
  return `${y}-${parts[1]}-${parts[2]}`
}

function normalizeKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getSectionCoordinates(sectionName) {
  const norm = sectionName.toUpperCase()
  if (norm.includes('B')) return { lat: 8.95045, lng: 125.61665 }
  if (norm.includes('C')) return { lat: 8.9502, lng: 125.6169 }
  if (norm.includes('D')) return { lat: 8.9499, lng: 125.61715 }
  return { lat: 8.95078, lng: 125.61642 } // Section A default
}

function safeRead(filePath, maxAttempts = 6) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return fs.readFileSync(filePath)
    } catch (err) {
      if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') {
        const wait = 250 * (i + 1)
        const end = Date.now() + wait
        while (Date.now() < end) {}
      } else {
        throw err
      }
    }
  }
  throw new Error(`File is locked by Excel after ${maxAttempts} attempts.`)
}

let lastFileHash = null

function syncNow(quiet = false) {
  if (!fs.existsSync(EXCEL_FILE)) {
    console.warn(`[Sync] Warning: "${path.basename(EXCEL_FILE)}" not found.`)
    return
  }

  try {
    const buffer = safeRead(EXCEL_FILE)
    const currentHash = calculateHash(buffer)

    if (lastFileHash && lastFileHash === currentHash) {
      if (!quiet) console.log(`[Sync] Content unchanged. (SHA-256 matched)`)
      return
    }

    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const targetSheetName =
      workbook.SheetNames.find(
        (s) => s.toLowerCase().includes('burial') || s.toLowerCase().includes('registry')
      ) || workbook.SheetNames[0]

    if (!targetSheetName) {
      console.warn('[Sync] No valid worksheet found in spreadsheet.')
      return
    }

    const worksheet = workbook.Sheets[targetSheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    ensureDataDir()
    let currentRecords = []
    if (fs.existsSync(REGISTRY_FILE)) {
      try {
        currentRecords = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'))
      } catch {
        currentRecords = []
      }
    }

    let added = 0
    let updated = 0
    let unchanged = 0

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]
      const rowMap = {}
      for (const [k, v] of Object.entries(row)) {
        rowMap[normalizeKey(k)] = v
      }

      const fName = String(rowMap['firstname'] || rowMap['deceasedfirstname'] || rowMap['first'] || '').trim()
      const lName = String(rowMap['lastname'] || rowMap['deceasedlastname'] || rowMap['last'] || '').trim()
      const rawFullName = String(rowMap['fullname'] || rowMap['deceasedname'] || rowMap['name'] || '').trim()
      const mName = String(rowMap['middlename'] || rowMap['middle'] || '').trim() || null
      const sfx = String(rowMap['suffix'] || '').trim() || null

      let firstName = fName
      let lastName = lName
      if (!firstName && !lastName && rawFullName) {
        const parts = rawFullName.split(/\s+/)
        firstName = parts[0] || 'Unknown'
        lastName = parts.slice(1).join(' ') || ''
      }

      const hasContent = Boolean(
        firstName ||
        lastName ||
        rawFullName ||
        mName ||
        rowMap['contactpersonname'] ||
        rowMap['address'] ||
        rowMap['section']
      )
      if (!hasContent) continue
      if (!firstName && !lastName) continue

      const dobKey = Object.keys(rowMap).find(
        (k) => k.startsWith('dateofbirth') || k.includes('birthdate') || k === 'dob' || k === 'birth'
      )
      const dob = formatExcelDate(dobKey ? rowMap[dobKey] : '')
      const dod = formatExcelDate(rowMap['dateofdeath'] || rowMap['deathdate'] || rowMap['dod'] || rowMap['death'])
      const burialDate = formatExcelDate(rowMap['dateofburial'] || rowMap['burialdate'] || rowMap['buried'])

      const dateOfRent = formatExcelDate(rowMap['dateofrent'] || rowMap['rentdate'] || rowMap['rent']) || burialDate
      const contractTermKey = Object.keys(rowMap).find(
        (k) => k.startsWith('contractterm') || k.startsWith('termofrent') || k.includes('rentterm') || k === 'term'
      )
      const contractTermRaw = String(contractTermKey ? rowMap[contractTermKey] : '5 years').trim()
      const contractTerm = contractTermRaw.includes('20') ? '20 years' : '5 years'

      let effectiveDateOfRenewal = formatExcelDate(rowMap['dateofrenewal'] || rowMap['renewaldate'] || rowMap['renewal'])
      if (!effectiveDateOfRenewal && dateOfRent) {
        effectiveDateOfRenewal = addYearsToDate(dateOfRent, contractTerm === '20 years' ? 20 : 5)
      }

      let costOfRentRaw = String(rowMap['costofrent'] || rowMap['rentcost'] || rowMap['cost'] || '').trim()
      if (!costOfRentRaw || costOfRentRaw === '0') {
        costOfRentRaw = contractTerm === '20 years' ? '₱20,000' : '₱300'
      } else {
        const num = Number(costOfRentRaw.replace(/[^0-9.]/g, ''))
        if (!isNaN(num) && num > 0) {
          costOfRentRaw = `₱${num.toLocaleString('en-US')}`
        }
      }

      const contactPerson = String(rowMap['contactpersonname'] || rowMap['contactperson'] || rowMap['contactname'] || '').trim() || null
      const contactAddress = String(rowMap['contactaddress'] || rowMap['address'] || '').trim() || null
      const contactPhone = String(rowMap['contactphonenumber'] || rowMap['contactphone'] || rowMap['phone'] || '').trim() || null

      const sectionRaw = String(rowMap['section'] || rowMap['sectionname'] || 'SECTION A').trim().toUpperCase()
      const sectionName = sectionRaw.includes('SECTION') ? sectionRaw : `SECTION ${sectionRaw}`
      const sectionCode = sectionName.replace(/\s+/g, '-').toUpperCase()
      const sectionId = `sec-${sectionCode.toLowerCase().replace('section-', '') || 'a'}`

      const block = String(rowMap['block'] || '').trim() || null
      const rowNum = String(rowMap['row'] || rowMap['rownumber'] || '').trim() || null
      const lotNumber = String(rowMap['lot'] || rowMap['lotnumber'] || '').trim() || null
      const graveNumber = String(rowMap['grave'] || rowMap['gravenumber'] || '').trim() || null
      const nicheNumber = String(rowMap['niche'] || rowMap['nichenumber'] || '').trim() || null

      const burialType = String(rowMap['burialtype'] || rowMap['type'] || 'interment').toLowerCase()
      const facilityInput = String(rowMap['memorialfacility'] || rowMap['facility'] || 'in-ground burial plot').toLowerCase().trim()
      let facilityType = 'in-ground burial plot'
      if (facilityInput.includes('columbarium') || facilityInput.includes('niche')) facilityType = 'columbarium'
      else if (facilityInput.includes('crypt')) facilityType = 'crypt'
      else if (facilityInput.includes('panteon')) facilityType = 'panteon'
      else if (facilityInput.includes('roofed') || facilityInput.includes('tomb')) facilityType = 'roofed tomb'
      else if (facilityInput.includes('mausoleum')) facilityType = 'family mausoleum'

      // Deduplication Matching Strategy (Upsert)
      const existingId = String(rowMap['id'] || rowMap['recordid'] || '').trim()
      let existingIndex = -1

      if (existingId) {
        existingIndex = currentRecords.findIndex((r) => r.id === existingId)
      }

      if (existingIndex === -1 && (lotNumber || graveNumber || nicheNumber)) {
        existingIndex = currentRecords.findIndex(
          (r) =>
            r.first_name.toLowerCase() === firstName.toLowerCase() &&
            r.last_name.toLowerCase() === lastName.toLowerCase() &&
            r.section_name.toUpperCase() === sectionName &&
            ((lotNumber && r.lot_number?.toLowerCase() === lotNumber.toLowerCase()) ||
              (graveNumber && r.grave_number?.toLowerCase() === graveNumber.toLowerCase()) ||
              (nicheNumber && r.niche_number?.toLowerCase() === nicheNumber.toLowerCase()))
        )
      }

      if (existingIndex === -1 && (dob || dod)) {
        existingIndex = currentRecords.findIndex(
          (r) =>
            r.first_name.toLowerCase() === firstName.toLowerCase() &&
            r.last_name.toLowerCase() === lastName.toLowerCase() &&
            r.section_name.toUpperCase() === sectionName &&
            ((dob && r.birth_date === dob) || (dod && r.death_date === dod))
        )
      }

      if (existingIndex === -1) {
        existingIndex = currentRecords.findIndex(
          (r) =>
            r.first_name.toLowerCase() === firstName.toLowerCase() &&
            r.last_name.toLowerCase() === lastName.toLowerCase() &&
            r.section_name.toUpperCase() === sectionName
        )
      }

      const defaultCoords = getSectionCoordinates(sectionName)

      let assignedId = existingIndex >= 0 ? currentRecords[existingIndex].id : ''
      if (!assignedId) {
        const cleanF = firstName.toLowerCase().replace(/[^a-z0-9]/g, '')
        const cleanL = lastName.toLowerCase().replace(/[^a-z0-9]/g, '')
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

      const entity = {
        id: assignedId,
        first_name: firstName,
        middle_name: mName,
        last_name: lastName,
        suffix: sfx,
        birth_date: dob || '1960-01-01',
        death_date: dod || '2020-01-01',
        burial_date: burialDate || dod || '2020-01-05',
        burial_type: burialType,
        burial_structure_type: facilityType,
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
          date_of_rent: dateOfRent || null,
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
        const prev = currentRecords[existingIndex]
        const isUnchanged =
          prev.first_name === entity.first_name &&
          prev.last_name === entity.last_name &&
          prev.birth_date === entity.birth_date &&
          prev.death_date === entity.death_date &&
          prev.section_name === entity.section_name &&
          prev.lot_number === entity.lot_number &&
          prev.grave_number === entity.grave_number &&
          prev.rental_information?.cost_of_rent === entity.rental_information?.cost_of_rent &&
          prev.rental_information?.date_of_renewal === entity.rental_information?.date_of_renewal

        currentRecords[existingIndex] = entity
        if (isUnchanged) unchanged++
        else updated++
      } else {
        currentRecords.push(entity)
        added++
      }
    }

    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(currentRecords, null, 2), 'utf-8')
    lastFileHash = currentHash

    const time = new Date().toLocaleTimeString()
    console.log(
      `\x1b[32m[${time}]\x1b[0m 🟢 \x1b[1mSave detected on ${path.basename(EXCEL_FILE)}\x1b[0m ➜ ` +
        `\x1b[32m+${added} added\x1b[0m, \x1b[34m${updated} updated\x1b[0m, \x1b[33m${unchanged} unchanged\x1b[0m. ` +
        `\x1b[36mTotal: ${currentRecords.length} records\x1b[0m in registry.json`
    )
  } catch (err) {
    console.error(`\x1b[31m[Sync Error]\x1b[0m`, err.message)
  }
}

// Banner
console.log('\x1b[36m' + '='.repeat(68) + '\x1b[0m')
console.log('  \x1b[1m\x1b[33mHINUMDOM — EXCEL AUTO-SYNC WATCHER (Option 1)\x1b[0m')
console.log(`  Target File : \x1b[32m${path.basename(EXCEL_FILE)}\x1b[0m`)
console.log(`  Full Path   : ${EXCEL_FILE}`)
console.log(`  Database    : ${REGISTRY_FILE}`)
console.log(`  Status      : \x1b[32mActive & Listening for Ctrl+S Saves\x1b[0m`)
console.log('\x1b[36m' + '='.repeat(68) + '\x1b[0m\n')

// Initial baseline sync
syncNow(true)

let debounce = null
let lastMtime = fs.existsSync(EXCEL_FILE) ? fs.statSync(EXCEL_FILE).mtimeMs : 0

function handleEvent() {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(() => {
    if (fs.existsSync(EXCEL_FILE)) {
      const mt = fs.statSync(EXCEL_FILE).mtimeMs
      if (mt !== lastMtime) {
        lastMtime = mt
        syncNow()
      }
    }
  }, 600)
}

// Watch directory
const watchDir = path.dirname(EXCEL_FILE)
const targetBase = path.basename(EXCEL_FILE).toLowerCase()

try {
  fs.watch(watchDir, { persistent: true }, (event, filename) => {
    if (!filename) return
    const fn = filename.toLowerCase()
    if (fn.startsWith('~$') || fn.startsWith('.~') || fn.endsWith('.tmp')) return
    if (fn === targetBase) {
      handleEvent()
    }
  })
} catch (err) {
  console.warn('[Watcher Warning]', err.message)
}

// Fallback interval (every 2.5s)
setInterval(() => {
  if (fs.existsSync(EXCEL_FILE)) {
    const mt = fs.statSync(EXCEL_FILE).mtimeMs
    if (mt > lastMtime) {
      lastMtime = mt
      handleEvent()
    }
  }
}, 2500)

console.log('Tip: Open "RECORDS TEMPLATE.xlsx" in Excel, edit rows, and press Ctrl+S.')
console.log('Press Ctrl+C to stop the watcher.\n')
