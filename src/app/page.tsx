'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Map as MapIcon, Info, ChevronRight, Cross, FileCheck, MapPin, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStep, setActiveStep] = useState(0)

  // Scroll-reveal refs
  const featuresRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [howItWorksVisible, setHowItWorksVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === featuresRef.current) setFeaturesVisible(true)
            if (entry.target === howItWorksRef.current) setHowItWorksVisible(true)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (featuresRef.current) observer.observe(featuresRef.current)
    if (howItWorksRef.current) observer.observe(howItWorksRef.current)

    return () => observer.disconnect()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex flex-col w-full min-w-0 overflow-x-hidden">

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="hero-section text-white pt-20 sm:pt-28 pb-24 sm:pb-36 px-4 sm:px-6" aria-label="Hero">
        <div className="container-content relative z-10 text-center flex flex-col items-center">


          {/* Hero heading */}
          <div className="animate-fade-up">
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                color: '#F7F4EC',
                maxWidth: '52rem',
                margin: '0 auto 1.5rem',
              }}
            >
              {t('heroHeading') as string}
            </h1>
          </div>

          {/* Supporting text */}
          <div className="animate-fade-up animate-fade-up-1">
            <p
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
                color: 'rgba(247,244,236,0.85)',
                maxWidth: '36rem',
                margin: '0 auto 2.5rem',
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              {t('heroSubtitle') as string}
            </p>
          </div>

          {/* Search bar */}
          <div className="animate-fade-up animate-fade-up-2" style={{ width: '100%', maxWidth: '640px' }}>
            <form onSubmit={handleSearch} className="hero-search-wrap" role="search">
              <div className="hero-search-field">
                <Search
                  className="search-icon"
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    position: 'absolute',
                    left: '1.125rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-accent)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  id="hero-search"
                  placeholder={t('heroSearchPlaceholder') as string}
                  className="search-input"
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                    padding: '0.9375rem 1rem 0.9375rem 3.25rem',
                    fontSize: '1.0625rem',
                    color: 'var(--color-text)',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t('heroSearchPlaceholder') as string}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!searchQuery.trim()}
                aria-label={t('heroSearchButton') as string}
              >
                {t('heroSearchButton') as string}
              </button>
            </form>

          </div>

          {/* Secondary CTA */}
          <div className="animate-fade-up animate-fade-up-3" style={{ marginTop: '2rem' }}>
            <Link
              href="/map"
              className="btn btn-outline"
              style={{
                color: 'rgba(247,244,236,0.9)',
                borderColor: 'rgba(255,255,255,0.25)',
                borderRadius: '10px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
              }}
            >
              <MapIcon size={18} />
              {t('heroMapButton') as string}
            </Link>
          </div>

        </div>
      </section>

      {/* ─── Feature Cards: How Can We Help You? ──────────────── */}
      <section
        ref={featuresRef}
        className={`py-16 sm:py-20 px-4 sm:px-6 ${featuresVisible ? 'section-reveal' : ''}`}
        style={{
          background: 'var(--color-background)',
        }}
        aria-labelledby="features-heading"
      >
        <div className="container-content">

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-ornament">
              <Cross size={14} className="section-ornament-icon" />
            </div>
            <h2 id="features-heading" className="heading-section" style={{ marginBottom: '0.5rem' }}>
              {t('featuresTitle') as string}
            </h2>
          </div>

          {/* Cards */}
          <div className="features-grid">

            {/* Card 1: Find a Loved One */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Search size={28} />
              </div>
              <h3>{t('feature1Title') as string}</h3>
              <p>{t('feature1Desc') as string}</p>
              <Link href="/search" className="feature-card-link">
                {t('heroFindButton') as string}
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Card 2: Explore the Cemetery Map */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <MapIcon size={28} />
              </div>
              <h3>{t('feature2Title') as string}</h3>
              <p>{t('feature2Desc') as string}</p>
              <Link href="/map" className="feature-card-link">
                {t('heroMapButton') as string}
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Card 3: Learn About the Cemetery */}
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Info size={28} />
              </div>
              <h3>{t('feature3Title') as string}</h3>
              <p>{t('feature3Desc') as string}</p>
              <a href="#about" className="feature-card-link">
                {t('navAbout') as string}
                <ChevronRight size={16} />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────── */}
      <section
        ref={howItWorksRef}
        className={`py-16 sm:py-24 px-4 sm:px-6 timeline-section ${howItWorksVisible ? 'section-reveal' : ''}`}
        aria-labelledby="how-it-works-heading"
      >
        <div className="container-content">

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 id="how-it-works-heading" className="heading-section" style={{ marginBottom: '0.5rem' }}>
              {t('howItWorksTitle') as string}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '28rem', margin: '0.75rem auto 0' }}>
              {t('heroSubtitle') as string !== t('howItWorksTitle') as string ? '' : ''}
            </p>
          </div>

          {/* Stepper horizontal line & nodes */}
          <div className="how-it-works-stepper-wrap" aria-hidden="true">
            <div className="how-it-works-stepper">
              <div
                className="stepper-progress-fill"
                style={{
                  width:
                    activeStep === 0
                      ? '0%'
                      : activeStep === 1
                      ? 'calc((100% - (100% / 3)) * 0.5)'
                      : 'calc(100% - (100% / 3))',
                }}
              />
              {[
                { num: '01', key: 0 },
                { num: '02', key: 1 },
                { num: '03', key: 2 },
              ].map(({ num, key }) => {
                const isCompletedOrActive = key <= activeStep
                return (
                  <div key={num} className="stepper-node-wrap">
                    <div
                      className={`stepper-node ${isCompletedOrActive ? 'is-active' : ''} ${activeStep === key ? 'is-hovered' : ''}`}
                    >
                      {key < activeStep || (key === 0 && activeStep === 0) ? (
                        <Check size={18} strokeWidth={2.5} />
                      ) : (
                        <span>{num}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Cards Grid */}
          <div className="step-cards-grid">
            {[
              {
                num: '01',
                label: 'STEP 1',
                title: t('step1Title') as string,
                desc: t('step1Desc') as string,
                icon: Search,
              },
              {
                num: '02',
                label: 'STEP 2',
                title: t('step2Title') as string,
                desc: t('step2Desc') as string,
                icon: FileCheck,
              },
              {
                num: '03',
                label: 'STEP 3',
                title: t('step3Title') as string,
                desc: t('step3Desc') as string,
                icon: MapPin,
              },
            ].map((step, idx) => {
              const IconComp = step.icon
              return (
                <div
                  key={step.num}
                  className="step-card"
                  onMouseEnter={() => setActiveStep(idx)}
                  onMouseLeave={() => setActiveStep(0)}
                >
                  <div className="step-icon-wrap">
                    <IconComp size={28} strokeWidth={2} />
                  </div>
                  <span className="step-badge">{step.label}</span>
                  <h3 className="step-card-title">{step.title}</h3>
                  <p className="step-card-desc">{step.desc}</p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

    </div>
  )
}
