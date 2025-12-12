import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext.jsx'

const AuthContext = createContext(null)
const AUTH_KEY = 'raku-auth'

async function authRequest(path, body) {
  const api = import.meta.env.VITE_API_URL
  if (!api) throw new Error('API URL not set')
  const res = await fetch(`${api}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const { addToast } = useToast()

  const isExpired = (token) => {
    try {
      const [, payload] = token.split('.')
      const decoded = JSON.parse(atob(payload))
      if (!decoded.exp) return false
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    if (user) {
      if (isExpired(user.token)) {
        setUser(null)
        return
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    }
    else localStorage.removeItem(AUTH_KEY)
  }, [user])

  const signup = async (email, password) => {
    const data = await authRequest('/api/auth/signup', { email, password })
    setUser({ token: data.token, email: data.user.email })
    addToast('Account created')
  }

  const login = async (email, password) => {
    const data = await authRequest('/api/auth/login', { email, password })
    setUser({ token: data.token, email: data.user.email })
    addToast('Logged in')
  }

  const logout = () => {
    setUser(null)
    addToast('Signed out')
  }

  const value = useMemo(() => ({ user, signup, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
