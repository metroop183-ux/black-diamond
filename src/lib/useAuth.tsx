import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from './api'

export type User = {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  otherNames: string
  mothersMaidenName: string
  dob: string
  country: string
  state: string
  address: string
  annualRevenue: string
  role: 'admin' | 'investor'
  balance: number
  totalInvested: number
  weeklyReturn: number
  solanaAddress: string
  createdAt: string
}

type AuthCtx = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  signup: (data: Record<string, string>) => Promise<{ error?: string; user?: User }>
  refreshUser: () => Promise<void>
}

const Ctx = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const tok = localStorage.getItem('bd_token')
    if (!tok) { setUser(null); return }
    const res = await api.me()
    if (res?.error) { localStorage.removeItem('bd_token'); setUser(null) }
    else setUser(res)
  }, [])

  useEffect(() => {
    // Seed test accounts on first load, then restore session
    api.seed().finally(() => {
      refreshUser().finally(() => setLoading(false))
    })
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password)
    if (res?.error) return { error: res.error }
    localStorage.setItem('bd_token', res.token)
    setUser(res.user)
    return {}
  }

  const logout = async () => {
    await api.logout()
    localStorage.removeItem('bd_token')
    setUser(null)
  }

  const signup = async (data: Record<string, string>) => {
    const res = await api.signup(data)
    if (res?.error) return { error: res.error }
    localStorage.setItem('bd_token', res.token)
    setUser(res.user)
    return { user: res.user }
  }

  return (
    <Ctx.Provider value={{ user, loading, login, logout, signup, refreshUser }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
