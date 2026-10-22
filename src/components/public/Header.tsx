'use client'
// src/components/public/Header.tsx

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import type { Language } from '@/lib/translations'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { t, lang, setLang } = useLang()

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/search', label: t('nav_find') },
    { href: '/map', label: t('nav_map') },
    { href: '/about', label: t('nav_about') },
    { href: '/contact', label: t('nav_contact') },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const toggleLang = () => setLang(lang === 'en' ? 'ceb' : 'en' as Language)

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="container-content">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              style={{
                width: 36,
                height: 36,
                background: 'var(--color-primary)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontSize: 18 }}>✝</span>
            </div>
            <div>
              <span
                className="text-serif font-bold block"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--color-primary-dark)',
                  lineHeight: 1.2,
                }}
              >
                HINUMDOM
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {t('app_tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="btn btn-ghost btn-sm"
              aria-label={`Switch to ${lang === 'en' ? 'Bisaya' : 'English'}`}
              title={`Switch to ${lang === 'en' ? 'Bisaya' : 'English'}`}
            >
              <Globe size={16} />
              <span className="hidden sm:inline">
                {lang === 'en' ? 'Bisaya' : 'English'}
              </span>
            </button>

            {/* Mobile toggle */}
            <button
              className="md:hidden btn btn-ghost btn-sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          style={{
            borderTop: '1px solid var(--color-border-light)',
            background: 'var(--color-surface)',
            padding: '0.75rem 0',
          }}
        >
          <nav className="container-content flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
                style={{ padding: '0.75rem 1rem' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
