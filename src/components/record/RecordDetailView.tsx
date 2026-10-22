'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Map, Calendar, MapPin, UserCircle2, Info, FileText, Phone, Lock, ShieldCheck } from 'lucide-react'
import { PublicBurialDetail } from '@/types/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useAdminAuth } from '@/lib/adminAuthContext'
import { formatMemorialFacility } from '@/lib/utils'

interface RecordDetailViewProps {
  record: PublicBurialDetail
}

export function RecordDetailView({ record }: RecordDetailViewProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { isAdmin } = useAdminAuth()

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return t('notRecorded') as string
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  const handleShowMap = () => {
    // We would normally pass the location ID or coordinates to the map page
    if (record.location?.id) {
      router.push(`/map?loc=${record.location.id}`)
    } else {
      router.push('/map')
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        {t('back') as string}
      </button>

      <div className="bg-surface border border-border-light rounded-2xl overflow-hidden shadow-sm">
        
        {/* Record Hero Header (Homepage Blue Theme) */}
        <div className="record-hero-header p-8 md:p-14 text-center text-white relative">
          <div className="relative z-10 flex flex-col items-center">
            {record.has_photo ? (
              <div className="w-24 h-24 rounded-full bg-white/15 border-4 border-white/80 mb-6 flex items-center justify-center overflow-hidden shadow-lg backdrop-blur-xs">
                <UserCircle2 size={48} className="text-white/85" />
              </div>
            ) : (
              <div className="w-20 h-20 mb-6 flex items-center justify-center text-gold drop-shadow-md">
                <CrossDecoration />
              </div>
            )}
            
            <h1 className="record-hero-name font-serif text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white">
              {record.full_name}
            </h1>
            {record.suffix && (
              <span className="record-hero-suffix text-xl font-medium text-white/90 mb-1">{record.suffix}</span>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 font-medium">
              <div className="flex flex-col items-center">
                <span className="record-hero-date-label text-xs uppercase mb-1 font-semibold">{t('bornLabel') as string}</span>
                <span className="record-hero-date-value text-base text-white font-semibold">{formatDate(record.birth_date)}</span>
              </div>
              <div className="w-px h-8 bg-white/35"></div>
              <div className="flex flex-col items-center">
                <span className="record-hero-date-label text-xs uppercase mb-1 font-semibold">{t('diedLabel') as string}</span>
                <span className="record-hero-date-value text-base text-white font-semibold">{formatDate(record.death_date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-10">
          
          {/* Left Col: Location */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-border-light pb-2">
              <MapPin className="text-primary" size={20} />
              <h2 className="font-serif text-xl font-bold text-primary-dark">{t('detailLocationInfo') as string}</h2>
            </div>
            
            <div className="location-left-col bg-surface-warm rounded-xl p-5 border border-border flex flex-col gap-4">
              <div className="location-detail-row py-1 border-none">
                <span className="location-label">{t('detailCemeteryInfo') as string}</span>
                <span className="location-value font-bold text-primary-dark">{record.cemetery.name}</span>
              </div>
              
              {record.location ? (
                <>
                  {record.location.section_name && (
                    <div className="location-detail-row py-2">
                      <span className="location-label">{t('sectionLabel') as string}</span>
                      <span className="location-value">{record.location.section_name}</span>
                    </div>
                  )}
                  {record.location.block && (
                    <div className="location-detail-row py-2">
                      <span className="location-label">{t('blockLabel') as string}</span>
                      <span className="location-value">{record.location.block}</span>
                    </div>
                  )}
                  {record.location.row_number && (
                    <div className="location-detail-row py-2">
                      <span className="location-label">{t('rowLabel') as string}</span>
                      <span className="location-value">{record.location.row_number}</span>
                    </div>
                  )}
                  {record.location.lot_number && (
                    <div className="location-detail-row py-2">
                      <span className="location-label">{t('lotLabel') as string}</span>
                      <span className="location-value">{record.location.lot_number}</span>
                    </div>
                  )}
                  {record.location.grave_number && (
                    <div className="location-detail-row py-2">
                      <span className="location-label">{t('graveLabel') as string}</span>
                      <span className="location-value">{record.location.grave_number}</span>
                    </div>
                  )}
                  {record.location.niche_number && (
                    <div className="location-detail-row py-2">
                      <span className="location-label">Niche</span>
                      <span className="location-value">{record.location.niche_number}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm border border-yellow-200 mt-2">
                  <p className="flex gap-2"><Info size={18} className="shrink-0" /> {t('unmappedNotice') as string}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleShowMap}
              className="btn btn-primary w-full py-4 text-lg mt-2 shadow-md hover:shadow-lg"
            >
              <Map className="mr-2" />
              {t('detailShowOnMap') as string}
            </button>
          </div>

          {/* Right Col: Details */}
          <div className="flex flex-col gap-6">

            {/* 1. Information (formerly Burial Information) */}
            <div>
              <div className="flex items-center gap-2 border-b border-border-light pb-2 mb-2">
                <Info className="text-primary" size={20} />
                <h2 className="font-serif text-xl font-bold text-primary-dark">Information</h2>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="location-detail-row">
                  <span className="location-label">DATE OF BIRTH</span>
                  <span className="location-value">{formatDate(record.birth_date)}</span>
                </div>
                <div className="location-detail-row">
                  <span className="location-label">DATE OF BURIAL</span>
                  <span className="location-value">{formatDate(record.burial_date)}</span>
                </div>
                {record.location && (
                  <div className="location-detail-row">
                    <span className="location-label">MEMORIAL FACILITY</span>
                    <span className="location-value font-medium">
                      {formatMemorialFacility(record.location.burial_structure_type)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Burial Information (Rental & Lease Details) */}
            <div>
              <div className="flex items-center gap-2 border-b border-border-light pb-2 mb-2">
                <FileText className="text-primary" size={20} />
                <h2 className="font-serif text-xl font-bold text-primary-dark">Burial Information</h2>
              </div>

              <div className="flex flex-col gap-1">
                <div className="location-detail-row">
                  <span className="location-label">Date of Renewal</span>
                  <span className="location-value">
                    {formatDate(record.rental_information?.date_of_renewal || null)}
                  </span>
                </div>
                <div className="location-detail-row">
                  <span className="location-label">Date of Rent</span>
                  <span className="location-value">
                    {formatDate(record.rental_information?.date_of_rent || null)}
                  </span>
                </div>
                <div className="location-detail-row">
                  <span className="location-label">Contract Term</span>
                  <span className="location-value font-medium">
                    {record.rental_information?.term_of_rent || '5 years'}
                  </span>
                </div>
                <div className="location-detail-row">
                  <span className="location-label">Cost of Rent</span>
                  <span className="location-value font-semibold text-primary">
                    {record.rental_information?.cost_of_rent || '₱300'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Contact Information (Only Accessible by Logged-in Admin Users) */}
            {isAdmin && (
              <div className="p-4 rounded-xl bg-primary-50/60 border border-primary/20">
                <div className="flex items-center justify-between border-b border-primary/15 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="text-primary" size={18} />
                    <h3 className="font-serif text-lg font-bold text-primary-dark">Contact Information</h3>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  <div className="location-detail-row py-1.5 border-primary/10">
                    <span className="location-label text-xs">Contact Person Name</span>
                    <span className="location-value font-medium text-text">
                      {record.contact_information?.contact_person_name || 'Parish Representative'}
                    </span>
                  </div>
                  <div className="location-detail-row py-1.5 border-primary/10">
                    <span className="location-label text-xs">Address</span>
                    <span className="location-value text-text">
                      {record.contact_information?.address || 'Ampayon, Butuan City'}
                    </span>
                  </div>
                  <div className="location-detail-row py-1.5 border-none">
                    <span className="location-label text-xs">Phone Number</span>
                    <span className="location-value font-mono text-primary font-semibold">
                      {record.contact_information?.phone_number || '(085) 341-2345'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Note about verification */}
            <div className="mt-auto pt-4 flex items-start gap-3 text-xs text-text-light bg-surface-warm p-4 rounded-lg">
              <ShieldIcon className="shrink-0 text-border" />
              <div>
                <p>
                  This record was verified by the cemetery office. {t('footerDataPrivacy') as string}
                </p>
                {!isAdmin && (
                  <p className="mt-1 text-3xs text-text-muted">
                    Note: Contact details are confidential. Authorized cemetery personnel can{' '}
                    <Link href="/admin/login" className="text-primary hover:underline font-semibold">
                      sign in as admin
                    </Link>{' '}
                    to view family contact records.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

function CrossDecoration() {
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="0" width="4" height="60" rx="1" />
      <rect x="6" y="16" width="28" height="4" rx="1" />
    </svg>
  )
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    </svg>
  )
}
