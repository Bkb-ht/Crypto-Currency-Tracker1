import React, { createContext, useContext, useMemo, useState } from 'react'
import { readJSON, removeKey, writeJSON } from '../lib/storage'

const AuthContext = createContext(null)

const LS_KEY = 'nf_auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readJSON(LS_KEY, null))

  const value = useMemo(() => {
    return {
      user: auth?.user ?? null,
      isAuthed: Boolean(auth?.user),
      login: ({ email }) => {
        const next = {
          user: {
            email,
            name: email?.split('@')?.[0] || 'Viewer'
          }
        }
        setAuth(next)
        writeJSON(LS_KEY, next)
      },
      logout: () => {
        setAuth(null)
        removeKey(LS_KEY)
      }
    }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
