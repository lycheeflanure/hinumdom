'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, TranslationKey, translations, t as translateFunction } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string | Function
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to English, but try to load from localStorage if available
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('hinumdom_language') as Language
    if (savedLang && (savedLang === 'en' || savedLang === 'ceb')) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('hinumdom_language', lang)
  }

  // Type-safe translation function bound to current language
  const t = (key: TranslationKey) => {
    return translateFunction(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
