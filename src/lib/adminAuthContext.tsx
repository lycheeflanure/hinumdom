'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminAuthContextType {
  isAdmin: boolean
  loading: boolean
  login: (email?: string, password?: string) => Promise<boolean>
  logout: () => Promise<void>
  checkStatus: () => Promise<boolean>
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
  checkStatus: async () => false,
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const checkStatus = async (): Promise<boolean> => {
    try {
      // 1. Quick check in localStorage
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('hinumdom_admin')
        if (local === 'true') {
          setIsAdmin(true)
        }
      }

      // 2. Verify with local backend API
      const res = await fetch('/api/admin/status')
      if (res.ok) {
        const data = await res.json()
        const authenticated = Boolean(data.authenticated)
        setIsAdmin(authenticated)
        if (typeof window !== 'undefined') {
          if (authenticated) {
            localStorage.setItem('hinumdom_admin', 'true')
          } else {
            localStorage.removeItem('hinumdom_admin')
          }
        }
        return authenticated
      }
    } catch {
      // Fallback to localStorage if offline
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('hinumdom_admin') === 'true'
        setIsAdmin(local)
        return local
      }
    } finally {
      setLoading(false)
    }
    return false
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const login = async (email?: string, password?: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setIsAdmin(true)
          if (typeof window !== 'undefined') {
            localStorage.setItem('hinumdom_admin', 'true')
            // Also set client cookie as backup
            document.cookie = 'hinumdom_admin_session=true; path=/; max-age=86400; SameSite=Lax'
          }
          return true
        }
      }
      return false
    } catch (err) {
      console.error('Login error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsAdmin(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hinumdom_admin')
        document.cookie = 'hinumdom_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      setLoading(false)
    }
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading, login, logout, checkStatus }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
