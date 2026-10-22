'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Cross, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useAdminAuth } from '@/lib/adminAuthContext'
import { Language } from '@/lib/i18n/translations'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { isAdmin } = useAdminAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t('navHome') as string },
    { href: '/search', label: t('navFind') as string },
    { href: '/map', label: t('navMap') as string },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--color-background)',
        borderBottom: '1px solid var(--color-border-light)',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'box-shadow 250ms ease, background 250ms ease, border-color 250ms ease',
      }}
    >
      <div className="container-content">
        <div className="flex items-center justify-between" style={{ height: '4rem' }}>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMenu}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '50%',
                background: 'var(--color-pale-sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Cross size={16} style={{ color: 'var(--color-gold)' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--color-heading)',
              }}
            >
              HINUMDOM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div
              className="flex items-center gap-2"
              style={{
                marginLeft: '1rem',
                paddingLeft: '1rem',
                borderLeft: '1px solid var(--color-border-light)',
              }}
            >
              <button
                onClick={() => setLanguage('en')}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: language === 'en' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.375rem',
                  borderRadius: '4px',
                  transition: 'color 150ms ease',
                }}
              >
                EN
              </button>
              <span style={{ color: 'var(--color-border)', fontSize: '0.75rem' }}>|</span>
              <button
                onClick={() => setLanguage('ceb')}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: language === 'ceb' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.375rem',
                  borderRadius: '4px',
                  transition: 'color 150ms ease',
                }}
              >
                CEB
              </button>
            </div>

            {/* Admin Link */}
            <Link
              href="/admin"
              className={isAdmin ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 ml-3' : ''}
              style={isAdmin ? undefined : {
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                marginLeft: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                transition: 'color 150ms ease',
              }}
            >
              {isAdmin && <ShieldCheck size={13} className="text-primary" />}
              <span>{isAdmin ? 'Admin Portal' : (t('navAdmin') as string)}</span>
            </Link>

            {/* Dark Mode Switcher (Desktop - Top Right) */}
            <div
              className="flex items-center"
              style={{
                marginLeft: '0.75rem',
                paddingLeft: '0.75rem',
                borderLeft: '1px solid var(--color-border-light)',
              }}
            >
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Right Controls: Dark Mode Switch + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? t('navCloseMenu') as string : t('navOpenMenu') as string}
              aria-expanded={isMenuOpen}
              style={{
                padding: '0.5rem',
                color: 'var(--color-text)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'color 150ms ease',
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid var(--color-border-light)',
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-md)',
            position: 'absolute',
            width: '100%',
          }}
        >
          <nav className="flex flex-col" style={{ padding: '1rem' }} aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname === link.href ? 'var(--color-primary)' : 'var(--color-text)',
                  background: pathname === link.href ? 'var(--color-pale-sage)' : 'transparent',
                  transition: 'background 150ms ease',
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '0.75rem 0' }}></div>

            {/* Language Switcher Mobile */}
            <div className="flex items-center justify-between" style={{ padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                {t('navLanguage') as string}
              </span>
              <div className="flex" style={{ gap: '1rem' }}>
                <button
                  onClick={() => { setLanguage('en'); closeMenu(); }}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: language === 'en' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('ceb'); closeMenu(); }}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: language === 'ceb' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Bisaya
                </button>
              </div>
            </div>

            {/* Theme Switcher Mobile */}
            <div className="flex items-center justify-between" style={{ padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                Theme Appearance
              </span>
              <ThemeToggle showLabel />
            </div>

            {/* Admin Link Mobile */}
            <Link
              href="/admin"
              onClick={closeMenu}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                textAlign: 'center',
                marginTop: '0.5rem',
                border: '1px solid var(--color-border-light)',
                borderRadius: '10px',
              }}
            >
              {t('navAdmin') as string}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
