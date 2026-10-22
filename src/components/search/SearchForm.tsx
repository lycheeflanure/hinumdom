'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface SearchFormProps {
  initialQuery?: string
}

export function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-container relative w-full shadow-md rounded-full" role="search">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary flex items-center justify-center z-10">
        <Search size={22} />
      </div>
      <input
        type="text"
        placeholder={t('heroSearchPlaceholder') as string}
        className="search-input w-full bg-surface text-text border border-border focus:border-primary rounded-full transition-all"
        style={{
          paddingLeft: '3.5rem',
          paddingRight: '7.5rem',
          height: '3.5rem',
          fontSize: '1rem',
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <button 
          type="submit" 
          className="btn btn-primary py-2 px-5 rounded-full text-sm font-semibold h-10 flex items-center shadow-xs"
        >
          {t('search') as string}
        </button>
      </div>
    </form>
  )
}
