'use client'
// src/components/public/HeroSearchBar.tsx
// Hero section search input with routing

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export default function HeroSearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { t } = useLang()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          display: 'flex',
          background: 'white',
          borderRadius: 50,
          padding: '0.375rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1.125rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-primary)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="hero-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            aria-label="Search for a loved one by name"
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              border: 'none',
              borderRadius: 50,
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={query.trim().length < 2}
          className="btn btn-primary"
          style={{ borderRadius: 50, padding: '0.75rem 1.5rem', flexShrink: 0 }}
          aria-label="Search"
        >
          {t('search_button')}
        </button>
      </div>
    </form>
  )
}
