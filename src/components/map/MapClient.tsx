'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  MOCK_CEMETERY,
  MOCK_SECTIONS,
  MOCK_BURIAL_RECORDS,
} from '@/lib/mockData'
import { Calendar, Cross, ExternalLink } from 'lucide-react'
import { formatMemorialFacility } from '@/lib/utils'

// Custom Leaflet marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

// Helper component to smoothly pan/zoom map when grave is selected or fit cemetery boundary on load
function MapController({
  targetCoord,
  boundary,
}: {
  targetCoord: [number, number] | null
  boundary?: [number, number][]
}) {
  const map = useMap()

  useEffect(() => {
    if (targetCoord) {
      map.flyTo(targetCoord, 20, {
        duration: 1.2,
      })
    } else if (boundary && boundary.length > 0) {
      const bounds = L.latLngBounds(boundary)
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 19 })
    }
  }, [targetCoord, boundary, map])

  return null
}

export default function MapClient() {
  const searchParams = useSearchParams()

  const locParam = searchParams.get('loc') || ''
  const recordParam = searchParams.get('record') || ''

  const [records, setRecords] = useState<any[]>(MOCK_BURIAL_RECORDS)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  // Fetch latest local backend registry records so Excel imports reflect live on map
  useEffect(() => {
    fetch('/api/records')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.records) && data.records.length > 0) {
          setRecords(data.records)
        }
      })
      .catch((err) => console.error('Error loading cemetery map records:', err))
  }, [])

  // Auto-select record if URL param provided
  useEffect(() => {
    if (recordParam) {
      setSelectedRecordId(recordParam)
    } else if (locParam) {
      const matched = records.find(
        (r) => `loc-${r.id}` === locParam || r.id === locParam
      )
      if (matched) {
        setSelectedRecordId(matched.id)
      }
    }
  }, [recordParam, locParam, records])

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || null

  const targetCoordinates: [number, number] | null = selectedRecord
    ? [selectedRecord.latitude, selectedRecord.longitude]
    : null

  return (
    <div className="container-content pt-12 md:pt-16 pb-20 md:pb-28 flex-grow flex flex-col justify-center w-full">
      
      {/* Top Header & Cemetery Details - Centered on 1 single line with prominent margins */}
      <div className="mb-8 md:mb-12 text-center w-full max-w-4xl mx-auto">
        <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight whitespace-nowrap">
          Holy Cross Catholic Cemetery
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-3">
          {MOCK_CEMETERY.address}
        </p>
      </div>

      {/* Main Map - Full width, centered, with generous space below and before the gold line */}
      <div className="w-full h-[520px] md:h-[620px] relative overflow-hidden rounded-2xl border-2 border-border-light shadow-lg bg-surface mb-12 md:mb-16">
        <MapContainer
          center={MOCK_CEMETERY.center}
          zoom={MOCK_CEMETERY.default_zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={22}
            maxNativeZoom={19}
          />

          <MapController targetCoord={targetCoordinates} boundary={MOCK_CEMETERY.boundary} />

          {/* Cemetery Perimeter Boundary (Google Maps Block) */}
          {MOCK_CEMETERY.boundary && (
            <Polygon
              positions={MOCK_CEMETERY.boundary}
              pathOptions={{
                color: '#1D70B8',
                fillColor: '#38BDF8',
                fillOpacity: 0.08,
                weight: 3,
              }}
            />
          )}

          {/* Cemetery Sections (Polygons) */}
          {MOCK_SECTIONS.map((sec) => (
            <Polygon
              key={sec.id}
              positions={sec.bounds}
              pathOptions={{
                color: sec.color,
                fillColor: sec.color,
                fillOpacity: 0.22,
                weight: 2,
              }}
            >
              <Tooltip
                permanent
                direction="center"
                className="bg-primary-dark/85 text-white font-bold text-xs tracking-wider px-2.5 py-1 rounded-md shadow border-none"
              >
                {sec.name}
              </Tooltip>
            </Polygon>
          ))}

            {/* Markers for each deceased person */}
            {records.map((rec) => {
              const isSelected = rec.id === selectedRecordId
              const fullName = [rec.first_name, rec.middle_name, rec.last_name, rec.suffix]
                .filter(Boolean)
                .join(' ')

              return (
                <Marker
                  key={rec.id}
                  position={[rec.latitude, rec.longitude]}
                  icon={isSelected ? selectedIcon : defaultIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedRecordId(rec.id)
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2 font-sans min-w-[210px] text-text">
                      <div className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-primary font-bold mb-1">
                        <Cross size={12} className="text-gold" />
                        <span>{rec.section_name}</span>
                      </div>
                      
                      <h3 className="font-serif font-bold text-base text-primary-dark m-0 leading-tight">
                        {fullName}
                      </h3>
                      
                      <div className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          {rec.birth_date} — {rec.death_date}
                        </span>
                      </div>

                      <div className="my-2 p-1.5 rounded bg-surface-warm border border-border-light text-xs">
                        <div>
                          <strong>Location:</strong>{' '}
                          {rec.niche_number
                            ? `Niche ${rec.niche_number}`
                            : `Block ${rec.block || '—'}, Lot ${rec.lot_number || '—'} (${rec.grave_number || ''})`}
                        </div>
                        <div className="text-2xs text-text-muted mt-0.5">
                          Memorial Facility: {formatMemorialFacility(rec.burial_structure_type)}
                        </div>
                      </div>

                      <Link
                        href={`/record/${rec.id}`}
                        className="btn btn-primary w-full py-1.5 text-xs text-center flex items-center justify-center gap-1 mt-2 text-white no-underline shadow-xs"
                      >
                        <span>View Memorial Details</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>
  )
}
