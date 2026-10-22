'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { MapPin, Clock, ShieldAlert, Cross } from 'lucide-react'

export function Footer() {
  const { t } = useLanguage()
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #0F2038 0%, #0A1626 100%)',
        color: 'rgba(255,255,255,0.85)',
        borderTop: '3px solid var(--color-gold)',
      }}
    >
      <div className="container-content" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '2.5rem',
          }}
        >

          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cross size={14} style={{ color: 'var(--color-gold)' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.01em',
                }}
              >
                HINUMDOM
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.875rem',
                color: 'rgba(194,164,107,0.9)',
                lineHeight: 1.6,
              }}
            >
              &ldquo;{t('taglinePrimary') as string}&rdquo;
            </p>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderLeft: '2px solid var(--color-gold)',
                padding: '0.625rem 0.875rem',
                borderRadius: '0 8px 8px 0',
                marginTop: '0.125rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '0.8125rem',
                  color: '#D4E6F7',
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{t('verseMatthewQuote') as string}&rdquo;
              </p>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.04em',
                  marginTop: '0.25rem',
                }}
              >
                — {t('verseMatthewRef') as string}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
              {t('footerNotAffiliated') as string}
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'white',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: '0.75rem',
                marginBottom: '0.25rem',
              }}
            >
              {t('navHome') as string}
            </h4>
            {[
              { href: '/search', label: t('navFind') as string },
              { href: '/map', label: t('navMap') as string },
              { href: '/admin', label: t('navAdmin') as string },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'white',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: '0.75rem',
                marginBottom: '0.25rem',
              }}
            >
              {t('navContact') as string}
            </h4>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              {t('footerCemetery') as string}
            </p>
            <p style={{ fontSize: '0.8125rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>
              {t('footerParish') as string}
            </p>
            <div className="flex items-start gap-2" style={{ marginTop: '0.25rem' }}>
              <MapPin size={14} style={{ color: 'var(--color-gold)', marginTop: '3px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>
                {t('footerAddress') as string}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>
                {t('footerVisiting') as string}
              </span>
            </div>
          </div>

          {/* Legal / Privacy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'white',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: '0.75rem',
                marginBottom: '0.25rem',
              }}
            >
              Legal
            </h4>
            <div className="flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
              <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ lineHeight: 1.5 }}>{t('footerDataPrivacy') as string}</p>
            </div>
            <div className="flex gap-4" style={{ marginTop: '0.5rem' }}>
              <button
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.8125rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              >
                {t('footerPrivacy') as string}
              </button>
              <button
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.8125rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              >
                {t('footerTerms') as string}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3"
          style={{
            marginTop: '3rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.8125rem',
          }}
        >
          <p>&copy; {currentYear} {t('footerCemetery') as string}. {t('footerAllRightsReserved') as string}</p>
          <p>
            <a
              href="https://www.facebook.com/profile.php?id=61594118682609&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors hover:text-white/80 cursor-pointer"
            >
              Powered by RateIT
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
