'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin, User, Calendar } from 'lucide-react'
import { PublicBurialRecord } from '@/types/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface SearchResultCardProps {
  record: PublicBurialRecord
}

export function SearchResultCard({ record }: SearchResultCardProps) {
  const { t } = useLanguage()

  // Format dates
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return t('notRecorded') as string
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  // Build location string
  const buildLocationString = () => {
    const parts = []
    if (record.section_name) parts.push(`${record.section_name}`)
    if (record.block) parts.push(`${t('blockLabel')} ${record.block}`)
    if (record.lot_number) parts.push(`${t('lotLabel')} ${record.lot_number}`)
    
    if (parts.length === 0) return t('unmappedNotice') as string
    return parts.join(' • ')
  }

  return (
    <div className="card hover:border-primary/50 transition-colors group flex flex-col md:flex-row gap-6 items-start md:items-center">
      
      <div className="flex-grow flex flex-col gap-3 w-full">
        <div className="flex items-start justify-between gap-4 w-full">
          <div>
            <h3 className="font-serif text-xl font-bold text-primary-dark">
              {record.full_name} {record.suffix && <span className="text-sm font-sans text-text-muted ml-1">{record.suffix}</span>}
            </h3>
            
            <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(record.birth_date)} – {formatDate(record.death_date)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-warm rounded-lg p-3 mt-1 border border-border-light flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full text-sm">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-semibold text-text">{record.cemetery_name}</span>
              <span className="text-text-muted">{buildLocationString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="shrink-0 w-full md:w-auto flex justify-end">
        <Link 
          href={`/record/${record.id}`}
          className="btn btn-outline w-full md:w-auto group-hover:bg-primary group-hover:text-white transition-all"
        >
          {t('viewDetails') as string}
          <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  )
}
