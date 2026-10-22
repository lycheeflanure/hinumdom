'use client'
// src/components/public/Footer.tsx

import Link from 'next/link'
import { Phone, MapPin, Clock, Mail } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--color-primary-dark)',
        color: 'rgba(255,255,255,0.85)',
        marginTop: 'auto',
      }}
    >
      {/* Main footer content */}
      <div className="container-content" style={{ padding: '3rem 1.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'var(--color-accent-light)', fontSize: 18 }}>✝</span>
              </div>
              <div>
                <div
                  className="text-serif font-bold"
                  style={{ color: 'white', fontSize: '1.125rem' }}
                >
                  HINUMDOM
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>
                  {t('app_tagline')}
                </div>
              </div>
            </div>
            <p
              className="text-serif italic"
              style={{
                color: 'var(--color-accent-light)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            >
              &ldquo;{t('tagline_primary')}&rdquo;
            </p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
              {t('tagline_primary_en')}
            </p>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderLeft: '2px solid var(--color-gold)',
                padding: '0.5rem 0.75rem',
                borderRadius: '0 6px 6px 0',
                marginTop: 8,
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
                &ldquo;Blessed are those who mourn, for they shall be comforted.&rdquo;
              </p>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.04em',
                  marginTop: 4,
                }}
              >
                — Matthew 5:4
              </span>
            </div>
          </div>

          {/* Cemetery Info */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent-light)',
                marginBottom: '1rem',
              }}
            >
              {t('footer_cemetery')}
            </h3>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.55)',
                marginBottom: '0.5rem',
                fontStyle: 'italic',
              }}
            >
              {t('footer_parish')}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-start">
                <MapPin size={14} style={{ color: 'var(--color-accent)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem' }}>{t('footer_address')}</span>
              </div>
              <div className="flex gap-2 items-start">
                <Clock size={14} style={{ color: 'var(--color-accent)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem' }}>{t('footer_visiting')}</span>
              </div>
              <div className="flex gap-2 items-start">
                <Phone size={14} style={{ color: 'var(--color-accent)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem' }}>{t('footer_contact')}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent-light)',
                marginBottom: '1rem',
              }}
            >
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { href: '/search', label: t('nav_find') },
                { href: '/map', label: t('nav_map') },
                { href: '/about', label: t('nav_about') },
                { href: '/contact', label: t('nav_contact') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal & Data */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent-light)',
                marginBottom: '1rem',
              }}
            >
              Information
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { href: '/privacy', label: t('footer_privacy') },
                { href: '/terms', label: t('footer_terms') },
                { href: '/contact?subject=incorrect-record', label: t('footer_report') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p
              style={{
                marginTop: '1.5rem',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.5,
              }}
            >
              HINUMDOM is a digital memorial tool. It does not imply official Catholic Church endorsement.
              Burial record accuracy depends on submitted data.
              Protected under the Data Privacy Act of 2012 (RA 10173).
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '1rem 0',
        }}
      >
        <div
          className="container-content flex flex-wrap justify-between items-center gap-3"
          style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}
        >
          <span>
            {t('footer_copyright', { year: String(year) })}
          </span>
          <Link
            href="/admin/login"
            style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontSize: '0.75rem' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
