'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Loader2, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useAdminAuth } from '@/lib/adminAuthContext'

export default function AdminLogin() {
  const { t } = useLanguage()
  const router = useRouter()
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('admin@hinumdom.ph')
  const [password, setPassword] = useState('••••••••••')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const success = await login(email, password)
    if (success) {
      router.push('/admin')
    } else {
      setErrorMsg('Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  const handleQuickDemo = async () => {
    setLoading(true)
    setErrorMsg('')
    const success = await login('admin@hinumdom.ph', 'admin123')
    if (success) {
      router.push('/admin')
    } else {
      setErrorMsg('Demo login failed.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-surface-warm py-20 px-6">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-4 shadow-sm border border-primary/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="heading-display text-3xl font-bold">{t('adminSignInTitle') as string}</h1>
          <p className="text-text-muted mt-2">{t('adminSignInSubtitle') as string}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Proposal Prototype Mode (No Backend Required)</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="card shadow-lg p-8">
          <div className="flex flex-col gap-5">
            <div>
              <label className="form-label" htmlFor="email">{t('adminEmail') as string}</label>
              <input
                id="email"
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="form-label" htmlFor="password">{t('adminPassword') as string}</label>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2 h-12 text-base font-bold flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? 'Entering Admin Dashboard...' : (t('adminSignIn') as string)}
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={loading}
              className="btn btn-outline w-full text-sm font-semibold flex items-center justify-center gap-2 border-dashed"
            >
              <Sparkles size={16} className="text-gold" />
              1-Click Demo Login for Presentation
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-text-muted mt-8">
          Return to <Link href="/" className="text-primary font-medium hover:underline">public homepage</Link>.
        </p>
      </div>
    </div>
  )
}
