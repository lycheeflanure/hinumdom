'use client'
// src/lib/language-context.tsx
// Language provider and hook for Bisaya/English toggle

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Language } from './translations'
import { t as translate, type TranslationKey } from './translations'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

const STORAGE_KEY = 'hinumdom_lang'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'ceb' || stored === 'en') {
      setLangState(stored)
    }
  }, [])

  function setLang(newLang: Language) {
    setLangState(newLang)
    localStorage.setItem(STORAGE_KEY, newLang)
  }

  function t(key: TranslationKey, vars?: Record<string, string>): string {
    return translate(lang, key, vars)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
