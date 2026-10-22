'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hinumdom-theme') as Theme | null
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored)
        applyTheme(stored)
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initial: Theme = prefersDark ? 'dark' : 'light'
        setThemeState(initial)
        applyTheme(initial)
      }
    } catch {
      // Fallback in case of sandboxed localStorage
    }
    setMounted(true)
  }, [])

  const applyTheme = (nextTheme: Theme) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (nextTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      root.style.colorScheme = 'light'
    }
  }

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme)
    applyTheme(nextTheme)
    try {
      localStorage.setItem('hinumdom-theme', nextTheme)
    } catch {
      // ignore
    }
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
