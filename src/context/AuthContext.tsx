import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { resolveZip, ZipRecord } from '../data/zipcodes'

const STORAGE_KEY = 'lockedin.session.v1'

export type SessionUser = {
  email: string
  displayName: string
  zip: string
  zipRecord: ZipRecord
  joinedAt: string
}

type AuthContextValue = {
  user: SessionUser | null
  login: (email: string, password: string, zip: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
  updateZip: (zip: string) => { ok: true } | { ok: false; error: string }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function makeDisplayName(email: string): string {
  const local = email.split('@')[0] || 'friend'
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as SessionUser
      // Re-resolve zip in case the DB grew (and to validate)
      const rec = resolveZip(parsed.zip)
      if (!rec) return null
      return { ...parsed, zipRecord: rec }
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email, password, zip) => {
        const trimmedEmail = email.trim()
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
          return { ok: false, error: 'Enter a valid email address.' }
        }
        if (!password || password.length < 4) {
          return { ok: false, error: 'Password must be at least 4 characters.' }
        }
        const rec = resolveZip(zip)
        if (!rec) {
          return { ok: false, error: 'Enter a valid US ZIP code.' }
        }
        setUser({
          email: trimmedEmail,
          displayName: makeDisplayName(trimmedEmail),
          zip: rec.zip,
          zipRecord: rec,
          joinedAt: new Date().toISOString(),
        })
        return { ok: true }
      },
      logout: () => setUser(null),
      updateZip: (zip) => {
        const rec = resolveZip(zip)
        if (!rec) return { ok: false, error: 'Unknown ZIP.' }
        setUser((prev) => (prev ? { ...prev, zip: rec.zip, zipRecord: rec } : prev))
        return { ok: true }
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
