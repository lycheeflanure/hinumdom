'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/themeContext'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`w-12 h-6.5 rounded-full bg-border-light border border-border inline-flex items-center p-0.5 opacity-60 ${className}`}
        style={{ width: '3rem', height: '1.65rem' }}
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform active:scale-95 ${className}`}
    >
      <div
        className={`relative rounded-full transition-colors duration-300 ease-in-out p-0.5 border flex items-center ${
          isDark
            ? 'bg-surface-warm border-primary/50 shadow-inner'
            : 'bg-primary-50 border-border hover:border-primary/40'
        }`}
        style={{ width: '3.125rem', height: '1.625rem' }}
      >
        {/* Decorative Track Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none">
          <Sun
            size={11}
            className={`transition-opacity duration-200 text-amber-500 ${
              isDark ? 'opacity-30' : 'opacity-85'
            }`}
          />
          <Moon
            size={11}
            className={`transition-opacity duration-200 text-sky-300 ${
              isDark ? 'opacity-90' : 'opacity-30'
            }`}
          />
        </div>

        {/* Sliding Circular Knob */}
        <div
          className={`relative z-10 rounded-full shadow-sm flex items-center justify-center transition-all duration-300 ease-out ${
            isDark
              ? 'translate-x-[1.5rem] bg-primary text-white shadow-primary/40'
              : 'translate-x-0 bg-white text-amber-500 shadow-sm border border-border-light'
          }`}
          style={{ width: '1.3rem', height: '1.3rem' }}
        >
          {isDark ? (
            <Moon size={10} className="text-white fill-white" />
          ) : (
            <Sun size={10} className="text-amber-500 fill-amber-400" />
          )}
        </div>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold text-text-muted select-none">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  )
}
